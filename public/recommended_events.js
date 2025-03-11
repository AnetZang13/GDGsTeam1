let currentEvent;

fetch('http://localhost:3000/api/message')
  .then(response => response.text())
  .then(data => {
    const jcalData = ICAL.parse(data);
    const comp = new ICAL.Component(jcalData);
    const events = comp.getAllSubcomponents('vevent');
    
    events.forEach(event => {
      let vevent = new ICAL.Event(event);
      console.log('Event:', vevent.summary, 'on', vevent.startDate.toString());
    });
  });

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
    height: 'auto',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listDay'
    },
    views: {
      listDay: { buttonText: 'List' },
    events: 'https://embark.mtholyoke.edu/ics?type=starredgroups&eid=688281eeb2387a8853d2c2acbcf9a91d'
    },
    //adjust window to size of window
    windowResize: function (view) {
      if (window.innerWidth < 768) {
        calendar.changeView('listWeek');
      } else {
        calendar.changeView('dayGridMonth');
      }
    }
  });

  calendar.render();});