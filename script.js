// Floating Pill Nav indicator position calculation & Section Observer
const navPill = document.getElementById('navPill');
const navIndicator = document.getElementById('navIndicator');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('section[id]');

function updateIndicator(targetEl) {
  if (!targetEl || !navIndicator || !navPill) return;
  const rect = targetEl.getBoundingClientRect();
  const pillRect = navPill.getBoundingClientRect();

  navIndicator.style.width = `${rect.width}px`;
  navIndicator.style.left = `${rect.left - pillRect.left}px`;
}

// Greeting follows the visitor's local browser time.
function updateTimeGreeting() {
  const greeting = document.getElementById('timeGreeting');
  if (!greeting) return;
  const hour = new Date().getHours();
  greeting.textContent = hour < 11 ? 'selamat pagi' : hour < 15 ? 'selamat siang' : hour < 18 ? 'selamat sore' : 'selamat malam';
}

// Initial positioning on load
window.addEventListener('load', () => {
  const activeNav = document.querySelector('.nav-item.active');
  if (activeNav) updateIndicator(activeNav);
  updateTimeGreeting();
});

// Click behavior on nav items
navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    updateIndicator(item);
  });
});

// Scrollspy with dark/light mode detection for navbar
const observerOptions = {
  root: null,
  rootMargin: '-30% 0px -50% 0px',
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const sectionId = entry.target.id;

      navItems.forEach(item => {
        if (item.getAttribute('data-nav') === sectionId) {
          navItems.forEach(n => n.classList.remove('active'));
          item.classList.add('active');
          updateIndicator(item);
        }
      });

      if (sectionId === 'portfolio' || sectionId === 'contact') {
        document.body.classList.add('in-light-section');
      } else {
        document.body.classList.remove('in-light-section');
      }
    }
  });
}, observerOptions);

sections.forEach(sec => sectionObserver.observe(sec));

// Portfolio Tab Switcher
function switchPortfolioTab(tabKey) {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-target') === tabKey);
  });

  panels.forEach(panel => {
    panel.classList.toggle('active', panel.id === `tab-${tabKey}`);
  });

  const portfolioEl = document.getElementById('portfolio');
  if (portfolioEl && window.scrollY < portfolioEl.offsetTop - 100) {
    portfolioEl.scrollIntoView({ behavior: 'smooth' });
  }
}

// Certificates Carousel Logic
const certTrack = document.getElementById('certTrack');
function nextCert() {
  if (!certTrack) return;
  certTrack.scrollBy({ left: certTrack.clientWidth, behavior: 'smooth' });
}

function prevCert() {
  if (!certTrack) return;
  certTrack.scrollBy({ left: -certTrack.clientWidth, behavior: 'smooth' });
}

// Comments Form & Persistence
function handleCommentSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('commentName');
  const bodyInput = document.getElementById('commentBody');
  const name = nameInput.value.trim();
  const text = bodyInput.value.trim();

  if (!name || !text) return;

  const container = document.getElementById('commentsContainer');
  if (container) {
    const newComment = document.createElement('div');
    newComment.className = 'comment-item';
    newComment.style.animation = 'fadeIn 0.4s ease';
    newComment.innerHTML = `
      <div class="comment-item-top">
        <span class="comment-author">${escapeHTML(name)}</span>
        <span class="comment-time">Baru saja</span>
      </div>
      <p class="comment-text">${escapeHTML(text)}</p>
    `;
    container.prepend(newComment);

    const items = container.querySelectorAll('.comment-item');
    const badge = document.getElementById('commentCountBadge');
    if (badge) badge.innerText = `${items.length} komentar`;
  }

  nameInput.value = '';
  bodyInput.value = '';
  showToast('Terima kasih! Komentar Anda berhasil dipublikasikan.');
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Copy Email Utility
function copyEmail() {
  const emailEl = document.getElementById('emailText');
  if (!emailEl) return;
  const email = emailEl.innerText;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(email)
      .then(() => showToast('Email disalin ke clipboard!'))
      .catch(() => showToast('Email: ' + email));
  } else {
    showToast('Email: ' + email);
  }
}

// Toast System
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  const text = document.getElementById('toastText');
  if (!toast || !text) return;
  text.innerText = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

