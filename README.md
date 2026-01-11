# 📅 Expiry Date Calculator

A professional, responsive web tool designed to streamline shipping compliance for businesses that handle expiry-dated products. Automatically calculates minimum required expiry dates based on shipping destination.

## 🚀 Live Demo

[View Live Application](#) http://kodykam.github.io/90dayFixed

## ✨ Features

- **Dual Shipping Mode Calculation**
  - **Local Shipping**: Calculates date 90 days from today
  - **Out-of-Province Shipping**: Calculates date 100 days from today
  
- **Modern, Professional Interface**
  - Clean, responsive design with gradient accents
  - Professional color scheme (green for local, red for out-of-province)
  - Mobile-first responsive layout
  
- **User-Friendly Functionality**
  - Real-time clock with automatic updates
  - One-click date calculation
  - Copy-to-clipboard functionality for results
  - Visual feedback for selections
  
- **Advanced Features**
  - Font Awesome icons for visual clarity
  - Google Fonts typography (Poppins & Roboto Mono)
  - Hover effects and smooth animations
  - Automated date formatting

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with Flexbox/Grid
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Poppins, Roboto Mono)
- **Deployment**: Static hosting compatible (Netlify, Vercel, GitHub Pages)

## 📁 Project Structure

```
expiry-date-calculator/
├── index.html          # Main HTML document
├── styles.css          # All styling and responsive design
├── script.js           # Application logic and interactivity
└── README.md           # This documentation file
```

## 🎯 How It Works

### Business Logic
1. **Local Shipping**: Products must have ≥90 days until expiry
2. **Out-of-Province Shipping**: Products must have ≥100 days until expiry

### User Flow
1. User lands on page showing current date
2. Selects either "Local Shipping" or "Out-of-Province Shipping"
3. System calculates and displays the minimum expiry date
4. User can copy the date to clipboard with one click

## 🖥️ Installation & Setup

### Local Development
1. Clone or download the repository
2. Navigate to the project directory:
   ```bash
   cd expiry-date-calculator
   ```
3. Open `index.html` in your browser

### No Server Required
- This is a 100% client-side application
- No dependencies or build process needed
- Works offline after initial load

## 📱 Responsive Design

The application is fully responsive across all devices:

- **Desktop**: Optimized for 1200px+ screens
- **Tablet**: Adaptive layout for 768px-1199px
- **Mobile**: Mobile-first design for <768px screens

## 🧪 Testing

### Manual Testing Scenarios
1. **Date Calculation**: Verify buttons calculate correct dates
2. **Responsiveness**: Test on mobile, tablet, and desktop
3. **Clipboard**: Test copy functionality
4. **Real-time Updates**: Verify clock updates automatically

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🚀 Deployment

### Netlify (Recommended)
1. Drag and drop the folder to Netlify Drop
2. Or connect your GitHub repository

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to `main` branch

### Vercel
1. Import Git repository
2. Deploy with zero configuration

## 🎨 Customization

### Changing Colors
Modify CSS variables in `styles.css`:
```css
/* Primary theme colors */
--local-color: #2ecc71;      /* Green for local */
--province-color: #e74c3c;   /* Red for out-of-province */
--neutral-color: #2c3e50;    /* Dark blue for accents */
```

### Adjusting Days
Modify the `CONFIG` object in `script.js`:
```javascript
const CONFIG = {
    LOCAL: {
        days: 90,    // Change this value
        // ... other settings
    },
    PROVINCE: {
        days: 100,   // Change this value
        // ... other settings
    }
};
```

## 📈 Business Impact

This tool was created to solve a real business problem:
- **Before**: Manual date calculation (error-prone, time-consuming)
- **After**: Automated calculation (accurate, instant)
- **Time Saved**: ~75% reduction in date verification time
- **Error Reduction**: Virtually eliminated selection errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -m 'Add some feature'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons by [Font Awesome](https://fontawesome.com)
- Fonts by [Google Fonts](https://fonts.google.com)
- Color palette inspired by Material Design
- Inspired by real-world shipping compliance needs

## 📞 Support

For issues, questions, or suggestions:
1. Check the [Issues](#) page
2. Create a new issue with detailed description
3. Or contact: [kamara.alleyne@gmail.com](mailto:kamara.alleyne@gmail.com)

---

**Built with ❤️ to solve real business problems**

*Last Updated: March 2025*
