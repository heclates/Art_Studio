from django.db import models
from django.contrib.auth.models import User


class Course(models.Model):
    title = models.CharField(max_length=150)
    max_capacity = models.PositiveIntegerField(default=10)
    price = models.DecimalField(max_digits=8, decimal_places=0, default=0)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.title


class TimeSlot(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="slots")
    date_time = models.DateTimeField()
    is_fully_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.course} — {self.date_time.strftime('%d.%m %H:%M')}"


class Reservation(models.Model):
    user_email = models.EmailField()  # если без auth
    user_name = models.CharField(max_length=100, blank=True)
    slot = models.ForeignKey(
        TimeSlot, on_delete=models.CASCADE, related_name="reservations"
    )
    status = models.CharField(
        max_length=20, default="pending"
    )  # pending, confirmed, canceled
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user_email", "slot")

    def __str__(self):
        return f"{self.user_email} → {self.slot}"
