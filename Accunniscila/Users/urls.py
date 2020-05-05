from django.urls import path
from . import views


urlpatterns = [
    path('api/login', views.Login.as_view(), name="Login" ),
    path('api/logout', views.Logout.as_view(), name="Logout" ),
    path('api/register', views.Register.as_view(), name="Register" ),
    path('api/check', views.check.as_view(), name="check" ),
]