# core/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Импортируем ViewSet
from reservations.views import (
    UserViewSet,
    LocationViewSet,
    CourseViewSet,
    TimeSlotViewSet,
    ReservationViewSet,
)

# Создаём router
router = DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"locations", LocationViewSet)
router.register(r"courses", CourseViewSet)
router.register(r"timeslots", TimeSlotViewSet)
router.register(r"reservations", ReservationViewSet)

def api_root(request):
    return JsonResponse({
        "message": "ART_STUDIO API",
        "endpoints": {
            "admin": "/admin/",
            "courses": "/api/courses/",
            "timeslots": "/api/timeslots/",
            "reservations": "/api/reservations/",
            "locations": "/api/locations/",
            "register": "/api/register/",
            "login": "/api/token/",
            "refresh": "/api/token/refresh/"
        }
    })

urlpatterns = [
    path('', api_root, name='api_root'),
    path("admin/", admin.site.urls),
    path("api/register/", UserViewSet.as_view({"post": "create"}), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/", include(router.urls)),
    path("api-auth/", include("rest_framework.urls")),
]