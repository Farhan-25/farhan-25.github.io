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


    if (targetPage === 'writeups' || targetPage === 'codeforces') {
        if (sidebar) sidebar.style.display = 'none';
    } else {
        if (sidebar) sidebar.style.display = '';
    }

    if (targetPage === 'codeforces') {
        const hash = window.location.hash.substring(1);
        if (hash === 'codeforces' || hash.startsWith('codeforces/')) {
            setTimeout(async () => {
                await handleCodeforcesRoute();
            }, 100);
        } else {
            setTimeout(async () => {
                await initCodeforces();
                await showCodeforcesIndex();
            }, 100);
        }
    }


    if (targetPage === 'writeups') {

    } else {

        if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname);
        }
    }
}


function handleHashRoute() {
    const hash = window.location.hash.substring(1);


    if (!hash || (hash !== 'writeups' && !hash.startsWith('writeups/') && hash !== 'codeforces' && !hash.startsWith('codeforces/'))) {

        return;
    }


    if (hash === 'codeforces' || hash.startsWith('codeforces/')) {
        const codeforcesLink = Array.from(navLinks).find(link =>
            link.getAttribute('data-nav-link') === 'codeforces'
        );
        if (codeforcesLink && !codeforcesLink.classList.contains('active')) {
            codeforcesLink.click();
        }
        setTimeout(() => {
            handleCodeforcesRoute();
        }, 100);
        return;
    }


    const writeupsLink = Array.from(navLinks).find(link =>
        link.getAttribute('data-nav-link') === 'writeups'
    );
    if (writeupsLink && !writeupsLink.classList.contains('active')) {
        writeupsLink.click();
    }


    if (hash === 'writeups') {
        setTimeout(() => {
            showWriteupsIndex();
        }, 100);
        return;
    }


    if (hash.startsWith('writeups/')) {
        const parts = hash.split('/');
        if (parts.length >= 2) {
            const writeupKey = parts[1];
            const challengePath = parts.slice(2).join('/');


            if (Object.keys(allWriteupsData).length === 0) {
                setTimeout(() => {
                    if (allWriteupsData[writeupKey]) {
                        showWriteupsView(writeupKey, challengePath);
                    } else {
                        setTimeout(() => {
                            showWriteupsView(writeupKey, challengePath);
                        }, 500);
                    }
                }, 200);
            } else {
                setTimeout(() => {
                    showWriteupsView(writeupKey, challengePath);
                }, 100);
            }
        }
    }
}


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
    'thm-cybersecurity-101': {
        title: 'TryHackMe Cyber Security 101',
        src: 'Cyber Security 101.pdf'
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
    btn.addEventListener('click', function () {
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
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && certModal.classList.contains('active')) {
        closeCertModal();
    }
});

// Initialize - ensure About is active by default
document.addEventListener('DOMContentLoaded', function () {
    const aboutLink = document.querySelector('[data-nav-link="about"]');
    const aboutArticle = document.querySelector('[data-page="about"]');

    if (aboutLink && aboutArticle) {
        aboutLink.classList.add('active');
        aboutArticle.classList.add('active');
    }


    if (sidebar) sidebar.style.display = '';


    initWriteups();
    initCodeforces();


    const initialHash = window.location.hash.substring(1);
    if (initialHash === 'writeups' || initialHash.startsWith('writeups/') || initialHash === 'codeforces' || initialHash.startsWith('codeforces/')) {
        handleHashRoute();
    }
});


window.addEventListener('hashchange', function () {
    const hash = window.location.hash.substring(1);

    if (hash === 'writeups' || hash.startsWith('writeups/') || hash === 'codeforces' || hash.startsWith('codeforces/')) {
        handleHashRoute();
    }

});



const ctfConfig = {
    'Platypwn 2025': {
        name: 'Platypwn 2025',
        readme: 'CTF-Writeups/Platypwn 2025/README.md',
        type: 'ctf'
    }
};


const aocConfig = {
    'AoC2025': {
        name: 'Advent of Cyber 2025',
        readme: 'CTF-Writeups/AoC2025/README.md',
        type: 'aoc'
    }
};


let ctfData = {};

let selectedCTF = null;
let selectedChallenge = null;


