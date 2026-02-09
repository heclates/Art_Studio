from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone


class Location(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Локация"
        verbose_name_plural = "Локации"


class Course(models.Model):
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

    title = models.CharField(max_length=150, verbose_name="Название")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, verbose_name="Категория")
    direction = models.CharField(max_length=50, choices=DIRECTION_CHOICES, verbose_name="Направление")
    location = models.ForeignKey(
        Location, on_delete=models.CASCADE, related_name="courses", verbose_name="Локация"
    )
    max_capacity = models.PositiveIntegerField(
        default=10, verbose_name="Макс. человек в слоте"
    )
    daily_capacity = models.PositiveIntegerField(
        default=8, 
        verbose_name="Макс. человек в день",
        help_text="Общее количество студентов в день для этого курса"
    )
    price = models.DecimalField(max_digits=8, decimal_places=0, default=0, verbose_name="Цена")
    description = models.TextField(blank=True, verbose_name="Описание")
    age_min = models.PositiveIntegerField(default=0, blank=True, verbose_name="Возраст от")
    age_max = models.PositiveIntegerField(default=99, blank=True, verbose_name="Возраст до")

    def __str__(self):
        return f"{self.title} ({self.get_category_display()})"

    class Meta:
        verbose_name = "Курс"
        verbose_name_plural = "Курсы"


class TimeSlot(models.Model):
    """
    Временной слот - конкретное занятие в определённое время.
    Может быть несколько слотов в один день для одного курса.
    """
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="slots", verbose_name="Курс"
    )
    start_time = models.DateTimeField(verbose_name="Начало")
    end_time = models.DateTimeField(blank=True, null=True, verbose_name="Конец")
    teacher = models.CharField(max_length=100, blank=True, verbose_name="Преподаватель")
    available_spots = models.PositiveIntegerField(default=10, verbose_name="Доступно мест")
    is_fully_booked = models.BooleanField(default=False, verbose_name="Полностью забронирован")

    class Meta:
        ordering = ['start_time']
        verbose_name = "Временной слот"
        verbose_name_plural = "Временные слоты"
        indexes = [
            models.Index(fields=['course', 'start_time']),
            models.Index(fields=['is_fully_booked']),
        ]

    def save(self, *args, **kwargs):
        if not self.pk:
            self.available_spots = self.course.max_capacity
        super().save(*args, **kwargs)

    def get_date(self):
        """Возвращает дату без времени"""
        return self.start_time.date()

    def get_daily_reservations_count(self):
        """Считает активные резервации на этот день для этого курса"""
        date = self.get_date()
        return Reservation.objects.filter(
            slot__course=self.course,
            slot__start_time__date=date,
            status__in=['pending', 'confirmed']
        ).count()

    def is_daily_limit_reached(self):
        """Проверяет, не превышен ли дневной лимит"""
        return self.get_daily_reservations_count() >= self.course.daily_capacity

    def __str__(self):
        return f"{self.course.title} - {self.start_time.strftime('%d.%m.%Y %H:%M')}"


class Reservation(models.Model):
    STATUS_CHOICES = [
        ("pending", "Ожидает подтверждения"),
        ("confirmed", "Подтверждена"),
        ("canceled", "Отменена"),
    ]

    # Пользователь (опционально - для гостей null)
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reservations",
        verbose_name="Пользователь"
    )
    
    # Контактная информация
    user_name = models.CharField(max_length=100, blank=True, verbose_name="Имя")
    user_surname = models.CharField(max_length=100, blank=True, verbose_name="Фамилия")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Телефон")
    
    # Информация о ребёнке
    child_name = models.CharField(max_length=100, blank=True, verbose_name="Имя ребёнка")
    child_birthdate = models.DateField(null=True, blank=True, verbose_name="Дата рождения ребёнка")

    # Слот (опционально - для некоторых типов броней)
    slot = models.ForeignKey(
        TimeSlot,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="reservations",
        verbose_name="Временной слот"
    )

    # Направление (если бронь без конкретного слота)
    direction_manual = models.CharField(
        max_length=150, 
        blank=True, 
        verbose_name="Направление",
        help_text="Название курса для броней без слота"
    )

    # Статус и метаданные
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default="pending",
        verbose_name="Статус"
    )
    message = models.TextField(blank=True, verbose_name="Сообщение")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")

    # Дополнительные поля для специальных типов броней
    art_box_type = models.CharField(max_length=50, blank=True, verbose_name="Тип арт-бокса")
    delivery_type = models.CharField(max_length=20, blank=True, verbose_name="Тип доставки")
    certificate_type = models.CharField(max_length=50, blank=True, verbose_name="Тип сертификата")
    certificate_amount = models.DecimalField(
        max_digits=8, 
        decimal_places=0, 
        null=True, 
        blank=True,
        verbose_name="Сумма сертификата"
    )

    class Meta:
        verbose_name = "Резервация"
        verbose_name_plural = "Резервации"
        ordering = ['-created_at']

    def clean(self):
        """Валидация перед сохранением"""
        if self.slot:
            # Проверка места в слоте
            if self.slot.available_spots <= 0:
                raise ValidationError("В этом слоте нет свободных мест!")
            
            # Проверка дневного лимита
            if self.slot.is_daily_limit_reached():
                raise ValidationError(
                    f"Достигнут дневной лимит ({self.slot.course.daily_capacity} человек) "
                    f"для курса {self.slot.course.title}. Выберите другой день."
                )

    def save(self, *args, **kwargs):
        self.full_clean()  # Валидация
        
        # Уменьшаем места только при создании новой брони
        if self.pk is None and self.slot and self.status in ['pending', 'confirmed']:
            self.slot.available_spots -= 1
            if self.slot.available_spots <= 0:
                self.slot.is_fully_booked = True
            self.slot.save()

        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """При удалении возвращаем место в слот"""
        if self.slot and self.status in ['pending', 'confirmed']:
            self.slot.available_spots += 1
            self.slot.is_fully_booked = False
            self.slot.save()
        super().delete(*args, **kwargs)

    def __str__(self):
        name = self.user.username if self.user else f"{self.user_name} {self.user_surname}"
        target = self.slot if self.slot else self.direction_manual
        return f"{name} - {target}"