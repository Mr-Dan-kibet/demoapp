# 🚐 Luxury Rides

**Ease your journey — Book your ride, order your meal, and pay via M-Pesa.**

---

## 🚌 Overview

Luxury Rides is a **single-page seat booking platform** built for travelers moving between **Nairobi**, **Nakuru**, and **Eldoret**. This app allows users to:

- 🪑 Book multiple seats on a luxury ride  
- 🧾 View ticket information and receive a digital receipt  
- 📲 Pay seamlessly via **M-Pesa** integration (planned feature)  
- 🍽️ *Preorder food for the stopover* (planned feature)

This project demonstrates frontend engineering using **HTML**, **CSS**, **JavaScript**, and `json-server` for local data persistence.

---

## 🎯 Features

- 🔍 View available rides and seat availability  
- 🪑 Select multiple seats per booking  
- 🧾 View a receipt with ticket information  
- 📲 Make M-Pesa payments (mark as paid) 
- 📋 Booking form with   
- ✅ Clean, responsive UI  

---

## 🛠️ Technologies Used

- **HTML5 & CSS3**  
- **JavaScript (ES6+)**  
- **JSON Server** for local backend  
- **M-Pesa Daraja API (sandbox)**  
- **Live Server** (for frontend preview)

---

## 📁 File Structure

```
Luxury-Rides/
├── index.html
├── css/
│   └── style.css
├── src/
│   └── index.js
├── db.json
├── package.json
├── server.js
└── README.md
```

---

## 🚀 Setup Instructions

1. **Clone the Repository**
 ```bash
  git clone git@github.com:Mr-Dan-kibet/demoapp.git
  cd demoapp
```
2. Install JSON Server (if not already installed)
```
npm install -g json-server
```
3. Start JSON Server
```
json-server --watch db.json
```
5. Start the Frontend
```
Use the Live Server extension in VS Code
OR simply open index.html in your browser
```
---
## HOW TO USE

Welcome to the Luxury Rides seat booking system! Follow these simple steps to reserve your seat:

1. Select Your Seat(s)
Scroll through the seat layout.

Click on available seats to select (green).

Selected seats will turn blue.

Booked seats are shown in red and cannot be selected.

2. Fill in Passenger Information
Enter your Full Name.

Enter a valid Phone Number (must start with 07).

Choose your Travel Date.

Select your Departure Time.

Enter your Pickup Point and Destination.

3. Book Your Ride
Click the "Book Now" button.

A digital ticket will be displayed showing your booking details.

A receipt popup will confirm your booking.

4. View Booking History
Scroll down to the Booking History section to view all bookings.

Admin users can delete or mark bookings as paid (if not yet completed).

All data is stored in a live database hosted on Render.

## 👨🏽‍💻 Author
Dan Rotich
Full-Stack Developer @ Moringa School
GitHub: @Mr-Dan-kibet

---
## 🖼️ Preview
“Designed to reduce queues and waiting time at booking offices and stopovers — all from your phone.”

---

## 📄 License

### MIT License

### Copyright (c) 2025 DAN ROTICH
