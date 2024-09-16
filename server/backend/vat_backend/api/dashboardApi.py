from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from vat_backend.serializers import DashboardSerializer
from vat_backend.models import Dashboard
from bson import ObjectId
import json
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


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


class IsAuthenticated(permissions.BasePermission):
    """
    Allows access only to authenticated users.
    """

    def has_permission(self, request, view):
        request.user.last_login = timezone.now()
        request.user.save(update_fields=["last_login"])
        return bool(request.user and request.user.is_authenticated)


class DashboardViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    serializer_class = DashboardSerializer
    queryset = Dashboard.objects.all()

    def create(self, request, *args, **kwargs):
        if request.user and request.user.dashboard_set.count() >= request.user.max_dashboards:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        userID = ObjectId(request.data.get("user"))
        request.data["user"] = userID
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        record_update = Dashboard.objects.all().filter(_id=ObjectId(serializer.data["_id"])).first()
        record_update.link_public = request.data.get("link_public") + str(serializer.data["_id"])
        record_update.save()
        return Response(serializer.data["_id"])


class Object:
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)


class DashboardViewDetail(APIView):
    serializer_class = DashboardSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    queryset = Dashboard.objects.all()

    def get(self, request, ID):
        record_response = Dashboard.objects.all().filter(user_id=ObjectId(ID))
        dashboard_serializer = DashboardSerializer(record_response, many=True)
        return Response(JSONEncoder().encode(dashboard_serializer.data))

    def put(self, request, ID):
        record_update = Dashboard.objects.all().filter(_id=ObjectId(ID)).first()
        record_update.name = request.data.get("name")
        record_update.description = request.data.get("description")
        record_update.public = request.data.get("public")
        record_update.save()
        return Response(status=status.HTTP_200_OK)

    def delete(self, request, ID):
        record_delete = Dashboard.objects.all().filter(_id=ObjectId(ID)).first()
        record_delete.delete()
        return Response(status=status.HTTP_200_OK)
