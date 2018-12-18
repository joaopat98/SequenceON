from django.db import models


class Song(models.Model):
    name = models.CharField(max_length=50)
    length = models.IntegerField()


class Sheet(models.Model):
    instrument = models.CharField(max_length=20)
    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name="sheets")


class Note(models.Model):
    time = models.IntegerField()
    pitch = models.IntegerField()
    length = models.IntegerField()
    sheet = models.ForeignKey(Song, on_delete=models.CASCADE, related_name="notes")
