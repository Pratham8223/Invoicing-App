from django.urls import path
from .views import check_auth

urlpatterns = [
    path('test_auth/', check_auth),
]
