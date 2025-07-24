document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.each-container');
    const navLinks = document.querySelectorAll('.nav-link');

    function setActiveLink() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight/4)) {
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

    // Update touch support for smoother scrolling
    let touchStartY = 0;
    let touchEndY = 0;
    const SWIPE_THRESHOLD = 100; // Minimum swipe distance to trigger section change

    document.addEventListener('touchstart', e => {
        touchStartY = e.touches[0].clientY;
    }, false);

    

    // Prevent default scroll behavior on touch devices
    document.addEventListener('touchmove', function(e) {
        e.stopPropagation();
    }, { passive: true });

    // Scroll to Top functionality
    const scrollToTopBtn = document.getElementById('scrollToTop');

    // Scroll to Bottom functionality
    const scrollToBottomBtn = document.getElementById('scrollToBottom');
    const skillsSection = document.getElementById('skills');

    let scrollToBottomClicked = false;
    function toggleScrollToBottom() {
        if (scrollToBottomClicked) {
            scrollToBottomBtn.classList.remove('visible');
            return;
        }
        // Show button if user is near the skills section or bottom
        const skillsRect = skillsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const nearBottom = (window.scrollY + windowHeight) >= (document.body.scrollHeight - 100);
        const skillsVisible = skillsRect.top < windowHeight && skillsRect.bottom > 0;
        if (skillsVisible || nearBottom) {
            scrollToBottomBtn.classList.add('visible');
        } else {
            scrollToBottomBtn.classList.remove('visible');
        }
    }

    scrollToBottomBtn.addEventListener('click', () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });
    
    // Show SaaS section and hide scrollToBottom button on click
    const saasSection = document.querySelector('.saas-outer-container');
    if (scrollToBottomBtn && saasSection) {
        scrollToBottomBtn.addEventListener('click', function() {
            scrollToBottomClicked = true;
            saasSection.classList.add('visible');
            scrollToBottomBtn.classList.remove('visible');
            saasSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    window.addEventListener('scroll', toggleScrollToBottom);
    window.addEventListener('resize', toggleScrollToBottom);
    document.addEventListener('DOMContentLoaded', toggleScrollToBottom);

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

    // Add balloon functionality
    const experienceContainer = document.querySelector('.experience-container');
    
    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = Math.random() * 100 + '%';
        balloon.style.backgroundColor = `hsla(${Math.random() * 360}, 70%, 50%, 0.7)`;
        
        // Calculate experience section height instead of screen height
        const experienceHeight = experienceContainer.offsetHeight;
        document.documentElement.style.setProperty('--section-height', `${experienceHeight}px`);
        
        experienceContainer.appendChild(balloon);
        balloon.addEventListener('animationend', () => balloon.remove());
    }
    
    // Update height on resize
    window.addEventListener('resize', () => {
        const experienceHeight = experienceContainer.offsetHeight;
        document.documentElement.style.setProperty('--section-height', `${experienceHeight}px`);
    });
    
    // Add balloon toggle button
    const balloonToggle = document.createElement('button');
    balloonToggle.className = 'balloon-toggle disabled'; // Add disabled class initially
    balloonToggle.innerHTML = '<i class="fa-solid fa-toggle-off"></i>';
    balloonToggle.title = 'Toggle Balloons';
    experienceContainer.appendChild(balloonToggle);

    let balloonsEnabled = false; // Start with balloons disabled
    let balloonInterval;

    function toggleBalloons() {
        balloonsEnabled = !balloonsEnabled;
        balloonToggle.innerHTML = balloonsEnabled ? 
            '<i class="fa-solid fa-toggle-on"></i>' : 
            '<i class="fa-solid fa-toggle-off"></i>';
        balloonToggle.classList.toggle('disabled'); // Toggle disabled instead of inactive
        
        if (balloonsEnabled) {
            balloonInterval = setInterval(createBalloon, 2000);
        } else {
            clearInterval(balloonInterval);
            document.querySelectorAll('.balloon').forEach(b => b.remove());
        }
    }

    balloonToggle.addEventListener('click', toggleBalloons);

    // Don't start balloon creation automatically
    // balloonInterval = setInterval(createBalloon, 2000);

    // Add rain effect
    const summaryContainer = document.querySelector('.summary-container');
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-container';
    summaryContainer.insertBefore(rainContainer, summaryContainer.firstChild);

    function createRaindrop() {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        
        // Random properties for each drop
        const size = Math.random() * 3 + 1;
        const speed = Math.random() * 1.5 + 0.5;
        const xPos = Math.random() * 100;
        
        drop.style.height = size * 20 + 'px';
        drop.style.left = xPos + '%';
        drop.style.animationDuration = speed + 's';
        
        rainContainer.appendChild(drop);
        
        // Remove drop after animation
        setTimeout(() => drop.remove(), speed * 1000);
    }

    // Create raindrops periodically
    let rainInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
            createRaindrop();
        }
    }, 100);

    // Add cloud and thunder effects
    function createCloud() {
        // Check for existing clouds to prevent overlap
        const existingClouds = rainContainer.querySelectorAll('.cloud');
        if (existingClouds.length > 3) return; // Limit maximum clouds

        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        
        // Get positions of existing clouds
        const cloudPositions = Array.from(existingClouds).map(c => {
            const rect = c.getBoundingClientRect();
            return { left: rect.left, top: parseInt(c.style.top) };
        });

        // Find a safe position for new cloud
        let safePosition = false;
        let attempts = 0;
        let topPos, leftPos;

        while (!safePosition && attempts < 10) {
            topPos = Math.random() * 60;
            leftPos = -150; // Start from left edge

            // Check if position is far enough from existing clouds
            safePosition = cloudPositions.every(pos => 
                Math.abs(pos.top - topPos) > 30 && Math.abs(pos.left - leftPos) > 200
            );
            attempts++;
        }

        if (!safePosition) return; // Skip if no safe position found

        cloud.style.top = `${topPos}px`;
        rainContainer.appendChild(cloud);
        
        // Remove cloud after animation or if hidden
        const removeCloud = () => cloud.remove();
        cloud.addEventListener('animationend', removeCloud);
        setTimeout(removeCloud, 20000); // Backup cleanup

        // Create thunder with random delay
        if (Math.random() < 0.3) {
            setTimeout(() => {
                if (cloud.isConnected) { // Only create thunder if cloud still exists
                    createThunder(cloud);
                }
            }, Math.random() * 2000);
        }
    }

    // Adjust cloud creation interval
    const createCloudWithInterval = () => {
        if (document.visibilityState === 'visible') {
            createCloud();
        }
    };

    // Initial cloud
    createCloud();
    
    // Create new clouds at random intervals between 5-15 seconds
    function scheduleNextCloud() {
        const randomDelay = 5000 + Math.random() * 10000;
        setTimeout(() => {
            createCloud();
            scheduleNextCloud();
        }, randomDelay);
    }
    
    scheduleNextCloud();

    // Add to existing visibility change handler
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            rainContainer.querySelectorAll('.cloud, .thunder').forEach(el => el.remove());
        }
    });

    // Clean up
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            rainContainer.innerHTML = '';
        }
    });

    // Add water effect
    const waterContainer = document.createElement('div');
    waterContainer.className = 'water-container';
    
    // Create all 4 waves
    for (let i = 1; i <= 4; i++) {
        const wave = document.createElement('div');
        wave.className = `wave wave${i}`;
        waterContainer.appendChild(wave);
    }
    
    summaryContainer.appendChild(waterContainer);

    // Add boat after water container
    const boat = document.createElement('img');
    boat.src = 'images/boat.png';
    boat.alt = 'Floating Boat';
    boat.className = 'boat';
    summaryContainer.appendChild(boat);

    // Add animation toggle button
    summaryContainer.classList.add('animations-disabled'); // Disable animations by default
    
    const animationToggle = document.createElement('button');
    animationToggle.className = 'animation-toggle disabled';
    animationToggle.innerHTML = '<i class="fa-solid fa-toggle-off"></i>';
    animationToggle.title = 'Toggle Animations';
    summaryContainer.appendChild(animationToggle);

    let animationsEnabled = false;

    function toggleAnimations() {
        animationsEnabled = !animationsEnabled;
        animationToggle.innerHTML = animationsEnabled ? 
            '<i class="fa-solid fa-toggle-on"></i>' : 
            '<i class="fa-solid fa-toggle-off"></i>';
        animationToggle.classList.toggle('disabled');
        summaryContainer.classList.toggle('animations-disabled');
        
        if (animationsEnabled) {
            // Start animations
            createCloud();
            scheduleNextCloud();
            rainInterval = setInterval(() => {
                if (document.visibilityState === 'visible') {
                    createRaindrop();
                }
            }, 100);
        } else {
            // Stop animations
            clearInterval(rainInterval);
            rainContainer.innerHTML = '';
        }
    }

    animationToggle.addEventListener('click', toggleAnimations);

    // Don't start animations automatically
    clearInterval(rainInterval);
    rainContainer.innerHTML = '';
});
