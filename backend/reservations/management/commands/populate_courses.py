from django.core.management.base import BaseCommand
from reservations.models import Location, Course


class Command(BaseCommand):
    help = 'Заполняет БД курсами из coursesEN.js'

    def handle(self, *args, **kwargs):
        # Создаём локации
        praha2, _ = Location.objects.get_or_create(name="Прага 2")
        praha9, _ = Location.objects.get_or_create(name="Прага 9")
        
        courses_data = [
            {
                'title': 'Рисование. Младшая группа',
                'category': 'children',
                'direction': 'drawing',
                'location': praha2,
                'max_capacity': 10,
                'daily_capacity': 8,
                'age_min': 4,
                'age_max': 6,
                'price': 500,
                'description': 'Занятия по рисованию для младшей группы'
            },
            {
                'title': 'Рисование. Средняя группа',
                'category': 'children',
                'direction': 'drawing',
                'location': praha2,
                'max_capacity': 10,
                'daily_capacity': 8,
                'age_min': 7,
                'age_max': 11,
                'price': 550,
                'description': 'Занятия по рисованию для средней группы'
            },
            {
                'title': 'Рисование. Старшая группа',
                'category': 'children',
                'direction': 'drawing',
                'location': praha2,
                'max_capacity': 10,
                'daily_capacity': 8,
                'age_min': 12,
                'age_max': 18,
                'price': 600,
                'description': 'Занятия по рисованию для старшей группы'
            },
            {
                'title': 'Керамика',
                'category': 'children',
                'direction': 'ceramics',
                'location': praha2,
                'max_capacity': 8,
                'daily_capacity': 8,
                'age_min': 4,
                'age_max': 14,
                'price': 600,
                'description': 'Занятия по керамике и лепке'
            },
            {
                'title': 'Творческая мастерская',
                'category': 'children',
                'direction': 'creative_workshop',
                'location': praha2,
                'max_capacity': 12,
                'daily_capacity': 8,
                'age_min': 3,
                'age_max': 99,
                'price': 450,
                'description': 'Творческие занятия в мастерской'
            },
            {
                'title': 'Комбо-занятия',
                'category': 'children',
                'direction': 'combo',
                'location': praha2,
                'max_capacity': 10,
                'daily_capacity': 8,
                'age_min': 5,
                'age_max': 14,
                'price': 800,
                'description': 'Комбинированные занятия'
            },
            {
                'title': 'Подготовка в художественную школу',
                'category': 'children',
                'direction': 'prep_school',
                'location': praha2,
                'max_capacity': 6,
                'daily_capacity': 6,
                'age_min': 12,
                'age_max': 18,
                'price': 1200,
                'description': 'Интенсивная подготовка к поступлению'
            },
            {
                'title': 'Индивидуальные занятия',
                'category': 'children',
                'direction': 'individual',
                'location': praha2,
                'max_capacity': 1,
                'daily_capacity': 4,
                'age_min': 3,
                'age_max': 99,
                'price': 1500,
                'description': 'Персональные занятия'
            },
        ]
        
        created = 0
        for data in courses_data:
            obj, is_created = Course.objects.get_or_create(
                title=data['title'],
                location=data['location'],
                defaults=data
            )
            if is_created:
                created += 1
            
        self.stdout.write(
            self.style.SUCCESS(f'✅ Создано {created} курсов')
        )