# CollegeConnect

 **CollegeConnect** – a comprehensive platform designed to streamline college life through resource sharing, event discovery, and automated letter drafting.

---

## 🚀 Features

### 1. Letter Drafting Assistance
- Get help composing formal letters for internships, applications, duty leave, and permissions.
- Automated templates for common college scenarios (internship application, duty leave, event permission, etc.).
- PDF generation for drafted letters.

### 2. Study Material Exchange
- Share and access a variety of study materials (notes, textbooks, etc.) with fellow students.
- Upload your own resources and download those shared by others.
- Post books for sale or exchange.
- Reduce textbook expenses and ensure access to quality materials.
- Connect with students from your courses.

### 3. Events & Hackathons
- Discover and participate in college events, workshops, and hackathons.
- View event details, registration info, and schedules.
- Stay updated on opportunities to showcase your skills.

### 4. Modern, Responsive UI
- Clean, user-friendly dashboard for easy navigation.
- Optimized for all devices.

---

## 📦 Tech Stack

- **Frontend:** React.js (Vite), CSS (custom and utility classes)
- **Backend:** Python Django (REST API)
- **Database:** MYSQL
- **Other:** Axios (API calls), PDF generation, image assets

---

## 🛠️ How to Run the Project

### Prerequisites

- Node.js & npm (for frontend)
- Python 3.x & pip (for backend)
- (Optional) Virtualenv for Python
- MYSQL

---

### 1. Clone the Repository

```sh
git clone https://github.com/sethunath2003/CollegeConnect.git
cd CollegeConnect
```

---

### 2. Backend Setup

```sh
cd backend
python3 -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
- The backend will run on `http://localhost:8000` by default.

---

### 3. Frontend Setup

```sh
cd frontend
npm install
npm run dev
```
- The frontend will run on `http://localhost:5173` (default Vite port).

---

### 4. Access the Application

- Open your browser and visit: [http://localhost:5173](http://localhost:5173)
- Register or log in to start using CollegeConnect.

---

## 📚 Additional Notes

- **API Endpoints:** The frontend communicates with the backend via RESTful APIs (`/api/...`).
- **Assets:** Images for landing pages and cards are located in the `public/` directory.
- **Letter Templates:** Customizable for all common college needs.
- **Responsive Design:** Optimized for mobile and desktop.

---

## 📖 Interview Preparation

Preparing for an interview where you'll discuss this project? Check out our comprehensive **[Interview Preparation Guide](./INTERVIEW_PREP.md)**!

This guide includes:
- 50+ technical questions with detailed answers
- Code examples and implementation details
- Architecture and design pattern explanations
- Behavioral questions using the STAR method
- Practice questions and resources
- Final checklist before your interview

---

## 🤝 Contributing

Pull requests and suggestions are welcome! Please fork the repo and submit your changes via PR.

---

## 👤 Author

- [Sethunath A](https://github.com/sethunath2003)
- [Sreya Elizabeth Shibu](https://github.com/Sreyaes)
- [Japheth Santhosh](https://github.com/Japheth-Santosh)
- [Varsha Sunil Mathai](https://github.com/varshasunil9)
---

## 📞 Contact

For queries or support, open an issue in this repository.
