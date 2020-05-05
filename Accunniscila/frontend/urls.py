from django.urls import path
from . import views


urlpatterns = [
    path('', views.IndexView.as_view(), name="IndexView" ),
    path('about/', views.About.as_view(), name="About" ),
    path('creaOrdine/', views.CreaOrdine.as_view(), name="CreaOrdine" ),
    path('myOrders/', views.Orders.as_view(), name="Orders" ),
    path('myOrders/<int:order_id>', views.OrderDetails.as_view(), name="OrderDetails" ),
    path('menu/', views.Menu.as_view(), name="Menu" ),
    path('signUp/', views.SignUp.as_view(), name="SignUp" ),
    path('login/', views.Login.as_view(), name="Login" ),
]