window.addEventListener('resize', () => {
  const activeNav = document.querySelector('.nav-item.active');
  if (activeNav) updateIndicator(activeNav);
});

// Gallery lightbox
const galleryModal = document.getElementById('galleryModal');
const galleryModalImage = document.getElementById('galleryModalImage');
const galleryModalTitle = document.getElementById('galleryModalTitle');
const galleryModalDescription = document.getElementById('galleryModalDescription');

function openGallery(item) {
  const image = item.querySelector('img');
  if (!image || !galleryModal) return;
  galleryModalImage.src = image.src;
  galleryModalImage.alt = image.alt;
  galleryModalTitle.textContent = item.dataset.galleryTitle || '';
  galleryModalDescription.textContent = item.dataset.galleryDescription || '';
  galleryModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeGallery() {
  if (!galleryModal) return;
  galleryModal.hidden = true;
  document.body.style.overflow = '';
}

document.querySelectorAll('.gallery-item, .project-thumb:not([data-case-study])').forEach(item => {
  item.addEventListener('click', () => openGallery(item));
});

document.querySelectorAll('[data-close-gallery]').forEach(element => element.addEventListener('click', closeGallery));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeGallery();
});

// Anime / Spider-Man Interactive Hover & Hint (Smooth physics-based easing)
const profileBox = document.getElementById('profileBox');
const spidermanHint = document.getElementById('spidermanHint');

if (profileBox) {
  let targetX = 160;
  let targetY = 175;
  let currentX = 160;
  let currentY = 175;
  let isHovering = false;
  let animFrameId = null;

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function updatePhysics() {
    currentX = lerp(currentX, targetX, 0.12);
    currentY = lerp(currentY, targetY, 0.12);

    profileBox.style.setProperty('--mouse-x', `${currentX.toFixed(2)}px`);
    profileBox.style.setProperty('--mouse-y', `${currentY.toFixed(2)}px`);

    if (isHovering || Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
      animFrameId = requestAnimationFrame(updatePhysics);
    } else {
      animFrameId = null;
    }
  }

  function setTargetFromEvent(e) {
    const rect = profileBox.getBoundingClientRect();
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(updatePhysics);
    }
  }

  profileBox.addEventListener('mouseenter', (e) => {
    isHovering = true;
    profileBox.classList.add('is-hovering');
    setTargetFromEvent(e);
  });

  profileBox.addEventListener('mousemove', (e) => {
    setTargetFromEvent(e);
  });

  profileBox.addEventListener('mouseleave', () => {
    isHovering = false;
    profileBox.classList.remove('is-hovering');
    targetX = profileBox.offsetWidth / 2;
    targetY = profileBox.offsetHeight / 2;
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(updatePhysics);
    }
  });

  profileBox.addEventListener('click', (e) => {
    profileBox.classList.toggle('is-hovering');
    setTargetFromEvent(e);
  });

  if (spidermanHint) {
    let hintPlayed = false;
    const hintObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hintPlayed) {
          hintPlayed = true;
          spidermanHint.classList.add('animate-spiderman-hint');
          hintObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    hintObserver.observe(profileBox);
  }
}

// === CINEMATIC HERO PARALLAX & SUBTLE 3D DEPTH ===
(function initCinematicHero() {
  const hero = document.getElementById('home');
  const bgWord = document.getElementById('heroBgWord');
  const portrait = document.getElementById('heroPortraitWrap');
  const leftCopy = document.getElementById('heroLeftCopy');
  if (!hero || !bgWord || !portrait || !leftCopy) return;

  let mouseX = 0, mouseY = 0;

  window.addEventListener('pointermove', (e) => {
    if (window.innerWidth <= 680) return;
    mouseX = ((e.clientX / window.innerWidth) - 0.5) * 18;
    mouseY = ((e.clientY / window.innerHeight) - 0.5) * 12;
  }, { passive: true });

  function updateCinematicHero() {
    const rect = hero.getBoundingClientRect();
    const scrolled = Math.max(0, -rect.top);
    const isMobile = window.innerWidth <= 680;

    if (!isMobile && rect.bottom > 0) {
      bgWord.style.transform = `translate3d(${(-mouseX * 0.7).toFixed(1)}px, ${(scrolled * 0.28 - mouseY * 0.5).toFixed(1)}px, 0)`;
      portrait.style.transform = `translate3d(${(mouseX * 0.6).toFixed(1)}px, ${(scrolled * 0.14).toFixed(1)}px, 0) scale(${(1 + scrolled * 0.0001).toFixed(4)})`;
      leftCopy.style.transform = `translate3d(${(mouseX * 0.3).toFixed(1)}px, ${(-scrolled * 0.08).toFixed(1)}px, 0)`;
    } else {
      bgWord.style.transform = '';
      portrait.style.transform = '';
      leftCopy.style.transform = '';
    }
    requestAnimationFrame(updateCinematicHero);
  }

  requestAnimationFrame(updateCinematicHero);
})();

