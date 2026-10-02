const hapticElements = document.querySelectorAll('a, button, summary, input, select, textarea');
const inquiryForm = document.querySelector('.inquiry-form');
const formStatus = document.querySelector('.form-status');
const navSlogan = document.querySelector('.nav-slogan');
const serviceDetailSection = document.querySelector('#service-detail');
const scrollTopButton = document.querySelector('.scroll-top-button');
const scrollProgressRing = document.querySelector('.scroll-progress-value');
const scrollProgressCircumference = 2 * Math.PI * 28;
const slogans = [
    'Smart growth. Steady support.',
    'Thoughtful research. Clear decisions.',
    'Your Amazon store, in capable hands.',
    'From busy storefront to better business.'
];

let scrollProgressFrame = 0;

const updateScrollProgress = () => {
    scrollProgressFrame = 0;

    const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableDistance > 0
        ? Math.min(Math.max(window.scrollY / scrollableDistance, 0), 1)
        : 0;
    scrollProgressRing.style.strokeDashoffset = `${scrollProgressCircumference * (1 - progress)}`;

    const hasReachedThirdSection = serviceDetailSection.getBoundingClientRect().top < window.innerHeight;
    scrollTopButton.classList.toggle('is-visible', hasReachedThirdSection);
};

const scheduleScrollProgressUpdate = () => {
    if (!scrollProgressFrame) {
        scrollProgressFrame = window.requestAnimationFrame(updateScrollProgress);
    }
};

window.addEventListener('scroll', scheduleScrollProgressUpdate, { passive: true });
window.addEventListener('resize', scheduleScrollProgressUpdate);

scrollTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
});

scheduleScrollProgressUpdate();

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let sloganIndex = 0;
    window.setInterval(() => {
        navSlogan.parentElement.classList.add('is-changing');
        window.setTimeout(() => {
            sloganIndex = (sloganIndex + 1) % slogans.length;
            navSlogan.textContent = slogans[sloganIndex];
            navSlogan.parentElement.classList.remove('is-changing');
        }, 450);
    }, 4200);
}

hapticElements.forEach((element) => {
    element.addEventListener('click', () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(12);
        }
    });
});

inquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(inquiryForm);
    const subject = `Amazon support inquiry from ${formData.get('name')}`;
    const body = [
        `Name: ${formData.get('name')}`,
        `Email: ${formData.get('email')}`,
        `Phone / WhatsApp: ${formData.get('phone')}`,
        `Business type: ${formData.get('business_type')}`,
        `Service: ${formData.get('service')}`,
        `Preferred date: ${formData.get('date')}`,
        `Preferred time slot: ${formData.get('time_slot')}`,
        '',
        formData.get('message')
    ].join('\n');

    formStatus.textContent = 'Opening your email app...';
    window.location.href = `mailto:malik.usman.va@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
