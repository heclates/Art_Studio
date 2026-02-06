from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Reservation


@receiver(post_save, sender=Reservation)
def update_slot_on_cancel(sender, instance, **kwargs):
    if (
        instance.status == "canceled"
        and instance.slot.available_spots < instance.slot.course.max_capacity
    ):
        instance.slot.available_spots += 1
        instance.slot.is_fully_booked = False
        instance.slot.save()
