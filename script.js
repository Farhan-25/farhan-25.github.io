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
  'iit-madras': {
    title: 'IIT Madras Certificate',
    src: 'Certificates/IIT Madras BS-DS.pdf'
  },
  'thm-pre-security': {
    title: 'TryHackMe Pre Security Certificate',
    src: 'Certificates/THM-Pre Security.pdf'
  },
  'thm-cybersecurity-101': {
    title: 'TryHackMe Cyber Security 101',
    src: 'Certificates/THM-CyberSecurity101.pdf'
  },
  'intro-cybersecurity': {
    title: 'Introduction to Cybersecurity Certificate',
    src: 'Certificates/Introduction_to_Cybersecurity_certificate_farhansaiyed2511-gmail-com_c0f41631-fb38-4606-b26d-bdd98cd3c89a.pdf'
  },
  'google-cybersecurity': {
    title: 'Google Cybersecurity Certificate',
    src: 'Certificates/Google Cybersecurity Certificate.pdf'
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
    btn.addEventListener('click', function () {
      const certKey = this.getAttribute('data-cert');
      openCertModal(certKey);
    });
  });

  if (certModalOverlay) certModalOverlay.addEventListener('click', closeCertModal);
  if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
}


// Open Source Functionality
let openSourceData = {};

async function loadOpenSourceData() {
  if (Object.keys(openSourceData).length > 0) {
    return openSourceData;
  }
  try {
    // Use a timestamp to prevent caching and ensure fresh data
    const response = await fetch('opensource_data.json?t=' + new Date().getTime());
    if (!response.ok) throw new Error('Failed to load open source data');
    openSourceData = await response.json();
    return openSourceData;
  } catch (error) {
    console.error('Error loading open source data:', error);
    return {};
  }
}

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

