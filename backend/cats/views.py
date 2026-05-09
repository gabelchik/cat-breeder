from rest_framework import generics, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model

from .models import Cat
from .serializers import UserRegistrationSerializer, CatSerializer


User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permissions_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid()
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class CatViewSet(viewsets.ModelViewSet):
    serializer_class = CatSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        return Cat.objects.filter(owner=self.request.user)


    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
