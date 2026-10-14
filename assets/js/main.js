const hapticElements = document.querySelectorAll('a, button, summary, input, select, textarea');
const inquiryForm = document.querySelector('.inquiry-form');
const formStatus = document.querySelector('.form-status');
const navSlogan = document.querySelector('.nav-slogan');
const profileFrame = document.querySelector('.profile-frame');
const profileImages = [...profileFrame.querySelectorAll('.profile-img')];
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
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const heroImageHold = 4500;
const heroTransitionDuration = prefersReducedMotion ? 220 : 680;

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

if (!prefersReducedMotion) {
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

const loadHeroImages = async () => {
    const profileWrapper = document.querySelector('.profile-wrapper');
    const manifestController = new AbortController();
    let disposed = false;
    let holdTimer = 0;
    let transitionTimer = 0;
    let holdStartedAt = 0;
    let transitionStartedAt = 0;
    let remainingHold = heroImageHold;
    let remainingTransition = heroTransitionDuration;
    let waitingForNextImage = false;
    let preparingTransition = false;
    let isTransitioning = false;
    let isHovered = false;
    let activeImage = profileImages.find((image) => image.classList.contains('is-active'));
    let nextImage;
    let imagePaths = [];
    let currentIndex = -1;
    let preparedNext = null;
    let preparedNextPromise;

    const clearHoldTimer = () => {
        if (holdTimer) {
            window.clearTimeout(holdTimer);
            holdTimer = 0;
        }
    };

    const clearTransitionTimer = () => {
        if (transitionTimer) {
            window.clearTimeout(transitionTimer);
            transitionTimer = 0;
        }
    };

    const cleanup = () => {
        disposed = true;
        manifestController.abort();
        clearHoldTimer();
        clearTransitionTimer();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('pagehide', cleanup);
        if (profileWrapper) {
            profileWrapper.removeEventListener('pointerenter', handlePointerEnter);
            profileWrapper.removeEventListener('pointerleave', handlePointerLeave);
        }
        profileFrame.classList.remove('is-transitioning', 'is-paused');
        profileImages.forEach((image) => image.classList.remove('is-incoming', 'is-outgoing'));
    };

    const findNextDecodedImage = async () => {
        for (let offset = 1; offset < imagePaths.length; offset += 1) {
            if (disposed) {
                return null;
            }

            const index = (currentIndex + offset) % imagePaths.length;
            const path = imagePaths[index];
            const image = new Image();
            image.src = path;

            try {
                await image.decode();
                return { index, path };
            } catch (error) {
                console.error(`Unable to decode hero image "${path}"; skipping it.`, error);
            }
        }

        return null;
    };

    const prepareNextImage = () => {
        preparedNext = null;
        preparedNextPromise = findNextDecodedImage().then((candidate) => {
            preparedNext = candidate;
            return candidate;
        });
    };

    const scheduleHold = (delay = heroImageHold) => {
        clearHoldTimer();
        remainingHold = delay;

        if (disposed || document.hidden || isHovered || imagePaths.length < 2) {
            return;
        }

        holdStartedAt = performance.now();
        holdTimer = window.setTimeout(() => {
            holdTimer = 0;
            remainingHold = 0;
            waitingForNextImage = true;
            startPreparedTransition();
        }, delay);
    };

    const finishTransition = () => {
        clearTransitionTimer();
        if (disposed || !isTransitioning) {
            return;
        }

        const outgoingImage = activeImage;
        activeImage = nextImage;
        activeImage.classList.remove('is-incoming');
        activeImage.classList.add('is-active');
        activeImage.removeAttribute('aria-hidden');
        activeImage.alt = 'Malik M. Usman';
        outgoingImage.classList.remove('is-active', 'is-outgoing');
        outgoingImage.alt = '';
        outgoingImage.setAttribute('aria-hidden', 'true');
        profileFrame.classList.remove('is-transitioning');
        if (isHovered) {
            profileFrame.classList.add('is-paused');
        } else {
            profileFrame.classList.remove('is-paused');
        }
        isTransitioning = false;
        currentIndex = preparedNext.index;
        remainingTransition = heroTransitionDuration;
        waitingForNextImage = false;
        prepareNextImage();
        if (!isHovered) {
            scheduleHold();
        }
    };

    const scheduleTransitionFinish = (delay = heroTransitionDuration) => {
        clearTransitionTimer();

        if (disposed || document.hidden || !isTransitioning) {
            return;
        }

        remainingTransition = delay;
        transitionStartedAt = performance.now();
        transitionTimer = window.setTimeout(finishTransition, delay);
    };

    const beginTransition = (candidate) => {
        if (disposed || document.hidden || isTransitioning || !candidate) {
            return;
        }

        nextImage = profileImages.find((image) => image !== activeImage);
        nextImage.src = candidate.path;
        nextImage.alt = '';
        nextImage.setAttribute('aria-hidden', 'true');
        nextImage.classList.add('is-incoming');
        activeImage.classList.add('is-outgoing');
        profileFrame.classList.add('is-transitioning');
        isTransitioning = true;
        waitingForNextImage = false;
        scheduleTransitionFinish();
    };

    const startPreparedTransition = async () => {
        if (preparingTransition) {
            return;
        }

        preparingTransition = true;
        try {
            const candidate = preparedNext || await preparedNextPromise;
            if (disposed) {
                return;
            }

            if (!candidate) {
                waitingForNextImage = false;
                prepareNextImage();
                if (!isHovered) {
                    scheduleHold();
                }
                return;
            }

            if (!document.hidden) {
                beginTransition(candidate);
            }
        } finally {
            preparingTransition = false;
        }
    };

    const handlePointerEnter = () => {
        if (isHovered || disposed) {
            return;
        }

        isHovered = true;
        profileFrame.classList.add('is-paused');
        if (holdTimer) {
            remainingHold = Math.max(0, remainingHold - (performance.now() - holdStartedAt));
            clearHoldTimer();
        }
    };

    const handlePointerLeave = () => {
        if (!isHovered || disposed) {
            return;
        }

        isHovered = false;
        if (!document.hidden) {
            profileFrame.classList.remove('is-paused');
            if (!isTransitioning) {
                if (waitingForNextImage) {
                    startPreparedTransition();
                } else {
                    scheduleHold(remainingHold);
                }
            }
        }
    };

    const handleVisibilityChange = () => {
        if (document.hidden) {
            profileFrame.classList.add('is-paused');

            if (holdTimer) {
                remainingHold = Math.max(0, remainingHold - (performance.now() - holdStartedAt));
                clearHoldTimer();
            }

            if (transitionTimer) {
                remainingTransition = Math.max(0, remainingTransition - (performance.now() - transitionStartedAt));
                clearTransitionTimer();
            }

            return;
        }

        if (!isHovered) {
            profileFrame.classList.remove('is-paused');
        }

        if (isTransitioning) {
            scheduleTransitionFinish(remainingTransition);
        } else if (waitingForNextImage) {
            if (!isHovered) {
                startPreparedTransition();
            }
        } else if (!isHovered) {
            scheduleHold(remainingHold);
        }
    };

    if (profileWrapper) {
        profileWrapper.addEventListener('pointerenter', handlePointerEnter);
        profileWrapper.addEventListener('pointerleave', handlePointerLeave);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', cleanup);

    try {
        const response = await fetch('./assets/images/hero/manifest.json', { signal: manifestController.signal });
        if (!response.ok) {
            throw new Error(`Image manifest request failed with status ${response.status}.`);
        }

        const manifest = await response.json();
        if (disposed) {
            return;
        }
        if (!Array.isArray(manifest.images) || !manifest.images.every((image) => typeof image === 'string')) {
            throw new Error('Image manifest must contain an images array of file paths.');
        }

        imagePaths = [...new Set(manifest.images)];
        const currentPath = new URL(activeImage.src).pathname;
        currentIndex = imagePaths.findIndex((imagePath) => new URL(imagePath, document.baseURI).pathname === currentPath);

        if (currentIndex === -1) {
            imagePaths.unshift(activeImage.src);
            currentIndex = 0;
        }

        if (imagePaths.length >= 2 && profileImages.length === 2) {
            prepareNextImage();
            scheduleHold();
        }
    } catch (error) {
        cleanup();
        if (error.name !== 'AbortError') {
            console.error('Unable to initialize the hero image cycle.', error);
        }
    }
};

loadHeroImages();

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
