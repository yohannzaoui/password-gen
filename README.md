
---

# 🛡️ Password Generator Pro

A modern, lightweight, and secure web application designed to generate robust passwords. The interface is built with **Bootstrap 5.3**, offering a fluid, bilingual, and adaptive user experience.

---

## 🚀 Key Features

### 1. 🔑 Custom Generation

* **Granular Control**: Choose to include lowercase, uppercase, numbers, and/or symbols.
* **Adjustable Length**: An intuitive slider allowing you to set a length from **8 to 32 characters**.
* **Ambiguity Filter**: An option to exclude similar-looking characters (e.g., `1`, `l`, `i`, `0`, `O`) to prevent typing errors.

### 2. 📊 Real-Time Strength Analysis

The app features an algorithm that instantly evaluates the complexity of the generated password:

* 🔴 **Weak**: Less than 8 characters or low character diversity.
* 🟡 **Medium**: Decent length with a mix of character types.
* 🟢 **Strong**: Over 16 characters with full character diversity.

### 3. 🎨 User Interface (UI/UX)

* **Auto-Scaling Text**: The password text automatically shrinks its font size for longer lengths (up to 32 characters) to **stay on a single line** without breaking the layout.
* **Dark Mode**: A quick toggle between light and dark themes with preference persistence via `localStorage`.
* **Bilingual**: Full support for English and French with a single click.
* **One-Tap Copy**: A dedicated button to copy the password to the clipboard with visual confirmation.

---

## 🛠️ Technical Stack

| Technology | Usage |
| --- | --- |
| **HTML5** | Semantic structure of the application. |
| **CSS3** | Custom styling, theme variables, and smooth transitions. |
| **JavaScript (ES6+)** | Logic for generation, strength calculation, and DOM management. |
| **Bootstrap 5.3** | CSS framework for responsive design and components (Progress bars, Switches). |
| **Bootstrap Icons** | Icon library for a visually intuitive interface. |

---

## 📂 Project Structure

```text
/
├── index.html   # Main structure and CDN imports
├── style.css    # Theme variables and display fixes
└── script.js    # Business logic, translations, and security

```

---

## ⚙️ Installation & Usage

1. **Clone or download** the three project files.
2. Place the files in the same folder.
3. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
* *No server or dependency installation is required (uses CDNs).*



---

## 🔒 Security & Privacy

* **Client-Side Only**: Password generation happens exclusively in the user's browser.
* **Privacy**: No data is sent over the internet or stored on any remote server.
* **Local Memory**: Only your language and theme preferences are saved on your device using `localStorage`.

---

## 📝 License

This project is free to use for personal or educational purposes.

---

### 💡 Future Roadmap

* [ ] Add "Pronounceable Passwords" option.
* [ ] Local history of the last 5 generated passwords.
* [ ] QR Code generation to quickly scan passwords onto mobile devices.

---
