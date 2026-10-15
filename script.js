
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


/* ===== INTERACTIVE BACKGROUND ===== */

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("particles-canvas");
    const cursorGlow = document.querySelector(".cursor-glow");
    const background = document.querySelector(".animated-background");

    if (!canvas || !cursorGlow || !background) return;

    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let particles = [];
    let animationId;
    let mouse = { x: -1000, y: -1000 };
    let lastFrame = 0;

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.min(
            65,
            Math.floor((width * height) / 18000)
        );

        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.5,
            speedX: (Math.random() - 0.5) * 0.35,
            speedY: (Math.random() - 0.5) * 0.35,
            alpha: Math.random() * 0.5 + 0.2
        }));
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            if (!reduceMotion) {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0 || p.x > width) p.speedX *= -1;
                if (p.y < 0 || p.y > height) p.speedY *= -1;
            }

            // Partikel menjauh sedikit dari kursor
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (!reduceMotion && distance < 110 && distance > 0) {
                p.x += (dx / distance) * 0.45;
                p.y += (dy / distance) * 0.45;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 25, 25, ${p.alpha})`;
            ctx.fill();

            // Garis tipis saat partikel dekat dengan kursor
            if (!reduceMotion && distance < 150) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle =
                    `rgba(255, 0, 0, ${0.15 * (1 - distance / 150)})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
            }
        });
    }

    function animate(timestamp = 0) {
        if (timestamp - lastFrame < 30) {
            animationId = requestAnimationFrame(animate);
            return;
        }

        lastFrame = timestamp;
        drawParticles();

        if (!reduceMotion) {
            animationId = requestAnimationFrame(animate);
        }
    }

    // Posisi kursor dan cahaya merah
    window.addEventListener("pointermove", event => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;

        cursorGlow.style.left = `${mouse.x}px`;
        cursorGlow.style.top = `${mouse.y}px`;

        document.body.classList.add("cursor-active");
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
        mouse.x = -1000;
        mouse.y = -1000;
        document.body.classList.remove("cursor-active");
    });

    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();
    animate();
});
