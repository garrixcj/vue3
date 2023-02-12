import lobby3 from './lobby3.json';
import lobby5 from './lobby5.json';
import lobby19 from './lobby19.json';
import lobby40 from './lobby40.json';
import lobby55 from './lobby55.json';
import lobby65 from './lobby65.json';
import lobby106 from './lobby106.json';
import lobby109 from './lobby109.json';

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
    ...lobby5[lang],
    ...lobby19[lang],
    ...lobby40[lang],
    ...lobby55[lang],
    ...lobby65[lang],
    ...lobby106[lang],
    ...lobby109[lang],
  };
  return acc;
}, {});

export default message;
