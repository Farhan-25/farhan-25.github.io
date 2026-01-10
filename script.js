'use strict';


const navLinks = document.querySelectorAll('[data-nav-link]');
const articles = document.querySelectorAll('[data-page]');
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');


function handleNavClick() {
    const targetPage = this.getAttribute('data-nav-link');

    
    navLinks.forEach(link => link.classList.remove('active'));

    
    this.classList.add('active');

    
    articles.forEach(article => article.classList.remove('active'));

    
    const targetArticle = document.querySelector(`[data-page="${targetPage}"]`);
    if (targetArticle) {
        targetArticle.classList.add('active');
    }

    
    if (targetPage === 'writeups' || targetPage === 'codeforces' || targetPage === 'vulnhub') {
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
        
    } else if (targetPage === 'vulnhub') {
        const hash = window.location.hash.substring(1);
        if (hash === 'vulnhub' || hash.startsWith('vulnhub/')) {
            setTimeout(async () => {
                await handleVulnhubRoute();
            }, 100);
        } else {
            setTimeout(async () => {
                await initVulnhub();
                await showVulnhubIndex();
            }, 100);
        }
    } else {
        
        if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname);
        }
    }
}


function handleHashRoute() {
    const hash = window.location.hash.substring(1); 
    
    
    if (!hash || (hash !== 'writeups' && !hash.startsWith('writeups/') && hash !== 'codeforces' && !hash.startsWith('codeforces/') && hash !== 'vulnhub' && !hash.startsWith('vulnhub/'))) {
        
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
    
    if (hash === 'vulnhub' || hash.startsWith('vulnhub/')) {
        const vulnhubLink = Array.from(navLinks).find(link => 
            link.getAttribute('data-nav-link') === 'vulnhub'
        );
        if (vulnhubLink && !vulnhubLink.classList.contains('active')) {
            vulnhubLink.click();
        }
        setTimeout(() => {
            handleVulnhubRoute();
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


navLinks.forEach(link => {
    link.addEventListener('click', handleNavClick);
});

if (sidebarBtn) {
    sidebarBtn.addEventListener('click', toggleSidebar);
}


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
        document.body.style.overflow = 'hidden'; 
    }
}

function closeCertModal() {
    certModal.classList.remove('active');
    document.body.style.overflow = ''; 
}


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


document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && certModal.classList.contains('active')) {
        closeCertModal();
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const aboutLink = document.querySelector('[data-nav-link="about"]');
    const aboutArticle = document.querySelector('[data-page="about"]');

    if (aboutLink && aboutArticle) {
        aboutLink.classList.add('active');
        aboutArticle.classList.add('active');
    }

    
    if (sidebar) sidebar.style.display = '';

    
    initWriteups();
    initCodeforces();
    initVulnhub();
    
    
    const initialHash = window.location.hash.substring(1);
    if (initialHash === 'writeups' || initialHash.startsWith('writeups/') || initialHash === 'codeforces' || initialHash.startsWith('codeforces/') || initialHash === 'vulnhub' || initialHash.startsWith('vulnhub/')) {
        handleHashRoute();
    }
});


window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    
    if (hash === 'writeups' || hash.startsWith('writeups/') || hash === 'codeforces' || hash.startsWith('codeforces/') || hash === 'vulnhub' || hash.startsWith('vulnhub/')) {
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


const vulnhubConfig = {
    'Vulnhub': {
        name: 'Vulnhub Labs',
        readme: 'Vulnhub/README.md',
        type: 'vulnhub'
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


async function loadCTFData() {
    const promises = Object.keys(ctfConfig).map(async (ctfKey) => {
        const config = ctfConfig[ctfKey];
        try {
            const response = await fetch(config.readme);
            if (!response.ok) {
                console.warn(`Failed to load README for ${ctfKey}`);
                return { key: ctfKey, challenges: [] };
            }
            const readmeContent = await response.text();
            const challenges = parseChallengesFromReadme(readmeContent, ctfKey);
            
            return {
                key: ctfKey,
                data: {
                    name: config.name,
                    challenges: challenges
                }
            };
        } catch (error) {
            console.error(`Error loading ${ctfKey} README:`, error);
            return { key: ctfKey, data: { name: config.name, challenges: [] } };
        }
    });
    
    const results = await Promise.all(promises);
    
    
    results.forEach(result => {
        ctfData[result.key] = result.data;
    });
    
    
    populateCTFList();
}

function populateCTFList() {
    const ctfList = document.getElementById('ctfList');
    if (!ctfList) return;
    
    
    ctfList.innerHTML = '';
    
    
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

function initCTFWriteups() {
    const challengeList = document.getElementById('challengeList');
    if (!challengeList) return;
    
    
    loadCTFData();
}

function selectCTF(ctfKey) {
    selectedCTF = ctfKey;
    const ctf = ctfData[ctfKey];
    
    
    if (!ctf) {
        console.warn(`CTF data for ${ctfKey} not loaded yet`);
        return;
    }
    
    
    document.querySelectorAll('.ctf-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeButton = document.querySelector(`[data-ctf="${ctfKey}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    
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
            
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'challenge-name';
            nameSpan.textContent = challenge.name;
            
            
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
    
    
    showPlaceholder();
}

function selectChallenge(ctfKey, challengeIndex) {
    selectedChallenge = challengeIndex;
    const ctf = ctfData[ctfKey];
    const challenge = ctf.challenges[challengeIndex];
    
    
    document.querySelectorAll('.challenge-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-challenge="${challengeIndex}"]`).classList.add('active');
    
    
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
    
    
    if (placeholder) placeholder.style.display = 'none';
    if (display) display.style.display = 'block';
    if (writeupBody) writeupBody.innerHTML = '<p>Loading writeup...</p>';
    
    
    fetch(writeupPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load writeup');
            }
            return response.text();
        })
        .then(markdown => {
            
            if (typeof marked !== 'undefined') {
                const html = marked.parse(markdown);
                
                
                const titleMatch = markdown.match(/^#\s+(.+)$/m);
                const categoryMatch = markdown.match(/\*\*Category:\*\*\s+(.+)/);
                const difficultyMatch = markdown.match(/\*\*Difficulty:\*\*\s+(.+)/);
                const ctfMatch = markdown.match(/\*\*CTF:\*\*\s+(.+)/);
                
                
                if (writeupTitle && titleMatch) {
                    writeupTitle.textContent = titleMatch[1];
                }
                
                
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
                
                
                if (writeupBody) {
                    writeupBody.innerHTML = html;
                    
                    fixRelativePaths(writeupBody, writeupPath);
                    
                    processImagesAndCaptions(writeupBody);
                    
                    addCopyButtonsToCodeBlocks(writeupBody);
                }
            } else {
                
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

function fixRelativePaths(container, writeupPath) {
    
    const writeupDir = writeupPath.substring(0, writeupPath.lastIndexOf('/') + 1);
    
    
    const images = container.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:')) {
            
            img.setAttribute('src', writeupDir + src);
        }
    });
    
    
    const videos = container.querySelectorAll('video');
    videos.forEach(video => {
        const src = video.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:')) {
            video.setAttribute('src', writeupDir + src);
        }
    });
    
    
    const links = container.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('/') && !href.startsWith('#') && !href.startsWith('mailto:')) {
            
            const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
            const isVideo = videoExtensions.some(ext => href.toLowerCase().endsWith(ext));
            if (isVideo || href.includes('video') || href.includes('mp4')) {
                link.setAttribute('href', writeupDir + href);
            }
        }
    });
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



let aocData = {};

let selectedAoCYear = null;
let selectedAoCChallenge = null;


async function loadAoCData() {
    const promises = Object.keys(aocConfig).map(async (aocKey) => {
        const config = aocConfig[aocKey];
        try {
            const response = await fetch(config.readme);
            if (!response.ok) {
                console.warn(`Failed to load README for ${aocKey}`);
                return { key: aocKey, challenges: [] };
            }
            const readmeContent = await response.text();
            const challenges = parseAoCChallengesFromReadme(readmeContent, aocKey);
            
            return {
                key: aocKey,
                data: {
                    name: config.name,
                    challenges: challenges
                }
            };
        } catch (error) {
            console.error(`Error loading ${aocKey} README:`, error);
            return { key: aocKey, data: { name: config.name, challenges: [] } };
        }
    });
    
    const results = await Promise.all(promises);
    
    
    results.forEach(result => {
        aocData[result.key] = result.data;
    });
    
    
    populateAoCYearList();
}

function populateAoCYearList() {
    const aocYearList = document.getElementById('aocYearList');
    if (!aocYearList) return;
    
    
    aocYearList.innerHTML = '';
    
    
    Object.keys(aocData).forEach(aocKey => {
        const aoc = aocData[aocKey];
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.className = 'ctf-item';
        button.textContent = aoc.name;
        button.setAttribute('data-aoc-year', aocKey);
        button.addEventListener('click', () => selectAoCYear(aocKey));
        li.appendChild(button);
        aocYearList.appendChild(li);
    });
}

function initAoCWriteups() {
    const challengeList = document.getElementById('aocChallengeList');
    if (!challengeList) return;
    
    
    loadAoCData();
}

function selectAoCYear(aocKey) {
    selectedAoCYear = aocKey;
    const aoc = aocData[aocKey];
    
    
    if (!aoc) {
        console.warn(`AoC data for ${aocKey} not loaded yet`);
        return;
    }
    
    
    document.querySelectorAll('[data-aoc-year]').forEach(item => {
        item.classList.remove('active');
    });
    const activeButton = document.querySelector(`[data-aoc-year="${aocKey}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    
    const challengeList = document.getElementById('aocChallengeList');
    challengeList.innerHTML = '';
    
    if (aoc.challenges.length === 0) {
        const li = document.createElement('li');
        li.className = 'no-selection';
        li.textContent = 'No challenges available';
        challengeList.appendChild(li);
    } else {
        aoc.challenges.forEach((challenge, index) => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.className = 'challenge-item';
            button.setAttribute('data-aoc-challenge', index);
            button.addEventListener('click', () => selectAoCChallenge(aocKey, index));
            
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'challenge-name';
            nameSpan.textContent = challenge.name;
            
            
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
    
    
    showAoCPlaceholder();
}

function selectAoCChallenge(aocKey, challengeIndex) {
    selectedAoCChallenge = challengeIndex;
    const aoc = aocData[aocKey];
    const challenge = aoc.challenges[challengeIndex];
    
    
    document.querySelectorAll('[data-aoc-challenge]').forEach(item => {
        item.classList.remove('active');
    });
    const activeButton = document.querySelector(`[data-aoc-challenge="${challengeIndex}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    
    const folderName = challenge.folder.replace(/\s+/g, '-');
    window.location.hash = `writeup/${aocKey}/${folderName}`;
    
    
    loadAoCWriteup(challenge.writeup);
}

function showAoCPlaceholder() {
    const placeholder = document.getElementById('aocWriteupPlaceholder');
    const display = document.getElementById('aocWriteupDisplay');
    
    if (placeholder) placeholder.style.display = 'flex';
    if (display) display.style.display = 'none';
}

function loadAoCWriteup(writeupPath) {
    const placeholder = document.getElementById('aocWriteupPlaceholder');
    const display = document.getElementById('aocWriteupDisplay');
    const writeupTitle = document.getElementById('aocWriteupTitle');
    const writeupMeta = document.getElementById('aocWriteupMeta');
    const writeupBody = document.getElementById('aocWriteupBody');
    
    
    if (placeholder) placeholder.style.display = 'none';
    if (display) display.style.display = 'block';
    if (writeupBody) writeupBody.innerHTML = '<p>Loading writeup...</p>';
    
    
    fetch(writeupPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load writeup');
            }
            return response.text();
        })
        .then(markdown => {
            
            if (typeof marked !== 'undefined') {
                const html = marked.parse(markdown);
                
                
                const titleMatch = markdown.match(/^#\s+(.+)$/m);
                const categoryMatch = markdown.match(/\*\*Category:\*\*\s+(.+)/);
                const difficultyMatch = markdown.match(/\*\*Difficulty:\*\*\s+(.+)/);
                const yearMatch = markdown.match(/\*\*Year:\*\*\s+(.+)/);
                const typeMatch = markdown.match(/\*\*Type:\*\*\s+(.+)/);
                
                
                if (writeupTitle && titleMatch) {
                    writeupTitle.textContent = titleMatch[1];
                }
                
                
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
                    
                    if (yearMatch) {
                        const badge = document.createElement('span');
                        badge.className = 'meta-badge';
                        badge.textContent = `Year: ${yearMatch[1].trim()}`;
                        writeupMeta.appendChild(badge);
                    }
                    
                    if (typeMatch) {
                        const badge = document.createElement('span');
                        badge.className = 'meta-badge';
                        badge.textContent = `Type: ${typeMatch[1].trim()}`;
                        writeupMeta.appendChild(badge);
                    }
                }
                
                
                if (writeupBody) {
                    writeupBody.innerHTML = html;
                    
                    fixRelativePaths(writeupBody, writeupPath);
                    
                    processImagesAndCaptions(writeupBody);
                    
                    addCopyButtonsToCodeBlocks(writeupBody);
                }
            } else {
                
                if (writeupBody) {
                    writeupBody.innerHTML = '<p>Markdown parser not loaded. Please refresh the page.</p><pre>' + markdown + '</pre>';
                }
            }
        })
        .catch(error => {
            console.error('Error loading AoC writeup:', error);
            if (writeupBody) {
                writeupBody.innerHTML = `<p style="color: var(--bittersweet-shimmer);">Error loading writeup: ${error.message}</p>`;
            }
        });
}





let allWriteupsData = {};
let currentWriteupKey = null;
let currentChallengeIndex = null;


function parseChallengesFromReadmeUnified(readmeContent, writeupKey) {
    const challenges = [];
    const lines = readmeContent.split('\n');
    const challengePattern = /^-\s+\[(.+?)\]\(\.\/(.+?)\/writeup\.md\)/;
    
    for (const line of lines) {
        const match = line.match(challengePattern);
        if (match) {
            const challengeName = match[1].trim();
            let folder = match[2].trim();
            folder = decodeURIComponent(folder);
            
            let writeupPath;
            if (writeupKey === 'Vulnhub') {
                writeupPath = `Vulnhub/${folder}/writeup.md`;
            } else {
                writeupPath = `CTF-Writeups/${writeupKey}/${folder}/writeup.md`;
            }
            
            challenges.push({
                name: challengeName,
                folder: folder,
                writeup: writeupPath
            });
        }
    }
    
    return challenges;
}


async function loadAllWriteupsData() {
    const allConfigs = { ...ctfConfig, ...aocConfig };
    const promises = Object.keys(allConfigs).map(async (key) => {
        const config = allConfigs[key];
        try {
            const response = await fetch(config.readme);
            if (!response.ok) {
                return { key, data: { name: config.name, challenges: [], type: config.type } };
            }
            const readmeContent = await response.text();
            const challenges = parseChallengesFromReadmeUnified(readmeContent, key);
            
            return {
                key,
                data: {
                    name: config.name,
                    challenges: challenges,
                    type: config.type
                }
            };
        } catch (error) {
            console.error(`Error loading ${key} README:`, error);
            return { key, data: { name: config.name, challenges: [], type: config.type } };
        }
    });
    
    const results = await Promise.all(promises);
    results.forEach(result => {
        allWriteupsData[result.key] = result.data;
    });
    
    populateWriteupsIndex();
}


function populateWriteupsIndex() {
    const ctfGrid = document.getElementById('ctfWriteupsGrid');
    const aocGrid = document.getElementById('aocWriteupsGrid');
    
    if (!ctfGrid || !aocGrid) return;
    
    ctfGrid.innerHTML = '';
    aocGrid.innerHTML = '';
    
    Object.keys(ctfConfig).forEach(key => {
        const writeup = allWriteupsData[key];
        if (writeup) {
            const card = createWriteupCard(writeup, key);
            ctfGrid.appendChild(card);
        }
    });
    
    Object.keys(aocConfig).forEach(key => {
        const writeup = allWriteupsData[key];
        if (writeup) {
            const card = createWriteupCard(writeup, key);
            aocGrid.appendChild(card);
        }
    });
}


function createWriteupCard(writeup, key) {
    const card = document.createElement('div');
    card.className = 'writeup-card';
    card.setAttribute('data-writeup-key', key);
    card.style.cursor = 'pointer';
    
    card.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        
        const writeupsLink = Array.from(navLinks).find(link => 
            link.getAttribute('data-nav-link') === 'writeups'
        );
        if (writeupsLink && !writeupsLink.classList.contains('active')) {
            writeupsLink.click();
        }
        
        
        window.location.hash = `writeups/${key}`;
        
        
        setTimeout(() => {
            if (allWriteupsData[key]) {
                showWriteupsView(key);
            } else {
                
                setTimeout(() => {
                    if (allWriteupsData[key]) {
                        showWriteupsView(key);
                    } else {
                        console.warn(`Writeup data for ${key} not loaded yet`);
                    }
                }, 500);
            }
        }, 150);
    });
    
    const icon = writeup.type === 'aoc' ? 'calendar-outline' : 'flag-outline';
    
    card.innerHTML = `
        <div class="writeup-card-header">
            <ion-icon name="${icon}"></ion-icon>
            <h4 class="writeup-card-title">${writeup.name}</h4>
        </div>
        <p class="writeup-card-description">
            ${writeup.challenges.length} challenge${writeup.challenges.length !== 1 ? 's' : ''} available
        </p>
        <div class="writeup-card-count">
            <ion-icon name="document-text-outline"></ion-icon>
            <span>${writeup.challenges.length} writeup${writeup.challenges.length !== 1 ? 's' : ''}</span>
        </div>
    `;
    
    return card;
}


function showWriteupsIndex() {
    const index = document.getElementById('writeupsIndex');
    const view = document.getElementById('writeupsView');
    
    if (index) index.style.display = 'block';
    if (view) view.style.display = 'none';
}


function showWriteupsView(writeupKey, challengePath = null) {
    const index = document.getElementById('writeupsIndex');
    const view = document.getElementById('writeupsView');
    const viewTitle = document.getElementById('writeupsViewTitle');
    const backButton = document.getElementById('writeupsBackButton');
    
    if (!index || !view) return;
    
    const writeup = allWriteupsData[writeupKey];
    if (!writeup) {
        console.warn(`Writeup ${writeupKey} not found`);
        return;
    }
    
    currentWriteupKey = writeupKey;
    
    index.style.display = 'none';
    view.style.display = 'block';
    
    if (viewTitle) viewTitle.textContent = writeup.name;
    
    if (backButton) {
        
        const newBackButton = backButton.cloneNode(true);
        backButton.parentNode.replaceChild(newBackButton, backButton);
        
        
        newBackButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = 'writeups';
            setTimeout(() => {
                showWriteupsIndex();
            }, 50);
        });
    }
    
    populateChallengeListUnified(writeup.challenges);
    
    if (challengePath) {
        const challengeIndex = writeup.challenges.findIndex(c => {
            const folderName = c.folder.replace(/\s+/g, '-');
            return folderName === challengePath || c.folder === challengePath;
        });
        if (challengeIndex !== -1) {
            selectChallengeUnified(challengeIndex);
        }
    } else {
        showWriteupPlaceholderUnified();
    }
}