// === TYPING EFFECT BERGANTI-GANTI KATA DI HERO ===
(function initRoleTyping() {
  const roleEl = document.getElementById('typingRole');
  if (!roleEl) return;

  const roles = [
    'WEB DEVELOPER',
    'ML ENTHUSIAST',
    'AI ENGINEER',
    'DATA SCIENTIST'
  ];

  let roleIndex = 0;
  let charIndex = roles[0].length;
  let isDeleting = true;

  function typeLoop() {
    const currentWord = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
      roleEl.textContent = currentWord.substring(0, charIndex);
    } else {
      charIndex++;
      roleEl.textContent = currentWord.substring(0, charIndex);
    }

    let delay = isDeleting ? 55 : 105; // Kecepatan hapus lebih cepat dari ngetik

    if (!isDeleting && charIndex === currentWord.length) {
      delay = 1800; // Jeda baca saat kata selesai diketik
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 350; // Jeda singkat sebelum mulai kata baru
    }

    setTimeout(typeLoop, delay);
  }

  // Mulai animasi setelah jeda awal 1.8 detik
  setTimeout(typeLoop, 1800);
})();


// === PROJECT CASE STUDY MODAL ===
(function initCaseStudyModal() {
  const modal = document.getElementById('caseStudyModal');
  if (!modal) return;

  const caseStudies = {
    'onboarding-buddy': {
      badge: 'RAG AI AGENT · ENTERPRISE WORKFLOW',
      title: 'Onboarding Buddy System',
      subtitle: 'Asisten AI Berbasis Retrieval-Augmented Generation (RAG) untuk Orientasi Karyawan Baru',
      image: 'Cuplikan layar 2026-11-09 182944.png',
      problem:
        'Karyawan baru sering kewalahan mencari informasi SOP, kebijakan perusahaan, dan panduan teknis yang tersebar di banyak dokumen internal, sementara tim HR harus menjawab pertanyaan administratif yang berulang setiap kali ada rekrutmen baru.',
      flow: [
        {
          step: '1. Ingestion & Chunking',
          desc: 'Komponen Read File dan Split Text di IBM Langflow mengekstrak dokumen SOP internal menjadi potongan teks terstruktur.'
        },
        {
          step: '2. Vector Indexing (Astra DB)',
          desc: 'Potongan teks diubah menjadi embedding vektor dan disimpan ke DataStax Astra DB untuk pencarian semantik berkecepatan tinggi.'
        },
        {
          step: '3. Context Retrieval & Prompting',
          desc: 'Saat karyawan bertanya, sistem mengambil konteks paling relevan dari Astra DB dan menyusunnya melalui Prompt Template.'
        },
        {
          step: '4. LLM Reasoning & Parsing',
          desc: 'Gemini 3.6 Flash merumuskan jawaban yang akurat sesuai SOP, lalu Parser merapikan format output sebelum ditampilkan ke pengguna.'
        }
      ],
      stack: [
        'IBM Langflow',
        'DataStax Astra DB (Vector Store)',
        'Gemini 3.6 Flash',
        'RAG Architecture',
        'Prompt Engineering',
        'Document Parser'
      ]
    }
  };

  function openCaseStudy(key) {
    const data = caseStudies[key];
    if (!data) return;

    document.getElementById('caseModalImg').src = data.image;
    document.getElementById('caseModalImg').alt = data.title;
    document.getElementById('caseModalBadge').textContent = data.badge;
    document.getElementById('caseModalTitle').textContent = data.title;
    document.getElementById('caseModalSubtitle').textContent = data.subtitle;
    document.getElementById('caseModalProblem').textContent = data.problem;

    const flowContainer = document.getElementById('caseModalFlow');
    flowContainer.innerHTML = data.flow
      .map(item => `<div class="case-flow-step"><strong>${item.step}</strong><span>${item.desc}</span></div>`)
      .join('');

    const stackContainer = document.getElementById('caseModalStack');
    stackContainer.innerHTML = data.stack
      .map(tech => `<span>${tech}</span>`)
      .join('');

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeCaseStudy() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-case-study]').forEach(btn => {
    btn.addEventListener('click', () => openCaseStudy(btn.getAttribute('data-case-study')));
  });

  document.querySelectorAll('[data-close-case]').forEach(el => {
    el.addEventListener('click', closeCaseStudy);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeCaseStudy();
  });
})();

