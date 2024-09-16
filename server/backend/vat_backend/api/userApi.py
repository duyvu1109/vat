from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from vat_backend.serializers import UserSerializer, FeedSerializer, DashboardSerializer
from vat_backend.models import User, Feed, Dashboard
from bson import ObjectId
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
import json
class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Instance must have an attribute named `owner`.
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user or request.user.is_staff

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [
        IsAuthenticated, IsAdminUser
    ]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    
    def list(self, request):
        print("Get data user")
        users = User.objects.all()
        user_serializer = UserSerializer(users, many=True)
        return Response(user_serializer.data)
    
    def update(self, request, *args, **kwargs):
        print("Update data user")
        partial = kwargs.pop('partial', False)
        # Override function update Django here, only change query get record by _id
        id_update = kwargs.get('pk', False)
        if id_update:
            record_update = User.objects.all().filter(_id=ObjectId(id_update)).first()
            # Override function update Django above
            serializer = self.get_serializer(record_update, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            if serializer.validated_data.get('password', False):
                serializer.validated_data['password'] = make_password(serializer.validated_data['password'])
            self.perform_update(serializer)

            if getattr(record_update, '_prefetched_objects_cache', None):
                # If 'prefetch_related' has been applied to a queryset, we need to
                # forcibly invalidate the prefetch cache on the record_update.
                record_update._prefetched_objects_cache = {}

            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, *args, **kwargs):
        print("Delete data user")
        id_delete = kwargs.get('pk', False)
        if id_delete:
            record_delete = User.objects.all().filter(_id=ObjectId(id_delete)).first()
            record_delete.delete()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)                

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.is_valid():
            serializer.validated_data['password'] = make_password(serializer.validated_data['password'])
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()

    def get_object(self):
        lookup_field_value = self.kwargs[self.lookup_field]

        obj = User.objects.get(lookup_field_value)
        self.check_object_permissions(self.request, obj)

        return obj
    
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


class UserViewOne(viewsets.ModelViewSet):
    permission_classes = [
        IsAuthenticated
    ]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    
    def list(self, request):
        users = User.objects.all().filter(username = request.user)
        user_serializer = UserSerializer(users, many=True)
        ID = user_serializer.data[0]["_id"]
        feedList = Feed.objects.all().filter(user=ObjectId(ID))
        feedList_serializer = FeedSerializer(feedList, many=True)
        dashboardList = Dashboard.objects.all().filter(user_id=ObjectId(ID))
        dashboardList_serializer = DashboardSerializer(dashboardList, many=True)
        returnData = {}
        returnData["feed"] = len(feedList_serializer.data)
        returnData["dashboard"] = len(dashboardList_serializer.data)
        returnData["data"] = user_serializer.data
        return Response(JSONEncoder().encode(returnData))
    
    def put(self, request):
        users = User.objects.all().filter(username = request.user)
        user_serializer = UserSerializer(users, many=True)
        ID = user_serializer.data[0]["_id"]
        record_update = User.objects.all().filter(_id=ObjectId(ID)).first()
        record_update.first_name = request.data['first_name']
        record_update.last_name = request.data['last_name']
        if request.data['password'] != "no":
            record_update.password = make_password(request.data['password'])
        record_update.save()
        return Response(status=status.HTTP_200_OK)