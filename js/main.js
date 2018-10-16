const cookie = {};


// Determine current status based of value sum
() => {

};


// Loading
const cookies = document.cookie.split(';');
console.log(cookies);
$.each(cookies, (_key, pair) => {
  if (pair) {
    const [key, value] = pair.split('=');
    cookie[key] = value;
    const parent = $(`#${key}`).addClass('loaded');
    const selected = parent.find(`a[data-status=${value}]`).addClass('selected');
    parent.find('a').not(selected).addClass('not-selected');
  }
});

//
if (location.hash) {
  $(location.hash).nextAll(':not(.loaded)').find('a').addClass('never-selected');
}


// Action
$(document).on('click','a', ({ target }) => {
  const selected = $(target);
  const parent = selected.addClass('selected').parents('li[id]').addClass('loaded');
  const id = parent.attr('id');
  parent.find('a').removeClass('never-selected').not(selected).addClass('not-selected');
  const status = selected.data('status');
  //Update Cookie state
  cookie[id] = status;
  document.cookie = `${id}=${status};`;
})
