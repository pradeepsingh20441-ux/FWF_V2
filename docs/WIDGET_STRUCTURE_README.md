# Contest Widget - Organized Structure

## 📁 File Structure

```
fwf-site-main/
├── css/
│   └── contest-widget.css          # Widget styles
├── js/
│   └── contest-widget.js            # Widget JavaScript
├── widgets/
│   └── contest-widget.html          # Widget HTML template
└── *.html pages                     # All pages include widget
```

## 🔧 How to Include Widget in Pages

Add these lines before `</body>` tag in any HTML page:

```html
<!-- Contest Widget -->
<link rel="stylesheet" href="css/contest-widget.css">
<div id="contestWidgetContainer"></div>
<script>
  // Load contest widget HTML
  fetch('widgets/contest-widget.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('contestWidgetContainer').innerHTML = html;
      // Load widget JavaScript after HTML is loaded
      const script = document.createElement('script');
      script.src = 'js/contest-widget.js';
      document.body.appendChild(script);
    })
    .catch(error => console.error('Error loading contest widget:', error));
</script>
<!-- Contest Widget End -->
```

## ✅ Benefits

1. **Clean Code**: Widget code separate from page code
2. **Easy Updates**: Change widget once, updates everywhere
3. **Maintainable**: Clear file organization
4. **No Duplication**: Widget code not repeated in every page

## 🛠️ Making Changes

### To Update Widget Design:
- Edit `css/contest-widget.css`

### To Update Widget HTML:
- Edit `widgets/contest-widget.html`

### To Update Widget Behavior:
- Edit `js/contest-widget.js`

Changes will automatically reflect on all pages that include the widget!

## 📄 Current Pages Using Widget

✅ index.html  
⏳ about.html (needs migration)  
⏳ csr.html (needs migration)  
⏳ projects.html (needs migration)  
⏳ donation.html (needs migration)

## 🔄 Migration Status

**index.html** - ✅ Migrated to external files  
**Other pages** - ⏳ Still using inline widget code (to be migrated)
