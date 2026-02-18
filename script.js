'use strict';

// Element selections
const sidebarContainer = document.getElementById('sidebar-container');
const navbarContainer = document.getElementById('navbar-container');

// Load Sidebar
async function loadSidebar() {
  try {
    if (!sidebarContainer) return;
    const response = await fetch('sidebar.html');
    if (!response.ok) throw new Error('Sidebar not found');
    const html = await response.text();
    sidebarContainer.innerHTML = html;

    // Initialize sidebar functionality
    const sidebar = document.querySelector('[data-sidebar]');
    const sidebarBtn = document.querySelector('[data-sidebar-btn]');
    if (sidebarBtn && sidebar) {
      sidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });
    }
  } catch (error) {
    console.error('Error loading sidebar:', error);
  }
}

// Load Navbar
async function loadNavbar() {
  try {
    if (!navbarContainer) return;
    const response = await fetch('navbar.html');
    if (!response.ok) throw new Error('Navbar not found');
    const html = await response.text();
    navbarContainer.innerHTML = html;

    // Highlight active link
    const article = document.querySelector('article');
    if (article) {
      const currentPage = article.getAttribute('data-page');
      const navLinks = document.querySelectorAll('[data-nav-link]');
      navLinks.forEach(link => {
        if (link.getAttribute('data-nav-link') === currentPage) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  } catch (error) {
    console.error('Error loading navbar:', error);
  }
}

// Certificate Modal Functionality (About Page)
const certData = {
  'thm-pre-security': {
    title: 'TryHackMe Pre Security Certificate',
    src: 'Certificates/THM-Pre Security.pdf'
  },
  'thm-cybersecurity-101': {
    title: 'TryHackMe Cyber Security 101',
    src: 'Certificates/Cyber Security 101.pdf'
  },
  'intro-cybersecurity': {
    title: 'Introduction to Cybersecurity Certificate',
    src: 'Certificates/Introduction_to_Cybersecurity_certificate_farhansaiyed2511-gmail-com_c0f41631-fb38-4606-b26d-bdd98cd3c89a.pdf'
  }
};

function attachCertModalListeners() {
  const viewCertBtns = document.querySelectorAll('[data-cert]');
  const certModal = document.getElementById('certModal');
  const certModalOverlay = document.getElementById('certModalOverlay');
  const certModalClose = document.getElementById('certModalClose');

  if (!certModal) return;

  function openCertModal(certKey) {
    const cert = certData[certKey];
    const certModalTitle = document.getElementById('certModalTitle');
    const certPreview = document.getElementById('certPreview');
    const certOpenLink = document.getElementById('certOpenLink');

    if (cert) {
      const resolvedSrc = encodeURI(cert.src);
      if (certModalTitle) certModalTitle.textContent = cert.title;
      if (certPreview) certPreview.src = resolvedSrc;
      if (certOpenLink) certOpenLink.href = resolvedSrc;
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

  if (certModalOverlay) certModalOverlay.addEventListener('click', closeCertModal);
  if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
}


// Open Source Functionality
const openSourceData = {
  'project-1': {
    title: 'Project Name',
    repoName: 'username/project-name',
    repoUrl: 'https://github.com/username/project-name',
    lang: 'Python',
    description: 'Detailed description of the contribution or project. Explain what was done and the impact.',
    prs: [
      { title: 'Fix bug in login flow', status: 'Merged', link: '#' },
      { title: 'Add new feature for dashboard', status: 'Open', link: '#' }
    ]
  },
  'project-2': {
    title: 'Cyber Security Tool',
    repoName: 'username/cyber-security-tool',
    repoUrl: 'https://github.com/username/cyber-security-tool',
    lang: 'JavaScript',
    description: 'A web-based tool for analyzing network traffic and identifying potential security threats.',
    prs: [
      { title: 'Initial commit', status: 'Merged', link: '#' },
      { title: 'Add packet analysis feature', status: 'Merged', link: '#' },
      { title: 'Implement real-time monitoring', status: 'Open', link: '#' }
    ]
  }
};

function renderOpenSourceList() {
  const grid = document.getElementById('opensource-grid');
  if (!grid) return;

  grid.innerHTML = '';
  
  Object.keys(openSourceData).forEach(key => {
    const project = openSourceData[key];
    const item = document.createElement('div');
    item.className = 'opensource-item';
    
    item.innerHTML = `
      <div class="opensource-header">
        <h3 class="opensource-title" onclick="window.location.hash = 'opensource/${key}'" style="cursor: pointer;">
          ${project.repoName || project.title}
        </h3>
        <div class="opensource-meta">
          <span class="opensource-lang">${project.lang}</span>
          <a href="${project.repoUrl}" target="_blank" class="opensource-github-link" title="View on GitHub">
            <ion-icon name="logo-github"></ion-icon>
          </a>
        </div>
      </div>
      <p class="opensource-description">
        ${project.description}
      </p>
      <div class="opensource-actions">
        <button class="view-repo-btn" onclick="window.location.hash = 'opensource/${key}'">
          <ion-icon name="eye-outline"></ion-icon>
          <span>View Details</span>
        </button>
      </div>
    `;
    
    grid.appendChild(item);
  });
}

function showOpenSourceDetail(projectKey) {
  const project = openSourceData[projectKey];
  if (!project) return;

  const listView = document.getElementById('opensource-list-view');
  const detailView = document.getElementById('opensource-detail-view');
  
  if (listView) listView.style.display = 'none';
  if (detailView) detailView.style.display = 'block';
  
  // Populate Detail
  const detailTitle = document.getElementById('detail-title');
  const detailRepoLink = document.getElementById('detail-repo-link');
  const detailDescription = document.getElementById('detail-description');
  const detailPrList = document.getElementById('detail-pr-list');

  if (detailTitle) detailTitle.textContent = project.title;
  if (detailRepoLink) detailRepoLink.href = project.repoUrl;
  if (detailDescription) detailDescription.textContent = project.description;
  
  if (detailPrList) {
    detailPrList.innerHTML = '';
    project.prs.forEach(pr => {
      const li = document.createElement('li');
      li.className = 'opensource-pr-item';
      li.innerHTML = `
        <a href="${pr.link}" target="_blank" class="opensource-pr-link">
          <span class="opensource-pr-title">${pr.title}</span>
          <span class="opensource-pr-status ${pr.status.toLowerCase()}">${pr.status}</span>
        </a>
      `;
      detailPrList.appendChild(li);
    });
  }
}

function showOpenSourceList() {
  const listView = document.getElementById('opensource-list-view');
  const detailView = document.getElementById('opensource-detail-view');
  
  if (listView) listView.style.display = 'block';
  if (detailView) detailView.style.display = 'none';
}

function handleOpenSourceRoute() {
  const hash = window.location.hash.substring(1);
  if (hash.startsWith('opensource/')) {
    const projectKey = hash.split('/')[1];
    if (openSourceData[projectKey]) {
      showOpenSourceDetail(projectKey);
    } else {
      showOpenSourceList();
    }
  } else {
    showOpenSourceList();
  }
}

function attachOpenSourceListeners() {
  renderOpenSourceList();
  
  const backBtn = document.getElementById('opensource-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      // Go back to opensource main view
      // We can remove the hash or set it to 'opensource' (though 'opensource' isn't a project key, so it defaults to list)
      // Ideally we want to clear the hash but stay on the page.
      // But our page logic is: if hash is project, show detail. Else show list.
      // So removing hash works.
      history.pushState("", document.title, window.location.pathname + window.location.search);
      handleOpenSourceRoute();
    });
  }
  
  // Initial check
  handleOpenSourceRoute();
}

// Global Escape key listener for all modals
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.cert-modal.active, .opensource-modal.active');
    if (activeModal) {
      activeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});


// Codeforces Logic
let codeforcesSolutions = {};
let allCodeforcesSolutions = [];
let filteredSolutions = [];

async function loadCodeforcesSolutions() {
  if (Object.keys(codeforcesSolutions).length > 0) {
    return codeforcesSolutions;
  }
  try {
    const response = await fetch('Codeforces/solutions.json');
    if (!response.ok) throw new Error('Failed to load solutions');
    codeforcesSolutions = await response.json();
    return codeforcesSolutions;
  } catch (error) {
    console.error('Error loading Codeforces solutions:', error);
    return {};
  }
}

function getCodeforcesSolutions() {
  return Object.keys(codeforcesSolutions)
    .map(name => ({
      name: name,
      code: codeforcesSolutions[name],
      urlName: name.replace(/\s+/g, '-')
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
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
        filteredSolutions = allCodeforcesSolutions.filter(
          solution => solution.name.toLowerCase().includes(searchTerm));
      }
      populateCodeforcesList();
    });
  }
  populateCodeforcesList();
}

async function populateCodeforcesList() {
  const list = document.getElementById('codeforcesList');
  if (!list) return;

  await loadCodeforcesSolutions(); // Ensure loaded

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
    // Ensure href is correct
    backButton.setAttribute('href', '#codeforces');
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
        newCopyBtn.innerHTML =
          '<ion-icon name="checkmark-outline"></ion-icon><span>Copied!</span>';
        newCopyBtn.classList.add('copied');
        setTimeout(() => {
          newCopyBtn.innerHTML = originalHTML;
          newCopyBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        // Fallback
      }
    });
  }
}