// === INTERACTIVE TECH STACK EXPLANATION DRAWER ===
(function initTechStackDrawer() {
  const drawer = document.getElementById('techDetailDrawer');
  const nameEl = document.getElementById('techDetailName');
  const catEl = document.getElementById('techDetailCategory');
  const descEl = document.getElementById('techDetailDesc');
  const closeBtn = document.getElementById('techDetailClose');
  const pills = document.querySelectorAll('.tech-pill');

  if (!drawer || !pills.length) return;

  const techInfo = {
    'Python': {
      category: 'CORE PROGRAMMING & AI',
      desc: 'Bahasa pemrograman utama untuk pengolahan data, pemodelan Machine Learning, serta pembuatan skrip otomasi dan backend layanan AI.'
    },
    'Gemini AI': {
      category: 'LARGE LANGUAGE MODEL',
      desc: 'Model AI generatif multimodal dari Google yang saya integrasikan untuk penalaran konteks, analisis dokumen, dan generasi jawaban cerdas pada aplikasi AI Agent.'
    },
    'IBM Langflow': {
      category: 'AI WORKFLOW ORCHESTRATION',
      desc: 'Framework visual untuk merancang alur kerja LLM dan pipeline RAG (Retrieval-Augmented Generation), mulai dari pembacaan dokumen hingga integrasi vektor database.'
    },
    'Astra DB': {
      category: 'VECTOR DATABASE',
      desc: 'Database cloud berbasis Apache Cassandra dengan dukungan pencarian vektor berkecepatan tinggi untuk menyimpan embedding pengetahuan sistem AI.'
    },
    'Machine Learning': {
      category: 'PREDICTIVE MODELING & DATA',
      desc: 'Pendekatan algoritma pembelajaran mesin untuk mengenali pola dari dataset, melakukan klasifikasi, dan membangun sistem berbasis data yang adaptif.'
    },
    'AWS Cloud': {
      category: 'CLOUD INFRASTRUCTURE',
      desc: 'Layanan komputasi awan Amazon Web Services untuk deployment aplikasi, manajemen infrastruktur cloud, dan dukungan fondasi Generative AI.'
    },
    'JavaScript': {
      category: 'INTERACTIVE WEB DEVELOPMENT',
      desc: 'Bahasa pemrograman web modern untuk membangun antarmuka interaktif, manipulasi DOM dinamis, animasi halus, dan komunikasi API asinkron.'
    },
    'HTML5': {
      category: 'WEB STRUCTURE & SEMANTICS',
      desc: 'Fondasi struktur halaman web modern yang semantik, aksesibel, dan teroptimasi untuk berbagai ukuran perangkat.'
    },
    'CSS3': {
      category: 'UI STYLING & MOTION',
      desc: 'Styling tingkat lanjut untuk tata letak responsif (Grid/Flexbox), efek glassmorphism, serta animasi antarmuka berbasis akselerasi GPU.'
    },
    'Git & GitHub': {
      category: 'VERSION CONTROL & COLLABORATION',
      desc: 'Sistem kontrol versi untuk melacak riwayat perubahan kode sumber, manajemen branch, dan kolaborasi pengembangan perangkat lunak.'
    }
  };

  let activeTech = null;

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const label = pill.querySelector('span')?.textContent.trim();
      const info = techInfo[label];
      if (!info) return;

      // Jika mengklik teknologi yang sama, tutup panelnya
      if (activeTech === label && !drawer.hidden) {
        drawer.hidden = true;
        activeTech = null;
        pills.forEach(p => p.classList.remove('is-active'));
        return;
      }

      activeTech = label;
      nameEl.textContent = label;
      catEl.textContent = info.category;
      descEl.textContent = info.desc;

      pills.forEach(p => {
        const pName = p.querySelector('span')?.textContent.trim();
        p.classList.toggle('is-active', pName === label);
      });

      drawer.hidden = false;
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      drawer.hidden = true;
      activeTech = null;
      pills.forEach(p => p.classList.remove('is-active'));
    });
  }
})();

