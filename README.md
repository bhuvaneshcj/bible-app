# 📖 Holy Bible Web App

A modern, multilingual Bible reading web application built with vanilla JavaScript, Tailwind CSS, and HTML. Read the Holy Bible in 18+ languages with a clean, distraction-free interface.

## ✨ Features

### 🌍 Multilingual Support
- **18 Languages**: English, Hindi, Tamil, Telugu, Malayalam, Kannada, Gujarati, Bengali, Marathi, Punjabi, Oriya, Nepali, Afrikaans, Indonesian, Hungarian, Sepedi, Xhosa, and Zulu
- **Dynamic Font Loading**: Automatically loads Google Fonts optimized for each language
- **Language-specific Typography**: Noto Serif fonts for Indian languages, Merriweather for others

### 📚 Complete Bible Navigation
- **Testament Organization**: Browse Old Testament (39 books) and New Testament (27 books)
- **Book Filtering**: Filter by testament or search books by name
- **Chapter Selection**: Grid-based chapter selection for easy navigation
- **Verse Reading**: Clean, readable typography optimized for long reading sessions

### 🔍 Powerful Search
- **Full-text Search**: Search verses across the entire Bible or current book
- **Keyword Highlighting**: Found text is highlighted in results
- **Instant Results**: Debounced search for smooth performance

### 🎨 Customization
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Font Size Control**: Adjust text size (14-24px) for comfortable reading
- **Line Height Adjustment**: Customize line spacing (1.5-2.5) for optimal readability
- **Preferences Persistence**: All settings saved to localStorage

### ⌨️ Keyboard Navigation
- **Arrow Keys**: Navigate between chapters (← Previous, → Next)
- **Efficient Reading**: Quick chapter navigation without mouse

### 🔗 URL Routing & History
- **Shareable URLs**: Each chapter has a unique URL (e.g., `#/english/0/0`)
- **Browser History**: Back/forward buttons work correctly
- **Deep Linking**: Share direct links to specific chapters

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Large, easy-to-tap buttons
- **Progressive Enhancement**: Works on all modern browsers

### ♿ Accessibility
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Keyboard Accessible**: Full keyboard navigation support
- **Screen Reader Friendly**: ARIA labels and meaningful alt text
- **High Contrast**: Dark mode for reduced eye strain
- **Reduced Motion**: Respects prefers-reduced-motion setting

## 🚀 Technology Stack

- **HTML5**: Semantic markup
- **Tailwind CSS 4**: Utility-first CSS via CDN
- **Vanilla JavaScript**: No frameworks, no build tools
- **Google Fonts API**: Dynamic font loading
- **localStorage**: Persistent user preferences

## 📂 Project Structure

```
/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── main.css       # Custom styles
│   ├── js/
│   │   └── main.js        # Application logic
│   ├── data/              # Bible JSON files
│   │   ├── english.json
│   │   ├── hindi.json
│   │   ├── tamil.json
│   │   └── ... (15 more)
│   └── favicon/           # Icons and manifest
└── README.md
```

## 📊 Data Format

Each language JSON follows this structure:

```json
[
  {
    "testament": "Old Testament / पुराना नियम / etc",
    "books": [
      {
        "name": "Genesis / उत्पत्ति / etc",
        "chapters": [
          {
            "number": 1,
            "verses": [
              {
                "number": 1,
                "text": "In the beginning..."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "testament": "New Testament / नया नियम / etc",
    "books": [ /* ... */ ]
  }
]
```

## 🎯 User Flow

1. **Language Selection** → Select your preferred language
2. **Book Selection** → Browse and filter books (Old/New Testament)
3. **Chapter Selection** → Choose a chapter from grid
4. **Verse Reading** → Read with navigation controls
5. **Search** (Optional) → Search verses across Bible

## 💡 Key Implementation Details

### State Management
- Central `appState` object manages application state
- Reactive updates trigger UI re-renders
- State persisted in URL and localStorage

### Font Loading
- Fonts loaded lazily when language is selected
- Prevents loading all fonts upfront
- Font applied dynamically to reading container

### Performance Optimizations
- **Data Caching**: Loaded language data cached in memory
- **Debounced Search**: Search input debounced to reduce operations
- **Lazy Loading**: Only active view rendered in DOM
- **Minimal Reflows**: Efficient DOM manipulation

### URL Routing
- Hash-based routing (#/language/book/chapter)
- History API for back/forward navigation
- Deep linking support

## 🔧 Customization

### Adding a New Language

1. Add language JSON to `assets/data/`
2. Update `languages` array in `main.js`:

```javascript
{ 
  code: 'newlang', 
  name: 'Language Name', 
  font: 'Google Font Name' 
}
```

### Modifying Theme Colors

Edit Tailwind classes in HTML or add custom CSS in `main.css`.

### Adjusting Typography

Modify default values in `appState`:

```javascript
fontSize: 18,      // Default font size
lineHeight: 1.8    // Default line height
```

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

This project is open source and available for personal and educational use.

## 👨‍💻 Author

**Bhuvanesh CJ**

## 🙏 Acknowledgments

- Bible text from public domain sources
- Google Fonts for typography
- Tailwind CSS for styling utilities

---

**Note**: This is a static site designed for GitHub Pages. No server or build process required.
