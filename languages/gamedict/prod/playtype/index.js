import lobby3 from './lobby3.json';
import lobby12 from './lobby12.json';
import lobby19 from './lobby19.json';
import lobby22 from './lobby22.json';
import lobby31 from './lobby31.json';
import lobby36 from './lobby36.json';
import lobby47 from './lobby47.json';
import lobby55 from './lobby55.json';
import lobby65 from './lobby65.json';
import lobby73 from './lobby73.json';
import lobby106 from './lobby106.json';
import lobby109 from './lobby109.json';
import lobby113 from './lobby113.json';
import lobby136 from './lobby136.json';
import lobby141 from './lobby141.json';
import lobby145 from './lobby145.json';

export const langKeys = [
  'zh-tw',
  'zh-cn',
  'en',
  'ja',
  'ko',
  'vi',
  'th',
];

const message = langKeys.reduce((acc, lang) => {
  acc[lang] = {
    ...lobby3[lang],
    ...lobby12[lang],
    ...lobby19[lang],
    ...lobby22[lang],
    ...lobby31[lang],
    ...lobby36[lang],
    ...lobby47[lang],
    ...lobby55[lang],
    ...lobby65[lang],
    ...lobby73[lang],
    ...lobby106[lang],
    ...lobby109[lang],
    ...lobby113[lang],
    ...lobby136[lang],
    ...lobby141[lang],
    ...lobby145[lang],
  };
  return acc;
}, {});

export default message;
