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

const addAlarmBtn = document.getElementById("addAlarm");
const alarm = document.querySelector("x-alarm");
const alarmForm = alarm.querySelector(".alarm-form");
const alarmTime = alarmForm.querySelector("#new-alarm-time");
const alarmDescription = alarmForm.querySelector("#new-alarm-description");
const alarmItems = alarm.querySelector(".items");
const alarmSound = new Audio(new URL("./alarm.wav", import.meta.url));
alarmSound.preload = "auto";

function enableAlarmSound() {
  alarmSound.muted = true;
  alarmSound
    .play()
    .then(() => {
      alarmSound.pause();
      alarmSound.currentTime = 0;
      alarmSound.muted = false;
    })
    .catch((error) => {
      alarmSound.muted = false;
      console.error("Could not enable alarm sound:", error);
    });
}

alarm.addEventListener("ring", (event) => {
  const ringingAlarm = event.detail;
  if (
    !ringingAlarm.hasAttribute("ringing") ||
    ringingAlarm.hasAttribute("paused")
  ) {
    return;
  }

  alarmSound.currentTime = 0;
  alarmSound.play().catch((error) => {
    console.error("Could not play alarm sound:", error);
  });
});

addAlarmBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  alarmForm.hidden = false;
  addAlarmBtn.hidden = true;
  alarmTime.focus();
});

alarmForm.addEventListener("submit", (event) => {
  event.preventDefault();
  enableAlarmSound();
  alarm.add();

  const newAlarm = alarmItems.lastElementChild;
  newAlarm.querySelector('input[type="time"]').value = alarmTime.value;
  newAlarm.querySelector(".alarm-description").value = alarmDescription.value;
  alarmItems.prepend(newAlarm);

  alarmForm.reset();
  alarmForm.hidden = true;
  addAlarmBtn.hidden = false;
});

alarmForm.querySelector(".cancel-alarm").addEventListener("click", () => {
  alarmForm.reset();
  alarmForm.hidden = true;
  addAlarmBtn.hidden = false;
});

const startStopwatch = document.getElementById("startStopwatch");
const pauseStopwatch = document.getElementById("pauseStopwatch");
const restartStopwatch = document.getElementById("restartStopwatch");
const markBtn = document.getElementById("mark");
const markTitle = document.getElementById("markTitle");
const lapsList = document.getElementById("lapsList");
const stopwatchEl = document.querySelector("x-stopwatch");

let markId = 1;

startStopwatch.addEventListener("click", () => {
  startStopwatch.style.display = "none";
  pauseStopwatch.style.display = "inline-block";
  restartStopwatch.style.display = "none";
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
  markId = 1;
});

markBtn.addEventListener("click", () => {
  markTitle.style.display = "block";

  const timeElement = stopwatchEl ? stopwatchEl.querySelector("time") : null;
  const currentTime = timeElement ? timeElement.textContent : "00:00:00";

  const li = document.createElement("li");
  li.classList.add("lap-item");

  const labelSpan = document.createElement("span");
  labelSpan.textContent = markId < 10 ? `0${markId++}` : `${markId++}`;

  const timeSpan = document.createElement("span");
  timeSpan.textContent = currentTime;

  li.appendChild(labelSpan);
  li.appendChild(timeSpan);

  lapsList.appendChild(li);
});
