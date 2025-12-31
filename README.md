
---

# 🛡️ Secure Password Generator

A modern, responsive, and multilingual web application to generate secure passwords. This tool allows users to customize their password criteria (length, numbers, symbols) and features a sleek **Dark Mode** interface.

---

## ✨ Features

* **Customizable Length**: Choose a password length between 8 and 32 characters using a smooth slider.
* **Character Sets**: Toggle the inclusion of **numbers** (`0-9`) and **symbols** (`!@#$%^&*`) to meet security requirements.
* **Copy to Clipboard**: One-click copy functionality with visual feedback (icon change).
* **Dark Mode**: A visual theme toggle (Light/Dark) to reduce eye strain, styled with custom CSS variables.
* **Internationalization (i18n)**: Full support for **English** and **French** languages.
* **Responsive Design**: Built with **Bootstrap 5**, ensuring it works perfectly on desktops, tablets, and smartphones.

---

## 🛠️ Technologies Used

| Technology | Purpose |
| --- | --- |
| **HTML5** | Structure and semantic layout. |
| **CSS3** | Custom styling, animations, and Dark Mode variables. |
| **JavaScript (ES6)** | Randomization logic, DOM manipulation, and translation system. |
| **Bootstrap 5** | Responsive grid and modern UI components (Switches, Buttons). |
| **Bootstrap Icons** | "Flat" vector iconography for a professional look. |

---

## 🚀 How it Works

The generation logic uses the `Math.random()` function to pick characters from a dynamically built string based on user preferences:

1. **Selection**: The script checks which checkboxes are active.
2. **Pooling**: It creates a "pool" of available characters (Letters + Numbers + Symbols).
3. **Looping**: A `for` loop runs for the duration of the selected length.
4. **Randomizing**: For each iteration, a character is randomly selected from the pool using:


5. **Output**: The resulting string is displayed in the UI.

---

## 📦 Installation & Usage

Since this is a client-side application, no server is required:

1. Download the `pswd.html` file.
2. Open the file in any modern web browser (Chrome, Firefox, Edge, Safari).
3. Adjust your settings and click **Generate**.

---

## 📝 License

This project is open-source and free to use for educational or personal purposes.

---


* Add a **password strength meter** (Low/Medium/High)?
* Show you how to **host this online** for free using GitHub Pages?
* Add a feature to **generate multiple passwords** at once?
