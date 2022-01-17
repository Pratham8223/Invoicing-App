from django.urls import path
from .views import purchase_orders, purchase_orders_id, po_item_id

urlpatterns = [
    path('', purchase_orders),
    path('<int:id>/', purchase_orders_id),
    path('po-item/<int:po_itm_id>/', po_item_id)
]
