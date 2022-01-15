from django.urls import path
from .views import shop, shop_id, product, product_id

urlpatterns = [
    path('', shop),
    path('<int:id>/', shop_id),
    path('product/', product),
    path('product/<int:id>', product_id)
]
