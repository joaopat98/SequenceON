# chat/consumers.py
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json

from .models import Sheet, Note


class ChatConsumer(WebsocketConsumer):
    def connect(self):

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            str(self.scope["session"]["song"]),
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            str(self.scope["session"]["song"]),
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        obj = json.loads(text_data)
        sheet = Sheet.objects.filter(id=self.scope["session"]["sheet"]).first()
        if obj["instrument"] == sheet.instrument:
            if obj["action"] == "add":
                for note in obj["notes"]:
                    new_note = Note(time=note["x"], pitch=note["y"], length=note["length"], sheet=sheet)
                    new_note.save()
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            str(self.scope["session"]["song"]),
            {
                'type': 'chat_message',
                'message': text_data
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))
