// ===== MENÚ MÓVIL =====
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.querySelector('.nav-links');

// Abrir / cerrar con el botón ☰
menuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = navLinks.classList.toggle('active');
  menuBtn.textContent = isOpen ? '✕' : '☰';
});

// 🖱️ Cerrar al hacer clic fuera del menú
document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('active') &&
    !navLinks.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {
    navLinks.classList.remove('active');
    menuBtn.textContent = '☰';
  }
});

// 📜 Cerrar al hacer scroll
window.addEventListener('scroll', () => {
  if (navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
    menuBtn.textContent = '☰';
  }
}, { passive: true });

// 🔗 Cerrar al hacer clic en un enlace del menú
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuBtn.textContent = '☰';
  });
});

// ===== FORMULARIO DE CONTACTO → GOOGLE FORMS =====
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe839pzfRotv0wWstDyQDJcyjU4rNx_u40VUjQYxS7S94QYag/formResponse';
const ENTRY_NOMBRE = 'entry.584823438';
const ENTRY_EMAIL = 'entry.1655897389';
const ENTRY_ASUNTO = 'entry.901875294';
const ENTRY_MENSAJE = 'entry.1853561981';

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // 🛡️ ANTI-SPAM: si el honeypot está lleno, es un bot
  const honeypot = document.getElementById('website');
  if (honeypot && honeypot.value) {
    console.warn('🤖 Bot detectado por honeypot');
    // Fingimos éxito para engañar al bot
    formMessage.classList.add('visible');
    contactForm.reset();
    setTimeout(() => formMessage.classList.remove('visible'), 6000);
    return;
  }

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const asunto = document.getElementById('asunto').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  if (!nombre || !email || !asunto || !mensaje) {
    alert('⚠️ Por favor, completa todos los campos.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('⚠️ Por favor, ingresa un correo válido.');
    return;
  }

  const formData = new FormData();
  formData.append(ENTRY_NOMBRE, nombre);
  formData.append(ENTRY_EMAIL, email);
  formData.append(ENTRY_ASUNTO, asunto);
  formData.append(ENTRY_MENSAJE, mensaje);

  const btn = contactForm.querySelector('button[type="submit"]');
  const textoOriginal = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  fetch(GOOGLE_FORM_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: formData
  })
    .then(() => {
      // 🎯 MENSAJE ELEGANTE en vez de alert
      formMessage.classList.add('visible');
      contactForm.reset();
      setTimeout(() => formMessage.classList.remove('visible'), 6000);
    })
    .catch(err => {
      console.error('Error:', err);
      alert('⚠️ Hubo un problema. Intenta de nuevo.');
    })
    .finally(() => {
      btn.disabled = false;
      btn.textContent = textoOriginal;
    });
});

// Ocultar mensaje de éxito al empezar a escribir de nuevo
['nombre', 'email', 'asunto', 'mensaje'].forEach(id => {
  const input = document.getElementById(id);
  if (input && formMessage) {
    input.addEventListener('input', () => {
      formMessage.classList.remove('visible');
    });
  }
});

// ===== ANIMACIONES AL HACER SCROLL =====
const revealElements = document.querySelectorAll('.service-card, .project-card, .testimonial-card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {
  threshold: 0.1
});

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'all 0.6s ease';
  observer.observe(el);
});

// ===== CLIC EN ENLACES DE PROYECTOS =====
document.querySelectorAll('.project-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href === '') {
      e.preventDefault();
      alert('🚀 Este proyecto está en desarrollo. ¡Contáctame para ver la demo!');
    }
  });
});