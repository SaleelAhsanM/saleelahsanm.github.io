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
});
