import "./chunk-2P3A4VVY.js";

// src/scripts/modules/toc.ts
function setupToC() {
  const container = document.getElementById("right-pane");
  const toc = document.getElementById("toc");
  if (!toc || !container) return;
  const sections = document.getElementById("content").querySelectorAll("h2, h3, h4, h5, h6");
  const links = toc.querySelectorAll("a");
  for (const link of links) {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      target.scrollIntoView({ behavior: "smooth" });
    });
  }
  function changeLinkState() {
    let index = sections.length;
    while (--index && container.scrollTop + 50 < sections[index].offsetTop) {
    }
    links.forEach((link) => link.classList.remove("active"));
    links[index].classList.add("active");
  }
  changeLinkState();
  container.addEventListener("scroll", changeLinkState);
}

// src/scripts/modules/expanders.ts
function setupExpanders() {
  const expanders = Array.from(document.querySelectorAll("#menu .submenu-item .collapse-button"));
  for (const expander of expanders) {
    const li = expander.parentElement?.parentElement;
    if (!li) {
      continue;
    }
    expander.addEventListener("click", (e) => {
      if (e.target.closest(".submenu-item,.item") !== li) return;
      e.preventDefault();
      e.stopPropagation();
      const ul = li.querySelector("ul");
      ul.style.height = `${ul.scrollHeight}px`;
      setTimeout(() => li.classList.toggle("expanded"), 1);
      setTimeout(() => ul.style.height = ``, 200);
    });
  }
}

// src/scripts/common/parents.ts
function parents(el, selector) {
  const result = [];
  for (let p = el && el.parentElement; p; p = p.parentElement) {
    if (p.matches(selector)) result.push(p);
  }
  return result;
}

// src/scripts/modules/mobile.ts
function setupMobileMenu() {
  function toggleMobileMenu(event) {
    event.stopPropagation();
    const isOpen = document.body.classList.contains("menu-open");
    if (isOpen) return document.body.classList.remove("menu-open");
    return document.body.classList.add("menu-open");
  }
  const showMenuButton = document.getElementById("show-menu-button");
  showMenuButton?.addEventListener("click", toggleMobileMenu);
  window.addEventListener("click", (e) => {
    const isOpen = document.body.classList.contains("menu-open");
    if (!isOpen) return;
    if (parents(e.target, "#left-pane").length) return;
    return toggleMobileMenu(e);
  });
}

