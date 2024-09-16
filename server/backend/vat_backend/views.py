from django.shortcuts import render

# Import your views here.
from .api.dashboardApi import DashboardViewSet, DashboardViewDetail

from .api.userApi import UserViewSet, UserViewOne

from .api.widgetApi import WidgetViewDetail, DashboardGetOne, WidgetViewDetailPublic, DashboardGetOnePublic

from .api.feedApi import FeedViewSet, FeedViewDetail, FeedViewDetailPublic

from .api.signInAPI import SignInViewSet

from .api.signUpAPI import SignUpViewSet

from .auth.ggauthenApi import UserInitApi
