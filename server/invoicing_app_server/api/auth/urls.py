from django.urls import path
from .views import api_login, api_logout

urlpatterns = [
    path('api-login/', api_login),
    path('api-logout/', api_logout),
]
