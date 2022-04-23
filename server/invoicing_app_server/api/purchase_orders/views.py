import datetime
import json

from django.core.handlers.wsgi import WSGIRequest
from django.http import FileResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authentication import TokenAuthentication, BasicAuthentication, SessionAuthentication
from rest_framework.decorators import authentication_classes, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from invoice_helper.invoice_helper import Invoice
from .models import PurchaseOrder, POItem
from .serializers import PurchaseOrderSerializer, POItemSerializer
from ..mail_helper.mail_helper import send_email_with_invoice
from ..shop.models import Product
from ..shop.serializers import ShopSerializer


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def purchase_orders(request: WSGIRequest):
    if request.method == 'GET':
        if 'month' in list(request.GET.keys()) and 'year' in list(request.GET.keys()):
            u_pos = PurchaseOrder.objects.filter(shop=request.user.shop, created_at__year=int(request.GET['year']),
                                                 created_at__month=int(request.GET['month'])).order_by('-created_at')
        else:
            u_pos = PurchaseOrder.objects.filter(shop=request.user.shop)

        u_pos_serialized = PurchaseOrderSerializer(u_pos, many=True).data
        for i in u_pos_serialized:
            i['po_items'] = POItemSerializer(POItem.objects.filter(purchase_order__id=i['id']), many=True).data

        return Response(u_pos_serialized)

    if request.method == 'POST':

        if not request.user.is_email_verified:
            return JsonResponse({'err': 'Email not verified!. Please verify it in settings session.'}, status=400)

        po_details = request.data

        print(po_details['due_date'])

        try:
            nw_po = PurchaseOrder(customer_name=po_details['customer_name'],
                                  customer_email=po_details['customer_email'],
                                  customer_phone=po_details['customer_phone'],
                                  customer_address=po_details['customer_address'],
                                  discount=float(po_details['discount']),
                                  pending_amount=float(po_details['pending_amount']),
                                  shop=request.user.shop)

            if int(po_details['pending_amount']) > 0:
                nw_po.due_date = datetime.datetime.strptime(po_details['due_date'], '%Y-%m-%d').date()

            inv_count = PurchaseOrder.objects.filter(shop=request.user.shop).count()
            if inv_count > 0:
                nw_po.invoice_no = PurchaseOrder.objects.filter(shop=request.user.shop)[inv_count - 1].invoice_no + 1
            else:
                nw_po.invoice_no = 1

            for itm in po_details['po_items']:

                po_itm = POItem()

                # if itm['product'] is not None:
                #   Todo: Enable this feature when inventory is pushed in production
                #   temp_p = Product.objects.get(id=itm['product'])
                #   if temp_p.shop == request.user.shop:
                #       po_itm.product = temp_p
                #       temp_p.available_stock -= itm['quantity']
                #
                #   else:
                #       nw_po.delete()
                #       return Response({'err': f'Unauthorized product of id {itm["product"]}'}, status=401)

                itm.pop('product')

                for key, val in itm.items():
                    setattr(po_itm, key, val)

                setattr(po_itm, 'amount', float(itm['cost']) * float(itm['quantity']))
                po_itm.purchase_order = nw_po

                nw_po.subtotal += float(po_itm.amount)
                try:
                    nw_po.discount = float(po_details['discount'])
                except:
                    nw_po.discount = 0

                nw_po.save()
                po_itm.save()

            if int(po_details['pending_amount']) > nw_po.subtotal:
                return Response({'err': 'Pending amount cannot be greater than subtotal.'}, status=400)

            u_pos_serialized = PurchaseOrderSerializer(nw_po).data
            u_pos_serialized['po_items'] = POItemSerializer(POItem.objects.filter(purchase_order=nw_po), many=True).data

            if po_details['send_to_customer']:
                inv_details = u_pos_serialized
                po_itm = []
                for itm in POItemSerializer(POItem.objects.filter(purchase_order__id=nw_po.id), many=True).data:
                    po_itm.append(dict(itm))

                inv_details['po_items'] = po_itm
                inv_details['shop'] = ShopSerializer(request.user.shop).data
                Invoice(u_pos_serialized).get_output(str(nw_po.id))
                a = send_email_with_invoice(to_email=po_details['customer_email'], subject="Your Invoice",
                                            content="Here is your invoice from {}".format(request.user.shop.name),
                                            invoice_id=str(nw_po.id))
                if a < 300:
                    u_pos_serialized['email_status'] = True
                else:
                    u_pos_serialized['email_status'] = False
            else:
                u_pos_serialized['email_status'] = None

            return Response(u_pos_serialized)

        except Exception as e:
            print(e)
            return Response({'err': str(e)}, status=400)


