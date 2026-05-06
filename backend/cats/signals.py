from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Breeder


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_breeder(sender, instance, created, **kwargs):
    if created:
        Breeder.objects.create(user=instance)