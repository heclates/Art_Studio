from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Location, Course, TimeSlot, Reservation

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # ДОБАВЛЕНО: first_name и last_name, чтобы Django не ругался на "лишние" поля
        fields = ("id", "username", "email", "password", "is_staff", "first_name", "last_name")

    def create(self, validated_data):
        # Используем create_user, он автоматически хеширует пароль
        # и корректно сохраняет все переданные поля (first_name, last_name и т.д.)
        user = User.objects.create_user(**validated_data)
        return user

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = "__all__"

class CourseSerializer(serializers.ModelSerializer):
    location_name = serializers.CharField(source="location.name", read_only=True)

    class Meta:
        model = Course
        fields = (
            "id",
            "title",
            "category",
            "direction",
            "location",
            "location_name",
            "max_capacity",
        )

class TimeSlotSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    reservations_count = serializers.SerializerMethodField()

    def get_reservations_count(self, obj):
        return obj.reservations.count()

    class Meta:
        model = TimeSlot
        fields = "__all__"

class ReservationSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")
    user_name = serializers.ReadOnlyField(source="user.get_full_name") # Полезно для фронтенда
    
    # Принимаем ID, в базу пишем объект slot
    slot_id = serializers.PrimaryKeyRelatedField(
        queryset=TimeSlot.objects.all(),
        source="slot",
        write_only=True,
        required=False,
        allow_null=True,
    )
    # Для отображения деталей слота в GET-запросах
    slot = TimeSlotSerializer(read_only=True)

    class Meta:
        model = Reservation
        fields = "__all__"

    def validate(self, data):
        slot = data.get("slot")
        if slot and hasattr(slot, 'available_spots'): # Проверка на наличие поля
            if slot.available_spots <= 0:
                raise serializers.ValidationError({"slot": "Мест в этом слоте больше нет."})
        return data

class IndividualReservationSerializer(ReservationSerializer):
    class Meta(ReservationSerializer.Meta):
        fields = "__all__"

class ArtBoxReservationSerializer(ReservationSerializer):
    class Meta(ReservationSerializer.Meta):
        fields = "__all__"