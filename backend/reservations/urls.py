from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserViewSet,
    LocationViewSet,
    CourseViewSet,
    TimeSlotViewSet,
    ReservationViewSet,
)

router = DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"locations", LocationViewSet)
router.register(r"courses", CourseViewSet)
router.register(r"timeslots", TimeSlotViewSet)
router.register(r"reservations", ReservationViewSet)

urlpatterns = [
    path("register/", UserViewSet.as_view({"post": "create"}), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    
    path("", include(router.urls)), 
]