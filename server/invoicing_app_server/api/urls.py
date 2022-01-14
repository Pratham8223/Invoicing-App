from django.urls import path, include
from .views import check_auth

urlpatterns = [
    path('test_auth/', check_auth),
    path('users/', include('api.users.urls')),
    path('shop/', include('api.shop.urls')),
    path('purchase_orders/', include('api.purchase_orders.urls'))
]
