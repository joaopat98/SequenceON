# chat/urls.py
from django.conf.urls import url
from django.urls import re_path

from . import views

urlpatterns = [
    re_path('user/register', views.register),
    re_path('user/logincheck', views.is_logged_in),
    re_path('user/login', views.login_view),
    re_path('user/logout', views.logout_view),
    re_path('random', views.random),
    re_path('createroom', views.createroom),
    re_path('joinroom', views.join_room),
    re_path('selectinstrument', views.select_instrument),
]
