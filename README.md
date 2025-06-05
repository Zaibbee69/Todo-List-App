# 📝 Teddy Tasks

A full-featured, interactive, and beautiful **To-Do List App** built using **Django (Backend)** and **HTML, SCSS, JavaScript (Frontend)**. It supports dynamic task creation, editing, filtering, drag-and-drop reordering, color-coded urgency, and both localStorage + API syncing.

## GitHub Repo

[Github Link](https://github.com/Zaibbee69/Todo-List-App)

## License: APACHE LICENSE

Read License File

---

## 🌟 Features

### ✅ Core Functionality
- Add, update, delete tasks
- Mark tasks as completed or incomplete
- Edit tasks inline using a modal-like form
- Save all tasks both **locally** (localStorage) and to the **Django backend**

### 🎨 UI & UX Enhancements
- Fully custom-styled checkboxes
- Smooth animations and hover transitions
- Elegant SCSS-powered design with soft color palette
- Responsive layout (mobile-friendly)

### 🔎 Filtering & Searching
- Real-time search by title
- Filter by:
  - Completion status: all, completed, incomplete
  - Priority: low, medium, high

### 📅 Deadlines & Priorities
- Set due dates for tasks
- Auto-color-coded urgency:
  - 🔴 Overdue
  - 🟠 Due Today
  - 🟡 Due Soon (within 3 days)
  - 🟢 Later
- Priority tags visibly styled and sorted

### 💾 Local + Remote Sync
- Tasks are saved in browser localStorage
- Synced with a Django REST API backend (`/api/tasks/`)
- On page load:
  - If localStorage is empty, fetch from backend
  - Otherwise, use local cache for speed

---

## ⚙️ Tech Stack

| Layer       | Tech                             |
|-------------|----------------------------------|
| Backend     | Django, Django REST Framework    |
| Frontend    | HTML, JavaScript, SCSS (compiled)|
| Storage     | localStorage + Django DB         |
| Styling     | SCSS (modular and reusable)      |

---

## 🛠️ Usage Instructions

```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install requirements.txt

# Go to backend
cd backend/todo_app

# Run migrations
python manage.py migrate

# Run server
python manage.py runserver

# Go back to front end
cd ../../frontend

# Run Live server extension and open on browser