function populateChallengeListUnified(challenges) {
    const challengeList = document.getElementById('challengeList');
    if (!challengeList) return;
    
    challengeList.innerHTML = '';
    
    if (challenges.length === 0) {
        const li = document.createElement('li');
        li.className = 'no-selection';
        li.textContent = 'No challenges available';
        challengeList.appendChild(li);
        return;
    }
    
    challenges.forEach((challenge, index) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.className = 'challenge-item';
        button.setAttribute('data-challenge-index', index);
        button.addEventListener('click', () => selectChallengeUnified(index));
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'challenge-name';
        nameSpan.textContent = challenge.name;
        
        button.appendChild(nameSpan);
        li.appendChild(button);
        challengeList.appendChild(li);
    });
}


function selectChallengeUnified(index) {
    if (!currentWriteupKey) return;
    
    const writeup = allWriteupsData[currentWriteupKey];
    if (!writeup || !writeup.challenges[index]) return;
    
    currentChallengeIndex = index;
    const challenge = writeup.challenges[index];
    
    document.querySelectorAll('[data-challenge-index]').forEach(item => {
        item.classList.remove('active');
    });
    const activeButton = document.querySelector(`[data-challenge-index="${index}"]`);
    if (activeButton) activeButton.classList.add('active');
    
    const folderName = challenge.folder.replace(/\s+/g, '-');
    window.location.hash = `writeups/${currentWriteupKey}/${folderName}`;
    
    loadWriteupUnified(challenge.writeup, writeup.type);
}


