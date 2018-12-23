# chat/consumers.py
import json

from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.generic.websocket import WebsocketConsumer
from django.db import close_old_connections

from .models import Sheet, Note


def get_sheet(session):
    return Sheet.objects.filter(id=session["sheet"]).first()


def get_sheet_instrument(session):
    return Sheet.objects.filter(id=session["sheet"]).first().instrument


class ChatConsumer(WebsocketConsumer):
    def connect(self):

        # Join room group
        if self.scope["session"].get("room", 0) != self.scope["session"]["song"]:
            d = {
                "username": self.scope["user"].username,
                "instrument": get_sheet_instrument(self.scope["session"]),
                "action": "join"
            }
            async_to_sync(self.channel_layer.group_send)(
                str(self.scope["session"]["song"]),
                {
                    'type': 'chat_message',
                    'message': json.dumps(d)
                }
            )
            self.scope["session"]["room"] = self.scope["session"]["song"]
            self.scope["session"].save()

        async_to_sync(self.channel_layer.group_add)(
            str(self.scope["session"]["song"]),
            self.channel_name
        )
        close_old_connections()
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        close_old_connections()
        async_to_sync(self.channel_layer.group_discard)(
            str(self.scope["session"]["song"]),
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        obj = json.loads(text_data)
        if obj["instrument"] == get_sheet_instrument(self.scope["session"]):
            self.save_changes(obj, self.scope["session"]["sheet"])
            # Send message to room group
            close_old_connections()
            async_to_sync(self.channel_layer.group_send)(
                str(self.scope["session"]["song"]),
                {
                    'type': 'chat_message',
                    'message': text_data
                }
            )

    def save_changes(self, obj, sheet_id):
        sheet = Sheet.objects.filter(id=sheet_id)
        if obj["action"] == "add":
            for note in obj["notes"]:
                new_note = Note(time=note["x"], pitch=note["y"], length=note["length"], sheet=sheet)
                new_note.save()
        elif obj["action"] == "remove":
            for note in obj["notes"]:
                new_note = Note.objects.filter(time=note["x"], pitch=note["y"], sheet=sheet).first()
                new_note.delete()
        elif obj["action"] == "change_length":
            for note in obj["notes"]:
                new_note = Note.objects.filter(time=note["x"], pitch=note["y"], sheet=sheet).first()
                new_note.length = note["length"]
                new_note.save()

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        obj = json.loads(message)
        if get_sheet_instrument(self.scope["session"]) != obj["instrument"]:
            # Send message to WebSocket
            close_old_connections()
            self.send(text_data=json.dumps({
                'message': message
            }))
