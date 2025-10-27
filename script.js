'use strict';

// Element selections
const navLinks = document.querySelectorAll('[data-nav-link]');
const articles = document.querySelectorAll('[data-page]');
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');

// Navigation functionality
function handleNavClick() {
    const targetPage = this.getAttribute('data-nav-link');

    // Remove active class from all nav links
    navLinks.forEach(link => link.classList.remove('active'));

    // Add active class to clicked nav link
    this.classList.add('active');

    // Hide all articles
    articles.forEach(article => article.classList.remove('active'));

    // Show target article
    const targetArticle = document.querySelector(`[data-page="${targetPage}"]`);
    if (targetArticle) {
        targetArticle.classList.add('active');
    }
}

// Sidebar toggle functionality
function toggleSidebar() {
    sidebar.classList.toggle('active');
}

// Event listeners
navLinks.forEach(link => {
    link.addEventListener('click', handleNavClick);
});

if (sidebarBtn) {
    sidebarBtn.addEventListener('click', toggleSidebar);
}

// Certificate Modal Functionality
const viewCertBtns = document.querySelectorAll('[data-cert]');
const certModal = document.getElementById('certModal');
const certModalOverlay = document.getElementById('certModalOverlay');
const certModalClose = document.getElementById('certModalClose');
const certModalTitle = document.getElementById('certModalTitle');
const certPreview = document.getElementById('certPreview');

const certData = {
    'thm-pre-security': {
        title: 'TryHackMe Pre Security Certificate',
        src: 'THM-Pre Security.pdf'
    },
    'intro-cybersecurity': {
        title: 'Introduction to Cybersecurity Certificate',
        src: 'Introduction_to_Cybersecurity_certificate_farhansaiyed2511-gmail-com_c0f41631-fb38-4606-b26d-bdd98cd3c89a.pdf'
    }
};

function openCertModal(certKey) {
    const cert = certData[certKey];
    if (cert) {
        certModalTitle.textContent = cert.title;
        certPreview.src = cert.src;
        certModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeCertModal() {
    certModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Event listeners for certificate modal
viewCertBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const certKey = this.getAttribute('data-cert');
        openCertModal(certKey);
    });
});

if (certModalOverlay) {
    certModalOverlay.addEventListener('click', closeCertModal);
}

if (certModalClose) {
    certModalClose.addEventListener('click', closeCertModal);
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && certModal.classList.contains('active')) {
        closeCertModal();
    }
});

// Initialize - ensure About is active by default
document.addEventListener('DOMContentLoaded', function() {
    const aboutLink = document.querySelector('[data-nav-link="about"]');
    const aboutArticle = document.querySelector('[data-page="about"]');

    if (aboutLink && aboutArticle) {
        aboutLink.classList.add('active');
        aboutArticle.classList.add('active');
    }
});