function parseChallengesFromReadme(readmeContent, ctfKey) {
    const challenges = [];
    const lines = readmeContent.split('\n');


    const challengePattern = /^-\s+\[(.+?)\]\(\.\/(.+?)\/writeup\.md\)/;

    for (const line of lines) {
        const match = line.match(challengePattern);
        if (match) {
            const challengeName = match[1].trim();
            const folder = match[2].trim();
            const writeupPath = `CTF-Writeups/${ctfKey}/${folder}/writeup.md`;

            challenges.push({
                name: challengeName,
                folder: folder,
                writeup: writeupPath,
                solves: 0
            });
        }
    }

    return challenges;
}

function processImagesAndCaptions(container) {

    const images = container.querySelectorAll('img');

    images.forEach(img => {

        const imgParagraph = img.closest('p');
        if (!imgParagraph) return;


        let nextSibling = imgParagraph.nextElementSibling;


        while (nextSibling) {
            if (nextSibling.tagName === 'P') {
                const emElement = nextSibling.querySelector('em');
                if (emElement) {

                    const emText = emElement.textContent.trim();
                    if (emText.toLowerCase().includes('caption:')) {

                        emElement.classList.add('image-caption');

                        nextSibling.classList.add('image-caption-wrapper');
                        break;
                    }
                }
            }

            if (nextSibling.tagName && ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'PRE', 'UL', 'OL'].includes(nextSibling.tagName)) {
                break;
            }
            nextSibling = nextSibling.nextElementSibling;
        }
    });
}

