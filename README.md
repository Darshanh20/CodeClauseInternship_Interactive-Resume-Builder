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
- Secure user authentication via Supabase
- Exporting of resume as PDF

---

## 💻 Technologies Used

- **React (Vite)** – Fast frontend framework for interactive UI
- **Tailwind CSS** – Utility-first CSS for responsive and sleek design
- **Supabase** – Backend for authentication and database
- **React Router** – For multi-page navigation
- **React Hook Form / Zod (if used)** – Form validation and management

---

## 🔐 Environment Variables

Create a `.env` file in the root directory and add the following variables:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

## ⚙️ Scripts

- `npm install` – Install all dependencies
- `npm run dev` – Start development server


## SQL TABLES
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamp with time zone default now()
);

create table resumes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  summary text,
  education text,
  experience text,
  created_at timestamp with time zone default current_timestamp
);

create table skills (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid references resumes(id) on delete cascade,
  name text
);

create table education (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid references resumes(id) on delete cascade,
  institution text,
  from_date date,
  to_date date
);

create table experience (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid references resumes(id) on delete cascade,
  company text,
  from_date date,
  to_date date,
  role text
);

create table certifications (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid references resumes(id) on delete cascade,
  title text
);

create table links (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid references resumes(id) on delete cascade,
  label text,
  url text
);

alter table experience add column description text;
alter table experience add column currently_working boolean default false;


Developed by Darshan Hotchandani
