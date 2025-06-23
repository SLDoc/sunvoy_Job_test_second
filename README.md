# Full Stack Engineer Challenge – Payload CMS + Lexical Editor

This repository contains my solution to the Full Stack Engineer Challenge. The objective was to integrate [Payload CMS](https://payloadcms.com/) with the new [Lexical Editor](https://payloadcms.com/docs/rich-text/lexical), and implement two custom rich text features: a `<mark>` highlighting tool and a footnote system.

---

## 🛠 Stack

- **Language:** TypeScript
- **CMS:** Payload CMS (Blank Template)
- **Database:** MongoDB
- **Editor:** Lexical Editor (via Payload)
- **Icons:** FontAwesome
- **UI:** Payload Admin Panel

---

## 🚀 Steps Completed

### ✅ Step 1: GitHub Repository

- Created a public GitHub repository to track progress.
- All changes are committed incrementally with meaningful commit messages.

### ✅ Step 2: Payload CMS Setup

- Initialized a Payload CMS project using the blank template.
- Connected to a local MongoDB instance.

### ✅ Step 3: Lexical Editor Integration

- Configured Payload to use the Lexical rich text editor by modifying `payload.config.ts`.

### ✅ Step 4: Posts Collection

- Created a `posts` collection with the following fields:
  - `title`: plain text
  - `content`: rich text (Lexical Editor)

### ✅ Step 5: `<mark>` Custom Feature

- Added a custom `<mark>` feature to the Lexical editor.
- **Features:**
  - Button placed between _strikethrough_ and _subscript_
  - Uses FontAwesome `faHighlighter` icon
  - Can wrap/unwrap selected text with `<mark>` tags
  - Selection remains active after applying the mark
  - Marked content is parsed to `<mark>` in HTML output

🔗 **Demo (Loom Recording):** [Watch Highlight(Mark) Feature in Action](#) _https://www.loom.com/share/445f79d66c444cbca009d5dcd046510d?sid=0f70f568-4944-41f3-8300-67ad291025b4_

### ✅ Step 6: Footnote Custom Feature

- Replaced the default _superscript_ functionality with a footnote feature.
- Removed the _subscript_ button entirely.
- **Features:**
  - Inserts numbered `<sup>` node for footnotes
  - Opens drawer to input rich text (only: paragraph, bold, italic, strikethrough, links)
  - Previews content when the footnote is selected
  - Allows editing/removing footnotes
  - Converts to `<sup>` + `<footer><ul><li>...</li></ul></footer>` in HTML

🔗 **Demo (Loom Recording):** [Watch Footnote Feature in Action](#) _https://www.loom.com/share/853d790e717949479acb370e297031f0?sid=10e4e0d4-c660-474f-8f7b-bb141a86b05f_

---

## 🧪 Testing & Usage

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start MongoDB (if not already running)
4. Start Payload:
   ```bash
   npm run dev
   ```
5. Visit the Payload Admin Panel at `http://localhost:3000/admin`

---

## ⏱ Time Taken

- **Estimated:** [Your initial estimate]
- **Actual Total Time:** [Total hours/days spent]

---

## 📩 Submission

- GitHub Repo: [Your Repo Link]
- Loom Videos: Linked above
- Sent via reply to the original email.

✅ Task completed 100%
