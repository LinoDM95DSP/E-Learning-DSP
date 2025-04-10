from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

class LogoutView(APIView):
    """
    Logs out the user by blacklisting their refresh token.
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except TokenError as e:
            # Handle cases where the token is invalid or already blacklisted
            return Response({"error": f"Token error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Generic exception handling
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 