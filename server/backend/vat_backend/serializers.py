from rest_framework import serializers
from .models import Dashboard, Feed, Widget, User, Gauge, Digital, Control, Card, Map, Chart, Statistic
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login
from django.core.exceptions import ObjectDoesNotExist
class DashboardSerializer(serializers.ModelSerializer):
	class Meta:
		model = Dashboard
		fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = '__all__'
		extra_kwargs = {'password': {'write_only': True}}

class FeedSerializer(serializers.ModelSerializer):
	class Meta:
		model = Feed
		fields = '__all__'

class WidgetSerializer(serializers.ModelSerializer):
	class Meta:
		model = Widget
		fields = '__all__'

class GaugeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Gauge
		fields = '__all__'

class DigitalSerializer(serializers.ModelSerializer):
	class Meta:
		model = Digital
		fields = '__all__'

class MapSerializer(serializers.ModelSerializer):
	class Meta:
		model = Map
		fields = '__all__'

class ControlSerializer(serializers.ModelSerializer):
	class Meta:
		model = Control
		fields = '__all__'

class CardSerializer(serializers.ModelSerializer):
	class Meta:
		model = Card
		fields = '__all__'

class ChartSerializer(serializers.ModelSerializer):
	class Meta:
		model = Chart
		fields = '__all__'

class StatisticSerializer(serializers.ModelSerializer):
	class Meta:
		model = Statistic
		fields = '__all__'

class SignInSerializer(TokenObtainPairSerializer):
	def validate(self, attrs):
		data = super().validate(attrs)

		refresh = self.get_token(self.user)

		data['user'] = UserSerializer(self.user).data
		data['refresh'] = str(refresh)
		data['access'] = str(refresh.access_token)

		if api_settings.UPDATE_LAST_LOGIN:
			update_last_login(None, self.user)

		return data

class SignUpSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = '__all__'