async function showCodeforcesIndex() {
  const index = document.getElementById('codeforcesIndex');
  const view = document.getElementById('codeforcesView');
  if (index) index.style.display = 'block';
  if (view) view.style.display = 'none';
  await populateCodeforcesList();
}

async function handleCodeforcesRoute() {
  await loadCodeforcesSolutions();
  const hash = window.location.hash.substring(1);
  if (hash === 'codeforces' || hash === '') {
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

// Initialization
document.addEventListener('DOMContentLoaded', async function() {
  await Promise.all([loadSidebar(), loadNavbar()]);

  const article = document.querySelector('article');
  if (!article) return;
  const currentPage = article.getAttribute('data-page');

  if (currentPage === 'about') {
    attachCertModalListeners();
  } else if (currentPage === 'opensource') {
    attachOpenSourceListeners();
  } else if (currentPage === 'codeforces') {
    await initCodeforces();
    handleCodeforcesRoute(); // Initial check for deep link
  }
});

// Hash change for Codeforces only
window.addEventListener('hashchange', function() {
  const article = document.querySelector('article');
  if (!article) return;
  const currentPage = article.getAttribute('data-page');

  if (currentPage === 'codeforces') {
    handleCodeforcesRoute();
  } else if (currentPage === 'opensource') {
    handleOpenSourceRoute();
  }
});
