const ctaBtn = document.querySelector("#cta-btn");

ctaBtn.addEventListener("mousemove", (e) => {
  const rect = ctaBtn.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctaBtn.style.setProperty("--left", `${x}px`);
  ctaBtn.style.setProperty("--top", `${y}px`);
});

const video = document.querySelector('video');

const options = {
    root: null,
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            video.play().catch(error => {
                console.log("Autoplay was prevented by browser security rules:", error);
            });
        } else {
            video.pause();
        }
    });
}, options);

observer.observe(video);




function readAddress() {
  const text = document.getElementById("address").innerText;
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "fr-FR";
  speechSynthesis.speak(speech);
}




const slider = document.querySelector(".slider");

slider.addEventListener("wheel", (e) => {
  if (e.deltaY !== 0) {
    e.preventDefault();
    slider.scrollLeft += e.deltaY;
  }
}, { passive: false });



// Calendars

const monthYear = document.querySelector('#month-year');
const dates = document.querySelector('#dates');
const calNext = document.querySelector('#cal-next');
const calPrev = document.querySelector('#cal-prev');

let currentDate = new Date();

function updateCalendar() {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const totalDay = lastDay.getDate();
  const firstDayIndex = firstDay.getDay();
  const lastDayIndex = lastDay.getDay();

  const monthYearString = currentDate.toLocaleString('default', {month: 'long', year: 'numeric'});
  monthYear.textContent = monthYearString;

  let datesHTML = '';
  for(let i = firstDayIndex; i > 0; i--) {
    const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
    datesHTML += `<div class="date inactive">${prevDate.getDate()}</div>`
  }

  for (let i = 1; i <= totalDay; i++) {
    const date = new Date(currentYear, currentMonth, i);

    const isToday =
        date.toDateString() === new Date().toDateString();

    const isWeekend =
        date.getDay() === 0 || date.getDay() === 6;

    let activeClass = "";

    if (isWeekend) {
      activeClass += "active";
    }

    if (isToday) {
      activeClass += "today";
    }

    datesHTML += `<div class="date ${activeClass}">${i}</div>`;
}

  const nextDays = 6 - lastDayIndex;
  for (let i = 1; i <= nextDays; i++) {
      datesHTML += `<div class="date inactive">${i}</div>`;
  }

  dates.innerHTML = datesHTML;
}

calPrev.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalendar();
})
calNext.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalendar();
})

updateCalendar();


// Reviews

const reviews = [
    "Amazing city, loved the food!",
    "The map made it so easy to find attractions.",
    "Would visit Lyon again for sure.",
    "Great events happening all year round.",
    "Friendly people and beautiful old streets."
];

const reviewTrack = document.getElementById("reviewTrack");
let reviewIndex = 0;

function renderReviews() {
    reviewTrack.innerHTML = "";

    for (let i = -1; i <= 1; i++) {
        const card = document.createElement("div");
        card.className = "review-card";

        if (i === 0) {
            card.classList.add("center");
        }

        const index = (reviewIndex + i + reviews.length) % reviews.length;
        card.textContent = reviews[index];

        reviewTrack.appendChild(card);
    }
}

function changeReview(direction) {
    reviewIndex = (reviewIndex + direction + reviews.length) % reviews.length;
    renderReviews();
}

reviewPrev.onclick = () => changeReview(-1);
reviewNext.onclick = () => changeReview(1);

renderReviews();


// Other Tabs

const tabs = document.querySelectorAll('[role="tab"]');
const panels = document.querySelectorAll('[role="tabpanel"]');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetPanelId = tab.getAttribute('aria-controls');

    tabs.forEach(t => {
      t.setAttribute('aria-selected', 'false');
      t.classList.remove('current-tab');
      t.setAttribute('tabindex', '-1');
    });

    panels.forEach(panel => {
      panel.setAttribute('aria-hidden', 'true');
      panel.hidden = true;
    });

    tab.setAttribute('aria-selected', 'true');
    tab.classList.add('current-tab');
    tab.removeAttribute('tabindex');

    const activePanel = document.getElementById(targetPanelId);
    activePanel.setAttribute('aria-hidden', 'false');
    activePanel.hidden = false;
  });
});