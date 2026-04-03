// src/utils/scheduleUtils.js
import { shiftRU } from '@/i18n/shift/ru.js';
import { shiftEN } from '@/i18n/shift/en.js';
import { getLanguage } from '@/utils/languageManager.js';

const DAYS_OF_WEEK = {
  ru: {
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда',
    thursday: 'Четверг',
    friday: 'Пятница',
    saturday: 'Суббота',
    sunday: 'Воскресенье'
  },
  en: {
    monday: 'Pondělí',
    tuesday: 'Úterý',
    wednesday: 'Středa',
    thursday: 'Čtvrtek',
    friday: 'Pátek',
    saturday: 'Sobota',
    sunday: 'Neděle'
  }
};

export const getScheduleData = () => {
  const lang = getLanguage();
  return lang === 'ru' ? shiftRU : shiftEN;
};

export const getAvailableSlots = (locationSlug, directionSlug, categorySlug) => {
  const scheduleData = getScheduleData();
  const locationData = scheduleData.location[locationSlug];

  if (!locationData) {
    console.warn(`Location ${locationSlug} not found in schedule data`);
    return [];
  }

  // Фильтруем занятия по направлению и категории
  const matchingLessons = locationData.lessons.filter(lesson => {
    // Для детей ищем по направлению
    if (categorySlug === 'children') {
      return lesson.category.toLowerCase().includes(directionSlug.replace('_', ' ').toLowerCase()) ||
             directionSlug.includes(lesson.category.toLowerCase().replace(' ', '_'));
    }
    // Для взрослых ищем индивидуальные занятия или вечеринки
    else if (categorySlug === 'adults') {
      return directionSlug === 'individual_adult' || directionSlug === 'art_parties';
    }
    return false;
  });

  // Группируем по дням и времени
  const slots = [];
  const seen = new Set();

  matchingLessons.forEach(lesson => {
    const key = `${lesson.day}-${lesson.time}`;
    if (!seen.has(key)) {
      seen.add(key);
      slots.push({
        day: lesson.day,
        time: lesson.time,
        category: lesson.category,
        age: lesson.age,
        teacher: lesson.teacher,
        dayLabel: DAYS_OF_WEEK[getLanguage()][lesson.day] || lesson.day
      });
    }
  });

  return slots;
};

export const validateScheduleSlot = (locationSlug, directionSlug, categorySlug, selectedDay, selectedTime) => {
  const availableSlots = getAvailableSlots(locationSlug, directionSlug, categorySlug);

  return availableSlots.some(slot =>
    slot.day === selectedDay && slot.time === selectedTime
  );
};

export const formatScheduleTime = (timeString) => {
  // Преобразуем "15:00–16:00" в "15:00 - 16:00"
  return timeString.replace('–', ' - ');
};

export const getNextAvailableDate = (dayOfWeek) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date();
  const currentDayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const targetDayIndex = days.indexOf(dayOfWeek.toLowerCase());

  if (targetDayIndex === -1) return null;

  let daysToAdd = targetDayIndex - currentDayIndex;
  if (daysToAdd <= 0) {
    daysToAdd += 7; // Следующая неделя
  }

  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysToAdd);

  return targetDate.toISOString().split('T')[0]; // YYYY-MM-DD
};