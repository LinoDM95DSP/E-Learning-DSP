from django.shortcuts import render, get_object_or_404
from rest_framework import generics, views, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import Exam, ExamAttempt, CriterionScore, ExamCriterion
from .serializer import (
    ExamSerializer,
    ActiveExamAttemptSerializer,
    CompletedExamAttemptSerializer,
    TeacherSubmissionSerializer,
    TeacherGradingSerializer
)
from django.db.models import Exists, OuterRef, Q
from django.utils import timezone

# Create your views here.
class AvailableExamsView(generics.ListAPIView):
    """
    Gibt eine Liste der Prüfungen zurück, die für den eingeloggten Benutzer verfügbar sind.
    Verfügbar = Keine vorherigen Versuche UND is_available_for() gibt True zurück.
    """
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # 1. Finde alle Prüfungen, für die der User *keinen* Versuch gestartet hat.
        #    Wir brauchen nur die IDs.
        exams_without_started_attempt_ids = Exam.objects.exclude(
            attempts__user=user,
            attempts__status=ExamAttempt.Status.STARTED
        ).values_list('id', flat=True)

        # 2. Filtere diese IDs weiter: Nur die, bei denen is_available_for True zurückgibt.
        available_exam_ids = []
        # Iteriere über die potenziell verfügbaren Prüfungen (effizienter als alle zu laden)
        potential_exams = Exam.objects.filter(id__in=exams_without_started_attempt_ids)
        for exam in potential_exams:
             # Stelle sicher, dass die Module-Relation vorgeladen ist, falls benötigt
             # exam = Exam.objects.prefetch_related('modules').get(pk=exam.id)
             if exam.is_available_for(user):
                 available_exam_ids.append(exam.id)
        
        # Gib das finale Queryset zurück
        return Exam.objects.filter(id__in=available_exam_ids)

class ActiveExamsView(generics.ListAPIView):
    """
    Gibt eine Liste der Prüfungen zurück, die vom eingeloggten Benutzer gestartet wurden (Status 'started').
    """
    serializer_class = ActiveExamAttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ExamAttempt.objects.filter(
            user=user, 
            status=ExamAttempt.Status.STARTED
        ).select_related('exam')

class CompletedExamsView(generics.ListAPIView):
    """
    Gibt eine Liste der Prüfungen zurück, die vom eingeloggten Benutzer abgeschlossen wurden 
    (Status 'submitted' oder 'graded').
    """
    serializer_class = CompletedExamAttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ExamAttempt.objects.filter(
            user=user, 
            status__in=[ExamAttempt.Status.SUBMITTED, ExamAttempt.Status.GRADED]
        ).select_related('exam').prefetch_related('criterion_scores__criterion', 'attachments')

# --- Prüfungsaktionen Views ---

