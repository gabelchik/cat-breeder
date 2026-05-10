from rest_framework import generics, permissions

from django.contrib.auth import get_user_model
from django.db.models import Q

from .models import Message
from .serializers import UserSerializer, MessageSerializer


User = get_user_model()


class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        current_user = self.request.user
        return User.objects.exclude(
            Q(id=current_user.id) | Q(is_superuser=True)
        )


class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        other_user_id = self.kwargs['user_id']
        current_user = self.request.user
        return Message.objects.filter(
            (Q(sender=current_user, receiver_id=other_user_id) |
             Q(sender_id=other_user_id, receiver=current_user))
        ).order_by('created_at')