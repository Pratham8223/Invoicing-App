from rest_framework.serializers import ModelSerializer
from .models import PurchaseOrder, POItem


class PurchaseOrderSerializer(ModelSerializer):
    class Meta:
        model = PurchaseOrder
        fields = '__all__'


class POItemSerializer(ModelSerializer):
    class Meta:
        model = POItem
        fields = (
            'id',
            'product_name',
            'cost',
            'serial_no',
            'tax',
            'quantity',
            'amount',
            'created_at',
            'updated_at',
        )
