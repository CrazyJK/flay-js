/**
 * layout js
 */
import './lib/jquery-extends.js';
import './lib/web-socket.js';
import './layout.scss';

window.onerror = function (msg, url, lineNo, columnNo, error) {
  console.error('Error', msg, url, lineNo, columnNo, error);
  var string = msg.toLowerCase();
  var substring = 'script error';
  if (string.indexOf(substring) > -1) {
    alert('Script Error: See Browser Console for Detail');
  } else {
    var message = ['Message: ' + msg, 'URL: ' + url, 'Line: ' + lineNo, 'Column: ' + columnNo, 'Error object: ' + JSON.stringify(error)].join(' - ');
    alert(message);
  }

  return false;
};
