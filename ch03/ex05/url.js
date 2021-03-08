const url = require('url');

const { URL } = url;
// whatwg 방식
const myURL = new URL('http://gitbut.co.kr/book/bookList.apsx?sercate1=001001000#anchor');
console.log('new URL:', myURL);
console.log('url.format():', url.format(myURL));
console.log('--------------------');
// node 방식
const parseUrl = url.parse('http://gitbut.co.kr/book/bookList.apsx?sercate1=001001000#anchor');
console.log('url.parse():', parseUrl);
console.log('url.format():',url.format(parseUrl));
