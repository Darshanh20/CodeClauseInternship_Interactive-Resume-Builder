# CodeClauseInternship_Interactive-Resume-Builder

# 📄 Brief – The Ultimate Resume Builder

📌 **Note:** Please switch to the `master` branch to view all project files.

---

## 🎯 Aim

Develop an interactive resume builder tool.

---

## 📋 Description

**Brief** is a web application that enables users to create professional, visually appealing resumes with ease. Users can input their personal, educational, and work details, choose from multiple templates, preview their resume in real-time, and export it as a PDF. The application emphasizes both user experience and flexibility in design.

### ✨ Key Features

- Interactive form to enter personal, educational, and professional information
- Real-time preview of resume templates
- Template selection for customizable styles
- Resume export/download as PDF
- Secure user authentication via Supabase

---

## 💻 Technologies Used

- **React (Vite)** – Fast frontend framework for interactive UI
- **Tailwind CSS** – Utility-first CSS for responsive and sleek design
- **Supabase** – Backend for authentication and database
- **React Router** – For multi-page navigation
- **React Hook Form / Zod (if used)** – Form validation and management
- **html2pdf / react-to-print / jsPDF (if used)** – Resume PDF generation

---

## 🔐 Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

## Folder Structure
brief-resume-builder/
├── components/                # Reusable UI components
│   ├── ResumeForm.jsx         # Input form for user details
│   ├── TemplateSelector.jsx   # UI for selecting resume templates
│   └── PDFDownload.jsx        # Component to export/download the resume
├── pages/                     # Main app pages
│   ├── IntroFormPage.jsx      # Form input page
│   ├── TemplatePage.jsx       # Preview and template selector page
│   └── DownloadPage.jsx       # Final export/download screen
├── templates/                 # Resume templates (design components)
│   └── Template1.jsx          # Example resume layout
├── App.jsx                    # Main React app file with routes
├── supabase.js                # Supabase client setup
├── tailwind.config.js         # Tailwind CSS config
├── index.css                  # Global styles
├── main.jsx                   # Entry point
└── .env                       # Environment variables (not committed)

⚙️ Scripts
npm install        # Install dependencies
npm run dev        # Start development server
npm run build      # Build for production

Developed by Darshan Hotchandani
