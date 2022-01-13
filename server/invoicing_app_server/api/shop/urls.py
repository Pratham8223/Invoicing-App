from django.urls import path
from .views import shop, shop_id

urlpatterns = [
    path('', shop),
    path('<int:id>/', shop_id),
]
