import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from .models import Message

from django.contrib.auth import get_user_model


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.other_user_id = self.scope['url_route']['kwargs']['user_id']
        self.user = self.scope['user']

        if self.user.is_anonymous:
            await self.close()
            return

        user_ids = sorted([self.user.id, int(self.other_user_id)])
        self.room_group_name = f'chat_{user_ids[0]}_{user_ids[1]}'

        await self.channel_layer.group_add(self.room_group_name,
                                           self.channel_name)

        await self.accept()


    async def disconnect(self, code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )


    async def receive(self, text_data = None, bytes_data = None):
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            return

        message_text = data.get('message')
        if not message_text:
            return

        await self.save_message(self.user.id, int(self.other_user_id), message_text)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message_text,
                'sender_id': self.user.id,
                'sender_username': self.user.username,
            }
        )


    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'sender_username': event['sender_username']
        }))


    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, text):
        User = get_user_model()
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)
        Message.objects.create(sender=sender, receiver=receiver, text=text)