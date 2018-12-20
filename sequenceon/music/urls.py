# chat/urls.py
from django.conf.urls import url
from django.urls import re_path

from . import views

urlpatterns = [
    re_path('user/register', views.register),
    re_path('user/login', views.login_view),
    re_path('joinroom', views.join_room),
    re_path('selectinstrument', views.select_instrument),
]
