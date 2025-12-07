// Unified Writeups System
let allWriteupsData = {};
let currentWriteupKey = null;
let currentChallengeIndex = null;

// Parse README to extract challenges (works for both CTF and AoC)
function parseChallengesFromReadme(readmeContent, writeupKey, type) {
    const challenges = [];
    const lines = readmeContent.split('\n');
    const challengePattern = /^-\s+\[(.+?)\]\(\.\/(.+?)\/writeup\.md\)/;
    
    for (const line of lines) {
        const match = line.match(challengePattern);
        if (match) {
            const challengeName = match[1].trim();
            let folder = match[2].trim();
            // Decode URL-encoded folder names
            folder = decodeURIComponent(folder);
            
            let writeupPath;
            if (type === 'aoc') {
                writeupPath = `CTF-Writeups/${writeupKey}/${folder}/writeup.md`;
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

// Load all writeups data
async function loadAllWriteupsData() {
    const allConfigs = { ...ctfConfig, ...aocConfig };
    const promises = Object.keys(allConfigs).map(async (key) => {
        const config = allConfigs[key];
        try {
            const response = await fetch(config.readme);
            if (!response.ok) {
                console.warn(`Failed to load README for ${key}`);
                return { key, data: { name: config.name, challenges: [], type: config.type } };
            }
            const readmeContent = await response.text();
            const challenges = parseChallengesFromReadme(readmeContent, key, config.type);
            
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
    
    // Populate writeups index
    populateWriteupsIndex();
}

// Populate writeups index page
function populateWriteupsIndex() {
    const ctfGrid = document.getElementById('ctfWriteupsGrid');
    const aocGrid = document.getElementById('aocWriteupsGrid');
    
    if (!ctfGrid || !aocGrid) return;
    
    // Clear existing content
    ctfGrid.innerHTML = '';
    aocGrid.innerHTML = '';
    
    // Populate CTF writeups
    Object.keys(ctfConfig).forEach(key => {
        const writeup = allWriteupsData[key];
        if (writeup) {
            const card = createWriteupCard(writeup, key);
            ctfGrid.appendChild(card);
        }
    });
    
    // Populate AoC writeups
    Object.keys(aocConfig).forEach(key => {
        const writeup = allWriteupsData[key];
        if (writeup) {
            const card = createWriteupCard(writeup, key);
            aocGrid.appendChild(card);
        }
    });
}

// Create writeup card for index page
function createWriteupCard(writeup, key) {
    const card = document.createElement('div');
    card.className = 'writeup-card';
    card.setAttribute('data-writeup-key', key);
    card.addEventListener('click', () => {
        window.location.hash = `writeups/${key}`;
        showWriteupsView(key);
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

// Show writeups index page
function showWriteupsIndex() {
    const index = document.getElementById('writeupsIndex');
    const view = document.getElementById('writeupsView');
    
    if (index) index.style.display = 'block';
    if (view) view.style.display = 'none';
}

// Show individual writeup view (e.g., /writeups/AoC2025)
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
    
    // Show view, hide index
    index.style.display = 'none';
    view.style.display = 'block';
    
    // Set title
    if (viewTitle) {
        viewTitle.textContent = writeup.name;
    }
    
    // Back button
    if (backButton) {
        backButton.onclick = () => {
            window.location.hash = 'writeups';
            showWriteupsIndex();
        };
    }
    
    // Populate challenge list
    populateChallengeList(writeup.challenges);
    
    // If challenge path provided, load that challenge
    if (challengePath) {
        const challengeIndex = writeup.challenges.findIndex(c => {
            const folderName = c.folder.replace(/\s+/g, '-');
            return folderName === challengePath || c.folder === challengePath;
        });
        if (challengeIndex !== -1) {
            selectChallenge(challengeIndex);
        }
    } else {
        showWriteupPlaceholder();
    }
}

// Populate challenge list sidebar
function populateChallengeList(challenges) {
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
        button.addEventListener('click', () => selectChallenge(index));
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'challenge-name';
        nameSpan.textContent = challenge.name;
        
        button.appendChild(nameSpan);
        li.appendChild(button);
        challengeList.appendChild(li);
    });
}

// Select a challenge
function selectChallenge(index) {
    if (!currentWriteupKey) return;
    
    const writeup = allWriteupsData[currentWriteupKey];
    if (!writeup || !writeup.challenges[index]) return;
    
    currentChallengeIndex = index;
    const challenge = writeup.challenges[index];
    
    // Update active challenge
    document.querySelectorAll('[data-challenge-index]').forEach(item => {
        item.classList.remove('active');
    });
    const activeButton = document.querySelector(`[data-challenge-index="${index}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Update URL
    const folderName = challenge.folder.replace(/\s+/g, '-');
    window.location.hash = `writeups/${currentWriteupKey}/${folderName}`;
    
    // Load writeup
    loadWriteup(challenge.writeup, writeup.type);
}

// Show placeholder
function showWriteupPlaceholder() {
    const placeholder = document.getElementById('writeupPlaceholder');
    const display = document.getElementById('writeupDisplay');
    
    // Clear any active challenge selection
    document.querySelectorAll('[data-challenge-index]').forEach(item => {
        item.classList.remove('active');
    });
    
    // Reset current challenge index
    currentChallengeIndex = null;
    
    if (placeholder) placeholder.style.display = 'flex';
    if (display) display.style.display = 'none';
}

// Load and display writeup
function loadWriteup(writeupPath, type) {
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
                
                // Extract metadata
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

// Initialize writeups system
function initWriteups() {
    loadAllWriteupsData();
}



