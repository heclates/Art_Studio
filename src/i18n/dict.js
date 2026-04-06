import { coursesRU } from './courses/ru.js';
import { formsRU } from './forms/ru.js';
import { galleryRU } from './gallery/ru.js';
import { shiftRU } from './shift/ru.js';
import { coursesEN as coursesCS } from './courses/en.js';
import { formsEN as formsCS } from './forms/en.js';
import { galleryEN as galleryCS } from './gallery/en.js';
import { shiftEN as shiftCS } from './shift/en.js';

export const dict = {
  ru: {
    courses: coursesRU,
    forms: formsRU,
    gallery: galleryRU,
    shift: shiftRU
  },

  cs: {
    courses: coursesCS,
    forms: formsCS,
    gallery: galleryCS,
    shift: shiftCS
  }
};
