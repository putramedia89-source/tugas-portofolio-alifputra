
document.addEventListener("DOMContentLoaded", () => {
    // Elemen yang muncul ketika halaman digulir
    const revealElements = document.querySelectorAll(
        ".section-heading, " +
        ".profile-grid, " +
        ".timeline li, " +
        ".skill-card, " +
        ".project-card, " +
        ".experience-card, " +
        ".additional-skills, " +
        ".gallery-intro, " +
        ".gallery-item, " +
        ".gallery-video, " +
        ".interest-list, " +
        ".contact-card, " +
        ".download-cv, " +
        ".table-wrapper"
    );

    // Hormati preferensi pengurangan animasi
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        return;
    }

    // Tambahkan kelas animasi
    revealElements.forEach((element, index) => {
        element.classList.add("js-reveal");

        // Kartu muncul bergantian
        if (
            element.matches(
                ".skill-card, .project-card, .gallery-item, " +
                ".gallery-video, .contact-card"
            )
        ) {
            element.dataset.delay = String((index % 3) + 1);
        }
    });

    // Amati elemen saat masuk ke layar
    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach(element => {
        observer.observe(element);
    });
});
