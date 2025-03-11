// Static example data for testing the layout
const gridsData = [
    [
        { image: 'images/athletics.jpg', label: 'Athletics' },
        { image: 'images/clubSports.jpg', label: 'Club Sports' },
        { image: 'images/concerts_performances.jpg', label: 'Concerts & Performances' },
        { image: 'images/senior-symposium.png', label: 'Conferences & Symposia' }
    ],
    [
        { image: 'images/Deadlines & Important Dates.jpg', label: 'Deadlines & Important Dates' },
        { image: 'images/equestrian.jpg', label: 'Equestrian' },
        { image: 'images/Exhibitions.jpg', label: 'Exhibitions' },
        { image: 'images/fearless-first-academy.png', label: 'Fearless First Academy' }
    ],
    [
        { image: 'images/firstYearCalendar.jpg', label: 'First Year Calendar' },
        { image: 'images/gathering-meetings.jpg', label: 'Gatherings & Meetings' },
        { image: 'images/healthTesting.jpg', label: 'Health Testing' },
        { image: 'images/holidays_observances.jpg', label: 'Holidays & Observances' }
    ],
    [
        { image: 'images/information session.png', label: 'Information Sessions' },
        { image: 'images/juniorCalendar.jpg', label: 'Junior Calendar' },
        { image: 'images/lectures&presentations.jpeg', label: 'Lectures & Presentations' },
        { image: 'images/orientation.jpg', label: 'Orientation' }
    ],
    [
        { image: 'images/residential_life.jpg', label: 'Residential Life' },
        { image: 'images/seniorCalendar.png', label: 'Senior Calendar' },
        { image: 'images/sophomore_calendar.jpg', label: 'Sophomore Calendar' },
        { image: 'images/training_workout.png', label: 'Trainings & Workshops' }
    ],
    [
        { image: 'images/varsity.jpg', label: 'Varsity Sports' }
    ]
];

function generateGrids() {
    const container = document.querySelector('.preference-grids-container');
    gridsData.forEach(grid => {
        const gridElement = document.createElement('div');
        gridElement.classList.add('preference-grid');

        grid.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('preference-item');

            // Create circle for selection
            const circle = document.createElement('div');
            circle.classList.add('circle');
            itemElement.appendChild(circle);

            // Placeholder div for image background
            const imgPlaceholder = document.createElement('div');
            imgPlaceholder.classList.add('img-placeholder');
            itemElement.appendChild(imgPlaceholder);

            // Add image if available
            if (item.image) {
                const img = document.createElement('img');
                img.src = item.image;
                img.alt = item.label;
                img.classList.add('preference-image');
                imgPlaceholder.appendChild(img); // Place image inside placeholder
            }

            // Add text label
            const label = document.createElement('p');
            label.textContent = item.label;
            label.classList.add('preference-label');
            itemElement.appendChild(label);

            gridElement.appendChild(itemElement);
        });

        container.appendChild(gridElement);
    });

    // Event listener for toggling selection
    document.querySelectorAll('.preference-item').forEach(item => {
        item.addEventListener('click', function() {
            const circle = this.querySelector('.circle');
            circle.classList.toggle('checked');
        });
    });

    document.querySelectorAll('.circle').forEach(circle => {
        circle.addEventListener('click', function(event) {
            event.stopPropagation();
            this.classList.toggle('checked');
        });
    });

    document.getElementById('submit-button').addEventListener('click', function() {
        const selectedPreferences = [];
        
        document.querySelectorAll('.preference-item .circle.checked').forEach(circle => {
            const label = circle.parentElement.textContent.trim();
            selectedPreferences.push(label);
        });

        // Convert preferences array to a URL parameter string
        const queryParams = new URLSearchParams({ preferences: selectedPreferences.join(',') }).toString();

        // Redirect to the "Recommended Events" page with selected preferences
        window.location.href = `recommended_events.html?${queryParams}`;
    });
}

// Call function to generate grids on page load
window.onload = generateGrids;
