from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from reservations.models import Course, TimeSlot


class Command(BaseCommand):
    help = 'Генерирует временные слоты на следующие N дней'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=30,
            help='Количество дней вперёд'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Удалить старые слоты перед генерацией'
        )

    def handle(self, *args, **options):
        days = options['days']
        
        if options['clear']:
            TimeSlot.objects.filter(start_time__lt=timezone.now()).delete()
            self.stdout.write('Старые слоты удалены')

        # Расписание из shift/ru.js (Прага 9 + Прага 2)
        schedule = {
            'drawing': {
                'monday': [
                    ('16:00', '17:30'),
                    ('17:30', '19:00'),
                    ('16:00', '18:30'),  # Praha 2
                ],
                'tuesday': [
                    ('15:30', '17:00'),
                    ('16:00', '17:30'),  # Praha 2
                ],
                'wednesday': [
                    ('15:00', '16:30'),
                    ('16:30', '18:30'),
                    ('16:00', '17:30'),  # Praha 2
                ],
                'thursday': [
                    ('15:00', '16:30'),  # Praha 2
                    ('16:30', '18:30'),  # Praha 2
                ],
                'friday': [
                    ('16:00', '17:30'),
                    ('17:30', '19:00'),
                    ('16:00', '17:30'),  # Praha 2
                    ('17:30', '19:30'),  # Praha 2
                ],
                'saturday': [
                    ('11:00', '13:00'),
                    ('14:00', '15:30'),
                ],
                'sunday': [
                    ('12:00', '13:30'),
                    ('14:30', '16:00'),
                ],
            },
            'ceramics': {
                'monday': [('15:00', '16:00')],
                'tuesday': [('15:00', '16:00')],  # Praha 2
                'wednesday': [('15:00', '16:00')],  # Praha 2
                'friday': [
                    ('14:00', '15:00'),
                    ('15:00', '16:00'),  # Praha 2
                ],
                'saturday': [('13:00', '14:00')],
                'sunday': [('13:30', '14:30')],
            },
            'creative_workshop': {
                'monday': [('17:30', '19:00')],
                'tuesday': [('17:30', '19:00')],  # Praha 2
                'wednesday': [('17:30', '19:00')],  # Praha 2
                'friday': [('17:30', '19:00')],
            },
        }

        weekday_map = {
            0: 'monday', 1: 'tuesday', 2: 'wednesday', 
            3: 'thursday', 4: 'friday', 5: 'saturday', 6: 'sunday',
        }

        # Учителя из расписания
        teachers_map = {
            'drawing': ['Екатерина', 'Кристина'],
            'ceramics': ['Екатерина', 'Кристина'],
            'creative_workshop': ['Кристина'],
        }

        courses = Course.objects.filter(direction__in=schedule.keys())
        created_count = 0

        for course in courses:
            direction_schedule = schedule.get(course.direction)
            if not direction_schedule:
                continue

            teachers = teachers_map.get(course.direction, [''])

            for day_offset in range(days):
                date = timezone.now().date() + timedelta(days=day_offset)
                weekday = weekday_map[date.weekday()]
                
                times = direction_schedule.get(weekday)
                if not times:
                    continue

                for idx, (start_str, end_str) in enumerate(times):
                    start_hour, start_min = map(int, start_str.split(':'))
                    end_hour, end_min = map(int, end_str.split(':'))
                    
                    start_time = timezone.make_aware(
                        datetime.combine(
                            date, 
                            datetime.min.time().replace(hour=start_hour, minute=start_min)
                        )
                    )
                    end_time = timezone.make_aware(
                        datetime.combine(
                            date, 
                            datetime.min.time().replace(hour=end_hour, minute=end_min)
                        )
                    )

                    # Проверяем существование
                    if not TimeSlot.objects.filter(
                        course=course,
                        start_time=start_time
                    ).exists():
                        # Чередуем учителей
                        teacher = teachers[idx % len(teachers)]
                        
                        TimeSlot.objects.create(
                            course=course,
                            start_time=start_time,
                            end_time=end_time,
                            teacher=teacher,
                        )
                        created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'✅ Создано {created_count} новых слотов на {days} дней'
            )
        )