const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("main-nav");
const overlay = document.querySelector(".nav-overlay");

function setMenu(open) {
  document.body.classList.toggle("nav-open", open);
  toggle.setAttribute("aria-expanded", open);
}

toggle.addEventListener("click", () => {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});

overlay.addEventListener("click", () => setMenu(false));

menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

window.matchMedia("(min-width: 750px)").addEventListener("change", (e) => {
  if (e.matches) setMenu(false);
});
