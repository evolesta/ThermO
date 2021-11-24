from django.urls import include, path
from rest_framework import routers
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register(r'sensors', views.SensorsViewSet)
router.register(r'boilers', views.BoilersViewSet)
router.register(r'honeywellSensors', views.HoneywellSensorsViewSet)
router.register(r'heatpoint', views.HeatpointViewSet, basename='heatpoint')
router.register(r'schedule', views.ScheduleViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]