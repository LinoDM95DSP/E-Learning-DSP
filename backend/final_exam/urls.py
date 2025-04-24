from django.urls import path
from . import views

# Behalte ggf. die allgemeine ExamListView bei, wenn benötigt
# from .views import ExamListView 

urlpatterns = [
    # --- User facing URLs (Präfix: /api/exams/) ---
    # path('', ExamListView.as_view(), name='exam-list'), # GET /api/exams/ (Öffentliche Liste aller Prüfungen, optional)
    path('my-exams/available/', views.AvailableExamsView.as_view(), name='user-available-exams'), # GET /api/exams/my-exams/available/: Zeigt dem eingeloggten Benutzer alle Prüfungen an, die er starten kann.
    path('my-exams/active/', views.ActiveExamsView.as_view(), name='user-active-exams'),       # GET /api/exams/my-exams/active/: Zeigt dem eingeloggten Benutzer alle Prüfungen an, die er gerade bearbeitet (Status 'started').
    path('my-exams/completed/', views.CompletedExamsView.as_view(), name='user-completed-exams'), # GET /api/exams/my-exams/completed/: Zeigt dem eingeloggten Benutzer alle Prüfungen an, die er abgegeben oder die bewertet wurden.
    
    # NEU: URL für die Liste aller Prüfungen
    path("all/", views.AllExamsListView.as_view(), name="all-exams"),
    
    # --- Prüfungsaktionen ---
    path('<int:exam_id>/start/', views.StartExamView.as_view(), name='start-exam'), # POST /api/exams/<exam_id>/start/: Startet eine neue Prüfung für den eingeloggten Benutzer.
    path('attempts/<int:attempt_id>/submit/', views.SubmitExamView.as_view(), name='submit-exam'), # POST /api/exams/attempts/<attempt_id>/submit/: Sendet eine Prüfung zur Bewertung ein.

    # --- Teacher facing URLs (Präfix: /api/exams/) ---
    path('teacher/submissions/', views.TeacherSubmissionsListView.as_view(), name='teacher-submissions-list'), # GET /api/exams/teacher/submissions/: Zeigt Lehrern/Admins alle abgegebenen (Status 'submitted') Prüfungsversuche an.
    path('teacher/submissions/<int:attempt_id>/grade/', views.TeacherGradeAttemptView.as_view(), name='teacher-grade-attempt'), # POST /api/exams/teacher/submissions/<attempt_id>/grade/: Ermöglicht Lehrern/Admins das Bewerten eines spezifischen abgegebenen Versuchs.
    
    # --- Alte URLs (ersetzt) ---
    # path('my-exams/', views.UserExamListView.as_view(), name='user-exam-list'), # Ersetzt
]
