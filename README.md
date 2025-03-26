# WorkLaza – Worker-Customer Service Platform

## Overview

**WorkLaza** is a dynamic platform that connects skilled workers (painters, electricians, plumbers, etc.) with customers who need quick and reliable service. It provides an efficient booking system, automated platform fee calculation, and real-time user interactions to streamline the service process.

## Features

### 1. User Management 🔑
- Secure authentication for Customers, Workers, and Admins.
- User roles with distinct permissions.
- Profile management for workers and customers.

### 2. Service & Booking Management 📅
- Workers can list services with pricing and availability.
- Customers can browse and book services.
- Admin panel for monitoring and managing orders.

### 3. Automated Platform Fee Calculation 💰
- Workers are charged a platform fee for each service.
- Fee is automatically calculated according to the worker's bookings.
- Transparent and hassle-free payment management.

### 4. Reviews & Ratings ⭐
- Customers can rate and review workers based on service quality.
- Helps in building trust and improving service quality.

### 5. Admin Dashboard 📊
- Monitor all users, bookings, and platform fees.
- Generate reports for business insights.

### 6. Real-time Chat & Notifications 💬🔔
- Customers and workers can communicate directly within the platform.
- Instant notifications for bookings, order updates, and reminders.

## Technology Stack 🛠️

### **Backend:**
- **Django** (Web Framework)
- **Django REST Framework** (API Communication)
- **WebSockets** (Real-time communication)

### **Frontend:**
- **React.js** (Frontend framework)

### **Database:**
- **PostgreSQL** (Storing user data, bookings, and platform fees)

## Installation & Setup 🚀

### 1. Clone the Repository:
```sh
 git clone https://github.com/hasanpp/WorkLaza.git
 cd WorkLaza
 env\Scripts\activate.bat
```

### 2. Install Backend Dependencies:
```sh
 cd backend
 pip install -r requirements.txt
```

### 3. Install Frontend Dependencies:
```sh
 cd frontend
 npm install
```

### 4. Set Up Database:
```sh
 cd backend
 python manage.py migrate
```

### 5. Run the Backend Server:
```sh
 cd backend
 python manage.py runserver
```

### 6. Run the Frontend Application:
```sh
 cd frontend
 npm run dev
```

## How to Use? 🏠
- **Sign Up/Login** as a customer or worker.
- **Browse Services** and select the required service.
- **Book an Appointment** with an available worker.
- **Communicate via Real-time Chat** to discuss service details.
- **Receive Instant Notifications** for updates and reminders.
- **Rate & Review** the service after completion.

## Future Enhancements 🚀
- Advanced search and filter options for services.
- GPS-powered worker recommendations based on customer location.
- Automated invoicing and fee calculations for workers.

## Contributing 🤝
Feel free to fork this repository, submit pull requests, and report issues. Any contributions are welcome!

## License 📜
This project is licensed under the **MIT License**.

## Contact 📧
For any inquiries or contributions, feel free to reach out:

Email: hasanpp02@gmail.com

Happy Coding! 🚀
