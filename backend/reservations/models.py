from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Location(models.Model):
    # Represents branches like 'Praha 2'
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Course(models.Model):
    # Defines courses with category (children/adults), direction (drawing/ceramics etc.), location, capacity, etc.
    CATEGORY_CHOICES = [
        ("children", "Дети"),
        ("adults", "Взрослые"),
    ]
    DIRECTION_CHOICES = [
        ("drawing", "Рисование"),
        ("ceramics", "Керамика"),
        ("creative_workshop", "Творческая мастерская"),
        ("combo", "Комбо-занятия"),
        ("prep_school", "Подготовка в художественную школу"),
        ("individual", "Индивидуальные занятия"),
        ("online", "Онлайн-уроки"),
        ("masterclasses", "Мастер-классы"),
        ("plein_air", "Пленэры"),
        ("art_camp", "Арт-лагерь"),
        ("special_events", "Специальные мероприятия"),
        ("art_boxes", "Арт-боксы"),
        ("gift_certificates", "Подарочные сертификаты"),
        ("art_parties", "Арт-вечеринки"),
    ]

    title = models.CharField(max_length=150)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    direction = models.CharField(max_length=50, choices=DIRECTION_CHOICES)
    location = models.ForeignKey(
        Location, on_delete=models.CASCADE, related_name="courses"
    )
    max_capacity = models.PositiveIntegerField(default=10)
    price = models.DecimalField(max_digits=8, decimal_places=0, default=0)
    description = models.TextField(blank=True)
    age_min = models.PositiveIntegerField(default=0, blank=True)
    age_max = models.PositiveIntegerField(default=99, blank=True)

    def __str__(self):
        return f"{self.title} ({self.get_category_display()} - {self.get_direction_display()})"


class TimeSlot(models.Model):
    # Time slots for courses, with date, teacher, and available spots tracking.
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="slots")
    date_time = models.DateTimeField()
    teacher = models.CharField(max_length=100, blank=True)
    is_fully_booked = models.BooleanField(default=False)
    available_spots = models.PositiveIntegerField(default=10)
    age_group = models.CharField(max_length=50, blank=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.available_spots = self.course.max_capacity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.course} - {self.date_time.strftime('%d.%m %H:%M')} (Teacher: {self.teacher})"


class Reservation(models.Model):
    # Reservations linked to slots, with user details, status, and optional fields for specific branches (e.g., message, art_box_type).
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("canceled", "Canceled"),
    ]

    user_email = models.EmailField()
    user_name = models.CharField(max_length=100, blank=True)
    user_surname = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    child_name = models.CharField(max_length=100, blank=True)
    child_birthdate = models.DateField(null=True, blank=True)
    slot = models.ForeignKey(
        TimeSlot, on_delete=models.CASCADE, related_name="reservations"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    art_box_type = models.CharField(max_length=50, blank=True)
    delivery_type = models.CharField(max_length=20, blank=True)
    certificate_type = models.CharField(max_length=50, blank=True)
    certificate_amount = models.DecimalField(
        max_digits=8, decimal_places=0, null=True, blank=True
    )

    class Meta:
        unique_together = ("user_email", "slot")

    def save(self, *args, **kwargs):
        if self.pk is None:
            if self.slot.reservations.count() >= self.slot.course.max_capacity:
                raise ValueError("Slot is full")
            self.slot.available_spots -= 1
            if self.slot.available_spots <= 0:
                self.slot.is_fully_booked = True
            self.slot.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user_email} - {self.slot}"
