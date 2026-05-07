from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserRegistrationView, CatViewSet


router = DefaultRouter()
router.register(r'cats', CatViewSet, basename='cat')

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('', include(router.urls))
]