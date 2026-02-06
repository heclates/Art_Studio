from rest_framework import serializers
from .models import Location, Course, TimeSlot, Reservation


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = "__all__"


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"


class TimeSlotSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    reservations_count = serializers.SerializerMethodField()

    def get_reservations_count(self, obj):
        return obj.reservations.count()

    class Meta:
        model = TimeSlot
        fields = "__all__"


class ReservationSerializer(serializers.ModelSerializer):
    slot = TimeSlotSerializer(read_only=True)
    slot_id = serializers.PrimaryKeyRelatedField(
        queryset=TimeSlot.objects.all(), source="slot", write_only=True
    )

    class Meta:
        model = Reservation
        fields = "__all__"

    def validate(self, data):
        slot = data["slot"]
        if slot.reservations.count() >= slot.course.max_capacity:
            raise serializers.ValidationError({"slot": "This slot is full."})
        return data


class IndividualReservationSerializer(ReservationSerializer):
    message = serializers.CharField(required=True)


class ArtBoxReservationSerializer(ReservationSerializer):
    art_box_type = serializers.ChoiceField(
        choices=[
            ("materials_only", "Только материалы"),
            ("materials_lesson", "Материалы + урок"),
        ]
    )
    delivery_type = serializers.ChoiceField(
        choices=[("delivery", "Доставка"), ("pickup", "Самовывоз")]
    )
