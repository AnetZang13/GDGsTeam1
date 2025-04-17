document.addEventListener("DOMContentLoaded", function () {
  var appContainer = document.getElementById("app-container");
  if (!appContainer) {
    console.error("App container not found");
    return;
  }

  var mainContent = document.getElementById("main-content");
  if (!mainContent) {
    console.error("Main content container not found");
    return;
  }

  var calendarEl = document.getElementById("calendar");
  if (!calendarEl) {
    console.error("Calendar element not found");
    return;
  }

  // Initialize Quill
  var quill = new Quill("#quill-editor", {
    theme: "snow",
    modules: {
      toolbar: [
        ["bold", "italic", "underline"],
        ["image"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ size: ["small", "large", "huge"] }],
      ],
    },
  });

  // Initialize FullCalendar
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    height: "auto",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listDay",
    },
    views: {
      listDay: { buttonText: "List" },
    },
    windowResize: function () {
      if (window.innerWidth < 768) {
        calendar.changeView("listWeek");
      } else {
        calendar.changeView("dayGridMonth");
      }
    },
    selectable: true,
    events: [],
    eventClick: function (info) {
      showEventPopup(info.event);
    },
  });
  calendar.render();

  // Add Event Modal
  var modal = document.getElementById("eventModal");
  var btn = document.getElementById("open-modal");
  var span = document.getElementsByClassName("close")[0];

  btn.onclick = function () {
    modal.style.display = "block";
  };
  span.onclick = function () {
    modal.style.display = "none";
  };
  modal.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  document.getElementById("add-event-button").onclick = function () {
    const title = document.getElementById("event-title").value.trim();
    const start = document.getElementById("event-start").value;
    const end = document.getElementById("event-end").value;
    const notes = quill.root.innerHTML;

    if (title && start) {
      calendar.addEvent({
        title: title,
        start: start,
        end: end || null,
        extendedProps: {
          notes: notes,
        },
      });

      // Clear fields
      document.getElementById("event-title").value = "";
      document.getElementById("event-start").value = "";
      document.getElementById("event-end").value = "";
      quill.setContents([]);

      modal.style.display = "none";
    } else {
      alert("Please fill in event title and start time.");
    }
  };

  // Event popup modal
  function showEventPopup(event) {
    document.getElementById("popup-title").textContent = event.title;
    document.getElementById("popup-start").textContent = event.start.toLocaleString();
    document.getElementById("popup-end").textContent = event.end ? event.end.toLocaleString() : "N/A";
    document.getElementById("popup-notes").innerHTML = event.extendedProps.notes || "No notes.";

    const popup = document.getElementById("eventPopup");
    popup.style.display = "block";

    document.querySelector(".close-popup").onclick = () => {
      popup.style.display = "none";
    };
    window.onclick = function (e) {
      if (e.target === popup) {
        popup.style.display = "none";
      }
    };
  }

  // Todo list
  const todoList = document.getElementById("todos");
  const newTodoInput = document.getElementById("new-todo");
  const addTodoButton = document.getElementById("add-todo");
  const completedList = document.getElementById("completed-todos");
  const showButton = document.getElementById("show");

  if (todoList && newTodoInput && addTodoButton) {
    addTodoButton.addEventListener("click", addTodo);
    newTodoInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        addTodo();
      }
    });

    function addTodo() {
      const todoText = newTodoInput.value.trim();
      if (todoText) {
        const li = document.createElement("li");
        li.textContent = todoText;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Completed!";
        deleteButton.addEventListener("click", function () {
          completedList.appendChild(li);
          li.removeChild(deleteButton);
        });
        li.appendChild(deleteButton);
        todoList.appendChild(li);
        newTodoInput.value = "";
      }
    }
  }

  showButton.onclick = function () {
    if (
      completedList.style.display === "none" ||
      completedList.classList.contains("hidden")
    ) {
      completedList.style.display = "block";
      showButton.textContent = "Hide";
    } else {
      completedList.style.display = "none";
      showButton.textContent = "Show";
    }
  };

  // Menu
  var menuButton = document.getElementById("menu-button");
  var menuList = document.getElementById("menu-list");

  menuButton.onclick = function (event) {
    event.stopPropagation();
    menuList.classList.toggle("hidden");
  };

  window.onclick = function (event) {
    if (
      !menuList.classList.contains("hidden") &&
      !menuButton.contains(event.target)
    ) {
      menuList.classList.add("hidden");
    }
  };
});
