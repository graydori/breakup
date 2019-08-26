// Determine current status based of value sum

const state = {
  "reality" : 0,
  "pos": 0,
  "neg": 0
};

function recheck() {
  var max = 0;
  for (x in state) {
    if (state[x] > max) {
      $('body').removeClass("reality pos neg").addClass(x);
      max = state[x];
    }
  }
}
// Get a reference to the database service
var database = firebase.database();
var ref = database.ref('/users/');

ga(function(tracker) {
  var clientId = tracker.get('clientId').replace('.','-');
  ref = ref.child(clientId);
  ref.once('value').then(function(snapshot) {
    // Loading
    const data = snapshot.val() || {};
    $('ul li[id]').each((index,{id}) => {
      const value = data[id];
      const parent = $(`#${id}`);
      if (
          value &&
          (
            (location.hash === `#${id}` && id === 'end') ||
            parent.prevAll().filter(location.hash).length === 1
          )
        ) {
        parent.addClass('loaded');
        const selected = parent.find(`a[data-status=${value}]`).addClass('selected');
        parent.find('a').not(selected).addClass('not-selected');
        state[value]++;
        recheck();
      }
    })
  });
});



// Location
if (location.hash) {

  $('body').removeClass('animated');
}

// Navigating back clears values
var last = location.hash || "#in-love";
$( window ).on('hashchange', function(e) {
  console.log( 'hash changed',e); // change in focus
  var $last = $(last);
  var newLast = location.hash || "#in-love";
  if ($last.nextAll().filter(newLast).length === 1) {
    //Going back? Clear the state[]--;
    var parent = $(newLast);
    var status = parent.find('.selected').removeClass('selected').data('status');
    parent.removeClass('loaded').find('a').removeClass('never-selected').removeClass('not-selected');

    state[status]--;
  } else {
    //Going forward? Check the previous selection
    ref.child($last.attr('id')).once('value').then(function(snapshot) {
      var value = snapshot.val();
      const parent = $last.addClass('loaded');
      const selected = parent.find(`[data-status=${value}]`).addClass('selected');
      parent.find('a').removeClass('never-selected').not(selected).addClass('not-selected');
      state[value]++;
      recheck();
    });
  }
  last = newLast;
});

// Action

//Disable re-clicking a selected item
$(document).on('click','a.selected', (ev) => {
  ev.preventDefault();
  return false;
});

$(document).on('click','a[data-status]', ({ target }) => {
  const $selected = $(target);
  const id = $selected.parents('li[id]').attr('id');
  const status = $selected.data('status');
  ref.child(id).set(status);
});

$('form').submit(function() {
  const text = $('#feelings').val();
  ref.child('-').push(text);
  $('form').hide().after(`<ul><li><a class="selected">${text}</a></li></ul>`);
  return false;
});

//Auto sizing text area
autosize($("textarea"))
