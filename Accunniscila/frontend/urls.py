from django.urls import path
from . import views


urlpatterns = [
    path('', views.Index ),
    path('creaOrdine/', views.CreaOrdine ),
    path('menu/', views.Menu ),
    path('signUp/', views.SignUp ),
    path('login/', views.Login ),
]