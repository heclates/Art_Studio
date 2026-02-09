from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated

from .models import Location, Course, TimeSlot, Reservation
from .serializers import (
    UserSerializer,
    LocationSerializer,
    CourseSerializer,
    TimeSlotSerializer,
    ReservationSerializer,
    IndividualReservationSerializer,
    ArtBoxReservationSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["category", "direction", "location"]


class TimeSlotViewSet(viewsets.ModelViewSet):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
        "course__category",
        "course__direction",
        "is_fully_booked",
    ]

    # ДОБАВЛЕНО: Гибкая фильтрация по названию курса для фронтенда
    def get_queryset(self):
        queryset = TimeSlot.objects.all()
        # Позволяет фронтенду делать так: /api/timeslots/?course_title=Курс по рисованию
        course_title = self.request.query_params.get('course_title')
        if course_title:
            queryset = queryset.filter(course__title=course_title)
        
        # Исключаем слоты, где нет мест, чтобы не путать пользователя
        queryset = queryset.filter(is_fully_booked=False)
        return queryset


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data
        # На фронтенде мы шлем direction_manual или направление через payload
        direction = data.get("direction")

        if direction == "individual":
            serializer = IndividualReservationSerializer(data=data)
        elif direction == "art_boxes":
            serializer = ArtBoxReservationSerializer(data=data)
        else:
            serializer = self.get_serializer(data=data)

        serializer.is_valid(raise_exception=True)

        # Привязываем юзера, если он залогинен
        user = request.user if request.user.is_authenticated else None
        serializer.save(user=user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        # Анонимы не видят список броней, только админы или владельцы
        if not self.request.user.is_authenticated:
            return Reservation.objects.none()
        if self.request.user.is_staff:
            return Reservation.objects.all()
        return Reservation.objects.filter(user=self.request.user)