from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .mixins import ApiErrorsMixin, PublicApiMixin
from .services import jwt_login, google_validate_id_token
from .services import user_get_or_create, user_get_me

import json
from bson import ObjectId

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)
    
class UserInitApi(PublicApiMixin, ApiErrorsMixin, APIView):
    class InputSerializer(serializers.Serializer):
        email = serializers.EmailField()
        first_name = serializers.CharField(required=False, default='')
        last_name = serializers.CharField(required=False, default='')

    def post(self, request, *args, **kwargs):
        id_token = request.headers.get('Authorization')
        google_validate_id_token(id_token=id_token)
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user, _ = user_get_or_create(**serializer.validated_data)
        if user.is_block:
            return Response(status=status.HTTP_423_LOCKED)
        response = Response(user_get_me(user=user))
        response = jwt_login(response=response, user=user)
        # Generate token to access and refresh
        refresh = RefreshToken.for_user(user)
        response.data['access'] = str(refresh.access_token)
        response.data['refresh'] = str(refresh)
        response.data = JSONEncoder().encode(response.data)
        return response
        