class StartExamView(views.APIView):
    """
    Startet eine neue Prüfung für den eingeloggten Benutzer.
    Überprüft zunächst, ob die Prüfung für den Benutzer verfügbar ist.
    Erstellt dann einen neuen ExamAttempt mit Status 'started'.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, exam_id):
        # Lade die angeforderte Prüfung
        exam = get_object_or_404(Exam, pk=exam_id)
        user = request.user

        # Prüfe, ob die Prüfung für den Benutzer verfügbar ist
        if not exam.is_available_for(user):
            return Response(
                {"detail": "Diese Prüfung ist für Sie nicht verfügbar."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Erstelle einen neuen Prüfungsversuch
        attempt = ExamAttempt.objects.create(
            exam=exam,
            user=user,
            status=ExamAttempt.Status.STARTED
        )

        # Serialisiere und gib den neuen Versuch zurück
        serializer = ActiveExamAttemptSerializer(attempt)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SubmitExamView(views.APIView):
    """
    Reicht einen Prüfungsversuch zur Bewertung ein.
    Setzt den Status auf 'submitted' und speichert ggf. Anhänge.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, attempt_id):
        # Lade den Versuch und stelle sicher, dass er dem aktuellen Benutzer gehört
        attempt = get_object_or_404(
            ExamAttempt,
            pk=attempt_id,
            user=request.user  # Sicherstellung, dass nur der eigene Versuch eingereicht werden kann
        )

        # Prüfe, ob der Status 'started' ist
        if attempt.status != ExamAttempt.Status.STARTED:
            return Response(
                {"detail": "Nur gestartete Prüfungen können eingereicht werden."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Setze den Status auf 'submitted'
        attempt.status = ExamAttempt.Status.SUBMITTED
        attempt.submitted_at = timezone.now()
        attempt.save()

        # Verarbeitung von Dateianhängen (falls vorhanden)
        # TODO: Implementierung der Dateiverarbeitung, wenn benötigt

        # Serialisiere und gib den aktualisierten Versuch zurück
        serializer = CompletedExamAttemptSerializer(attempt)
        return Response(serializer.data, status=status.HTTP_200_OK)

# --- Teacher Views --- 

class TeacherSubmissionsListView(generics.ListAPIView):
    """
    Gibt eine Liste aller eingereichten (Status 'submitted') Prüfungsversuche zurück.
    Nur für Lehrer/Admins zugänglich.
    """
    serializer_class = TeacherSubmissionSerializer
    permission_classes = [IsAdminUser] 

    def get_queryset(self):
        return ExamAttempt.objects.filter(
            status=ExamAttempt.Status.SUBMITTED
        ).select_related('exam', 'user').prefetch_related('attachments', 'exam__criteria') # Kriterien mitladen

class TeacherGradeAttemptView(views.APIView):
    """
    Ermöglicht einem Lehrer/Admin, einen eingereichten Prüfungsversuch zu bewerten.
    Nimmt eine Liste von Kriterium-Scores ({criterion_id, achieved_points}) 
    und optionales Feedback entgegen.
    Setzt den Status auf 'graded' und speichert die Bewertung.
    """
    permission_classes = [IsAdminUser]

    def post(self, request, attempt_id):
        # Lade den Versuch und stelle sicher, dass Kriterien mitgeladen werden
        attempt = get_object_or_404(
            ExamAttempt.objects.select_related('exam').prefetch_related('exam__criteria'),
            pk=attempt_id
        )

        if attempt.status != ExamAttempt.Status.SUBMITTED:
            return Response(
                {"detail": "This attempt has already been graded or was not submitted yet."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = TeacherGradingSerializer(data=request.data, context={'attempt': attempt})
        
        if serializer.is_valid():
            validated_data = serializer.validated_data
            scores_data = validated_data.get('scores')
            feedback_data = validated_data.get('feedback', '')

            # --- Bewertungslogik --- 
            CriterionScore.objects.filter(attempt=attempt).delete()

            for score_item in scores_data:
                # Verwende 'achieved_points' aus den validierten Daten
                CriterionScore.objects.create(
                    attempt=attempt,
                    criterion_id=score_item['criterion_id'],
                    achieved_points=score_item['achieved_points'] # Angepasst
                )
            
            attempt.status = ExamAttempt.Status.GRADED
            attempt.feedback = feedback_data
            attempt.graded_by = request.user
            attempt.save() # Ruft _calculate_total_score und setzt graded_at

            # Gib den aktualisierten Versuch zurück
            response_serializer = TeacherSubmissionSerializer(attempt)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- Alte Views (werden nicht mehr benötigt) --- 

# class ExamListView(generics.ListAPIView): # Bleibt ggf. für öffentliche Liste?
#     """
#     Gibt eine Liste aller verfügbaren Prüfungen zurück.
#     (Öffentlich zugänglich)
#     """
#     queryset = Exam.objects.all()
#     serializer_class = ExamSerializer

# class UserExamListView(generics.ListAPIView): # Ersetzt durch spezifischere Views
#     """
#     Gibt eine Liste aller Prüfungen für den aktuell eingeloggten Benutzer zurück,
#     inklusive des Status (available, started, submitted, graded) und Attempt-Details.
#     """
#     serializer_class = UserExamStatusSerializer
#     permission_classes = [IsAuthenticated] # Nur für eingeloggte Benutzer
# 
#     def get_queryset(self):
#         return Exam.objects.all()
# 
#     def get_serializer_context(self):
#         context = super().get_serializer_context()
#         context.update({"request": self.request})
#         return context
