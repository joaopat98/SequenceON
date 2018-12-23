from datetime import datetime, timedelta
from random import choice

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import *

from .decorators import require_login
from .forms import *
from .models import *

instrumentLst = ["Drums", "Bass", "Piano", "Guitar", "Electric Guitar"]


def get_song(request):
    return Song.objects.filter(id=int(request.session["song"])).first()


def register(request):
    if request.method == "POST":
        user_form = UserCreationForm(request.POST)
        if user_form.is_valid():
            user = user_form.save()
            user.is_active = True
            user.save()
            return HttpResponse()
        return HttpResponseBadRequest()
    else:
        return HttpResponseNotAllowed("Method not Allowed")


def login_view(request):
    if request.method == "POST":
        try:
            user = authenticate(username=request.POST["username"], password=request.POST["password"])
        except KeyError as k:
            return JsonResponse({k.args[0]: "field missing in form"}, status=400)
        if user is not None:
            login(request, user)
            return HttpResponse()
        else:
            return HttpResponseNotFound()
    else:
        return HttpResponseNotAllowed("Method not Allowed")


@require_login
def is_logged_in(request):
    return HttpResponse()


@require_login
def join_room(request):
    if "room" in request.POST.keys():
        song = Song.objects.filter(id=int(request.POST["room"])).first()
        if song is not None:
            request.session["song"] = song.id
            lst_copy = instrumentLst[:]
            used = map(lambda sheet: sheet.instrument, Sheet.objects.filter(song=song))
            for inst in used:
                lst_copy.remove(inst)
            return JsonResponse({"available_instruments": lst_copy}, safe=False)

        else:
            return HttpResponseNotFound()


@require_login
def createroom(request):
    song = Song.objects.create()
    return JsonResponse(song.id, safe=False)


@require_login
def random(request):
    songs = list(map(lambda s: s.id, Song.objects.filter(created__gte=datetime.now() - timedelta(minutes=20))))
    if len(songs) > 0:
        return JsonResponse(choice(songs), safe=False)
    else:
        return HttpResponseNotFound()


@require_login
def select_instrument(request):
    song = get_song(request)
    if song is not None:
        lst_copy = instrumentLst[:]
        used = map(lambda s: s.instrument, Sheet.objects.filter(song=song))
        for inst in used:
            lst_copy.remove(inst)
        if "instrument" in request.POST.keys() and request.POST["instrument"] in lst_copy:
            sheet = Sheet(instrument=request.POST["instrument"], song=song, user=request.user)
            sheet.save()
            request.session["sheet"] = sheet.id
            sheets = song.sheets.all()
            notes = {}
            for sheet in sheets:
                notes[sheet.instrument] = list(map(lambda s: s.serialize(), sheet.notes.all()))
            users = {}
            for sheet in sheets:
                users[sheet.instrument] = sheet.user.username
            return JsonResponse(
                {"instruments": list(map(lambda s: s.instrument, sheets)), "notes": notes, "users": users})


@require_login
def logout_view(request):
    logout(request)
    return HttpResponse()