// === FULL-PAGE LUXURY SCROLL REVEAL (SEMUA ISI HALAMAN BERANIMASI SAAT DI-SCROLL) ===
(function initFullPageScrollMotion() {
  const navWrapper = document.getElementById('mainNav');

  // 1. Garis progres scroll di paling atas layar
  let progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);
  }

  // 2. Smart Navbar & Scroll Progress
  let lastScrollY = window.scrollY;
  let ticking = false;

  function onScrollUpdate() {
    const currentScrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;

    if (navWrapper) {
      navWrapper.classList.toggle('is-scrolled', currentScrollY > 60);
      if (currentScrollY > 320 && currentScrollY > lastScrollY + 8) {
        navWrapper.classList.add('is-hidden');
      } else if (currentScrollY < lastScrollY - 6 || currentScrollY <= 320) {
        navWrapper.classList.remove('is-hidden');
      }
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScrollUpdate);
      ticking = true;
    }
  }, { passive: true });

  // 3. Smooth Scroll saat klik link menu
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        if (navWrapper) navWrapper.classList.remove('is-hidden');
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 4. Daftarkan SEMUA isi halaman untuk beranimasi mewah saat di-scroll
  const motionGroups = [
    {
      selectors: ['.about-col-left', '.music-info', '.contact-layout > .contact-panel:first-child'],
      variant: 'motion-from-left'
    },
    {
      selectors: ['.about-col-right', '.music-player-wrap', '.contact-layout > .contact-panel:last-child'],
      variant: 'motion-from-right'
    },
    {
      selectors: ['.profile-card-wrapper', '.tech-marquee-section', '.section-header-light', '.portfolio-tabs'],
      variant: 'motion-zoom-in'
    },
    {
      selectors: [
        '.timeline-section-title',
        '.timeline-item',
        '.folder-card',
        '.project-card',
        '.cert-card',
        '.award-card',
        '.gallery-item',
        '.social-card',
        '.comment-item',
        '.site-footer'
      ],
      variant: 'motion-fade-up'
    }
  ];

  const allTargets = [];

  motionGroups.forEach(({ selectors, variant }) => {
    const query = selectors.join(', ');
    document.querySelectorAll(query).forEach((el) => {
      el.classList.add('scroll-fx', variant);
      const parent = el.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(c => c.matches(query));
        const idx = siblings.indexOf(el);
        if (idx > 0) {
          el.style.setProperty('--fx-delay', `${Math.min(idx * 100, 400)}ms`);
        }
      }
      allTargets.push(el);
    });
  });

  // 5. Observer Dua Arah: Muncul mewah saat masuk layar, reset saat keluar layar
  const fxObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -60px 0px'
  });

  allTargets.forEach((el) => fxObserver.observe(el));

  // 6. Picu ulang animasi kartu saat ganti tab (Projects / Certificates)
  document.querySelectorAll('.tab-btn, .folder-card').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      requestAnimationFrame(() => {
        const activeCards = document.querySelectorAll('.tab-panel.active .scroll-fx');
        activeCards.forEach((card, i) => {
          card.classList.remove('is-visible');
          card.style.setProperty('--fx-delay', `${Math.min(i * 95, 380)}ms`);
          void card.offsetWidth;
          card.classList.add('is-visible');
        });
      });
    });
  });
})();