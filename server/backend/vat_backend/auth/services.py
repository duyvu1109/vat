import requests
from typing import Tuple

from django.conf import settings
from django.http import HttpResponse
from django.core.exceptions import ValidationError
from django.db import transaction

from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.compat import set_cookie_with_token

from ..models import User
from django.utils import timezone
from datetime import datetime

GOOGLE_ID_TOKEN_INFO_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo'
GOOGLE_ACCESS_TOKEN_OBTAIN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

def get_now() -> datetime:
    return timezone.now()

def user_record_login(*, user: User) -> User:
    user.last_login = get_now()
    user.save()

    return user

def jwt_login(*, response: HttpResponse, user: User) -> HttpResponse:
    jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
    jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

    payload = jwt_payload_handler(user)
    payload.update({'user_id': str(payload.get('user_id'))})
    token = jwt_encode_handler(payload)

    if api_settings.JWT_AUTH_COOKIE:
        set_cookie_with_token(response, api_settings.JWT_AUTH_COOKIE, token)

    user_record_login(user=user)

    return response


def google_validate_id_token(*, id_token: str) -> bool:
    response = requests.get(
        GOOGLE_ID_TOKEN_INFO_URL,
        params={'id_token': id_token}
    )

    if not response.ok:
        raise ValidationError('id_token is invalid.')

    audience = response.json()['aud']

    if audience != settings.GOOGLE_OAUTH2_CLIENT_ID:
        raise ValidationError('Invalid audience.')

    return True

def user_create(email, password=None, **extra_fields) -> User:
    is_staff = False
    if email in settings.GG_ADMIN_ACCOUNT:
        is_staff = True
    extra_fields = {
        'username': email,
        'is_staff': is_staff,
        **extra_fields
    }

    user = User(email=email, **extra_fields)
    if password:
        user.set_password(password)
    else:
        user.set_unusable_password()

    user.full_clean()
    user.save()

    return user

@transaction.atomic
def user_get_or_create(*, email: str, **extra_data) -> Tuple[User, bool]:
    user = User.objects.filter(email=email).first()

    if user:
        return user, False

    return user_create(email=email, **extra_data), True

def user_get_me(*, user: User):
    return {
        '_id': user._id,
        'username': user.username,
        'is_staff': user.is_staff,
        'first_name': user.first_name,
        'last_name': user.last_name,
    }

def get_first_matching_attr(obj, *attrs, default=None):
    for attr in attrs:
        if hasattr(obj, attr):
            return getattr(obj, attr)

    return default


def get_error_message(exc) -> str:
    if hasattr(exc, 'message_dict'):
        return exc.message_dict
    error_msg = get_first_matching_attr(exc, 'message', 'messages')

    if isinstance(error_msg, list):
        error_msg = ', '.join(error_msg)

    if error_msg is None:
        error_msg = str(exc)

    return error_msg
