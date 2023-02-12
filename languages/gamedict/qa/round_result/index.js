import lobby3 from './lobby3.json';
import lobby19 from './lobby19.json';
import lobby22 from './lobby22.json';
import lobby47 from './lobby47.json';

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
    ...lobby19[lang],
    ...lobby22[lang],
    ...lobby47[lang],
  };
  return acc;
}, {});

export default message;
