from django.db import models
from django.conf import settings


class Breeder(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='breeder'
    )


    def __str__(self):
        return f'Breeder: {self.user.username}'


class Cat(models.Model):
    name = models.CharField(max_length=50)
    age = models.PositiveIntegerField()
    breed = models.CharField(max_length=50)
    fur_length = models.CharField(
        max_length=10,
        choices=[
            ('short', 'Короткая'),
            ('long', 'Длинная'),
            ('hairless', 'Лысая'),
        ],
        default='short'
    )
    owner = models.ForeignKey(
        Breeder,
        on_delete=models.CASCADE,
        related_name='cats'
    )


    def __str__(self):
        return f'{self.name} ({self.breed})'
