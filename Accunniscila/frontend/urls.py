from django.urls import path
from . import views


urlpatterns = [
    path('', views.IndexView.as_view(), name="IndexView" ),
    path('creaOrdine/', views.CreaOrdine.as_view(), name="CreaOrdine" ),
    path('menu/', views.Menu.as_view(), name="Menu" ),
    path('signUp/', views.SignUp.as_view(), name="SignUp" ),
    path('login/', views.Login.as_view(), name="Login" ),
]