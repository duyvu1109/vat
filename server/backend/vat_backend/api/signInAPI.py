from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.viewsets import ModelViewSet
from vat_backend.serializers import SignInSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.response import Response
from rest_framework import status

from vat_backend.models import User

class SignInViewSet(ModelViewSet, TokenObtainPairView):
    serializer_class = SignInSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        user_login =  User.objects.all().filter(username=request.data.get('username')).first()
        if user_login.is_block:
            return Response(status=status.HTTP_423_LOCKED)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
