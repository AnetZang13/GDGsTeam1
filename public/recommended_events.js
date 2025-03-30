document.addEventListener('DOMContentLoaded', function () {

    //Load in main container 
    var appContainer = document.getElementById('app-container');
    if (!appContainer) {
      console.error('Window not found');
      return;
    }
    //Load in main window (calendar & todo & add event) 
    var mainContent = document.getElementById('main-content');
    if (!mainContent) {
      console.error('Window not found');
      return;
    }
  
    var calendarEl = document.getElementById('calendar');
    if (!calendarEl) {
      console.error('Calendar not found');
      return;
    }
  
    // Implement FullCalendar
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'timeGridWeek',
      timeZone: 'local',
      events: [
        {
          title: 'BINGO',
          start: '2025-03-26T18:00:00', 
          end: '2025-03-26T20:00:00'
        },
        {
          title: 'Beekeeping 101: A Talk With Dan',
          start: '2025-03-26T14:00:00', 
          end: '2025-03-26T15:00:00'
        },
        {
          title: 'Clay Crafts & Tea Time',
          start: '2025-03-27T19:00:00', 
          end: '2025-03-26T20:30:00'
        }
      ],
      height: 'auto',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listDay'
      },
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listDay'
      },
      views: {
        listDay: { buttonText: 'List' },
      //adjust window to size of window
      windowResize: function (view) {
        if (window.innerWidth < 768) {
          calendar.changeView('listWeek');
        } else {
          calendar.changeView('dayGridMonth');
        }
      },
    }
  
});

calendar.render();

var modal = document.getElementById("eventModal");
var span = document.getElementsByClassName("close")[0];

calendar.on('eventClick', function(info) {
  modal.style.display = "block";
  modal.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
    var addButton = event.target.closest('#addButton'); 
  
        if (addButton) {
          if (!addButton.classList.contains('added')) {
            addButton.classList.add('added');
            addButton.textContent = 'Added'; 
            info.event.setProp('backgroundColor', '#013220');
          } else {
            addButton.classList.remove('added');
            addButton.textContent = 'Add'; 
            info.event.setProp('backgroundColor', '');
          }
        }
  }
});

span.onclick = function () {
  modal.style.display = "none";
}


  
    /*Menu*/
  
  document.addEventListener('DOMContentLoaded', function () {
    var menuButton = document.getElementById('menu-button');
    var menuList = document.getElementById('menu-list');
  
    // Show the menu when the button is clicked
    menuButton.onclick = function (event) {
      event.stopPropagation(); // Prevent affecting parent elements like the window
      menuList.classList.toggle('hidden'); // If the window is closed, open it, and vise versa
    };
  
    // Closing the menu when clicking anywhere outside of it in the window
    window.onclick = function (event) {
      //checks if menu is visable and if the click does not occur on menu button
      if (!menuList.classList.contains('hidden') && !menuButton.contains(event.target)) {
        menuList.classList.add('hidden');
      }
    };

  });
  
});
  