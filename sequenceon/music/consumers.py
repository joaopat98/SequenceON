# chat/consumers.py
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json

from .models import Sheet, Note


def get_sheet(session):
    return Sheet.objects.filter(id=session["sheet"]).first()


class ChatConsumer(WebsocketConsumer):
    def connect(self):

        # Join room group
        if not self.scope["session"].get("joined", False):
            d = {
                "username": self.scope["user"].username,
                "instrument": get_sheet(self.scope["session"]).instrument,
                "action": "join"
            }
            async_to_sync(self.channel_layer.group_send)(
                str(self.scope["session"]["song"]),
                {
                    'type': 'chat_message',
                    'message': json.dumps(d)
                }
            )
            self.scope["session"]["joined"] = True
            self.scope["session"].save()

        async_to_sync(self.channel_layer.group_add)(
            str(self.scope["session"]["song"]),
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        self.scope["session"]["joined"] = False
        self.scope["session"].save()
        async_to_sync(self.channel_layer.group_discard)(
            str(self.scope["session"]["song"]),
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        obj = json.loads(text_data)
        sheet = get_sheet(self.scope["session"])
        if obj["action"] == "ping":
            self.send(text_data=json.dumps({
                "message": json.dumps({'action': "pong"})

            }))
            return
        if obj["instrument"] == sheet.instrument:
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
            elif obj["action"] == "length":
                sheet.song.length = obj["length"]
                sheet.song.save()
            # Send message to room group
            elif obj["action"] == "offset":
                for note in obj["notes"]:
                    new_note = Note.objects.filter(time=note["x"], pitch=note["y"], sheet=sheet).first()
                    new_note.time = new_note.time + obj["offsetX"]
                    new_note.pitch = new_note.pitch + obj["offsetY"]
                    new_note.save()
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
        obj = json.loads(message)
        sheet = Sheet.objects.filter(id=self.scope["session"]["sheet"]).first()
        if sheet.instrument != obj["instrument"]:
            # Send message to WebSocket
            self.send(text_data=json.dumps({
                'message': message
            }))
