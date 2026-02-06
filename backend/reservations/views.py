from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Location, Course, TimeSlot, Reservation
from .serializers import (
    LocationSerializer,
    CourseSerializer,
    TimeSlotSerializer,
    ReservationSerializer,
    IndividualReservationSerializer,
    ArtBoxReservationSerializer,
)


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["category", "direction", "location"]


class TimeSlotViewSet(viewsets.ModelViewSet):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
        "course__category",
        "course__direction",
        "date_time",
        "is_fully_booked",
    ]


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save()

    @action(
        detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated]
    )
    def my_reservations(self, request):
        reservations = self.queryset.filter(user_email=request.user.email)
        serializer = self.get_serializer(reservations, many=True)
        return Response(serializer.data)

    def create(self, request):
        direction = request.data.get("direction")
        if direction == "individual":
            serializer = IndividualReservationSerializer(data=request.data)
        elif direction == "art_boxes":
            serializer = ArtBoxReservationSerializer(data=request.data)
        else:
            serializer = ReservationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
