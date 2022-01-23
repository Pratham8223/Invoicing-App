import json

from django.contrib.auth import login, logout
from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import permission_classes, authentication_classes, api_view
from rest_framework.permissions import IsAuthenticated

from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from django.views.decorators.csrf import csrf_exempt

from api.users.models import CustomUser


@csrf_exempt
def api_login(request: WSGIRequest):
    if request.method != 'POST':
        return JsonResponse({'err': "invalid http request"}, status=405)

    usr_credentials = json.loads(request.body)

    try:
        usr = CustomUser.objects.get(email=usr_credentials['email'])

        if usr.check_password(usr_credentials['password']):

            # Delete Previous tokens.
            for tkn in Token.objects.filter(user=usr):
                tkn.delete()

            token = Token.objects.create(user=usr)
            login(request, user=usr)
            return JsonResponse({'token': 'Token ' + token.key})
        else:
            return JsonResponse({'err': 'incorrect password.'}, status=401)

    except Exception as e:
        print(e)
        return JsonResponse({'err': 'invalid email or password'}, status=400)


@csrf_exempt
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def api_logout(request: WSGIRequest):
    tkn = request.headers['Authorization'].split(' ')[-1]

    try:
        del_token = Token.objects.get(user=request.user, key=tkn)
        del_token.delete()
        logout(request)

        return Response({'message': 'Logged out successfully.'})
    except Exception as e:

        return Response({'err': 'invalid user or authtoken'}, status=400)
