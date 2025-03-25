import 'core-js/modules/es.object.to-string';
import 'core-js/modules/es.promise';
import 'core-js/modules/web.timers';

import data from './json/index.json';
import './css/test.css';
import './less/test.less'; // 全部js兼容性处理 --> @babel/polyfill,如果使用按需加载,就不能使用下列
// import "@babel/polyfill"

function add(x, y) {
  return x + y;
}

const result = function result(x, y) {
  return x + y;
};

const p = new Promise((resolve) => {
  setTimeout(() => {
    console.log('定时器');
    resolve();
  }, 1000);
});
console.log(p);
console.log(add(1, 2));
console.log(result(2, 4));
console.log(data);
