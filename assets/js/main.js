// ============================================================
// HOLY BIBLE WEB APP - MODERN GLASSMORPHISM UI
// ============================================================

// ============================================================
// STATE MANAGEMENT
// ============================================================

const appState = {
    language: null,
    languageData: null,
    bookIndex: null,
    chapterIndex: null,
    currentView: 'language',
    fontSize: parseInt(localStorage.getItem('fontSize')) || 18,
    lineHeight: parseFloat(localStorage.getItem('lineHeight')) || 1.8,
    testamentFilter: 'all',
    sidebarOpen: false,
    cache: {}
};

// ============================================================
// LANGUAGE CONFIGURATION
// ============================================================

const languages = [
    { code: 'english', name: 'English', font: 'Inter' },
    { code: 'hindi', name: 'हिन्दी', font: 'Noto Serif Devanagari' },
    { code: 'tamil', name: 'தமிழ்', font: 'Baloo Thambi 2' },
    { code: 'telugu', name: 'తెలుగు', font: 'Noto Serif Telugu' },
    { code: 'malayalam', name: 'മലയാളം', font: 'Noto Serif Malayalam' },
    { code: 'kannada', name: 'ಕನ್ನಡ', font: 'Noto Serif Kannada' },
    { code: 'gujarati', name: 'ગુજરાતી', font: 'Noto Serif Gujarati' },
    { code: 'bengali', name: 'বাংলা', font: 'Noto Serif Bengali' },
    { code: 'marathi', name: 'मराठी', font: 'Noto Serif Devanagari' },
    { code: 'punjabi', name: 'ਪੰਜਾਬੀ', font: 'Noto Serif Gurmukhi' },
    { code: 'oriya', name: 'ଓଡ଼ିଆ', font: 'Noto Serif Oriya' },
    { code: 'nepali', name: 'नेपाली', font: 'Noto Serif Devanagari' },
    { code: 'afrikaans', name: 'Afrikaans', font: 'Inter' },
    { code: 'indonesian', name: 'Bahasa Indonesia', font: 'Inter' },
    { code: 'hungarian', name: 'Magyar', font: 'Inter' },
    { code: 'sepedi', name: 'Sepedi', font: 'Inter' },
    { code: 'xhosa', name: 'isiXhosa', font: 'Inter' },
    { code: 'zulu', name: 'isiZulu', font: 'Inter' }
];

// ============================================================
// DOM ELEMENTS
// ============================================================

const el = {
    // Views
    languageView: document.getElementById('languageView'),
    bookView: document.getElementById('bookView'),
    verseView: document.getElementById('verseView'),
    searchView: document.getElementById('searchView'),

    // Containers
    languageGrid: document.getElementById('languageGrid'),
    bookGrid: document.getElementById('bookGrid'),
    versesContainer: document.getElementById('versesContainer'),
    searchResultsContainer: document.getElementById('searchResultsContainer'),

    // Header Controls
    menuToggle: document.getElementById('menuToggle'),
    searchBtn: document.getElementById('searchBtn'),
    languageBtn: document.getElementById('languageBtn'),
    fontSizeBtn: document.getElementById('fontSizeBtn'),

    // Sidebar
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebarOverlay'),
    sidebarBookInfo: document.getElementById('sidebarBookInfo'),
    sidebarBookName: document.getElementById('sidebarBookName'),
    sidebarChapterName: document.getElementById('sidebarChapterName'),
    sidebarChapters: document.getElementById('sidebarChapters'),
    sidebarChapterGrid: document.getElementById('sidebarChapterGrid'),
    sidebarBooks: document.getElementById('sidebarBooks'),
    sidebarBookList: document.getElementById('sidebarBookList'),
    sidebarFilterAll: document.getElementById('sidebarFilterAll'),
    sidebarFilterOld: document.getElementById('sidebarFilterOld'),
    sidebarFilterNew: document.getElementById('sidebarFilterNew'),
    sidebarBookSearch: document.getElementById('sidebarBookSearch'),
    sidebarLanguageInfo: document.getElementById('sidebarLanguageInfo'),
    sidebarLanguageName: document.getElementById('sidebarLanguageName'),

    // Verse View
    verseViewTitle: document.getElementById('verseViewTitle'),
    verseViewSubtitle: document.getElementById('verseViewSubtitle'),
    prevChapterBtn: document.getElementById('prevChapterBtn'),
    nextChapterBtn: document.getElementById('nextChapterBtn'),
    prevChapterBtnBottom: document.getElementById('prevChapterBtnBottom'),
    nextChapterBtnBottom: document.getElementById('nextChapterBtnBottom'),

    // Search
    searchInput: document.getElementById('searchInput'),
    searchScope: document.getElementById('searchScope'),

    // Modals
    fontSizeModal: document.getElementById('fontSizeModal'),
    fontSizeSlider: document.getElementById('fontSizeSlider'),
    lineHeightSlider: document.getElementById('lineHeightSlider'),
    fontSizeValue: document.getElementById('fontSizeValue'),
    lineHeightValue: document.getElementById('lineHeightValue'),
    closeFontModal: document.getElementById('closeFontModal'),

    // Loading
    loadingIndicator: document.getElementById('loadingIndicator')
};

