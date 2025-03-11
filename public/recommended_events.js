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

    calendar.render();
});

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