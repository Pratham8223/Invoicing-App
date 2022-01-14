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
            'product_name',
            'cost',
            'discount',
            'tax',
            'quantity',
            'amount',
            'created_at',
            'updated_at',
        )
