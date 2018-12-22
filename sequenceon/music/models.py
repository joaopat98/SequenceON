from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class Song(models.Model):
    name = models.CharField(max_length=50, blank=True)
    length = models.IntegerField(default=64)
    created = models.DateTimeField(editable=False)

    def save(self, *args, **kwargs):
        if not self.id:
            self.created = timezone.now()
        return super(Song, self).save(*args, **kwargs)


class Sheet(models.Model):
    instrument = models.CharField(max_length=20)
    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name="sheets")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sheets")


class Note(models.Model):
    time = models.IntegerField()
    pitch = models.IntegerField()
    length = models.IntegerField()
    sheet = models.ForeignKey(Sheet, on_delete=models.CASCADE, related_name="notes")

    def serialize(self):
        return {
            "x": self.time,
            "y": self.pitch,
            "length": self.length
        }