// ============================================================
// INITIALIZATION
// ============================================================

function init() {
    applyFontPreferences();
    setupEventListeners();
    renderLanguageSelection();
    handleRouteFromURL();
    showView('language');
}

// ============================================================
// EVENT LISTENERS
// ============================================================

function setupEventListeners() {
    // Sidebar
    el.menuToggle.addEventListener('click', toggleSidebar);
    el.sidebarOverlay.addEventListener('click', closeSidebar);

    // Header Actions
    el.searchBtn.addEventListener('click', () => navigateToSearch());
    el.languageBtn.addEventListener('click', () => showLanguageModal());
    el.fontSizeBtn.addEventListener('click', openFontModal);

    // Font Modal
    el.closeFontModal.addEventListener('click', () => el.fontSizeModal.classList.add('hidden'));
    el.fontSizeModal.addEventListener('click', (e) => {
        if (e.target === el.fontSizeModal) el.fontSizeModal.classList.add('hidden');
    });

    el.fontSizeSlider.addEventListener('input', () => {
        appState.fontSize = parseInt(el.fontSizeSlider.value);
        localStorage.setItem('fontSize', appState.fontSize);
        applyFontPreferences();
        updateFontSliderValues();
    });

    el.lineHeightSlider.addEventListener('input', () => {
        appState.lineHeight = parseFloat(el.lineHeightSlider.value);
        localStorage.setItem('lineHeight', appState.lineHeight);
        applyFontPreferences();
        updateFontSliderValues();
    });

    // Sidebar Filters
    el.sidebarFilterAll.addEventListener('click', () => setSidebarFilter('all'));
    el.sidebarFilterOld.addEventListener('click', () => setSidebarFilter('old'));
    el.sidebarFilterNew.addEventListener('click', () => setSidebarFilter('new'));

    // Sidebar Book Search
    el.sidebarBookSearch.addEventListener('input', debounce(() => renderSidebarBooks(), 300));

    // Chapter Navigation
    el.prevChapterBtn.addEventListener('click', navigateToPreviousChapter);
    el.nextChapterBtn.addEventListener('click', navigateToNextChapter);
    el.prevChapterBtnBottom.addEventListener('click', navigateToPreviousChapter);
    el.nextChapterBtnBottom.addEventListener('click', navigateToNextChapter);

    // Search
    el.searchInput.addEventListener('input', debounce(() => performSearch(), 500));
    el.searchScope.addEventListener('change', () => {
        if (el.searchInput.value.trim()) performSearch();
    });

    // Keyboard Navigation
    document.addEventListener('keydown', handleKeyboardNavigation);

    // Browser History
    window.addEventListener('popstate', (e) => {
        if (e.state) restoreState(e.state);
        else handleRouteFromURL();
    });
}

// ============================================================
// SIDEBAR MANAGEMENT
// ============================================================

function toggleSidebar() {
    appState.sidebarOpen = !appState.sidebarOpen;
    if (appState.sidebarOpen) {
        el.sidebar.classList.remove('-translate-x-full');
        el.sidebarOverlay.classList.remove('hidden');
    } else {
        closeSidebar();
    }
}

function closeSidebar() {
    appState.sidebarOpen = false;
    el.sidebar.classList.add('-translate-x-full');
    el.sidebarOverlay.classList.add('hidden');
}

