from django.db import models
from django.conf import settings


class Cat(models.Model):
    name = models.CharField(max_length=50)
    age = models.PositiveIntegerField()
    breed = models.CharField(max_length=50)

    class FurLength(models.TextChoices):
        SHORT = 'short', 'Короткая'
        LONG = 'long', 'Длинная'
        HAIRLESS = 'hairless', 'Лысая'

    fur_length = models.CharField(
        max_length=10,
        choices=FurLength.choices,
        default=FurLength.SHORT,
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cats'
    )


    def __str__(self):
        return f'{self.name} ({self.breed})'
