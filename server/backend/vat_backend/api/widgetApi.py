from rest_framework import permissions
from rest_framework.response import Response
from vat_backend.serializers import (
    WidgetSerializer,
    DashboardSerializer,
    GaugeSerializer,
    DigitalSerializer,
    ControlSerializer,
    CardSerializer,
    MapSerializer,
    ChartSerializer,
    StatisticSerializer
)
from vat_backend.models import (
    Widget,
    Dashboard,
    User,
    Gauge,
    Digital,
    Control,
    Card,
    Map,
    Chart,
    FeedValue,
    Feed,
    Statistic
)
from rest_framework import status
from bson import ObjectId
from rest_framework.views import APIView
from datetime import date, datetime
import json
import base64
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, (datetime, date)):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)



class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Instance must have an attribute named `owner`.
        return obj.owner == request.user or request.user.is_staff


class WidgetViewDetail(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    serializer_class = WidgetSerializer
    queryset = Widget.objects.all()
    serializer_class1 = DashboardSerializer

    """
    Syntax for create new component
    def _get_value_xxxxx() -> Use for get value when creating or editing component (gauge, chart)
    def _create_new_xxxxx()
    """

    def _get_value_create_widgeṭ̣̣̣(self, widget, current_dashboard_id):
        new_widget = {}
        new_widget['x'] = widget['x']
        new_widget['y'] = widget['y']
        new_widget['w'] = widget['w']
        new_widget['h'] = widget['h'] 
        new_widget['type'] = widget['type'] 
        new_widget['name_color'] = widget['attribute']['name_color']
        new_widget['name'] = widget.get('name', "")
        new_widget['dashboard'] = current_dashboard_id
        # Add new list feed of that widget
        i = 0 
        for feed in widget['feeds']:
            widget['feeds'][i] = ObjectId(feed)
            i += 1
        if i != 0:
            new_widget['feeds'] = widget['feeds']
        return new_widget

    def _get_value_gauge(self, current, widget):
        current['number_of_element'] = widget['attribute']['number_of_element']
        current['signature'] = widget['attribute']['signature']
        current['color'] = widget['attribute']['color']
        current['text_color'] = widget['attribute']['text_color']
        current['arc_width']  = widget['attribute']['arc_width']
        current['animate']= widget['attribute']['animate']
        current['max_value'] = widget['attribute']['max_value']
        return current
    
    def _get_value_digital(self, current, widget):
        current["widget_color"] = widget["attribute"]["widget_color"]
        current["max_value"] = widget["attribute"]["max_value"]
        current["min_value"] = widget["attribute"]["min_value"]
        return current
    
    def _get_value_control(self, current, widget):
        current["off_color"] = widget["attribute"]["off_color"]
        current["on_color"] = widget["attribute"]["on_color"]
        current["number_auto_off"] = 0 # Hard code, wait for CP-060
        current["number_auto_on"] = 0 # Hard code, wait for CP-060
        return current
    
    def _get_value_card(self, current, widget):
        current["value_color"] = widget["attribute"]["value_color"]
        current["background_color"] = widget["attribute"]["background_color"]
        current["signature"] = widget["attribute"]["signature"]
        current["img_link"] = "https://www.google.com/" # Hard code, wait for CP-060
        return current

    def _get_value_card_logo(self, current, widget):
        current["image_data"] = widget["attribute"]["image_data"]
        return current

    def _get_value_map(self, current, widget):
        current["latitude"] = widget["attribute"]["latitude"]
        current["longitude"] = widget["attribute"]["longitude"]
        return current
    
    def _get_value_chart(self, current, widget):
        current["signature"] = widget["attribute"]["signature"]
        current["color_value"] = widget["attribute"]["color_value"]
        current["curve_type"] = widget["attribute"]["curve_type"]
        current["grid_color"] = widget["attribute"]["grid_color"]
        current["background"] = widget["attribute"]["background"]
        return current
    
    def _get_value_statistic(self, current, widget):
        current["precision"] = widget["attribute"]["precision"]
        current["suffix"] = widget["attribute"]["suffix"]
        current["background"] = widget["attribute"]["background"]
        current["equation"] = widget["attribute"]["equation"]
        current["value_color"] = widget["attribute"]["value_color"]
        return current

    def _create_new_gauge(self, widget, new_widget_created):
        # Extend from value widget + value child component
        new_value_gauge = new_widget_created
        new_value_gauge = self._get_value_gauge(new_value_gauge, widget)
        serializerGauge = GaugeSerializer(data=new_value_gauge)
        serializerGauge.is_valid(raise_exception=True)
        serializerGauge.save()

    def _create_new_digital(self, widget, new_widget_created):
        # Extend from value widget + value child component
        new_value_digital = new_widget_created
        new_value_digital = self._get_value_digital(new_value_digital, widget)
        serializerDigital = DigitalSerializer(data=new_value_digital)
        serializerDigital.is_valid(raise_exception=True)
        serializerDigital.save()

    def _create_new_control(self, widget, new_widget_created):
        # Extend from value widget + value child component
        new_value_control = new_widget_created
        new_value_control = self._get_value_control(new_value_control, widget)
        serializerControl = ControlSerializer(data=new_value_control)
        serializerControl.is_valid(raise_exception=True)
        serializerControl.save()

    def _create_new_card(self, widget, new_widget_created):
        # Extend from value widget + value child component
        new_value_card = new_widget_created
        new_value_card = self._get_value_card(new_value_card, widget)
        serializerCard = CardSerializer(data=new_value_card)
        serializerCard.is_valid(raise_exception=True)
        serializerCard.save()

    def _create_new_card_clock(self,widget, new_widget_created):
        new_value_card = new_widget_created
        serializerCard = CardSerializer(data=new_value_card)
        serializerCard.is_valid(raise_exception=True)
        serializerCard.save()

    def _create_new_card_logo(self, widget, new_widget_created):
        new_value_card = new_widget_created
        new_value_card = self._get_value_card_logo(new_value_card, widget)
        serializerCard = CardSerializer(data=new_value_card)
        serializerCard.is_valid(raise_exception=True)
        serializerCard.save()

    def _create_new_map(self, widget, new_widget_created):
        new_value_map = new_widget_created
        new_value_map = self._get_value_map(new_value_map, widget)
        serializerMap = MapSerializer(data=new_value_map)
        serializerMap.is_valid(raise_exception=True)
        serializerMap.save()

    def _create_new_chart(self, widget, new_widget_created):
        new_value_chart = new_widget_created
        new_value_chart = self._get_value_chart(new_value_chart, widget)
        serializerChart = ChartSerializer(data=new_value_chart)
        serializerChart.is_valid(raise_exception=True)
        serializerChart.save()

    def _create_new_statistic(self, widget, new_widget_created):
        new_value_statistic = new_widget_created
        new_value_statistic = self._get_value_statistic(new_value_statistic, widget)
        serializerStatistic = StatisticSerializer(data=new_value_statistic)
        serializerStatistic.is_valid(raise_exception=True)
        serializerStatistic.save()

    """
    Syntax for create new component
    def _get_value_edit_xxxxx()
    def _edit_current_xxxxx()
    """

    def _get_value_edit_widget(self, widget_edit, widget):
        widget_edit.x = widget['x']
        widget_edit.y = widget['y']
        widget_edit.w = widget['w']
        widget_edit.h = widget['h']
        widget_edit.name = widget['name']
        widget_edit.name_color = widget.get('attribute', {}).get('name_color', None) or widget_edit.name_color
        index = 0
        # Edit list feed of that widget
        for feed in widget['feeds']:
            widget['feeds'][index] = ObjectId(feed)
            index += 1
        widget_edit.feeds.set(widget['feeds'])
        return widget_edit

    def _get_value_edit_gauge(self, current, widget):
        current.number_of_element = widget['attribute']['number_of_element']
        current.signature = widget['attribute']['signature']
        current.color = widget['attribute']['color']
        current.text_color = widget['attribute']['text_color']
        current.arc_width  = widget['attribute']['arc_width']
        current.animate= widget['attribute']['animate']
        current.max_value = widget['attribute']['max_value']
        return current
    
    def _get_value_edit_digital(self, current, widget):
        current.max_value = widget["attribute"]["max_value"]
        current.min_value = widget["attribute"]["min_value"]
        current.widget_color = widget["attribute"]["widget_color"]
        return current
    
    def _get_value_edit_control(self, current, widget):
        current.on_color = widget["attribute"]["on_color"]
        current.off_color = widget["attribute"]["off_color"]
        return current
    
    def _get_value_edit_card(self, current, widget):
        current.value_color = widget["attribute"]["value_color"]
        current.background_color = widget["attribute"]["background_color"]
        current.signature = widget["attribute"]["signature"]
        return current
    
    def _get_value_edit_card_logo(self, current, widget):
        current.image_data =  widget["attribute"]["image_data"]
        return current
    
    def _get_value_edit_map(self, current, widget):
        current.latitude = widget["attribute"]["latitude"]
        current.longitude = widget["attribute"]["longitude"]
        return current
    
    def _get_value_edit_chart(self, current, widget):
        current.signature = widget["attribute"]["signature"]
        current.color_value = widget["attribute"]["color_value"]
        current.curve_type = widget["attribute"]["curve_type"]
        current.grid_color = widget["attribute"]["grid_color"]
        current.background = widget["attribute"]["background"]
        return current
    
    def _get_value_edit_statistic(self, current, widget):
        current.precision = widget["attribute"]["precision"]
        current.suffix = widget["attribute"]["suffix"]
        current.background = widget["attribute"]["background"]
        current.equation = widget["attribute"]["equation"]
        current.value_color = widget["attribute"]["value_color"]
        return current

    def _edit_current_gauge(self, widget):
        current_gauge = Gauge.objects.all().filter(widget_ptr_id=ObjectId(widget['i'])).first()
        current_gauge = self._get_value_edit_widget(current_gauge, widget)
        current_gauge = self._get_value_edit_gauge(current_gauge, widget)  # Gia tri khi edit widget keo tha -> Khong co cac attribute mau sac, ...
        current_gauge.save()

    def _edit_current_digital(self, widget):
        current_digital = Digital.objects.all().filter(widget_ptr_id=ObjectId(widget["i"])).first()
        current_digital = self._get_value_edit_widget(current_digital, widget)
        current_digital = self._get_value_edit_digital(current_digital, widget)
        current_digital.save()

    def _edit_current_control(self, widget):
        current_control = Control.objects.all().filter(widget_ptr_id=ObjectId(widget["i"])).first()
        current_control = self._get_value_edit_widget(current_control, widget)
        current_control = self._get_value_edit_control(current_control, widget)
        current_control.save()

    def _edit_current_card(self, widget):
        current_card = Card.objects.all().filter(widget_ptr_id=ObjectId(widget["i"])).first()
        current_card = self._get_value_edit_widget(current_card, widget)
        current_card = self._get_value_edit_card(current_card, widget)
        current_card.save()

    def _edit_current_card_clock(self, widget):
        current_card = Card.objects.all().filter(widget_ptr_id=ObjectId(widget["i"])).first()
        current_card = self._get_value_edit_widget(current_card, widget)
        current_card.save()

    def _edit_current_card_logo(self, widget):
        current_card = Card.objects.all().filter(widget_ptr_id=ObjectId(widget["i"])).first()
        current_card = self._get_value_edit_widget(current_card, widget)
        current_card = self._get_value_edit_card_logo(current_card, widget)
        current_card.save()

    def _edit_current_map(self, widget):
        current_map = Map.objects.all().filter(widget_ptr_id=ObjectId(widget["i"])).first()
        current_map = self._get_value_edit_widget(current_map, widget)
        current_map = self._get_value_edit_map(current_map, widget)
        current_map.save()

    def _edit_current_chart(self, widget):
        current_chart = Chart.objects.all().filter(widget_ptr_id=ObjectId(widget["i"])).first()
        current_chart = self._get_value_edit_widget(current_chart, widget)
        current_chart = self._get_value_edit_chart(current_chart, widget)
        current_chart.save()

    def _edit_current_statistic(self, widget):
        current_statistic = Statistic.objects.all().filter(widget_ptr_id=ObjectId(widget["i"])).first()
        current_statistic = self._get_value_edit_widget(current_statistic, widget)
        current_statistic = self._get_value_edit_statistic(current_statistic, widget)
        current_statistic.save()

    def post(self, request, ID):
        current_dashboard_id = ObjectId(ID)
        record_current = Widget.objects.all().filter(dashboard_id=current_dashboard_id)
        # for check delete widget -> delete in database
        for widget in record_current:
            checkExist = False
            for widgetnew in request.data:
                if ObjectId.is_valid(widgetnew['i']):
                    if ObjectId(widgetnew['i']) == ObjectId(widget._id):
                        checkExist = True
            if checkExist == False:
                widget.delete()

        for widget in request.data:
            # Edit widget if widget is exist in request.data
            if ObjectId.is_valid(widget['i']):
                is_edit_widget = Widget.objects.all().filter(_id=ObjectId(widget['i'])).first()
                if is_edit_widget:
                    if widget['type'][-5:] == "Gauge":
                        self._edit_current_gauge(widget)
                    elif (widget['type'][-7:] == "Digital"):
                        self._edit_current_digital(widget)
                    elif (widget['type'][-7:] == "Control"):
                        self._edit_current_control(widget)
                    elif (widget['type'] == "Simple Card"):
                        self._edit_current_card(widget)
                    elif (widget['type'] == "Logo Card"):
                        self._edit_current_card_logo(widget)
                    elif (widget['type'] == "Clock Card"):
                        self._edit_current_card_clock(widget)
                    elif (widget['type'][-8:] == "Location"):
                        self._edit_current_map(widget)
                    elif (widget['type'][-5:] == "Chart"):
                        self._edit_current_chart(widget)
                    elif (widget['type'][-9:] == "Statistic"):
                        self._edit_current_statistic(widget)
            else:
                new_value_widget = self._get_value_create_widgeṭ̣̣̣(widget, current_dashboard_id)
                # Create new widget component directly (char, gauge...)
                if widget['type'][-5:] == "Gauge":
                    self._create_new_gauge(widget, new_value_widget)
                elif widget['type'][-7:] == "Digital":
                    self._create_new_digital(widget, new_value_widget)
                elif widget['type'][-7:] == "Control":
                    self._create_new_control(widget, new_value_widget)
                elif widget['type'] == "Simple Card":
                    self._create_new_card(widget, new_value_widget)
                elif widget['type'] == "Logo Card":
                    self._create_new_card_logo(widget, new_value_widget)
                elif widget['type'] == "Clock Card":
                    self._create_new_card_clock(widget, new_value_widget)
                elif widget['type'][-8:] == "Location":
                    self._create_new_map(widget, new_value_widget)
                elif widget['type'][-5:] == "Chart":
                    self._create_new_chart(widget, new_value_widget)
                elif widget['type'][-9:] == "Statistic":
                    self._create_new_statistic(widget, new_value_widget)
        return Response(status=status.HTTP_200_OK)

    def _get_feed_values(self, current_user, current_widget):
        try:
            data = []
            current_feed_objectid = current_widget['feeds'][0] # Only support 1 widget has 1 feed now, improve later if any
            current_feed_name = Feed.objects.get(_id=current_feed_objectid).name
            topic_filter = "/bkiot/" + current_user.username
            all_feed_values_of_current_user = FeedValue.objects.all().filter(topic__contains = topic_filter)
            for feed_value in all_feed_values_of_current_user:
                if current_feed_name in feed_value.topic:
                    data.append({
                        'value': json.loads(feed_value.value).get('value', 0),
                        'time_stamp': feed_value.time_stamp
                    })
            result = sorted(data, key=lambda x: x['time_stamp'])[-30:]
            # Get the first 5 elements with time_stamp greater than now
            current_widget['feed_values'] = result
        except:
            current_widget['feed_values'] = []
        
    def get(self, request, ID):
        dashboardCurrent = Dashboard.objects.all().filter(_id=ObjectId(ID))
        if dashboardCurrent:
            all_record_widget = Widget.objects.all().filter(dashboard_id=ObjectId(ID))
            returnData = {}
            returnData["widget"] = []
            for widget in all_record_widget:
                if widget.type[-5:] == "Gauge":
                    returnData["widget"].append(GaugeSerializer(Gauge.objects.get(_id=ObjectId(widget._id))).data)
                elif widget.type[-7:] == "Digital":
                    returnData["widget"].append(DigitalSerializer(Digital.objects.get(_id=ObjectId(widget._id))).data)
                elif widget.type[-7:] == "Control":
                    returnData["widget"].append(ControlSerializer(Control.objects.get(_id=ObjectId(widget._id))).data)
                elif widget.type[-4:] == "Card":
                    returnData["widget"].append(CardSerializer(Card.objects.get(_id=ObjectId(widget._id))).data)
                elif widget.type[-8:] == "Location":
                    returnData["widget"].append(MapSerializer(Map.objects.get(_id=ObjectId(widget._id))).data)
                elif widget.type[-5:] == "Chart":
                    returnData["widget"].append(ChartSerializer(Chart.objects.get(_id=ObjectId(widget._id))).data)
                elif widget.type[-9:] == "Statistic":
                    returnData["widget"].append(StatisticSerializer(Statistic.objects.get(_id=ObjectId(widget._id))).data)
                self._get_feed_values(request.user, returnData['widget'][-1])
            return Response(JSONEncoder().encode(returnData))
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


# This class use for get name of dashboard in private (need authentication) link maindashboard
class DashboardGetOne(APIView):
    permission_classes = [
        permissions.IsAuthenticated, IsOwnerOrAdmin
    ]    
    serializer_class = WidgetSerializer
    queryset = Widget.objects.all()
    serializer_class1 = DashboardSerializer

    def get(self, request, ID):
        dashboardCurrent = Dashboard.objects.all().filter(_id=ObjectId(ID))
        if dashboardCurrent:
            dashboard_serializer = DashboardSerializer(dashboardCurrent, many=True)
            return Response(JSONEncoder().encode(dashboard_serializer.data))
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


# This class use for get name of dashboard in public (don't need authentication) link maindashboard
class DashboardGetOnePublic(APIView):
    permission_classes = []
    serializer_class = WidgetSerializer
    queryset = Widget.objects.all()
    serializer_class1 = DashboardSerializer

    def get(self, request, ID):
        dashboardCurrent = Dashboard.objects.all().filter(_id=ObjectId(ID))
        if dashboardCurrent:
            returnData = {}
            dashboard_serializer = DashboardSerializer(dashboardCurrent, many=True)
            recordUser = User.objects.all().filter(_id=ObjectId(dashboardCurrent[0].user_id)).first()
            returnData["data"] = dashboard_serializer.data
            returnData["user"] = recordUser.username
            return Response(JSONEncoder().encode(returnData))
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


class WidgetViewDetailPublic(APIView):
    permission_classes = []
    serializer_class = DashboardSerializer
    queryset = Dashboard.objects.all()

    def _get_feed_values(self, current_user, current_widget):
        try:
            data = []
            current_feed_objectid = current_widget['feeds'][0] # Only support 1 widget has 1 feed now, improve later if any
            current_feed_name = Feed.objects.get(_id=current_feed_objectid).name
            topic_filter = "/bkiot/" + current_user.username
            all_feed_values_of_current_user = FeedValue.objects.all().filter(topic__contains = topic_filter)
            for feed_value in all_feed_values_of_current_user:
                if current_feed_name in feed_value.topic:
                    data.append({
                        'value': json.loads(feed_value.value).get('value', 0),
                        'time_stamp': feed_value.time_stamp
                    })
            result = sorted(data, key=lambda x: x['time_stamp'])[-30:]
            current_widget['feed_values'] = result
        except:
            current_widget['feed_values'] = []

    def get(self, request, ID):
        dashboardCurrent = Dashboard.objects.all().filter(_id=ObjectId(ID))
        if dashboardCurrent:
            if dashboardCurrent[0].public:
                all_record_widget = Widget.objects.all().filter(dashboard_id=ObjectId(ID))
                returnData = {}
                returnData["widget"] = []
                for widget in all_record_widget:
                    if widget.type[-5:] == "Gauge":
                        returnData["widget"].append(GaugeSerializer(Gauge.objects.get(_id=ObjectId(widget._id))).data)
                    elif widget.type[-7:] == "Digital":
                        returnData["widget"].append(DigitalSerializer(Digital.objects.get(_id=ObjectId(widget._id))).data)
                    elif widget.type[-7:] == "Control":
                        returnData["widget"].append(ControlSerializer(Control.objects.get(_id=ObjectId(widget._id))).data)
                    elif widget.type[-4:] == "Card":
                        returnData["widget"].append(CardSerializer(Card.objects.get(_id=ObjectId(widget._id))).data)
                    elif widget.type[-8:] == "Location":
                        returnData["widget"].append(MapSerializer(Map.objects.get(_id=ObjectId(widget._id))).data)
                    elif widget.type[-5:] == "Chart":
                        returnData["widget"].append(ChartSerializer(Chart.objects.get(_id=ObjectId(widget._id))).data)
                    elif widget.type[-9:] == "Statistic":
                        returnData["widget"].append(StatisticSerializer(Statistic.objects.get(_id=ObjectId(widget._id))).data)
                    self._get_feed_values(dashboardCurrent[0].user, returnData['widget'][-1])
                return Response(JSONEncoder().encode(returnData))
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)