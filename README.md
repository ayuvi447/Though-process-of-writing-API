# User Authentication API (Node.js + MongoDB + JWT)

This is a Node.js-based user authentication API built with Express, MongoDB, and JWT. It includes functionality for registering, logging in/out, updating/deleting profiles, changing/forgetting passwords, uploading profile photos (in base64), and protected routes using middleware.

---

## 🔧 Features

- User registration with profile photo (stored in base64)
- Login/Logout functionality with JWT-based authentication
- User profile updates and deletion
- Password change and reset via email (nodemailer + Gmail)
- Input validation using `validator`
- Protected routes using `isAuth` middleware
- Cookie-based token handling
- MongoDB database connection via Mongoose
- `multer` used for photo upload (memory storage)

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT
- **Validation:** validator.js
- **Email:** Nodemailer
- **File Upload:** multer (memory storage)
- **Environment Variables:** dotenv
- **CORS + Cookies:** Enabled for cross-domain frontend

---


