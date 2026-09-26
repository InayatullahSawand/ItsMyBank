# ItsMyBank

**Educational Online Banking System** (not a real bank)

A full-stack imaginary banking web application built for learning purposes. It demonstrates secure authentication, REST APIs, account operations, and a modern fintech-style UI.

> **Disclaimer:** ItsMyBank is an **educational / demo project only**. It is **not a real bank** and does not handle real money or real financial transactions.

---

## Live Demo

- **Frontend:** [https://its-my-bank.vercel.app](https://its-my-bank.vercel.app)
- **GitHub:** [https://github.com/InayatullahSawand/ItsMyBank](https://github.com/InayatullahSawand/ItsMyBank)

> Note: Backend APIs work fully when the Spring Boot server is running (local or deployed). The Vercel link shows the UI; connect it to a live API URL for full online functionality.

---

## Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React.js, Vite, Tailwind CSS, Framer Motion |
| Backend | Java Spring Boot |
| Database | MySQL |
| Auth | Email OTP (Gmail SMTP) |
| Extra | QR Code, jsPDF (statements) |

---

## Features

### User
- Register / Login with **real email OTP**
- Dashboard with account balance
- **Test deposit** (demo money)
- Money **transfer** between accounts
- **Virtual debit card** (name + account linked)
- Account **freeze / unfreeze**
- **Bill payments** (Electricity, Gas, Internet, Mobile)
- **QR code** generate & pay
- Transaction history
- **PDF statement** download
- In-app **help chatbot**
- **Reminders / alerts**

### Admin
- Dashboard stats (users, accounts, balance, transactions)
- Block / unblock users
- Fraud alerts (high-value transactions)

---

## Project Structure

```text
ItsMyBank/
├── frontend/                 # React + Vite app
│   ├── src/
│   │   ├── api/
│   │   ├── pages/            # Login, Register, Dashboard, Admin
│   │   └── ...
│   └── package.json
├── src/main/java/com/inayatbank/inayatbank/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   ├── dto/
│   ├── config/
│   └── security/
├── pom.xml
└── README.md
