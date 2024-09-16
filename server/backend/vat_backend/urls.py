from rest_framework import routers
from .api.dashboardApi import DashboardViewSet
from .views import UserViewSet, FeedViewSet, UserViewOne
from .views import (
    FeedViewDetail,
    WidgetViewDetail,
    DashboardViewDetail,
    SignInViewSet,
    SignUpViewSet,
    DashboardGetOne,
    UserInitApi,
    WidgetViewDetailPublic,
    FeedViewDetailPublic,
    DashboardGetOnePublic,
)
from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register("dashboard", DashboardViewSet, "dashboard")
router.register("user", UserViewSet, "user")
router.register("oneuser", UserViewOne, "oneuser")
router.register("feed", FeedViewSet, "feed")
router.register("signIn", SignInViewSet, "signIn")
router.register("signUp", SignUpViewSet, "signUp")

urlpatterns = [
    path("feed/<str:ID>/", FeedViewDetail.as_view()),
    path("feed/public/<str:ID>/", FeedViewDetailPublic.as_view()),
    path("dashboard/<str:ID>/", DashboardViewDetail.as_view()),
    path("maindashboard/public/<str:ID>/", WidgetViewDetailPublic.as_view()),
    path("maindashboard/<str:ID>/", WidgetViewDetail.as_view()),
    path("getDashboard/<str:ID>/", DashboardGetOne.as_view()),
    path("getDashboard/public/<str:ID>/", DashboardGetOnePublic.as_view()),
    path("user/signin", jwt_views.TokenObtainPairView.as_view()),
    path("user/signin/refresh/", jwt_views.TokenRefreshView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("users/init/", UserInitApi.as_view(), name="gg_authen"),
]

urlpatterns += router.urls
