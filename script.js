/**
 * NEXUS LANDING PAGE — JAVASCRIPT
 * სუფთა, მოდულური და სწრაფი სკრიპტი ინტერაქტიულობისთვის
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initActiveNavLink();
  initContactForm();
  initCurrentYear();
  initScrollAnimations();
});

/**
 * 1. ჰედერისა და ნავიგაციის სქროლის ეფექტი
 */
function initNavbar() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 2. მობილური მენიუს გახსნა/დახურვა
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta-mobile a');

  if (!menuToggle || !navMenu) return;

  const toggleMenu = (forceState) => {
    const isOpen = typeof forceState === 'boolean' 
      ? forceState 
      : !navMenu.classList.contains('open');

    navMenu.classList.toggle('open', isOpen);
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));

    // მობილურზე სქროლის შეზღუდვა როცა მენიუ ღიაა
    if (window.innerWidth <= 768) {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  };

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // ნავიგაციის ბმულზე დაკლიკებისას მენიუს დახურვა
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  });

  // მენიუს გარეთ დაკლიკებისას დახურვა
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Escape კლავიშზე დაჭერისას დახურვა
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  // ეკრანის ზომის შეცვლისას მენიუს განულება
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/**
 * 3. აქტიური სექციის ინდიკატორი ნავიგაციაში სქროლისას
 */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-25% 0px -65% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));
}

/**
 * 4. საკონტაქტო ფორმის ვალიდაცია და გაგზავნის სიმულაცია
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('contact-submit-btn');
  const statusBox = document.getElementById('form-status');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  if (!form || !nameInput || !emailInput || !messageInput || !submitBtn) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ველის ვალიდაციის ფუნქციები
  const validateName = () => {
    const val = nameInput.value.trim();
    const isValid = val.length >= 2;
    setInputState(nameInput, nameError, isValid);
    return isValid;
  };

  const validateEmail = () => {
    const val = emailInput.value.trim();
    const isValid = emailRegex.test(val);
    setInputState(emailInput, emailError, isValid);
    return isValid;
  };

  const validateMessage = () => {
    const val = messageInput.value.trim();
    const isValid = val.length >= 10;
    setInputState(messageInput, messageError, isValid);
    return isValid;
  };

  const setInputState = (input, errorElem, isValid) => {
    if (!isValid) {
      input.classList.add('is-invalid');
      if (errorElem) errorElem.classList.add('visible');
    } else {
      input.classList.remove('is-invalid');
      if (errorElem) errorElem.classList.remove('visible');
    }
  };

  // ცოცხალი ვალიდაცია შეყვანისას
  nameInput.addEventListener('input', () => {
    if (nameInput.classList.contains('is-invalid')) validateName();
  });
  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('is-invalid')) validateEmail();
  });
  messageInput.addEventListener('input', () => {
    if (messageInput.classList.contains('is-invalid')) validateMessage();
  });

  // ფორმის გაგზავნა
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      // ფოკუსი პირველ შეცდომიან ველზე
      if (!isNameValid) nameInput.focus();
      else if (!isEmailValid) emailInput.focus();
      else messageInput.focus();
      return;
    }

    // ფორმის გაგზავნის დაწყება - ჩატვირთვის რეჟიმი
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    nameInput.disabled = true;
    emailInput.disabled = true;
    messageInput.disabled = true;

    if (statusBox) {
      statusBox.className = 'form-status-box';
      statusBox.textContent = '';
    }

    // სერვერთან კომუნიკაციის სიმულაცია (1.2 წამი)
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      nameInput.disabled = false;
      emailInput.disabled = false;
      messageInput.disabled = false;

      // ფორმის გასუფთავება
      form.reset();
      nameInput.classList.remove('is-invalid');
      emailInput.classList.remove('is-invalid');
      messageInput.classList.remove('is-invalid');

      // წარმატების შეტყობინება ფორმაში
      if (statusBox) {
        statusBox.className = 'form-status-box success';
        statusBox.textContent = 'გმადლობთ! თქვენი შეტყობინება წარმატებით გაიგზავნა. ჩვენი გუნდი მალე დაგიკავშირდებათ.';
      }

      // მცურავი Toast შეტყობინების გამოტანა
      showToast('შეტყობინება წარმატებით გაიგზავნა!');

      // სტატუსის დამალვა 6 წამის შემდეგ
      setTimeout(() => {
        if (statusBox) {
          statusBox.className = 'form-status-box';
          statusBox.textContent = '';
        }
      }, 6000);
    }, 1200);
  });
}

/**
 * 5. Toast შეტყობინების მართვა
 */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  if (!toast) return;

  if (toastMsg && message) {
    toastMsg.textContent = message;
  }

  clearTimeout(toastTimeout);
  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/**
 * 6. მიმდინარე წლის დინამიური განახლება
 */
function initCurrentYear() {
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}

/**
 * 7. შემოსვლის გლუვი ანიმაციები სქროლისას (Intersection Observer)
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.feature-card, .highlight-item, .visual-card-wrapper, .contact-item');

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}
