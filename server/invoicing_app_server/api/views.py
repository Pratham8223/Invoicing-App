from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from django.core.handlers.wsgi import WSGIRequest
from django.http.response import JsonResponse


# Create your views here.
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def home(request: WSGIRequest):
    return Response({'email': request.user.shop.name})


def handler404(request, exception):
    return JsonResponse({'err': 'not found.'}, status=404)


def handler500(request):
    return JsonResponse({'err': 'internal server error.'}, status=404)