function showWriteupPlaceholderUnified() {
    const placeholder = document.getElementById('writeupPlaceholder');
    const display = document.getElementById('writeupDisplay');
    
    
    document.querySelectorAll('[data-challenge-index]').forEach(item => {
        item.classList.remove('active');
    });
    
    
    currentChallengeIndex = null;
    
    if (placeholder) placeholder.style.display = 'flex';
    if (display) display.style.display = 'none';
}


function loadWriteupUnified(writeupPath, type) {
    const placeholder = document.getElementById('writeupPlaceholder');
    const display = document.getElementById('writeupDisplay');
    const writeupTitle = document.getElementById('writeupTitle');
    const writeupMeta = document.getElementById('writeupMeta');
    const writeupBody = document.getElementById('writeupBody');
    
    if (placeholder) placeholder.style.display = 'none';
    if (display) display.style.display = 'block';
    if (writeupBody) writeupBody.innerHTML = '<p>Loading writeup...</p>';
    
    fetch(writeupPath)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load writeup');
            return response.text();
        })
        .then(markdown => {
            if (typeof marked !== 'undefined') {
                const html = marked.parse(markdown);
                
                const titleMatch = markdown.match(/^#\s+(.+)$/m);
                const categoryMatch = markdown.match(/\*\*Category:\*\*\s+(.+)/);
                const difficultyMatch = markdown.match(/\*\*Difficulty:\*\*\s+(.+)/);
                const ctfMatch = markdown.match(/\*\*CTF:\*\*\s+(.+)/);
                const yearMatch = markdown.match(/\*\*Year:\*\*\s+(.+)/);
                const typeMatch = markdown.match(/\*\*Type:\*\*\s+(.+)/);
                
                if (writeupTitle && titleMatch) {
                    writeupTitle.textContent = titleMatch[1];
                }
                
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
                    
                    if (yearMatch) {
                        const badge = document.createElement('span');
                        badge.className = 'meta-badge';
                        badge.textContent = `Year: ${yearMatch[1].trim()}`;
                        writeupMeta.appendChild(badge);
                    }
                    
                    if (typeMatch) {
                        const badge = document.createElement('span');
                        badge.className = 'meta-badge';
                        badge.textContent = `Type: ${typeMatch[1].trim()}`;
                        writeupMeta.appendChild(badge);
                    }
                }
                
                if (writeupBody) {
                    writeupBody.innerHTML = html;
                    fixRelativePaths(writeupBody, writeupPath);
                    processImagesAndCaptions(writeupBody);
                    addCopyButtonsToCodeBlocks(writeupBody);
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


function initWriteups() {
    loadAllWriteupsData();
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


let vulnhubData = {};
let selectedVulnhubLab = null;
let selectedVulnhubChallenge = null;

async function loadVulnhubData() {
    const promises = Object.keys(vulnhubConfig).map(async (vulnhubKey) => {
        const config = vulnhubConfig[vulnhubKey];
        try {
            const response = await fetch(config.readme);
            if (!response.ok) {
                console.warn(`Failed to load README for ${vulnhubKey}`);
                return { key: vulnhubKey, challenges: [] };
            }
            const readmeContent = await response.text();
            const challenges = parseChallengesFromReadmeUnified(readmeContent, vulnhubKey);
            
            return {
                key: vulnhubKey,
                data: {
                    name: config.name,
                    challenges: challenges,
                    type: config.type
                }
            };
        } catch (error) {
            console.error(`Error loading ${vulnhubKey} README:`, error);
            return { key: vulnhubKey, data: { name: config.name, challenges: [], type: config.type } };
        }
    });
    
    const results = await Promise.all(promises);
    
    results.forEach(result => {
        vulnhubData[result.key] = result.data;
    });
    
    populateVulnhubList();
}

function populateVulnhubList() {
    const vulnhubGrid = document.getElementById('vulnhubWriteupsGrid');
    if (!vulnhubGrid) return;
    
    vulnhubGrid.innerHTML = '';
    
    Object.keys(vulnhubData).forEach(vulnhubKey => {
        const vulnhub = vulnhubData[vulnhubKey];
        vulnhub.challenges.forEach(challenge => {
            const card = createVulnhubLabCard(challenge, vulnhubKey);
            vulnhubGrid.appendChild(card);
        });
    });
}

function createVulnhubLabCard(challenge, vulnhubKey) {
    const card = document.createElement('div');
    card.className = 'writeup-card';
    card.setAttribute('data-lab-name', challenge.name);
    card.style.cursor = 'pointer';
    
    card.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const vulnhubLink = Array.from(navLinks).find(link => 
            link.getAttribute('data-nav-link') === 'vulnhub'
        );
        if (vulnhubLink && !vulnhubLink.classList.contains('active')) {
            vulnhubLink.click();
        }
        
        const folderName = challenge.folder.replace(/\s+/g, '-');
        window.location.hash = `vulnhub/${vulnhubKey}/${folderName}`;
        
        setTimeout(() => {
            showVulnhubLabWriteup(challenge, vulnhubKey);
        }, 150);
    });
    
    card.innerHTML = `
        <div class="writeup-card-header">
            <ion-icon name="shield-outline"></ion-icon>
            <h4 class="writeup-card-title">${challenge.name}</h4>
        </div>
        <p class="writeup-card-description">
            Click to view writeup
        </p>
        <div class="writeup-card-count">
            <ion-icon name="document-text-outline"></ion-icon>
            <span>View Writeup</span>
        </div>
    `;
    
    return card;
}

function showVulnhubIndex() {
    const index = document.getElementById('vulnhubIndex');
    const view = document.getElementById('vulnhubView');
    
    if (index) index.style.display = 'block';
    if (view) view.style.display = 'none';
}

function showVulnhubLabWriteup(challenge, vulnhubKey) {
    const index = document.getElementById('vulnhubIndex');
    const view = document.getElementById('vulnhubView');
    const viewTitle = document.getElementById('vulnhubViewTitle');
    const backButton = document.getElementById('vulnhubBackButton');
    const display = document.getElementById('vulnhubWriteupDisplay');
    
    if (!index || !view) return;
    
    index.style.display = 'none';
    view.style.display = 'block';
    if (display) display.style.display = 'block';
    
    if (viewTitle) viewTitle.textContent = challenge.name;
    
    if (backButton) {
        const newBackButton = backButton.cloneNode(true);
        backButton.parentNode.replaceChild(newBackButton, backButton);
        
        newBackButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = 'vulnhub';
            setTimeout(() => {
                showVulnhubIndex();
            }, 50);
        });
    }
    
    loadVulnhubWriteup(challenge.writeup);
}


function loadVulnhubWriteup(writeupPath) {
    const placeholder = document.getElementById('vulnhubWriteupPlaceholder');
    const display = document.getElementById('vulnhubWriteupDisplay');
    const writeupTitle = document.getElementById('vulnhubWriteupTitle');
    const writeupMeta = document.getElementById('vulnhubWriteupMeta');
    const writeupBody = document.getElementById('vulnhubWriteupBody');
    
    if (placeholder) placeholder.style.display = 'none';
    if (display) display.style.display = 'block';
    if (writeupBody) writeupBody.innerHTML = '<p>Loading writeup...</p>';
    
    fetch(writeupPath)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load writeup');
            return response.text();
        })
        .then(markdown => {
            if (typeof marked !== 'undefined') {
                const html = marked.parse(markdown);
                
                const titleMatch = markdown.match(/^#\s+(.+)$/m);
                const categoryMatch = markdown.match(/\*\*Category:\*\*\s+(.+)/);
                const difficultyMatch = markdown.match(/\*\*Difficulty:\*\*\s+(.+)/);
                const labMatch = markdown.match(/\*\*Lab:\*\*\s+(.+)/);
                const typeMatch = markdown.match(/\*\*Type:\*\*\s+(.+)/);
                
                if (writeupTitle && titleMatch) {
                    writeupTitle.textContent = titleMatch[1];
                }
                
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
                    
                    if (labMatch) {
                        const badge = document.createElement('span');
                        badge.className = 'meta-badge';
                        badge.textContent = `Lab: ${labMatch[1].trim()}`;
                        writeupMeta.appendChild(badge);
                    }
                    
                    if (typeMatch) {
                        const badge = document.createElement('span');
                        badge.className = 'meta-badge';
                        badge.textContent = `Type: ${typeMatch[1].trim()}`;
                        writeupMeta.appendChild(badge);
                    }
                }
                
                if (writeupBody) {
                    writeupBody.innerHTML = html;
                    fixRelativePaths(writeupBody, writeupPath);
                    processImagesAndCaptions(writeupBody);
                    addCopyButtonsToCodeBlocks(writeupBody);
                }
            }
        })
        .catch(error => {
            console.error('Error loading Vulnhub writeup:', error);
            if (writeupBody) {
                writeupBody.innerHTML = `<p style="color: var(--bittersweet-shimmer);">Error loading writeup: ${error.message}</p>`;
            }
        });
}

async function handleVulnhubRoute() {
    await loadVulnhubData();
    
    const hash = window.location.hash.substring(1);
    
    if (hash === 'vulnhub') {
        await showVulnhubIndex();
        return;
    }
    
    if (hash.startsWith('vulnhub/')) {
        const parts = hash.split('/');
        if (parts.length >= 3) {
            const vulnhubKey = parts[1];
            const challengePath = parts.slice(2).join('/');
            
            if (vulnhubData[vulnhubKey]) {
                const vulnhub = vulnhubData[vulnhubKey];
                const challenge = vulnhub.challenges.find(c => {
                    const folderName = c.folder.replace(/\s+/g, '-');
                    return folderName === challengePath || c.folder === challengePath;
                });
                
                if (challenge) {
                    showVulnhubLabWriteup(challenge, vulnhubKey);
                } else {
                    await showVulnhubIndex();
                }
            } else {
                await showVulnhubIndex();
            }
        } else {
            await showVulnhubIndex();
        }
    }
}

async function initVulnhub() {
    await loadVulnhubData();
    populateVulnhubList();
}