async function handleOpenSourceRoute() {
  await loadOpenSourceData();
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

async function attachOpenSourceListeners() {
  await loadOpenSourceData();
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
document.addEventListener('keydown', function (e) {
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

    newCopyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await copyTextToClipboard(solution);
      const originalHTML = newCopyBtn.innerHTML;
      newCopyBtn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon><span>Copied!</span>';
      newCopyBtn.classList.add('copied');
      setTimeout(() => {
        newCopyBtn.innerHTML = originalHTML;
        newCopyBtn.classList.remove('copied');
      }, 2000);
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

// Writeups Logic
let writeupsData = [];
let filteredWriteups = [];
let activeWriteupCategory = 'all';

async function loadWriteupsData() {
  if (writeupsData.length > 0) {
    return writeupsData;
  }
  try {
    const response = await fetch('writeups/writeups_data.json?t=' + new Date().getTime());
    if (!response.ok) throw new Error('Failed to load writeups data');
    const data = await response.json();
    writeupsData = data.writeups || [];
    return writeupsData;
  } catch (error) {
    console.error('Error loading writeups data:', error);
    return [];
  }
}

function resolveRelativePath(baseDir, relativePath) {
  if (!relativePath || relativePath.startsWith('http://') || relativePath.startsWith('https://') || relativePath.startsWith('/') || relativePath.startsWith('data:')) {
    return relativePath;
  }
  const baseParts = baseDir.split('/').filter(Boolean);
  const relParts = relativePath.split('/').filter(Boolean);
  for (const part of relParts) {
    if (part === '..') {
      baseParts.pop();
    } else if (part !== '.') {
      baseParts.push(part);
    }
  }
  return baseParts.join('/');
}

function renderWriteupsList() {
  const grid = document.getElementById('writeups-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const listToRender = filteredWriteups.length > 0 || (document.getElementById('writeupSearch') && document.getElementById('writeupSearch').value.trim() !== '') 
    ? filteredWriteups 
    : writeupsData;

  if (listToRender.length === 0) {
    grid.innerHTML = `
      <div class="no-writeups-found">
        <p>No writeups found matching your search.</p>
      </div>
    `;
    return;
  }

  listToRender.forEach(writeup => {
    const card = document.createElement('div');
    card.className = 'writeup-card';
    card.setAttribute('data-slug', writeup.slug);

    const diffClass = (writeup.difficulty || 'Easy').toLowerCase();
    const tagsHtml = (writeup.tags || [])
      .map(tag => `<span class="writeup-tag">${tag}</span>`)
      .join('');

    card.innerHTML = `
      <div>
        <div class="writeup-card-header">
          <h3 class="writeup-card-title">${writeup.name}</h3>
          <span class="writeup-difficulty-badge ${diffClass}">${writeup.difficulty || 'Easy'}</span>
        </div>
        <p class="writeup-card-desc">${writeup.description || 'CTF Challenge walkthrough and solution.'}</p>
      </div>
      <div class="writeup-card-meta">
        <div class="writeup-card-platform">
          <ion-icon name="flag-outline"></ion-icon>
          <span>${writeup.platform || 'TryHackMe'}</span>
        </div>
        <div class="writeup-tags-list">
          ${tagsHtml}
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      window.location.hash = `writeups/${writeup.slug}`;
    });

    grid.appendChild(card);
  });
}

function applyWriteupFilters() {
  const searchInput = document.getElementById('writeupSearch');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  filteredWriteups = writeupsData.filter(item => {
    const matchesCategory = activeWriteupCategory === 'all' || 
      (item.platform && item.platform.toLowerCase() === activeWriteupCategory.toLowerCase());
    
    const matchesSearch = query === '' ||
      item.name.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(query))) ||
      (item.difficulty && item.difficulty.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  renderWriteupsList();
}

function prepareMarkdown(markdownText, baseDir) {
  // Normalize markdown image links: ![alt](path)
  return markdownText.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, rawPath) => {
    let cleanPath = rawPath.trim();
    if (!cleanPath.startsWith('http://') && !cleanPath.startsWith('https://') && !cleanPath.startsWith('/') && !cleanPath.startsWith('data:')) {
      cleanPath = resolveRelativePath(baseDir, cleanPath);
    }
    return `![${alt}](${cleanPath})`;
  });
}

function fallbackCopy(text) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    return false;
  }
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      return fallbackCopy(text);
    }
  }
  return fallbackCopy(text);
}

async function renderMarkdown(writeup) {
  const listView = document.getElementById('writeups-list-view');
  const detailView = document.getElementById('writeup-detail-view');
  const contentDiv = document.getElementById('markdown-content');
  const detailTitle = document.getElementById('writeup-detail-title');
  const detailPlatform = document.getElementById('writeup-detail-platform');
  const detailDifficulty = document.getElementById('writeup-detail-difficulty');
  const detailTags = document.getElementById('writeup-detail-tags');

  if (!detailView || !contentDiv) return;

  if (listView) listView.style.display = 'none';
  detailView.style.display = 'block';

  // Set Header Metadata
  if (detailTitle) detailTitle.textContent = writeup.name;
  if (detailPlatform) detailPlatform.textContent = writeup.platform || 'TryHackMe';
  if (detailDifficulty) {
    const diffClass = (writeup.difficulty || 'Easy').toLowerCase();
    detailDifficulty.textContent = writeup.difficulty || 'Easy';
    detailDifficulty.className = `writeup-difficulty-badge ${diffClass}`;
  }
  if (detailTags) {
    detailTags.innerHTML = (writeup.tags || [])
      .map(tag => `<span class="writeup-tag">${tag}</span>`)
      .join('');
  }

  contentDiv.innerHTML = '<div style="padding: 20px; color: var(--light-gray);">Loading writeup...</div>';

  try {
    const response = await fetch(writeup.path + '?t=' + new Date().getTime());
    if (!response.ok) throw new Error('Markdown file not found');
    const rawText = await response.text();

    // Determine markdown base folder (e.g. "writeups/thm")
    const pathParts = writeup.path.split('/');
    pathParts.pop();
    const baseDir = pathParts.join('/');

    // Pre-process markdown images to resolve paths relative to markdown source
    const preparedMarkdown = prepareMarkdown(rawText, baseDir);

    if (typeof marked !== 'undefined') {
      contentDiv.innerHTML = marked.parse(preparedMarkdown);
    } else {
      contentDiv.textContent = rawText;
    }

    // Wrap tables in responsive wrapper
    contentDiv.querySelectorAll('table').forEach(table => {
      if (!table.parentElement.classList.contains('writeup-table-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'writeup-table-wrapper';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });

    // Wrap images in container and ensure paths are correct
    contentDiv.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:')) {
        img.src = src; // ensure absolute DOM resolution
      }
      if (!img.parentElement.classList.contains('writeup-img-container')) {
        const container = document.createElement('div');
        container.className = 'writeup-img-container';
        img.parentNode.insertBefore(container, img);
        container.appendChild(img);
      }
    });

    // Apply syntax highlighting & inject copy buttons
    contentDiv.querySelectorAll('pre').forEach(pre => {
      const code = pre.querySelector('code');
      if (code && typeof hljs !== 'undefined') {
        hljs.highlightElement(code);
      }

      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-code-btn';
      copyBtn.innerHTML = '<ion-icon name="copy-outline"></ion-icon><span>Copy</span>';
      copyBtn.setAttribute('title', 'Copy code to clipboard');

      copyBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const textToCopy = (code ? code.innerText : pre.innerText).trim();
        await copyTextToClipboard(textToCopy);

        copyBtn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon><span>Copied!</span>';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = '<ion-icon name="copy-outline"></ion-icon><span>Copy</span>';
          copyBtn.classList.remove('copied');
        }, 2000);
      });

      pre.style.position = 'relative';
      pre.appendChild(copyBtn);
    });

    // Scroll smoothly to top of detail view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error('Error rendering markdown:', err);
    contentDiv.innerHTML = `
      <div class="no-writeups-found">
        <p>Failed to load writeup content. Please verify that the file exists.</p>
      </div>
    `;
  }
}

function showWriteupList() {
  const listView = document.getElementById('writeups-list-view');
  const detailView = document.getElementById('writeup-detail-view');
  if (listView) listView.style.display = 'block';
  if (detailView) detailView.style.display = 'none';
}

async function handleWriteupRoute() {
  await loadWriteupsData();
  const hash = window.location.hash.substring(1);

  if (hash === 'writeups' || hash === '') {
    showWriteupList();
    return;
  }

  if (hash.startsWith('writeups/')) {
    const rawTarget = hash.replace('writeups/', '');
    const decodedTarget = decodeURIComponent(rawTarget).toLowerCase();

    const writeup = writeupsData.find(w => 
      w.slug.toLowerCase() === decodedTarget ||
      w.name.toLowerCase() === decodedTarget ||
      w.name.toLowerCase().replace(/\s+/g, '-') === decodedTarget
    );

    if (writeup) {
      await renderMarkdown(writeup);
    } else {
      showWriteupList();
    }
  } else {
    showWriteupList();
  }
}

async function initWriteups() {
  await loadWriteupsData();
  filteredWriteups = [...writeupsData];

  const searchInput = document.getElementById('writeupSearch');
  if (searchInput && !searchInput.hasAttribute('data-listener-attached')) {
    searchInput.setAttribute('data-listener-attached', 'true');
    searchInput.addEventListener('input', applyWriteupFilters);
  }

  const filterBtns = document.querySelectorAll('.writeup-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeWriteupCategory = this.getAttribute('data-filter') || 'all';
      applyWriteupFilters();
    });
  });

  const backBtn = document.getElementById('writeup-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.hash = 'writeups';
      showWriteupList();
    });
  }

  renderWriteupsList();
  await handleWriteupRoute();
}

// Initialization
document.addEventListener('DOMContentLoaded', async function () {
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
    handleCodeforcesRoute();
  } else if (currentPage === 'writeups') {
    await initWriteups();
  }
});

// Global Hash change listener
window.addEventListener('hashchange', function () {
  const article = document.querySelector('article');
  if (!article) return;
  const currentPage = article.getAttribute('data-page');

  if (currentPage === 'codeforces') {
    handleCodeforcesRoute();
  } else if (currentPage === 'opensource') {
    handleOpenSourceRoute();
  } else if (currentPage === 'writeups') {
    handleWriteupRoute();
  }
});