function addCopyButtonsToCodeBlocks(container) {

    const codeBlocks = container.querySelectorAll('pre code');

    codeBlocks.forEach((codeElement, index) => {
        const preElement = codeElement.parentElement;


        if (preElement.querySelector('.copy-code-btn')) {
            return;
        }


        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.setAttribute('aria-label', 'Copy code');
        copyBtn.innerHTML = '<ion-icon name="copy-outline"></ion-icon><span>Copy</span>';


        copyBtn.addEventListener('click', async () => {
            const codeText = codeElement.textContent || codeElement.innerText;

            try {
                await navigator.clipboard.writeText(codeText);


                const originalHTML = copyBtn.innerHTML;
                copyBtn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon><span>Copied!</span>';
                copyBtn.classList.add('copied');


                setTimeout(() => {
                    copyBtn.innerHTML = originalHTML;
                    copyBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {

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


        preElement.style.position = 'relative';
        preElement.appendChild(copyBtn);
    });
}

let codeforcesSolutions = {};

let allCodeforcesSolutions = [];
let filteredSolutions = [];

async function loadCodeforcesSolutions() {
    if (Object.keys(codeforcesSolutions).length > 0) {
        return codeforcesSolutions;
    }

    try {
        const response = await fetch('Codeforces/solutions.json');
        if (!response.ok) {
            throw new Error('Failed to load solutions');
        }
        codeforcesSolutions = await response.json();
        return codeforcesSolutions;
    } catch (error) {
        console.error('Error loading Codeforces solutions:', error);
        return {};
    }
}

function getCodeforcesSolutions() {
    return Object.keys(codeforcesSolutions).map(name => ({
        name: name,
        code: codeforcesSolutions[name],
        urlName: name.replace(/\s+/g, '-')
    })).sort((a, b) => a.name.localeCompare(b.name));
}

async function showCodeforcesIndex() {
    const index = document.getElementById('codeforcesIndex');
    const view = document.getElementById('codeforcesView');

    if (index) index.style.display = 'block';
    if (view) view.style.display = 'none';

    await populateCodeforcesList();
}

async function populateCodeforcesList() {
    const list = document.getElementById('codeforcesList');
    if (!list) return;

    await loadCodeforcesSolutions();

    if (allCodeforcesSolutions.length === 0) {
        allCodeforcesSolutions = getCodeforcesSolutions();
        filteredSolutions = [...allCodeforcesSolutions];
    }

    list.innerHTML = '';

    const solutions = filteredSolutions.length > 0 ? filteredSolutions : allCodeforcesSolutions;

    if (solutions.length === 0) {
        const li = document.createElement('li');
        li.className = 'no-selection';
        li.textContent = 'No solutions found';
        list.appendChild(li);
        return;
    }

    solutions.forEach(solution => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.className = 'codeforces-item';
        button.addEventListener('click', () => {
            window.location.hash = `codeforces/${solution.urlName}`;
            showCodeforcesSolution(solution.name);
        });

        const nameSpan = document.createElement('span');
        nameSpan.className = 'codeforces-item-name';
        nameSpan.textContent = solution.name;

        const langSpan = document.createElement('span');
        langSpan.className = 'codeforces-item-lang';
        langSpan.textContent = 'Python';

        button.appendChild(nameSpan);
        button.appendChild(langSpan);
        li.appendChild(button);
        list.appendChild(li);
    });
}

function showCodeforcesSolution(challengeName) {
    const index = document.getElementById('codeforcesIndex');
    const view = document.getElementById('codeforcesView');
    const viewTitle = document.getElementById('codeforcesViewTitle');
    const codeContent = document.getElementById('codeContentMain');
    const backButton = document.getElementById('codeforcesBackButton');

    if (!index || !view) return;

    const solution = codeforcesSolutions[challengeName];
    if (!solution) {
        console.warn(`Solution for ${challengeName} not found`);
        return;
    }

    index.style.display = 'none';
    view.style.display = 'block';

    if (viewTitle) viewTitle.textContent = challengeName;
    if (codeContent) codeContent.textContent = solution;

    if (backButton) {
        const newBackButton = backButton.cloneNode(true);
        backButton.parentNode.replaceChild(newBackButton, backButton);

        newBackButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = 'codeforces';
            setTimeout(() => {
                showCodeforcesIndex();
            }, 50);
        });
    }

    const copyBtn = document.getElementById('copyCodeBtnMain');
    if (copyBtn) {
        const newCopyBtn = copyBtn.cloneNode(true);
        copyBtn.parentNode.replaceChild(newCopyBtn, copyBtn);

        newCopyBtn.addEventListener('click', async () => {
            const codeText = solution;
            try {
                await navigator.clipboard.writeText(codeText);
                const originalHTML = newCopyBtn.innerHTML;
                newCopyBtn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon><span>Copied!</span>';
                newCopyBtn.classList.add('copied');
                setTimeout(() => {
                    newCopyBtn.innerHTML = originalHTML;
                    newCopyBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                const textArea = document.createElement('textarea');
                textArea.value = codeText;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    const originalHTML = newCopyBtn.innerHTML;
                    newCopyBtn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon><span>Copied!</span>';
                    newCopyBtn.classList.add('copied');
                    setTimeout(() => {
                        newCopyBtn.innerHTML = originalHTML;
                        newCopyBtn.classList.remove('copied');
                    }, 2000);
                } catch (fallbackErr) {
                    console.error('Failed to copy code:', fallbackErr);
                }
                document.body.removeChild(textArea);
            }
        });
    }
}

async function handleCodeforcesRoute() {
    await loadCodeforcesSolutions();

    const hash = window.location.hash.substring(1);

    if (hash === 'codeforces') {
        await showCodeforcesIndex();
        return;
    }

    if (hash.startsWith('codeforces/')) {
        const parts = hash.split('/');
        if (parts.length >= 2) {
            const challengeUrlName = parts.slice(1).join('/');
            const challengeName = challengeUrlName.replace(/-/g, ' ');

            const solution = codeforcesSolutions[challengeName];
            if (solution) {
                showCodeforcesSolution(challengeName);
            } else {
                await showCodeforcesIndex();
            }
        }
    }
}

async function initCodeforces() {
    await loadCodeforcesSolutions();

    if (allCodeforcesSolutions.length === 0) {
        allCodeforcesSolutions = getCodeforcesSolutions();
        filteredSolutions = [...allCodeforcesSolutions];
    }

    const searchInput = document.getElementById('codeforcesSearch');
    if (searchInput && !searchInput.hasAttribute('data-listener-attached')) {
        searchInput.setAttribute('data-listener-attached', 'true');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();

            if (searchTerm === '') {
                filteredSolutions = [...allCodeforcesSolutions];
            } else {
                filteredSolutions = allCodeforcesSolutions.filter(solution =>
                    solution.name.toLowerCase().includes(searchTerm)
                );
            }

            populateCodeforcesList();
        });
    }

    populateCodeforcesList();
}