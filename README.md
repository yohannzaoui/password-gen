
---

# 📖 Technical Documentation - Password GEN Pro

This documentation provides a detailed overview of the internal mechanics, accessibility features, and security algorithms of the application.

## 🛠️ Project Architecture

The application is built without heavy frameworks to ensure maximum speed and secure local execution.

* **Frontend**: HTML5 / CSS3 (Bootstrap 5.3)
* **Logic**: Vanilla JavaScript (ES6+)
* **Storage**: Browser LocalStorage (used for persisting language, theme, and accessibility preferences).

---

## 🔐 Security Algorithms

### 1. Entropy Calculation (Password Strength)

The application uses **Shannon Entropy** to measure the true complexity and unpredictability of a generated string.

**The formula used:**


Where:

*  = Length of the password.
*  = Size of the pool of possible characters (e.g., 26 lowercase + 10 digits = 36).

### 2. Crack Time Estimation

The estimation is based on a brute-force attack scenario using modern high-performance hardware (High-end GPUs) capable of testing approximately **100 billion combinations per second (/sec)**.

---

## ⚙️ Detailed JavaScript Functions

### `generate()`

* **Password Mode**: Generates a random string by drawing from a dynamic `pool` based on user-selected criteria.
* **Passphrase Mode**: Creates pronounceable blocks (alternating consonants and vowels) to balance memorability and security.

### `updateStrength(password)`

Analyzes the composition (via Regular Expressions) to determine the  value and updates the visual progress bar:

* **Red**: < 45 bits (Weak)
* **Yellow**: 45 - 80 bits (Medium)
* **Green**: > 80 bits (Strong)

### `renderHistory()`

Manages the display of the last 10 generated passwords.

* **Display Fix**: Implements `word-break: break-all` and `white-space: normal` to ensure 64-character passwords wrap onto multiple lines without breaking the layout.

---

## 🚀 User Guide

1. **Generation**: Choose the mode (Password/Passphrase) and length (4 to 64).
2. **Copy & Transfer**: Use the 📋 icon for the clipboard or the 📱 icon to display a QR Code.
3. **History**: Click on any previous password in the sidebar to re-copy it instantly.
4. **Export**: Click the 📥 icon to download your current history as a `.txt` file.

---

## ♿ Accessibility & Preferences

* **High Contrast**: A dedicated "Yellow on Black" theme for maximum readability.
* **Text Scaling**: Dynamic adjustment of the document's font size.
* **Auto-Save**: Language (FR/EN), Theme (Light/Dark/Contrast), and Text Size are automatically saved and restored on every visit.

---

## ⚖️ License (MIT)

Copyright (c) 2026 [Your Name or Alias]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---
