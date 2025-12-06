import { dayCard } from './ShiftDOM.js';

export const groupByDay = (items) =>
  items.reduce((acc, item) => {
    (acc[item.day] ??= []).push(item);
    return acc;
  }, {});

export const buildSlides = (wrapper, filterFn, data, days, btnText, submitHandler) => {
  wrapper.innerHTML = '';
  const grouped = groupByDay(data);

  Object.entries(grouped).forEach(([dayKey, lessons]) => {
    const translatedDay = days[dayKey] || dayKey;
    
    const filt = lessons.filter(filterFn);
    
    if (filt.length) {
      wrapper.append(dayCard(translatedDay, filt, btnText, submitHandler));
    }
  });
};