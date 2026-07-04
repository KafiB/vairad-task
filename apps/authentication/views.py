from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer


def get_tokens_for_user(user):
    """
    Generates a fresh access + refresh token pair for a given user.
    Equivalent to jwt.sign({ id: user._id }, SECRET) in Express,
    except SimpleJWT handles both access and refresh tokens together.
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class RegisterView(generics.CreateAPIView):
    """
    POST /api/auth/register/
    Public endpoint — creates a new user and immediately logs them in
    by returning JWT tokens, so the frontend doesn't need a separate
    login call right after registering.
    """

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        tokens = get_tokens_for_user(user)

        return Response({
            'user': UserProfileSerializer(user).data,
            'tokens': tokens,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    POST /api/auth/login/
    Public endpoint — validates credentials and returns JWT tokens.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        tokens = get_tokens_for_user(user)

        return Response({
            'user': UserProfileSerializer(user).data,
            'tokens': tokens,
        }, status=status.HTTP_200_OK)


class ProfileView(generics.RetrieveAPIView):
    """
    GET /api/auth/profile/
    Protected endpoint — requires a valid access token.
    Returns the currently authenticated user's data.
    """

    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Protected endpoint — blacklists the provided refresh token so
    it can never be used again to issue new access tokens.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response(
                {'detail': 'Refresh token is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(
                {'detail': 'Invalid or expired token.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {'detail': 'Logged out successfully.'},
            status=status.HTTP_205_RESET_CONTENT,
        )