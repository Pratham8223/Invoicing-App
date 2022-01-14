import json

from django.core.handlers.wsgi import WSGIRequest
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import PurchaseOrder, POItem
from .serializers import PurchaseOrderSerializer, POItemSerializer
from ..shop.models import Product
from ..shop.serializers import ProductSerializer


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def purchase_orders(request: WSGIRequest):
    if request.method == 'GET':
        u_pos = PurchaseOrder.objects.filter(shop=request.user.shop)
        u_pos_serialized = PurchaseOrderSerializer(u_pos, many=True).data
        for i in u_pos_serialized:
            i['po_items'] = POItemSerializer(POItem.objects.filter(purchase_order__id=i['id']), many=True).data

        return Response(u_pos_serialized)

    if request.method == 'POST':
        po_details = json.loads(request.body)

        try:
            nw_po = PurchaseOrder(customer_name=po_details['customer_name'], shop=request.user.shop)
            nw_po.invoice_no = PurchaseOrder.objects.filter(shop=request.user.shop).count() + 1

            for itm in po_details['po_items']:

                po_itm = POItem()

                if itm['product'] is not None:
                    temp_p = Product.objects.get(id=itm['product'])

                    if temp_p.shop == request.user.shop:
                        po_itm.product = temp_p
                        temp_p.stock -= 1

                    else:
                        nw_po.delete()
                        return Response({'err': f'Unauthorized product of id {itm["product"]}'}, status=401)

                itm.pop('product')

                for key, val in itm.items():
                    setattr(po_itm, key, val)

                setattr(po_itm, 'amount', itm['cost'] * itm['quantity'])
                po_itm.purchase_order = nw_po

                nw_po.subtotal += po_itm.amount
                nw_po.discount += po_itm.discount
                nw_po.tax += po_itm.tax

                nw_po.save()
                po_itm.save()

            u_pos_serialized = PurchaseOrderSerializer(nw_po).data
            u_pos_serialized['po_items'] = POItemSerializer(POItem.objects.filter(purchase_order=nw_po), many=True).data

            return Response(u_pos_serialized)

        except Exception as e:
            return Response({'err': str(e)}, status=400)


@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def purchase_orders_id(request: WSGIRequest, id: int):
    pass


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def po_item(request: WSGIRequest, po_id: int):
    pass


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def po_item_id(request: WSGIRequest, po_id: int, po_itm_id: int):
    return Response({'route': f'purchase_orders/{po_id}/po_item/{po_itm_id}/'})
