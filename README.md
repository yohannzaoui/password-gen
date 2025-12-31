
---

# 🛡️ Professional Password Generator

A modern, secure, and customizable password generator built with **HTML5**, **CSS3 (Variables)**, and **JavaScript (ES6)**. This version features a clean "flat" design using **Bootstrap 5**, multi-language support, and a dynamic Dark Mode.

---

## 📂 Project Structure

To keep the code clean and maintainable, the project is divided into three main files:

* **`index.html`**: Defines the layout and structure of the application.
* **`style.css`**: Contains custom styling and Dark Mode theme variables.
* **`script.js`**: Handles the randomization logic, translations, and theme switching.

---

## ✨ Features

* **Custom Length**: Adjustable slider from 8 to 32 characters.
* **Dynamic Charsets**: Toggle numbers and symbols on or off.
* **Internationalization**: Instant toggle between **English** and **French**.
* **Dark Mode**: Eye-friendly interface with a smooth color transition.
* **One-Click Copy**: Copy your password to the clipboard with visual confirmation.
* **Favicon**: A modern shield icon (🛡️) built directly into the HTML code.

---

## 🛠️ Technical Implementation

### Logic Workflow

The app uses a "pool" system to ensure security. Based on user selection, a string of available characters is built. The random index is calculated as follows:

### Theme Management

The Dark Mode is managed via CSS Custom Properties (Variables). When the `.dark-mode` class is toggled on the `<body>` tag, the colors update instantly:

| Element | Light Mode | Dark Mode |
| --- | --- | --- |
| Background | `#f8f9fa` | `#121212` |
| Card | `#ffffff` | `#1e1e1e` |
| Text | `#212529` | `#f8f9fa` |

---

## 🚀 Setup Instructions

1. Create a new folder on your computer.
2. Save the provided code into three separate files: `index.html`, `style.css`, and `script.js`.
3. Ensure all three files are in the **same folder**.
4. Open `index.html` in any web browser.

---

## 📦 Dependencies

* **Bootstrap 5 (CDN)**: For the responsive grid and modern components.
* **Bootstrap Icons (CDN)**: For the flat vector iconography.

---
