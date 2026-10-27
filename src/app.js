import Alarm from "./Alarm.js";
import Clock from "./Clock.js";
import Stopwatch from "./Stopwatch.js";
import Timer from "./Timer.js";

customElements.define("x-alarm", Alarm);
customElements.define("x-clock", Clock);
customElements.define("x-stopwatch", Stopwatch);
customElements.define("x-timer", Timer);

const menuIcon = document.querySelector("nav > .menu-icon");
const nav = document.querySelector("nav");

menuIcon.addEventListener("click", () => {
  const expanded = nav.classList.toggle("expanded");
  menuIcon.setAttribute("aria-expanded", String(expanded));
  menuIcon.setAttribute(
    "aria-label",
    expanded ? "Collapse navigation rail" : "Expand navigation rail",
  );
});

const navigationLinks = [...nav.querySelectorAll(".rail-destinations a")];

if (!window.location.hash && navigationLinks[0]) {
  window.history.replaceState(null, "", navigationLinks[0].hash);
}

function updateActiveDestination() {
  const activeLink = navigationLinks.find(
    (link) => link.hash === window.location.hash,
  );

  navigationLinks.forEach((link) => {
    if (link === activeLink) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("hashchange", updateActiveDestination);
updateActiveDestination();

const startStopwatch = document.getElementById("startStopwatch");
const pauseStopwatch = document.getElementById("pauseStopwatch");
const restartStopwatch = document.getElementById("restartStopwatch");
const markBtn = document.getElementById("mark");
const markTitle = document.getElementById("markTitle");
const lapsList = document.getElementById("lapsList");

let seconds = 0;

startStopwatch.addEventListener("click", () => {
  startStopwatch.style.display = "none";
  pauseStopwatch.style.display = "inline-block";
  restartStopwatch.style.display = "inline-block";
  markBtn.style.display = "inline-block";
});

pauseStopwatch.addEventListener("click", () => {
  startStopwatch.style.display = "inline-block";
  pauseStopwatch.style.display = "none";
  markBtn.style.display = "none";
  restartStopwatch.style.display = "inline-block";
});

restartStopwatch.addEventListener("click", () => {
  startStopwatch.style.display = "inline-block";
  pauseStopwatch.style.display = "none";
  restartStopwatch.style.display = "none";
  markBtn.style.display = "none";
  markTitle.style.display = "none";
  if (lapsList) lapsList.innerHTML = "";
  seconds = 0;
});

function formatTime(totalSeconds) {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
}

markBtn.addEventListener("click", () => {
  const li = document.createElement("li");
  li.textContent = `Marca: ${formatTime(seconds)}`;
  markTitle.style.display = "block";
  lapsList.appendChild(li);
});
