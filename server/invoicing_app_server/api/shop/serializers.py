from rest_framework.serializers import ModelSerializer
from .models import Shop, Product


class ShopSerializer(ModelSerializer):
    class Meta:
        model = Shop
        fields = '__all__'


class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
