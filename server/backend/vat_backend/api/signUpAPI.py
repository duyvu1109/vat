from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from vat_backend.serializers import SignUpSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from vat_backend.models import User
from django.contrib.auth.hashers import make_password

class SignUpViewSet(viewsets.ModelViewSet, TokenObtainPairView):
    permission_classes = [
        permissions.AllowAny,
    ]
    serializer_class = SignUpSerializer
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        if User.objects.all().filter(username=request.data.get('username')):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.validated_data['password'] = make_password(serializer.validated_data['password'])        
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        res = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        return Response({
            "user": serializer.data,
            "refresh": res["refresh"],
            "access": res["access"]
        }, status=status.HTTP_201_CREATED)