function updateSidebar() {
    // Update language info
    if (appState.language) {
        const lang = languages.find(l => l.code === appState.language);
        el.sidebarLanguageName.textContent = lang ? lang.name : 'Unknown';
    }

    // Show/hide based on context
    if (appState.language && appState.languageData) {
        el.sidebarBooks.classList.remove('hidden');

        if (appState.bookIndex !== null) {
            // Show book info and chapters
            el.sidebarBookInfo.classList.remove('hidden');
            el.sidebarChapters.classList.remove('hidden');

            const allBooks = getAllBooks();
            const book = allBooks[appState.bookIndex];
            el.sidebarBookName.textContent = book.name;

            if (appState.chapterIndex !== null) {
                el.sidebarChapterName.textContent = `Chapter ${appState.chapterIndex + 1}`;
            }

            renderSidebarChapters();
        } else {
            el.sidebarBookInfo.classList.add('hidden');
            el.sidebarChapters.classList.add('hidden');
        }

        renderSidebarBooks();
    } else {
        el.sidebarBooks.classList.add('hidden');
        el.sidebarBookInfo.classList.add('hidden');
        el.sidebarChapters.classList.add('hidden');
    }
}

function renderSidebarChapters() {
    if (!appState.languageData || appState.bookIndex === null) return;

    const allBooks = getAllBooks();
    const book = allBooks[appState.bookIndex];

    el.sidebarChapterGrid.innerHTML = book.chapters.map((chapter, idx) => `
    <button
      class="chapter-badge aspect-square flex items-center justify-center rounded-xl font-semibold text-sm ${idx === appState.chapterIndex ? 'active' : ''}"
      onclick="selectChapter(${idx})"
    >
      ${idx + 1}
    </button>
  `).join('');
}

function renderSidebarBooks() {
    if (!appState.languageData) return;

    const searchQuery = el.sidebarBookSearch.value.toLowerCase().trim();
    const allBooks = getAllBooks();

    let filteredBooks = allBooks;

    if (appState.testamentFilter === 'old') {
        filteredBooks = allBooks.filter((_, idx) => idx < appState.languageData[0].books.length);
    } else if (appState.testamentFilter === 'new') {
        filteredBooks = allBooks.filter((_, idx) => idx >= appState.languageData[0].books.length);
    }

    if (searchQuery) {
        filteredBooks = filteredBooks.filter(book =>
            book.name.toLowerCase().includes(searchQuery)
        );
    }

    updateSidebarFilterButtons();

    el.sidebarBookList.innerHTML = filteredBooks.map(book => {
        const globalIndex = allBooks.findIndex(b => b.name === book.name);
        const isActive = globalIndex === appState.bookIndex;

        return `
      <button
        class="book-item w-full text-left px-3 py-2.5 rounded-xl glass-button text-sm ${isActive ? 'gradient-button' : ''}"
        onclick="selectBook(${globalIndex})"
      >
        <div class="font-semibold">${book.name}</div>
        <div class="text-xs opacity-70 mt-0.5">${book.chapters.length} chapters</div>
      </button>
    `;
    }).join('');
}

function setSidebarFilter(filter) {
    appState.testamentFilter = filter;
    renderSidebarBooks();
}

function updateSidebarFilterButtons() {
    el.sidebarFilterAll.className = 'flex-1 px-3 py-2 rounded-xl text-xs font-medium ' +
        (appState.testamentFilter === 'all' ? 'gradient-button' : 'glass-button');
    el.sidebarFilterOld.className = 'flex-1 px-3 py-2 rounded-xl text-xs font-medium ' +
        (appState.testamentFilter === 'old' ? 'gradient-button' : 'glass-button');
    el.sidebarFilterNew.className = 'flex-1 px-3 py-2 rounded-xl text-xs font-medium ' +
        (appState.testamentFilter === 'new' ? 'gradient-button' : 'glass-button');
}

// ============================================================
// VIEW MANAGEMENT
// ============================================================

