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

const reviewPrev = document.getElementById("reviewPrev");
const reviewNext = document.getElementById("reviewNext");
const reviewTrack = document.getElementById("reviewTrack");

let reviews = [];
let reviewIndex = 0;

function renderReviews() {
  reviewTrack.innerHTML = "";

  if(reviews.length === 0) return;

  for(let i = -1; i <= 1; i++) {
    const card = document.createElement("div");
    card.className = "review-card";
    if(i === 0) card.classList.add("center");
    const index = (reviewIndex + i + reviews.length) % reviews.length;
    const review = reviews[index];

    card.innerHTML = `
      <h3>${review.author}</h3>
      <p>${review.content}</p>
      <p>Rating: ${review.rating} ${review.rating > 1 ? "stars" : "star"}</p>
    `;

    reviewTrack.appendChild(card);
  }
}

function changeReview(direction) {
  reviewIndex = (reviewIndex + direction + reviews.length) % reviews.length;

  renderReviews();
}

reviewPrev.addEventListener("click", () => { changeReview(-1) });
reviewNext.addEventListener("click", () => { changeReview(1) });

async function getReviews() {
   try {
    const res = await fetch("./review.json");
    if(!res.ok) console.error("Couldn't fetch Review");
    const data = await res.json();
    return data.reviews;
  } catch (error) {
    console.error("Couldn't fetch Review");
    return [];
  }
}

async function initReview() {
  reviews = await getReviews();
  renderReviews();
}

initReview();


// Other Tabs

const tabs = document.querySelectorAll('[role="tab"]');
const panels = document.querySelectorAll('[role="tabpanel"]');

function activateTab(tab) {
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
  tab.setAttribute('tabindex', '0');

  const activePanel = document.getElementById(targetPanelId);
  activePanel.setAttribute('aria-hidden', 'false');
  activePanel.hidden = false;

  tab.focus();
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    activateTab(tab);
  });

  tab.addEventListener('keydown', (e) => {
    const currentIndex = Array.from(tabs).indexOf(tab);
    let nextIndex;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else {
      return;
    }

    activateTab(tabs[nextIndex]);
  });
});

const maxWidth = 760;
const mediaQuery = window.matchMedia(`(max-width: ${maxWidth}px)`);

function updateImages(e) {
  const isSmallScreen = e.matches;

  document.querySelectorAll("img").forEach(img => {
    if (!img.dataset.originalSrc) {
      img.dataset.originalSrc = img.src;
    }

    const originalSrc = img.dataset.originalSrc;

    if(isSmallScreen) {
      img.src = originalSrc.replace(/(\.[^.]+)$/, "-low-res$1");
    } else {
      img.src = originalSrc;
    }
  });
}

mediaQuery.addEventListener("change", updateImages);

updateImages(mediaQuery)