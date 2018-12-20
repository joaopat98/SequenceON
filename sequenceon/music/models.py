from django.contrib.auth.models import User
from django.db import models


class Song(models.Model):
    name = models.CharField(max_length=50, blank=True)
    length = models.IntegerField(default=64)


class Sheet(models.Model):
    instrument = models.CharField(max_length=20)
    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name="sheets")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sheets")


class Note(models.Model):
    time = models.IntegerField()
    pitch = models.IntegerField()
    length = models.IntegerField()
    sheet = models.ForeignKey(Song, on_delete=models.CASCADE, related_name="notes")
