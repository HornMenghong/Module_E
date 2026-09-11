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


const calNext = document.getElementById('cal-next');
const calPrev = document.getElementById('cal-prev');
const monthYear = document.getElementById("monthYear");
const dates = document.getElementById("dates");

let currentDate = new Date();

function renderCalendar() {
    dates.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent = currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric"
    });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // Empty boxes
    for (let i = 0; i < firstDay; i++) {
        dates.innerHTML += "<div></div>";
    }

    // Days
    for (let day = 1; day <= totalDays; day++) {
        const weekday = new Date(year, month, day).getDay();

        let classes = "";
        if (weekday === 0 || weekday === 6) classes += " weekend";
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            classes += " today";
        }

        dates.innerHTML += `<div class="${classes}">${day}</div>`;
    }
}

function changeMonth(step) {
    currentDate.setMonth(currentDate.getMonth() + step);
    renderCalendar();
}

calPrev.onclick = () => changeMonth(-1);
calNext.onclick = () => changeMonth(1);

renderCalendar();



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