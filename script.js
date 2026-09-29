(() => {
  "use strict";

  const revealItems = document.querySelectorAll("[data-reveal]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && "IntersectionObserver" in window && revealItems.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -32px 0px" });

    document.documentElement.classList.add("motion-ready");
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const weddingDate = new Date("2027-05-16T11:00:00+05:30");
  const countdownFields = {
    days: document.querySelector("#countdown-days"),
    hours: document.querySelector("#countdown-hours"),
    minutes: document.querySelector("#countdown-minutes"),
    seconds: document.querySelector("#countdown-seconds")
  };
  const countdownMessage = document.querySelector("#countdown-message");
  const twoDigits = new Intl.NumberFormat("en", { minimumIntegerDigits: 2 });

  function updateCountdown() {
    const remaining = weddingDate.getTime() - Date.now();

    if (remaining <= 0) {
      Object.values(countdownFields).forEach((field) => {
        field.textContent = "00";
      });
      countdownMessage.textContent = remaining > -86400000
        ? "The celebration has begun!"
        : "Thank you for celebrating with us.";
      return;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    const values = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    };

    Object.entries(values).forEach(([unit, value]) => {
      const field = countdownFields[unit];
      const displayValue = unit === "days" ? String(value) : twoDigits.format(value);
      if (unit === "seconds" && field.textContent !== displayValue) {
        field.classList.remove("is-ticking");
        void field.offsetWidth;
        field.classList.add("is-ticking");
      }
      field.textContent = displayValue;
    });
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  document.querySelector("#calendar-button").addEventListener("click", () => {
    const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const calendar = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Anjana and Savanth//Wedding Invitation//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:anjana-savanth-wedding-20270516@invitation.local",
      `DTSTAMP:${timestamp}`,
      "DTSTART:20270516T053000Z",
      "DTEND:20270516T063000Z",
      "SUMMARY:Wedding of Anjana and Savanth",
      "LOCATION:Peruma Auditorium\\, Payyoli\\, Kerala",
      "DESCRIPTION:Muhoortham from 11:00 am to 12:00 pm IST.",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "UID:anjana-savanth-reception-20270517@invitation.local",
      `DTSTAMP:${timestamp}`,
      "DTSTART;VALUE=DATE:20270517",
      "DTEND;VALUE=DATE:20270518",
      "SUMMARY:Reception for Anjana and Savanth",
      "LOCATION:Assumption Parish Hall\\, Mupliyam\\, Thrissur",
      "DESCRIPTION:Reception begins at 11:00 am IST.",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const file = new Blob([calendar], { type: "text/calendar;charset=utf-8" });
    const downloadUrl = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = "anjana-and-savanth.ics";
    downloadLink.click();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  });
})();