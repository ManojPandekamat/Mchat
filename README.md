# MChat – Real-Time Chat Application with Room-Based Messaging

## Overview

MChat is a hassle-free real-time chat application featuring room-based communication, file sharing, and smart cleanup. It enables users to create and join chat rooms using 4-digit codes, share files seamlessly, and maintain persistent message and file history. The system is built for easy peer-to-peer communication without requiring user authentication.

---

## Features

- Real-time messaging using **Express.js** and **Socket.IO**.
- Room creation and joining via **4-digit codes**.
- Persistent message and file history stored in **MongoDB**.
- File sharing with **Multer** and **Axios**.
- Automatic room cleanup when all users leave.
- Lightweight and no authentication required for easy access.
- Responsive UI built with **React.js** and styled with **CSS**.

---

## Technologies Used

- React.js
- Express.js
- Node.js
- MongoDB
- Socket.IO
- Multer
- Axios
- CSS

---

## Live Demo

Access the deployed app here:

[https://mchat-9b60.onrender.com/](https://mchat-9b60.onrender.com/)

> *Note:* The app is hosted on a free Render plan, so it may take 15–20 seconds to wake up after inactivity.

---

## Folder Structure

```plaintext
├── frontend/            # React.js frontend application
├── backend/            # Express.js backend server with Socket.IO integration
├── README.md          # Project documentation
└── .env               # Environment variables (not committed)