function showView(viewName) {
    el.languageView.classList.add('hidden');
    el.bookView.classList.add('hidden');
    el.verseView.classList.add('hidden');
    el.searchView.classList.add('hidden');

    const viewMap = {
        'language': el.languageView,
        'book': el.bookView,
        'verse': el.verseView,
        'search': el.searchView
    };

    if (viewMap[viewName]) {
        viewMap[viewName].classList.remove('hidden');
        viewMap[viewName].classList.add('fade-in');
        appState.currentView = viewName;
    }

    updateSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// FONT MANAGEMENT
// ============================================================

function applyFontPreferences() {
    if (el.versesContainer) {
        el.versesContainer.style.fontSize = `${appState.fontSize}px`;
        el.versesContainer.style.lineHeight = appState.lineHeight;
    }
}

function updateFontSliderValues() {
    el.fontSizeValue.textContent = appState.fontSize;
    el.lineHeightValue.textContent = appState.lineHeight.toFixed(1);
}

function openFontModal() {
    el.fontSizeModal.classList.remove('hidden');
    el.fontSizeSlider.value = appState.fontSize;
    el.lineHeightSlider.value = appState.lineHeight;
    updateFontSliderValues();
}

function loadGoogleFont(fontFamily) {
    // Check if font is already loaded
    const existingLink = document.querySelector(`link[href*="${fontFamily.replace(/\s/g, '+')}"]`);
    if (existingLink) {
        // Font is already loaded, just apply it
        document.body.style.fontFamily = `"${fontFamily}", serif`;
        return;
    }

    // Create and append the Google Fonts link
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s/g, '+')}:wght@400;500;600;700&display=swap`;

    // Apply font after it loads
    link.onload = () => {
        document.body.style.fontFamily = `"${fontFamily}", serif`;
    };

    // Handle loading errors
    link.onerror = () => {
        console.error(`Failed to load font: ${fontFamily}`);
        // Fallback to default font
        document.body.style.fontFamily = `'Inter', serif`;
    };

    document.head.appendChild(link);

    // Apply font immediately for better UX (will be updated when font loads)
    document.body.style.fontFamily = `"${fontFamily}", 'Inter', serif`;
}

// ============================================================
// LOADING INDICATOR
// ============================================================

function showLoading() {
    el.loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
    el.loadingIndicator.classList.add('hidden');
}

// ============================================================
// LANGUAGE SELECTION
// ============================================================

function renderLanguageSelection() {
    el.languageGrid.innerHTML = languages.map(lang => `
    <button
      class="grid-item px-5 py-5 glass-card rounded-2xl hover:scale-105 transition-all font-medium text-base"
      onclick="selectLanguage('${lang.code}')"
    >
      ${lang.name}
    </button>
  `).join('');
}

function showLanguageModal() {
    showView('language');
    closeSidebar();
}

async function selectLanguage(languageCode) {
    showLoading();

    try {
        const data = await loadLanguageData(languageCode);

        appState.language = languageCode;
        appState.languageData = data;
        appState.bookIndex = null;
        appState.chapterIndex = null;

        const lang = languages.find(l => l.code === languageCode);
        if (lang) loadGoogleFont(lang.font);

        navigateToBookSelection();
        updateURL();

    } catch (error) {
        console.error('Failed to load language:', error);
        alert('Failed to load language data. Please try again.');
    } finally {
        hideLoading();
    }
}

async function loadLanguageData(languageCode) {
    if (appState.cache[languageCode]) {
        return appState.cache[languageCode];
    }

    const response = await fetch(`assets/data/${languageCode}.json`);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${languageCode}.json`);
    }

    const data = await response.json();
    appState.cache[languageCode] = data;

    return data;
}

// ============================================================
// BOOK SELECTION
// ============================================================

function navigateToBookSelection() {
    appState.bookIndex = null;
    appState.chapterIndex = null;
    appState.testamentFilter = 'all';

    renderBooks();
    showView('book');
    updateURL();
    pushState();
}

function renderBooks() {
    if (!appState.languageData) return;

    const allBooks = getAllBooks();

    el.bookGrid.innerHTML = allBooks.map((book, idx) => {
        const testament = idx < appState.languageData[0].books.length ?
            appState.languageData[0].testament :
            appState.languageData[1].testament;

        return `
      <button
        class="grid-item text-left p-5 glass-card rounded-2xl hover:scale-105 transition-all"
        onclick="selectBook(${idx})"
      >
        <div class="font-bold text-lg mb-2">${book.name}</div>
        <div class="text-sm text-white/60">${testament}</div>
        <div class="text-xs text-white/50 mt-2">${book.chapters.length} chapters</div>
      </button>
    `;
    }).join('');
}

function getAllBooks() {
    if (!appState.languageData) return [];
    return [...appState.languageData[0].books, ...appState.languageData[1].books];
}

function selectBook(bookIndex) {
    navigateToVerseReading(bookIndex, 0);
}

