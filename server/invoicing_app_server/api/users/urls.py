from django.urls import path
from .views import user, user_id

urlpatterns = [
    path('', user),
    path('<int:id>/', user_id),
]
