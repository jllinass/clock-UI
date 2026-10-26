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
