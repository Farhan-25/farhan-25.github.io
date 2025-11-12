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

    // Hide sidebar when on CTF writeups page
    if (targetPage === 'ctf writeups') {
        if (sidebar) sidebar.style.display = 'none';
    } else {
        if (sidebar) sidebar.style.display = '';
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

    // Ensure sidebar is visible by default (for about page)
    if (sidebar) sidebar.style.display = '';

    // Initialize CTF Writeups
    initCTFWriteups();
});

// CTF Writeups Functionality
const ctfData = {
    'PBCTF': {
        name: 'PBCTF',
        challenges: [
            {
                name: 'Web Injection',
                folder: 'web_injection',
                writeup: 'CTF-Writeups/PBCTF/web_injection/writeup.md',
                solves: 342
            },
            {
                name: 'Crypto Easy',
                folder: 'crypto_easy',
                writeup: 'CTF-Writeups/PBCTF/crypto_easy/writeup.md',
                solves: 567
            }
        ]
    },
    'R3CTF': {
        name: 'R3CTF',
        challenges: [
            {
                name: 'Web Challenge',
                folder: 'web_challenge',
                writeup: 'CTF-Writeups/R3CTF/web_challenge/writeup.md',
                solves: 89
            }
        ]
    },
    'HTB': {
        name: 'HTB',
        challenges: [
            {
                name: 'Forensics Basic',
                folder: 'forensics_basic',
                writeup: 'CTF-Writeups/HTB/forensics_basic/writeup.md',
                solves: 1234
            }
        ]
    }
};

let selectedCTF = null;
let selectedChallenge = null;

function initCTFWriteups() {
    const ctfList = document.getElementById('ctfList');
    const challengeList = document.getElementById('challengeList');
    
    if (!ctfList || !challengeList) return;

    // Populate CTF list
    Object.keys(ctfData).forEach(ctfKey => {
        const ctf = ctfData[ctfKey];
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.className = 'ctf-item';
        button.textContent = ctf.name;
        button.setAttribute('data-ctf', ctfKey);
        button.addEventListener('click', () => selectCTF(ctfKey));
        li.appendChild(button);
        ctfList.appendChild(li);
    });
}

function selectCTF(ctfKey) {
    selectedCTF = ctfKey;
    const ctf = ctfData[ctfKey];
    
    // Update active CTF
    document.querySelectorAll('.ctf-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-ctf="${ctfKey}"]`).classList.add('active');
    
    // Populate challenge list
    const challengeList = document.getElementById('challengeList');
    challengeList.innerHTML = '';
    
    if (ctf.challenges.length === 0) {
        const li = document.createElement('li');
        li.className = 'no-selection';
        li.textContent = 'No challenges available';
        challengeList.appendChild(li);
    } else {
        ctf.challenges.forEach((challenge, index) => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.className = 'challenge-item';
            button.setAttribute('data-challenge', index);
            button.addEventListener('click', () => selectChallenge(ctfKey, index));
            
            // Create challenge name span
            const nameSpan = document.createElement('span');
            nameSpan.className = 'challenge-name';
            nameSpan.textContent = challenge.name;
            
            // Create solve count badge
            const solveBadge = document.createElement('span');
            solveBadge.className = 'solve-count';
            solveBadge.textContent = challenge.solves || 0;
            solveBadge.setAttribute('title', `${challenge.solves || 0} solves`);
            
            button.appendChild(nameSpan);
            button.appendChild(solveBadge);
            li.appendChild(button);
            challengeList.appendChild(li);
        });
    }
    
    // Reset writeup display
    showPlaceholder();
}

