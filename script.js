const counters = document.querySelectorAll("[data-counter]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateCounter(element) {
  const target = Number(element.dataset.counter);
  const duration = 1200;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.floor(target * eased).toLocaleString("es-CO");

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString("es-CO");
    }
  }

  requestAnimationFrame(update);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        if (entry.target.hasAttribute("data-counter") && !entry.target.dataset.animated) {
          entry.target.dataset.animated = "true";

          if (prefersReducedMotion) {
            entry.target.textContent = Number(entry.target.dataset.counter).toLocaleString("es-CO");
          } else {
            animateCounter(entry.target);
          }
        }
      }
    });
  },
  {
    threshold: 0.2,
  }
);

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
counters.forEach((counter) => observer.observe(counter));

const filterButtons = document.querySelectorAll(".filter-btn");
const tableRows = document.querySelectorAll("tbody tr");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    tableRows.forEach((row) => {
      const impact = row.dataset.impact;
      const shouldShow = filter === "all" || impact === filter;
      row.classList.toggle("hidden-row", !shouldShow);
    });
  });
});

if (prefersReducedMotion) {
  document.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));
}
