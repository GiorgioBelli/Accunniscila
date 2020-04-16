from django.urls import path
from . import views


urlpatterns = [
    path('', views.index ),
    path('creaOrdine/', views.creaOrdine ),
    path('menu/', views.menu ),
]