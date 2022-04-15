from django.db import models
from ..shop.models import Shop, Product


# Create your models here.
class PurchaseOrder(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)

    customer_name = models.CharField(max_length=40, default=None, null=True)
    customer_email = models.CharField(max_length=40, default=None, null=True)
    customer_address = models.CharField(max_length=100, default=None, null=True)
    customer_phone = models.CharField(max_length=40, default=None, null=True)

    subtotal = models.FloatField(default=0.0)
    discount = models.FloatField(default=0.0)

    invoice_no = models.BigIntegerField()

    pending_amount = models.FloatField(default=0.0)
    due_date = models.DateField(default=None, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "({}) {} : Subtotal {}".format(self.id, self.shop.name, self.subtotal)


class POItem(models.Model):
    product_name = models.CharField(max_length=50, default='')

    product = models.ForeignKey(Product, null=True, on_delete=models.SET_NULL)
    serial_no = models.CharField(max_length=30, default='')

    cost = models.FloatField()
    tax = models.FloatField()

    quantity = models.FloatField()
    amount = models.FloatField()

    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