function selectChallenge(ctfKey, challengeIndex) {
    selectedChallenge = challengeIndex;
    const ctf = ctfData[ctfKey];
    const challenge = ctf.challenges[challengeIndex];
    
    // Update active challenge
    document.querySelectorAll('.challenge-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-challenge="${challengeIndex}"]`).classList.add('active');
    
    // Load writeup
    loadWriteup(challenge.writeup);
}

function showPlaceholder() {
    const placeholder = document.getElementById('writeupPlaceholder');
    const display = document.getElementById('writeupDisplay');
    
    if (placeholder) placeholder.style.display = 'flex';
    if (display) display.style.display = 'none';
}

function loadWriteup(writeupPath) {
    const placeholder = document.getElementById('writeupPlaceholder');
    const display = document.getElementById('writeupDisplay');
    const writeupTitle = document.getElementById('writeupTitle');
    const writeupMeta = document.getElementById('writeupMeta');
    const writeupBody = document.getElementById('writeupBody');
    
    // Show loading state
    if (placeholder) placeholder.style.display = 'none';
    if (display) display.style.display = 'block';
    if (writeupBody) writeupBody.innerHTML = '<p>Loading writeup...</p>';
    
    // Fetch markdown file
    fetch(writeupPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load writeup');
            }
            return response.text();
        })
        .then(markdown => {
            // Parse markdown
            if (typeof marked !== 'undefined') {
                const html = marked.parse(markdown);
                
                // Extract title and metadata from markdown
                const titleMatch = markdown.match(/^#\s+(.+)$/m);
                const categoryMatch = markdown.match(/\*\*Category:\*\*\s+(.+)/);
                const difficultyMatch = markdown.match(/\*\*Difficulty:\*\*\s+(.+)/);
                const ctfMatch = markdown.match(/\*\*CTF:\*\*\s+(.+)/);
                
                // Set title
                if (writeupTitle && titleMatch) {
                    writeupTitle.textContent = titleMatch[1];
                }
                
                // Set metadata
                if (writeupMeta) {
                    writeupMeta.innerHTML = '';
                    
                    if (categoryMatch) {
                        const badge = document.createElement('span');
                        badge.className = 'meta-badge category';
                        badge.textContent = `Category: ${categoryMatch[1].trim()}`;
                        writeupMeta.appendChild(badge);
                    }
                    
                    if (difficultyMatch) {
                        const badge = document.createElement('span');
                        const difficulty = difficultyMatch[1].trim().toLowerCase();
                        badge.className = `meta-badge difficulty ${difficulty}`;
                        badge.textContent = `Difficulty: ${difficultyMatch[1].trim()}`;
                        writeupMeta.appendChild(badge);
                    }
                    
                    if (ctfMatch) {
                        const badge = document.createElement('span');
                        badge.className = 'meta-badge';
                        badge.textContent = `CTF: ${ctfMatch[1].trim()}`;
                        writeupMeta.appendChild(badge);
                    }
                }
                
                // Set body
                if (writeupBody) {
                    writeupBody.innerHTML = html;
                    // Add copy buttons to code blocks
                    addCopyButtonsToCodeBlocks(writeupBody);
                }
            } else {
                // Fallback if marked.js is not loaded
                if (writeupBody) {
                    writeupBody.innerHTML = '<p>Markdown parser not loaded. Please refresh the page.</p><pre>' + markdown + '</pre>';
                }
            }
        })
        .catch(error => {
            console.error('Error loading writeup:', error);
            if (writeupBody) {
                writeupBody.innerHTML = `<p style="color: var(--bittersweet-shimmer);">Error loading writeup: ${error.message}</p>`;
            }
        });
}

function addCopyButtonsToCodeBlocks(container) {
    // Find all pre code blocks
    const codeBlocks = container.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeElement, index) => {
        const preElement = codeElement.parentElement;
        
        // Skip if already has a copy button
        if (preElement.querySelector('.copy-code-btn')) {
            return;
        }
        
        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.setAttribute('aria-label', 'Copy code');
        copyBtn.innerHTML = '<ion-icon name="copy-outline"></ion-icon><span>Copy</span>';
        
        // Add click handler
        copyBtn.addEventListener('click', async () => {
            const codeText = codeElement.textContent || codeElement.innerText;
            
            try {
                await navigator.clipboard.writeText(codeText);
                
                // Update button to show success
                const originalHTML = copyBtn.innerHTML;
                copyBtn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon><span>Copied!</span>';
                copyBtn.classList.add('copied');
                
                // Reset after 2 seconds
                setTimeout(() => {
                    copyBtn.innerHTML = originalHTML;
                    copyBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = codeText;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    const originalHTML = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon><span>Copied!</span>';
                    copyBtn.classList.add('copied');
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = originalHTML;
                        copyBtn.classList.remove('copied');
                    }, 2000);
                } catch (fallbackErr) {
                    console.error('Failed to copy code:', fallbackErr);
                    copyBtn.innerHTML = '<ion-icon name="close-outline"></ion-icon><span>Failed</span>';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<ion-icon name="copy-outline"></ion-icon><span>Copy</span>';
                    }, 2000);
                }
                
                document.body.removeChild(textArea);
            }
        });
        
        // Add button to pre element
        preElement.style.position = 'relative';
        preElement.appendChild(copyBtn);
    });
}