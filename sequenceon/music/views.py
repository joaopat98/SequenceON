from datetime import datetime, timedelta
from random import choice

from django.contrib.auth import authenticate, login, logout
from django.forms import ModelForm
from django.http import *

from .decorators import require_login
from .forms import *
from .models import *

instrumentLst = ["Drums", "Bass", "Piano", "Guitar", "Electric Guitar"]


def error_dict(*args):
    final = dict()
    for item in args:
        if item is not None:
            if issubclass(type(item), ModelForm):
                errors = dict()
                for error in item.errors.keys():
                    errors[error] = item.errors[error][0]
                final = {**final, **errors}
            else:
                final = {**final, **item}
    return final


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
        return JsonResponse(error_dict(user_form.errors), status=400)
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
            sheet = song.sheets.filter(user=request.user).first()
            if sheet is not None:
                request.session["sheet"] = sheet.id
                request.session["joined"] = True
                sheets = song.sheets.all()
                notes = {}
                for song_sheet in sheets:
                    notes[song_sheet.instrument] = list(map(lambda s: s.serialize(), song_sheet.notes.all()))
                users = {}
                for song_sheet in sheets:
                    users[song_sheet.instrument] = song_sheet.user.username
                return JsonResponse(
                    {
                        "instruments": list(map(lambda s: s.instrument, sheets)),
                        "notes": notes,
                        "users": users,
                        "instrument": sheet.instrument,
                        "length": song.length,
                        "song": song.id
                    })
            else:
                request.session["joined"] = False
                lst_copy = instrumentLst[:]
                used = map(lambda s: s.instrument, Sheet.objects.filter(song=song))
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
            request.session["joined"] = False
            sheets = song.sheets.all()
            notes = {}
            for sheet in sheets:
                notes[sheet.instrument] = list(map(lambda s: s.serialize(), sheet.notes.all()))
            users = {}
            for sheet in sheets:
                users[sheet.instrument] = sheet.user.username
            return JsonResponse(
                {
                    "instrument": request.POST["instrument"],
                    "instruments": list(map(lambda s: s.instrument, sheets)),
                    "notes": notes, "users": users,
                    "length": song.length,
                    "song": song.id
                })


@require_login
def logout_view(request):
    logout(request)
    return HttpResponse()
