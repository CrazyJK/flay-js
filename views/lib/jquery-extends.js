import $ from 'jquery';

/* ---- extends jquery ---- */
$.fn.serializeObject = function () {
  let obj = null;
  try {
    const arr = this.serializeArray();
    if (arr) {
      obj = {};
      $.each(arr, function () {
        obj[this.name] = this.value ? this.value.trim() : '';
      });
    }
  } catch (e) {
    alert(e.message);
  }
  return obj;
};