// src/scripts/common/debounce.ts
function debounce(executor, delay) {
  let timeout;
  return function(...args) {
    const callback = () => {
      timeout = null;
      Reflect.apply(executor, null, args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
}

// src/scripts/common/parsehtml.ts
function parseHTML(html, fragment = false) {
  const template = document.createElement("template");
  template.innerHTML = html;
  const node = template.content.cloneNode(true);
  if (fragment) return node;
  return node.childNodes.length > 1 ? node.childNodes : node.childNodes[0];
}

// src/scripts/modules/search.ts
var fuseInstance = null;
function buildResultItem(result) {
  return `<a class="search-result-item" href="./${result.id}">
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-note">${result.path || "Home"}</div>
            </a>`;
}
function setupSearch() {
  const searchInput = document.querySelector(".search-input");
  if (!searchInput) {
    return;
  }
  searchInput.addEventListener("keyup", debounce(async () => {
    const query = searchInput.value;
    if (query.length < 3) return;
    const resp = await fetchResults(query);
    const results = resp.results.slice(0, 5);
    const lines = [`<div class="search-results">`];
    for (const result of results) {
      lines.push(buildResultItem(result));
    }
    lines.push("</div>");
    const container = parseHTML(lines.join(""));
    const rect = searchInput.getBoundingClientRect();
    container.style.top = `${rect.bottom}px`;
    container.style.left = `${rect.left}px`;
    container.style.minWidth = `${rect.width}px`;
    const existing = document.querySelector(".search-results");
    if (existing) existing.replaceWith(container);
    else document.body.append(container);
  }, 500));
  window.addEventListener("click", (e) => {
    const existing = document.querySelector(".search-results");
    if (!existing) return;
    if (parents(e.target, ".search-results,.search-item").length) return;
    if (existing) existing.remove();
  });
}
async function fetchResults(query) {
  const linkHref = document.head.querySelector("link[rel=stylesheet]")?.getAttribute("href");
  const rootUrl = linkHref?.split("/").slice(0, -2).join("/") || ".";
  if (window.glob.isStatic) {
    if (!fuseInstance) {
      const searchIndex = await (await fetch(`${rootUrl}/search-index.json`)).json();
      const Fuse = (await import("./fuse-ZEXUGBUY.js")).default;
      fuseInstance = new Fuse(searchIndex, {
        keys: [
          "title",
          "content"
        ],
        includeScore: true,
        threshold: 0.65,
        ignoreDiacritics: true,
        ignoreLocation: true,
        ignoreFieldNorm: true,
        useExtendedSearch: true
      });
    }
    const results = fuseInstance.search(query, { limit: 5 });
    console.debug("Search results:", results);
    const processedResults = results.map(({ item, score }) => ({
      ...item,
      id: rootUrl + "/" + item.id,
      score
    }));
    return { results: processedResults };
  } else {
    const ancestor = document.body.dataset.ancestorNoteId;
    const resp = await fetch(`api/notes?search=${query}&ancestorNoteId=${ancestor}`);
    return await resp.json();
  }
}

// src/scripts/modules/theme.ts
var themeRootEl = document.documentElement;
function setupThemeSelector() {
  const themeSwitch = document.querySelector(".theme-selection input");
  themeSwitch?.addEventListener("change", () => {
    const theme = themeSwitch.checked ? "dark" : "light";
    setTheme(theme);
    localStorage.setItem("theme", theme);
  });
}
function setTheme(theme) {
  if (theme === "dark") {
    themeRootEl.classList.add("theme-dark");
    themeRootEl.classList.remove("theme-light");
  } else {
    themeRootEl.classList.remove("theme-dark");
    themeRootEl.classList.add("theme-light");
  }
}

// src/scripts/modules/mermaid.ts
async function setupMermaid() {
  const mermaidEls = document.querySelectorAll("#content pre code.language-mermaid");
  if (mermaidEls.length === 0) {
    return;
  }
  const mermaid = (await import("./mermaid.core-TRORSKKS.js")).default;
  for (const codeBlock of mermaidEls) {
    const parentPre = codeBlock.parentElement;
    if (!parentPre) {
      continue;
    }
    const mermaidDiv = document.createElement("div");
    mermaidDiv.classList.add("mermaid");
    mermaidDiv.innerHTML = codeBlock.innerHTML;
    parentPre.replaceWith(mermaidDiv);
  }
  mermaid.init();
}

// src/scripts/modules/math.ts
async function setupMath() {
  const anyMathBlock = document.querySelector("#content .math-tex");
  if (!anyMathBlock) {
    return;
  }
  const renderMathInElement = (await import("./auto-render-UXC7LJGS.js")).default;
  await import("./mhchem-DNUT7O3K.js");
  const contentEl = document.getElementById("content");
  if (!contentEl) return;
  renderMathInElement(contentEl);
  document.body.classList.add("math-loaded");
}

// src/scripts/modules/api.ts
async function fetchNote(noteId = null) {
  if (!noteId) {
    noteId = document.body.getAttribute("data-note-id");
  }
  const resp = await fetch(`api/notes/${noteId}`);
  return await resp.json();
}
var api_default = {
  fetchNote
};

// src/scripts/index.ts
function $try(func, ...args) {
  try {
    func.apply(func, args);
  } catch (e) {
    console.error(e);
  }
}
Object.assign(window, api_default);
$try(setupThemeSelector);
$try(setupToC);
$try(setupExpanders);
$try(setupMobileMenu);
$try(setupSearch);
function setupTextNote() {
  $try(setupMermaid);
  $try(setupMath);
}
document.addEventListener(
  "DOMContentLoaded",
  () => {
    const noteType = determineNoteType();
    if (noteType === "text") {
      setupTextNote();
    }
    const toggleMenuButton = document.getElementById("toggleMenuButton");
    const layout = document.getElementById("layout");
    if (toggleMenuButton && layout) {
      toggleMenuButton.addEventListener("click", () => layout.classList.toggle("showMenu"));
    }
  },
  false
);
function determineNoteType() {
  const bodyClass = document.body.className;
  const match = bodyClass.match(/type-([^\s]+)/);
  return match ? match[1] : null;
}
