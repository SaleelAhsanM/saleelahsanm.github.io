document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.each-container');
    const navLinks = document.querySelectorAll('.nav-link');

    function setActiveLink() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight/3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }

    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    window.addEventListener('scroll', setActiveLink);

    // Add touch support for mobile devices
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', e => {
        touchStartY = e.touches[0].clientY;
    }, false);

    document.addEventListener('touchend', e => {
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const sections = Array.from(document.querySelectorAll('.each-container'));
        const currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 0 && rect.bottom > 0;
        });
        
        if (currentSection) {
            const currentIndex = sections.indexOf(currentSection);
            if (touchEndY < touchStartY && currentIndex < sections.length - 1) {
                // Swipe up - go to next section
                sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
            } else if (touchEndY > touchStartY && currentIndex > 0) {
                // Swipe down - go to previous section
                sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    // Scroll to Top functionality
    const scrollToTopBtn = document.getElementById('scrollToTop');

    function toggleScrollToTop() {
        if (window.scrollY > 200) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', toggleScrollToTop);

    // Contact Popover functionality
    const contactButtons = document.querySelectorAll('.contact-btn');
    const popover = document.getElementById('contactPopover');
    const closeBtn = popover.querySelector('.close-btn');
    const copyBtn = popover.querySelector('.copy-btn');
    const copyContent = popover.querySelector('.copy-content');
    const actionBtn = popover.querySelector('.action-btn');

    const contactInfo = {
        phone: {
            display: '+91 98460 20101',
            action: 'tel:+919846020101',
            icon: 'fa-phone'
        },
        email: {
            display: 'saleelahsan@gmail.com',
            action: 'mailto:saleelahsan@gmail.com',
            icon: 'fa-envelope'
        }
    };

    contactButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = btn.dataset.type;
            const info = contactInfo[type];
            const rect = btn.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            copyContent.textContent = info.display;
            actionBtn.href = info.action;
            actionBtn.querySelector('i').className = `fas ${info.icon}`;
            
            // Show popover to calculate its dimensions
            popover.style.visibility = 'hidden';
            popover.classList.add('show');
            const popoverRect = popover.getBoundingClientRect();
            
            // Calculate position
            let left = rect.left;
            let top = rect.bottom + 10;
            
            // Adjust horizontal position if popover would overflow viewport
            if (left + popoverRect.width > viewportWidth) {
                left = viewportWidth - popoverRect.width - 10;
            }
            
            // Adjust vertical position if popover would overflow viewport
            if (top + popoverRect.height > viewportHeight) {
                top = rect.top - popoverRect.height - 10;
            }
            
            // Apply adjusted position
            popover.style.top = `${top}px`;
            popover.style.left = `${left}px`;
            popover.style.visibility = 'visible';
            
            e.stopPropagation();
        });
    });

    closeBtn.addEventListener('click', () => {
        popover.classList.remove('show');
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(copyContent.textContent);
        const copyIcon = copyBtn.querySelector('i');
        copyIcon.classList.remove('fa-copy');
        copyIcon.classList.add('fa-copy', 'fas');
        
        setTimeout(() => {
            copyIcon.classList.remove('fas');
            copyIcon.classList.add('far');
        }, 2000);
    });

    document.addEventListener('click', (e) => {
        if (!popover.contains(e.target) && !e.target.classList.contains('contact-btn')) {
            popover.classList.remove('show');
        }
    });

    // Add fireworks functionality
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');
    const nameContainer = document.querySelector('.name-container');

    function resizeCanvas() {
        canvas.width = nameContainer.offsetWidth;
        canvas.height = nameContainer.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function getRandomColor() {
        // Generate vibrant colors with high saturation
        const hue = Math.random() * 360;
        const saturation = 60 + Math.random() * 30; // Between 70-100%
        const lightness = 40 + Math.random() * 10;  // Between 50-60%
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    function createLaunchParticle(endX, endY) {
        return {
            x: endX,
            y: canvas.height,
            targetX: endX,
            targetY: endY,
            color: getRandomColor(), // Random color for each launch
            radius: 2,
            velocity: {
                x: 0,
                y: -15
            },
            isLaunching: true
        };
    }

    function createExplosionParticle(x, y, color) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 2;
        return {
            x,
            y,
            color: color, // Use the same color as the launch particle
            radius: Math.random() * 1.5 + 0.5,
            velocity: {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            },
            alpha: 1
        };
    }

    function createExplosion(x, y, color) {
        const particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push(createExplosionParticle(x, y, color));
        }
        return particles;
    }

    let fireworks = [];
    let launchParticles = [];

    nameContainer.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        launchParticles.push(createLaunchParticle(x, y));
    });

    function animate() {
        ctx.fillStyle = 'rgba(245, 242, 238, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw launch particles
        launchParticles = launchParticles.filter(particle => {
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();

            // Check if reached target
            if (particle.y <= particle.targetY) {
                fireworks.push(createExplosion(particle.x, particle.y, particle.color));
                return false;
            }
            return true;
        });

        // Update and draw explosion particles
        fireworks = fireworks.filter(particles => {
            particles = particles.filter(particle => {
                particle.x += particle.velocity.x;
                particle.y += particle.velocity.y;
                particle.velocity.y += 0.03;
                particle.alpha -= 0.01;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color.replace('hsl', 'hsla').slice(0, -1) + `, ${particle.alpha})`;
                ctx.fill();

                return particle.alpha > 0;
            });
            return particles.length > 0;
        });

        requestAnimationFrame(animate);
    }
    animate();
});
