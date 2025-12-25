import { dayCard } from './ShiftDOM';

export const buildSlides = (
  wrapper,
  filterFn,
  lessons,
  daysMap,
  submitHandler,
  meta
) => {
  wrapper.innerHTML = '';

  const grouped = lessons.reduce((acc, l) => {
    (acc[l.day] ??= []).push(l);
    return acc;
  }, {});

  Object.entries(grouped).forEach(([day, list]) => {
    const filtered = list.filter(filterFn);
    if (!filtered.length) return;

    wrapper.append(
      dayCard(
        day,
        daysMap[day] || day,
        filtered,
        submitHandler,
        meta
      )
    );
  });
};