// ============================================================
// VERSE READING
// ============================================================

function selectChapter(chapterIndex) {
    navigateToVerseReading(appState.bookIndex, chapterIndex);
    closeSidebar();
}

function navigateToVerseReading(bookIndex, chapterIndex) {
    if (!appState.languageData) return;

    appState.bookIndex = bookIndex;
    appState.chapterIndex = chapterIndex;

    renderVerses();
    showView('verse');
    updateURL();
    pushState();
    applyFontPreferences();

    // Scroll to top when changing chapters
    // Use setTimeout to ensure content is rendered first
    setTimeout(() => {
        // Try multiple scroll methods for better compatibility
        try {
            // Method 1: Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
            try {
                // Method 2: Instant scroll to top
                window.scrollTo(0, 0);
            } catch (e2) {
                // Method 3: Scroll the main content area
                const mainElement = document.querySelector('main');
                if (mainElement) {
                    mainElement.scrollTop = 0;
                }
                // Method 4: Scroll the body
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        }
    }, 150);
}

function renderVerses() {
    if (!appState.languageData || appState.bookIndex === null || appState.chapterIndex === null) return;

    const allBooks = getAllBooks();
    const book = allBooks[appState.bookIndex];
    const chapter = book.chapters[appState.chapterIndex];

    el.verseViewTitle.textContent = book.name;
    el.verseViewSubtitle.textContent = `Chapter ${appState.chapterIndex + 1}`;

    el.versesContainer.innerHTML = chapter.verses.map(verse => `
    <div class="verse-card">
      <div class="flex gap-4">
        <span class="verse-number flex-shrink-0 font-bold text-lg select-none">${verse.number}</span>
        <p class="flex-1 text-white/90 leading-relaxed">${verse.text}</p>
      </div>
    </div>
  `).join('');

    updateChapterNavigationButtons();
}

function updateChapterNavigationButtons() {
    const allBooks = getAllBooks();
    const book = allBooks[appState.bookIndex];

    const hasPrevious = appState.chapterIndex > 0;
    const hasNext = appState.chapterIndex < book.chapters.length - 1;

    el.prevChapterBtn.disabled = !hasPrevious;
    el.nextChapterBtn.disabled = !hasNext;
    el.prevChapterBtnBottom.disabled = !hasPrevious;
    el.nextChapterBtnBottom.disabled = !hasNext;
}

function navigateToPreviousChapter() {
    if (appState.chapterIndex > 0) {
        navigateToVerseReading(appState.bookIndex, appState.chapterIndex - 1);
    }
}

function navigateToNextChapter() {
    const allBooks = getAllBooks();
    const book = allBooks[appState.bookIndex];

    if (appState.chapterIndex < book.chapters.length - 1) {
        navigateToVerseReading(appState.bookIndex, appState.chapterIndex + 1);
    }
}

// ============================================================
// SEARCH FUNCTIONALITY
// ============================================================

function navigateToSearch() {
    if (!appState.language) {
        alert('Please select a language first');
        return;
    }

    showView('search');
    el.searchInput.focus();
    pushState();
}

function performSearch() {
    const query = el.searchInput.value.trim().toLowerCase();

    if (!query) {
        el.searchResultsContainer.innerHTML = `
      <p class="text-center text-white/50 py-10">Enter a keyword to search the Bible</p>
    `;
        return;
    }

    if (query.length < 2) {
        el.searchResultsContainer.innerHTML = `
      <p class="text-center text-white/50 py-10">Please enter at least 2 characters</p>
    `;
        return;
    }

    showLoading();

    setTimeout(() => {
        const results = searchVerses(query);
        renderSearchResults(results, query);
        hideLoading();
    }, 100);
}

function searchVerses(query) {
    if (!appState.languageData) return [];

    const results = [];
    const allBooks = getAllBooks();
    const scope = el.searchScope.value;

    let booksToSearch = allBooks;
    if (scope === 'current' && appState.bookIndex !== null) {
        booksToSearch = [allBooks[appState.bookIndex]];
    }

    booksToSearch.forEach((book, bookIdx) => {
        book.chapters.forEach((chapter, chapterIdx) => {
            chapter.verses.forEach(verse => {
                if (verse.text.toLowerCase().includes(query)) {
                    results.push({
                        bookIndex: scope === 'current' ? appState.bookIndex : allBooks.findIndex(b => b.name === book.name),
                        bookName: book.name,
                        chapterIndex: chapterIdx,
                        chapterNumber: chapterIdx + 1,
                        verseNumber: verse.number,
                        text: verse.text
                    });
                }
            });
        });
    });

    return results;
}

function renderSearchResults(results, query) {
    if (results.length === 0) {
        el.searchResultsContainer.innerHTML = `
      <div class="text-center py-10">
        <p class="text-white/70 text-lg mb-2">No results found for "${escapeHtml(query)}"</p>
        <p class="text-white/50 text-sm">Try different keywords</p>
      </div>
    `;
        return;
    }

    el.searchResultsContainer.innerHTML = `
    <div class="mb-5 text-white/60">
      Found ${results.length} result${results.length > 1 ? 's' : ''}
    </div>
    <div class="space-y-4">
      ${results.map(result => `
        <div class="glass-card p-5 rounded-2xl hover:scale-[1.02] transition-all cursor-pointer"
             onclick="navigateToVerseReading(${result.bookIndex}, ${result.chapterIndex})">
          <div class="text-sm font-semibold text-purple-400 mb-2">
            ${result.bookName} ${result.chapterNumber}:${result.verseNumber}
          </div>
          <p class="text-white/90 leading-relaxed">
            ${highlightText(result.text, query)}
          </p>
        </div>
      `).join('')}
    </div>
  `;
}

function highlightText(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark>$1</mark>');
}

// ============================================================
// NAVIGATION & HISTORY
// ============================================================

function updateURL() {
    let url = '#/';

    if (appState.language) {
        url += appState.language;

        if (appState.bookIndex !== null) {
            url += `/${appState.bookIndex}`;

            if (appState.chapterIndex !== null) {
                url += `/${appState.chapterIndex}`;
            }
        }
    }

    window.history.replaceState(getState(), '', url);
}

function pushState() {
    window.history.pushState(getState(), '', window.location.href);
}

function getState() {
    return {
        language: appState.language,
        bookIndex: appState.bookIndex,
        chapterIndex: appState.chapterIndex,
        currentView: appState.currentView
    };
}

async function restoreState(state) {
    if (state.language) {
        showLoading();

        try {
            const data = await loadLanguageData(state.language);
            appState.language = state.language;
            appState.languageData = data;

            const lang = languages.find(l => l.code === state.language);
            if (lang) loadGoogleFont(lang.font);

            if (state.bookIndex !== null) {
                appState.bookIndex = state.bookIndex;

                if (state.chapterIndex !== null) {
                    appState.chapterIndex = state.chapterIndex;
                    renderVerses();
                    showView('verse');
                }
            } else {
                navigateToBookSelection();
            }
        } catch (error) {
            console.error('Failed to restore state:', error);
            showView('language');
        } finally {
            hideLoading();
        }
    } else {
        showView('language');
    }
}

async function handleRouteFromURL() {
    const hash = window.location.hash;

    if (!hash || hash === '#/' || hash === '#') {
        showView('language');
        return;
    }

    const parts = hash.substring(2).split('/');
    const [languageCode, bookIndexStr, chapterIndexStr] = parts;

    if (languageCode) {
        showLoading();

        try {
            const data = await loadLanguageData(languageCode);
            appState.language = languageCode;
            appState.languageData = data;

            const lang = languages.find(l => l.code === languageCode);
            if (lang) loadGoogleFont(lang.font);

            if (bookIndexStr !== undefined) {
                const bookIndex = parseInt(bookIndexStr);
                appState.bookIndex = bookIndex;

                if (chapterIndexStr !== undefined) {
                    const chapterIndex = parseInt(chapterIndexStr);
                    appState.chapterIndex = chapterIndex;
                    renderVerses();
                    showView('verse');
                } else {
                    navigateToVerseReading(bookIndex, 0);
                }
            } else {
                navigateToBookSelection();
            }
        } catch (error) {
            console.error('Failed to handle route:', error);
            showView('language');
        } finally {
            hideLoading();
        }
    }
}

// ============================================================
// KEYBOARD NAVIGATION
// ============================================================

function handleKeyboardNavigation(e) {
    if (appState.currentView !== 'verse') return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateToPreviousChapter();
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateToNextChapter();
    }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================================
// START APPLICATION
// ============================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
