/**
 * common utilities
 */
import $ from 'jquery';

export const Random = {
  get: function (start, end) {
    return Math.random() * (end - start) + start;
  },
  getInteger: function (start, end) {
    // start부터 end사이의 random 정수 반환
    return Math.round(this.get(start, end));
  },
  getHex: function (start, end) {
    return this.getInteger(start, end).toString(16);
  },
  getBoolean: function () {
    return this.getInteger(1, 2) === 1;
  },
};

export var KB = 1024,
  MB = KB * KB,
  GB = MB * KB,
  TB = GB * KB;
export const FileUtils = {
  formatSize: function (length, unit, digits) {
    if (unit) {
      if (typeof digits === 'undefined') digits = 1;
      if (unit === 'MB') {
        return (length / MB).toFixed(digits) + ' MB';
      } else if (unit === 'GB') {
        return (length / GB).toFixed(digits) + ' GB';
      } else if (unit === 'TB') {
        return (length / TB).toFixed(digits) + ' TB';
      }
    } else {
      if (length < KB) return length + ' B';
      else if (length < MB) return (length / KB).toFixed(0) + ' kB';
      else if (length < GB) return (length / MB).toFixed(0) + ' <span>MB</span>';
      else if (length < TB) return (length / GB).toFixed(1) + ' <span>GB</span>';
      else return (length / TB).toFixed(2) + ' <span>TB</span>';
    }
  },
  validName: (name) => {
    // \ / : * ? " < > |
    return name.replace(/[\\]/gi, '＼').replace(/[/]/gi, '／').replace(/[:]/gi, '：').replace(/[*]/gi, '＊').replace(/[?]/gi, '？').replace(/["]/gi, '＂').replace(/[<]/gi, '＜').replace(/[>]/gi, '＞').replace(/[|]/gi, '｜');
  },
};

export const FlayFiles = {
  lastModified: (flay) => {
    let mtime = -1;
    mtime = Math.max(mtime, flay.files.cover.mtime);
    flay.files.movie.forEach((file) => {
      mtime = Math.max(mtime, file.mtime);
    });
    flay.files.subtitles.forEach((file) => {
      mtime = Math.max(mtime, file.mtime);
    });
    return mtime;
  },
};

export const DateUtils = {
  format: (date, pattern) => {
    function zf(n) {
      return n < 10 ? '0' + n : n;
    }
    if (typeof date === 'number') {
      date = new Date(date);
    }
    return pattern.replace(/(yyyy|yy|mm|dd|hh|mi|ss)/gi, function ($1) {
      switch ($1) {
        case 'yyyy':
          return date.getFullYear();
        case 'yy':
          return date.getFullYear().toString().substring(2, 4);
        case 'mm':
          return zf(date.getMonth() + 1);
        case 'dd':
          return zf(date.getDate());
        case 'hh':
          return zf(date.getHours());
        case 'mi':
          return zf(date.getMinutes());
        case 'ss':
          return zf(date.getSeconds());
        default:
          return $1;
      }
    });
  },
};

export const StringUtils = {
  isBlank: function (str) {
    return str === null || str.trim().length === 0;
  },
};

export const Tag = {
  indexOf: function (list, tag) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === tag.id) {
        return i;
      }
    }
    return -1;
  },
};

export const LocalStorageItem = {
  set: function (itemName, itemValue) {
    typeof Storage !== 'undefined' && localStorage.setItem(itemName, itemValue);
  },
  get: function (itemName, notfoundDefault) {
    return typeof Storage !== 'undefined' && (localStorage.getItem(itemName) || notfoundDefault);
  },
  getInteger: function (itemName, notfoundDefault) {
    return parseInt(this.get(itemName, notfoundDefault));
  },
  getBoolean: function (itemName, notfoundDefault) {
    if (notfoundDefault) {
      return this.get(itemName, notfoundDefault.toString()) === 'true';
    } else {
      return this.get(itemName) === 'true';
    }
  },
  split: function (itemName, notfoundDefault, delimiter) {
    return this.get(itemName, notfoundDefault).split(delimiter);
  },
  has: (itemName) => {
    // eslint-disable-next-line no-prototype-builtins
    return localStorage.hasOwnProperty(itemName);
  },
  remove: (itemName) => {
    localStorage.removeItem(itemName);
  },
  clear: () => {
    localStorage.clear();
  },
};

export const SessionStorageItem = {
  set: function (itemName, itemValue) {
    typeof Storage !== 'undefined' && sessionStorage.setItem(itemName, itemValue);
  },
  get: function (itemName, notfoundDefault) {
    return typeof Storage !== 'undefined' && (sessionStorage.getItem(itemName) || notfoundDefault);
  },
  getInteger: function (itemName, notfoundDefault) {
    return parseInt(this.get(itemName, notfoundDefault));
  },
  getBoolean: function (itemName, notfoundDefault) {
    if (notfoundDefault) {
      return this.get(itemName, notfoundDefault.toString()) === 'true';
    } else {
      return this.get(itemName) === 'true';
    }
  },
  has: (itemName) => {
    // eslint-disable-next-line no-prototype-builtins
    return sessionStorage.hasOwnProperty(itemName);
  },
  remove: (itemName) => {
    sessionStorage.removeItem(itemName);
  },
  clear: () => {
    sessionStorage.clear();
  },
};

/* ---- extends jquery ---- */
$.fn.serializeObject = function () {
  var obj = null;
  try {
    var arr = this.serializeArray();
    if (arr) {
      obj = {};
      $.each(arr, function () {
        obj[this.name] = this.value;
      });
    }
  } catch (e) {
    alert(e.message);
  }

  return obj;
};
