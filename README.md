Fullstack Assignment
💡 Overview

* This project demonstrates a full-stack implementation including:

* A secure backend API built with Node.js, Express.js, and MongoDB

* A frontend built with React and TypeScript

* A standalone TypeScript utility for meeting room conflict detection

⚙️ Tech Stack

Backend: Node.js, Express.js, MongoDB, JWT, bcrypt, Express-Validator
Frontend: React, TypeScript, Vite, Axios, React Router
Utility: TypeScript, Jest (unit testing)

Project Structure
backend/                # Express API with MongoDB + JWT Auth
frontend/               # React + TypeScript web app (Vite)
meeting-room-conflict/  # TypeScript utility with Jest tests
README.md               # Documentation

🖥 Backend

* Handles authentication, role-based access, and CRUD operations for screens and playlists.

Run Locally:

cd backend
npm install
cp .env.example .env
npm run seed
npm run dev


Runs on http://localhost:4000

💻 Frontend

* Provides UI for login, screen and playlist management, with pagination and search.

Run Locally:

cd frontend
npm install
npm run dev


Runs on http://localhost:3000

🧠 Meeting Room Conflict Utility

* Standalone TypeScript utility to detect overlapping meeting bookings with priority handling.

Run Tests:

cd meeting-room-conflict
npm install
npm test

👨‍💻 Author

Syed Faheemuddin
Full Stack Developer
GitHub: https://github.com/syedfaheem008code/fullstack-assignment
