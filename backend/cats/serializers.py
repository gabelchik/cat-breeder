from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Cat


User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password2']

        extra_kwargs = {
            'email': {
                'error_messages': {
                    'invalid': 'Введите корректный адрес электронной почты.',
                    'required': 'Email обязателен.',
                    'blank': 'Email обязателен.',
                }
            },
            'username': {
                'error_messages': {
                    'required': 'Имя пользователя обязательно.',
                    'blank': 'Имя пользователя обязательно.',
                }
            }
        }

    password = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={
            'min_length': 'Пароль должен содержать не менее 8 символов.',
            'blank': 'Пароль обязателен.',
            'required': 'Пароль обязателен.',
        }
    )

    password2 = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={
            'min_length': 'Пароль должен содержать не менее 8 символов.',
            'blank': 'Подтверждение пароля обязательно.',
            'required': 'Подтверждение пароля обязательно.',
        }
    )


    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Пароли не совпадают")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class CatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cat
        fields = ['id', 'name', 'age', 'breed', 'fur_length', 'fur_length_display','owner', 'owner_info']
        read_only_fields = ['owner']

    owner_info = serializers.ReadOnlyField(source='owner.username')
    fur_length_display = serializers.SerializerMethodField()

    def get_fur_length_display(self, obj):
        return obj.get_fur_length_display()

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data.pop('owner', None)
        cat = Cat.objects.create(owner=request.user, **validated_data)
        return cat
