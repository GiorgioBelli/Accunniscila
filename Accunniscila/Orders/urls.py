from django.urls import path
from . import views


urlpatterns = [
    path('api/retrieveOrders', views.RetrieveOrders.as_view(), name="RetrieveOrders" ),
    path('api/createOrder', views.CreateOrder.as_view(), name="CreateOrder" ),
]