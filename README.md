EVCONNECT – EVENT MANAGEMENT SAAS PLATFORM

EvConnect is a full-stack Event Management SaaS Platform that allows users to register for events, organizers to create and manage events, and participants to form teams. The system supports role-based access control and secure authentication using JWT.

---

FEATURES

• User Registration & Login (JWT Authentication)
• Role-Based Access Control (User, Organizer, Admin)
• Create, Update, Delete Events
• Event Registration System
• Team Creation & Join Functionality
• Secure REST APIs
• MongoDB Database Integration
• Responsive React Frontend
• Protected Routes using Authentication

---

TECH STACK

Backend
• Java 17
• Spring Boot 3
• Spring Security
• JWT Authentication
• MongoDB
• Lombok

Frontend
• React (Vite)
• JSX
• Axios
• Context API
• CSS

Testing
• JUnit (Backend Testing)
• Selenium (Frontend UI Testing)

---

PROJECT STRUCTURE

evconnect-backend
model/
dto/
repository/
service/
controller/
security/
config/

evconnect-frontend
pages/
components/
context/
services/
assets/

---

ARCHITECTURE

Client
↓
Controller Layer
↓
Service Layer
↓
Repository Layer
↓
MongoDB Database

---

ROLES & PERMISSIONS

USER
• View events
• Register for events
• Create or join teams

ORGANIZER
• Create events
• Update own events
• Delete own events
• Manage participants

ADMIN
• Manage all events
• Manage users
• Full system access

---

INSTALLATION & SETUP

Backend Setup

git clone https://github.com/yourusername/evconnect.git
cd evconnect-backend

Configure MongoDB in application.properties

spring.data.mongodb.uri=mongodb://localhost:27017/evconnect

Run backend

mvn spring-boot:run

Backend runs on:
http://localhost:8080

---

Frontend Setup

cd evconnect-frontend
npm install
npm run dev

Frontend runs on:
http://localhost:5173

---

API ENDPOINTS

Auth APIs
POST /api/auth/register
POST /api/auth/login

Event APIs
GET /api/events
POST /api/events
PUT /api/events/{id}
DELETE /api/events/{id}

Team APIs
POST /api/teams
POST /api/teams/{id}/join
GET /api/teams

Registration APIs
POST /api/registrations
GET /api/registrations

---

SECURITY

• JWT Authentication
• Spring Security Filter Chain
• Role Based Authorization
• Protected APIs
• Password Encryption (BCrypt)

---

OOAD PRINCIPLES USED

• Encapsulation
• Abstraction
• Inheritance
• Polymorphism
• Single Responsibility Principle
• Open Closed Principle
• Dependency Inversion Principle
• Separation of Concerns

Design Patterns

• Builder Pattern
• Factory Method Pattern
• Template Method Pattern
• Chain of Responsibility
• Observer Pattern

---

TESTING

JUnit
• Service layer testing
• Controller testing
• Authentication testing
• Event logic testing
• Role access testing

Selenium
• Login flow testing
• Event creation testing
• Team registration testing
• Navigation testing
• End-to-end testing

---

FUTURE ENHANCEMENTS

• Email notifications
• Payment integration
• Event reminders
• File upload support
• Dashboard analytics
• Mobile responsive improvements

---

AUTHOR

EvConnect Project
Built using Spring Boot + React + MongoDB
