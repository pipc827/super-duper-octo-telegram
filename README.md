# Spinning Wheel Generator

A fun, interactive spinning wheel website that generates a customizable wheel based on JSON data you upload!

## Features

✨ **Easy to Use**
- Upload a JSON file with a list of names or options
- Click to spin and get a random result

🎨 **Beautiful Design**
- Colorful gradient backgrounds
- Smooth animations and transitions
- Responsive design that works on all devices

⚡ **Fast & Lightweight**
- Pure HTML, CSS, and JavaScript
- No external dependencies
- Runs entirely in your browser

## How to Use

1. **Prepare your JSON file** with an array of strings:
   ```json
   ["Person", "Person2", "Person1"]
   ```

2. **Click the upload box** or select a JSON file

3. **Click the SPIN button** to spin the wheel

4. **Watch as the wheel spins** and reveals the winner!

## JSON Format

Your JSON file should contain a simple array of strings:

```json
["Alice", "Bob", "Charlie", "Diana"]
```

Each item in the array will appear as a segment on the wheel.

## Files

- `index.html` - Main HTML structure
- `style.css` - Styling and layout
- `script.js` - Wheel drawing and animation logic
- `README.md` - This file

## Supported Browsers

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with HTML5 Canvas support

## Tips

- The wheel has 15 different colors, so you can have as many segments as you want
- Text automatically scales to fit in segments
- The spin animation takes 4 seconds with realistic deceleration
- Mobile friendly - fully responsive design

Enjoy your spinning wheel! 🎡
