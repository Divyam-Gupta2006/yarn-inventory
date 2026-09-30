# 🧶 Yarn Inventory Management System

<p align="center">
  <img src="assets/logo.png" width="120" alt="Yarn Inventory App Logo" />
</p>

<h3 align="center">A Desktop Inventory Management Solution for Yarn Dyeing Businesses</h3>

<p align="center">
  Manage yarn stock, track bundle weights, monitor remaining inventory, and maintain organized records through a desktop application.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
</p>

---

## 📌 Overview

**Yarn Inventory Management System** is a desktop application designed to simplify inventory tracking for yarn dyeing businesses.

Managing yarn inventory manually can make it difficult to track stock quantities, bundle weights, shades, and remaining inventory accurately. This application provides a centralized system to record yarn details, organize inventory, and maintain structured stock records.

Built using **Electron.js, Node.js, and SQLite**, the application combines a desktop interface with a local database, making inventory management accessible without requiring a separate database server.

## ✨ Features

### 📦 Inventory Management

* Maintain organized records of yarn inventory.
* Record bale numbers, yarn brands, yarn types, and shade numbers.
* Track the number of bundles associated with each inventory entry.
* Store weight information for individual bundles and complete inventory lots.

### ⚖️ Weight Tracking

* Record weight per bundle.
* Maintain net weight and gross weight information.
* Track remaining yarn weight.
* Support inventory monitoring using structured weight records.

### 🗂️ Inventory Organization

* Keep yarn records organized by bale number, brand, yarn type, and shade.
* Make inventory information easier to retrieve and manage.
* Maintain consistent records for day-to-day business operations.

### 🔐 Authentication

* Password hashing using bcrypt.
* Local application authentication, where configured.
* Improved handling of user credentials.

### 🖥️ Desktop Application

* Runs as a desktop application using Electron.
* Uses a local SQLite database for persistent storage.
* Designed for inventory workflows in a business environment.
* Can be packaged into a distributable desktop application using Electron Builder.

## 🧵 Inventory Data Model

The application organizes yarn inventory around the following fields:

| Field             | Description                                 |
| ----------------- | ------------------------------------------- |
| Bale Number       | Unique identifier for a yarn bale           |
| Brand             | Manufacturer or yarn brand                  |
| Yarn Type         | Type or specification of yarn               |
| Shade Number      | Shade or color identification               |
| Weight per Bundle | Weight of an individual bundle              |
| Number of Bundles | Total bundles in the inventory entry        |
| Net Weight        | Net yarn weight                             |
| Gross Weight      | Total weight including applicable packaging |
| Remaining Weight  | Yarn weight remaining in stock              |

## 🛠️ Tech Stack

| Technology            | Purpose                               |
| --------------------- | ------------------------------------- |
| Electron.js           | Desktop application framework         |
| Node.js               | Application runtime and backend logic |
| SQLite                | Local relational database             |
| better-sqlite3        | SQLite database access                |
| bcrypt                | Password hashing                      |
| Electron Builder      | Desktop application packaging         |
| HTML, CSS, JavaScript | User interface and application logic  |

## 🏗️ Architecture

The application uses a local desktop architecture.

```text
┌──────────────────────────────────┐
│          Electron App            │
│                                  │
│  ┌────────────────────────────┐  │
│  │      User Interface        │  │
│  │       HTML / CSS / JS      │  │
│  └──────────────┬─────────────┘  │
│                 │                │
│  ┌──────────────▼─────────────┐  │
│  │     Node.js Main Process   │  │
│  │  Application & DB Logic    │  │
│  └──────────────┬─────────────┘  │
│                 │                │
│  ┌──────────────▼─────────────┐  │
│  │       better-sqlite3       │  │
│  └──────────────┬─────────────┘  │
│                 │                │
│  ┌──────────────▼─────────────┐  │
│  │      SQLite Database       │  │
│  │       Local Storage        │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

* [Node.js](https://nodejs.org/)
* npm (included with Node.js)
* Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Divyam-Gupta2006/YOUR-REPOSITORY.git
```

**2. Navigate to the project directory**

```bash
cd YOUR-REPOSITORY
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the application**

```bash
npm start
```

> Note: Ensure the `start` script is configured in your `package.json`. If your project uses a different development command, use the corresponding script.

## 📦 Building the Desktop Application

The application can be packaged for distribution using Electron Builder.

```bash
npm run build
```

The exact output format and build command depend on the configuration in `package.json` and the Electron Builder configuration.

## 💾 Database

The application uses SQLite for local data persistence.

Benefits include:

* No separate database server required.
* Local storage for inventory records.
* Relational data organization.
* Lightweight database operations suitable for a desktop application.

The database file should be backed up regularly to protect inventory records.

## 🔒 Security Considerations

* Passwords should be hashed using bcrypt rather than stored as plaintext.
* Database access should remain within the trusted application process.
* Electron renderer processes should use secure IPC communication when interacting with privileged operations.
* Database files and backups should be protected from unauthorized access.

## 🎯 Project Goals

* Digitize yarn inventory records.
* Reduce dependence on manual inventory registers and spreadsheets.
* Improve visibility into remaining yarn stock.
* Organize inventory using bale, brand, yarn type, and shade information.
* Provide a lightweight desktop solution tailored to yarn dyeing business workflows.

## 🔮 Future Improvements

Potential enhancements include:

* 🔎 Advanced search and filtering.
* 📊 Inventory dashboards and stock summaries.
* 📉 Low-stock alerts and inventory threshold monitoring.
* 📄 Excel and PDF report generation.
* 🧾 Stock movement and transaction history.
* 🔄 Inventory adjustment and audit logs.
* 💾 Automated database backups and restore functionality.
* 👥 Role-based access control for multiple employees.

## 👨‍💻 Author

**Divyam Gupta**

Computer Science & Engineering Student at IIIT Nagpur

<p>
  <a href="https://github.com/Divyam-Gupta-2006">
    <img src="https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github" />
  </a>
  <a href="https://www.linkedin.com/in/divyam-gupta-862542324/">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin" />
  </a>
</p>

---

<p align="center">
  Built to make yarn inventory management more organized, accessible, and efficient. 🧶
</p>
