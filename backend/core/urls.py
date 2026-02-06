from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from reservations.views import (
    LocationViewSet,
    CourseViewSet,
    TimeSlotViewSet,
    ReservationViewSet,
)

router = DefaultRouter()
router.register(r"locations", LocationViewSet)
router.register(r"courses", CourseViewSet)
router.register(r"timeslots", TimeSlotViewSet)
router.register(r"reservations", ReservationViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api-auth/", include("rest_framework.urls")),
]
