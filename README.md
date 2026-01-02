# 🚀 Quick AI

**Quick AI** is an AI-powered platform built using the **MERN stack** that delivers fast, intelligent responses through **Google Gemini API**.  
It is designed for high performance, smart automation, and scalable background processing with a modern backend architecture.

The platform supports **secure PDF upload and AI-based processing**, asynchronous job handling, and seamless service integration.

---

## ✨ Key Features

- 🤖 **AI Responses powered by Google Gemini**
- ⚡ **Fast & Intelligent Processing**
- 📄 **Secure PDF Upload & AI Processing**
- 🔄 **Background Job Handling using BullMQ**
- 🧵 **Queue-based Task Execution**
- 🐳 **Dockerized Architecture**
- 🗄️ **High-Speed Data Store with Valkey**
- 🔐 **Secure API & Environment Configuration**

---

## 🛠️ Tech Stack

### Frontend
- **React.js**
- **JavaScript / TypeScript**
- **Modern UI Architecture**

### Backend
- **Node.js**
- **Express.js**
- **BullMQ (Background Jobs)**
- **Google Gemini API**

### Database & Caching
- **MongoDB**
- **Valkey (Redis-compatible)**

### DevOps & Tools
- **Docker & Docker Compose**
- **Environment-based Configuration (.env)**

---

## 🧠 AI Integration

Quick AI integrates **Google Gemini API** to generate intelligent responses and process uploaded documents.

- Secure API key handling
- Fast AI response generation
- Asynchronous AI task execution
- Scalable AI pipelines using queues

---

## 🧩 System Architecture

- **React frontend** communicates with **Express APIs**
- Heavy tasks (PDF processing, AI generation) are queued
- **BullMQ** manages background jobs and retries
- **Valkey** ensures fast in-memory operations
- **MongoDB** stores application and job metadata
- **Docker** ensures consistent deployments

This architecture ensures **non-blocking performance**, scalability, and reliability.

---

## 📂 Core Features

- Upload and process PDFs securely
- AI-powered response generation using Gemini
- Background job execution
- Retry & failure handling
- Modular and scalable backend design

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- Docker & Docker Compose
- Google Gemini API Key

---

### Installation

```bash
git clone https://github.com/manavsingh345/quickai.git
cd quickai
