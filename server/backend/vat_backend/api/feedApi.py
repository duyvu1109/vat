from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from vat_backend.serializers import FeedSerializer
from vat_backend.models import Feed
from vat_backend.models import Dashboard
from bson import ObjectId
from rest_framework.permissions import IsAuthenticated
# Create Views and API here
import json

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
        return obj.owner == request.user or request.user.is_staff


class FeedViewSet(viewsets.ModelViewSet):
    serializer_class = FeedSerializer
    permission_classes = [
        IsAuthenticated, IsOwnerOrAdmin
    ]  
    queryset = Feed.objects.all()

    def create(self, request, *args, **kwargs):
        if request.user and request.user.feed_set.count() >= request.user.max_feeds:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        userID = ObjectId(request.data.get('user'))
        request.data['user'] = userID
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data['_id'])


class Object:
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)


class FeedViewDetail(APIView):
    serializer_class = FeedSerializer
    permission_classes = [
        IsAuthenticated, IsOwnerOrAdmin
    ]  
    queryset = Feed.objects.all()
    def get(self, request, ID):
        record_response = Feed.objects.all().filter(user=ObjectId(ID))
        feed_serializer = FeedSerializer(record_response, many=True)
        return Response(JSONEncoder().encode(feed_serializer.data))

    def put(self, request, ID):
        record_update = Feed.objects.all().filter(_id=ObjectId(ID)).first()
        record_update.name = request.data.get('name')
        record_update.description = request.data.get('description')
        record_update.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def delete(self, request, ID):
        record_delete = Feed.objects.all().filter(_id=ObjectId(ID)).first()
        widget_delete = record_delete.widget_set.all()
        widget_delete.delete()
        record_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class FeedViewDetailPublic(APIView):
    serializer_class = FeedSerializer
    permission_classes = []  
    queryset = Feed.objects.all()
    def get(self, request, ID):
        dashboard_ID = ObjectId(ID)
        currentDashboard = Dashboard.objects.all().filter(_id=dashboard_ID).first()
        record_response = Feed.objects.all().filter(user=ObjectId(currentDashboard.user_id))
        feed_serializer = FeedSerializer(record_response, many=True)
        # returnData = {"data": feed_serializer.data, "user": currentDashboard.user}
        returnData = {}
        returnData["data"] = feed_serializer.data
        returnData["user"] = currentDashboard.user.username
        return Response(JSONEncoder().encode(returnData))