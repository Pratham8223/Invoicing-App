# Generated by Django 4.0.1 on 2022-01-14 16:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('purchase_orders', '0009_poitem_product'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='purchaseorder',
            name='is_complete',
        ),
    ]