# @api_view(['delete', 'GET', 'PUT'])
@authentication_classes([TokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def purchase_orders_id(request: WSGIRequest, id: int):
    if request.method == 'GET':

        try:
            inv_details = PurchaseOrderSerializer(PurchaseOrder.objects.get(id=id, shop=request.user.shop)).data
        except Exception as e:
            print(e)
            return Response({'err': "Unauthorized"}, status=401)

        po_itm = []

        for itm in POItemSerializer(POItem.objects.filter(purchase_order__id=id), many=True).data:
            po_itm.append(dict(itm))

        inv_details['po_items'] = po_itm
        inv_details['shop'] = ShopSerializer(request.user.shop).data

        if 'res' in dict(request.GET.items()).keys():
            if dict(request.GET.items())['res'] == 'invoice':
                Invoice(inv_details).get_output(str(id))
                return FileResponse(open(f'./invoices/{str(id)}.pdf', 'rb'))

        return Response(inv_details)

    if request.method == 'PUT':
        try:
            edit_po = json.loads(request.body)

            po = PurchaseOrder.objects.get(id=id)

            if po.shop != request.user.shop:
                return Response({'err': f'Cannot edit purchase order with id {id}'}, status=401)

            try:
                po.customer_name = edit_po['customer_name']
                po.save()

                u_pos_serialized = PurchaseOrderSerializer(po).data
                u_pos_serialized['po_items'] = POItemSerializer(POItem.objects.filter(purchase_order=po),
                                                                many=True).data
                return Response(u_pos_serialized)

            except Exception as e:
                return Response({'err': str(e)}, status=400)

        except Exception as e:
            return Response({'err': str(e)}, status=400)

    if request.method == 'DELETE':
        try:
            PurchaseOrder.objects.get(id=id, shop=request.user.shop).delete()
            return JsonResponse({'msg': 'Successfully deleted invoice'}, status=200)
        except Exception as e:
            print(e)
            return JsonResponse({'err': str(e)}, status=400)


@api_view(['PUT'])
@authentication_classes([TokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def po_item_id(request: WSGIRequest, po_itm_id: int):
    try:
        edit_po_data = json.loads(request.body)

        po_itm_obj = POItem.objects.get(id=po_itm_id)

        for key, val in edit_po_data.items():
            if key == 'product':
                setattr(po_itm_obj, key, Product.objects.get(id=val, shop=request.user.shop))
            else:
                setattr(po_itm_obj, key, val)

        setattr(po_itm_obj, 'amount', edit_po_data['cost'] * edit_po_data['quantity'])
        po_itm_obj.save()

        po = recalculate_po(po_itm_obj.purchase_order.id)
        po_itm_obj.save()

        u_pos_serialized = PurchaseOrderSerializer(po).data
        u_pos_serialized['po_items'] = POItemSerializer(POItem.objects.filter(purchase_order=po),
                                                        many=True).data
        return Response(u_pos_serialized)

    except Exception as e:
        return Response({'err': str(e)}, status=400)


def recalculate_po(po_id: int):
    po = PurchaseOrder.objects.get(id=po_id)

    po.subtotal = 0
    po.discount = 0
    po.tax = 0

    for po_itm in POItem.objects.filter(purchase_order=po):
        po.subtotal += po_itm.amount
        po.discount += po_itm.discount
        po.tax += po_itm.tax

    po.save()
    return po
