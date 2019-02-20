const cookie = {};


// Determine current status based of value sum

const state = {
  "reality" : 0,
  "pos": 0,
  "neg": 0
};

function update(value) {
  state[value]++;
  var max = 0;
  for (x in state) {
    if (state[x] > max) {
        $('body').removeClass("reality pos neg").addClass(x);
        max = state[x];
    }
  }
}

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
    update(value);
  }
});

// Location
if (location.hash) {
  $(location.hash).nextAll(':not(.loaded)').find('a').addClass('never-selected');
}

// Action
$(document).on('click','a.selected', (ev) => {
  ev.preventDefault();
  return false;
});
$(document).on('click','a', ({ target }) => {
  const selected = $(target);
  const parent = selected.addClass('selected').parents('li[id]').addClass('loaded');
  const id = parent.attr('id');
  parent.find('a').removeClass('never-selected').not(selected).addClass('not-selected');
  const status = selected.data('status');
  //Update Cookie state
  cookie[id] = status;
  document.cookie = `${id}=${status};`;
  console.log(document.cookie);
  update(id);
});
