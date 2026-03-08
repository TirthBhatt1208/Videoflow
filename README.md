<div align="center">

# 🎬 VideoFlow

### A fully open-source, production-grade video processing platform

**Real-time progress · Adaptive bitrate streaming · Background job queues · Fully Dockerized · Deployed on AWS EC2**

[![TypeScript](https://img.shields.io/badge/TypeScript-94.6%25-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express.js-Backend-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![AWS EC2](https://img.shields.io/badge/AWS-EC2-FF9900?style=flat-square&logo=amazonaws&logoColor=white)](https://aws.amazon.com/ec2/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## 📖 Overview

**VideoFlow** is a production-grade, fully open-source video processing platform that handles the entire lifecycle of a video — from upload to adaptive bitrate delivery. It is engineered for non-blocking performance: background job queues powered by **BullMQ** process heavy FFmpeg operations asynchronously, while **WebSocket + Redis Pub/Sub** push real-time status updates directly to the user's browser.

Once processed, videos are streamed using **HLS (HTTP Live Streaming)** with adaptive bitrate support — automatically switching between 240p and 1080p based on the viewer's network conditions.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| ⚡ **Real-time Progress** | WebSocket + Redis Pub/Sub push live processing updates to the client |
| 📺 **Adaptive Bitrate Streaming** | HLS delivery with 240p → 360p → 480p → 720p → 1080p quality levels |
| 🔄 **Non-blocking Architecture** | BullMQ job queues handle FFmpeg processing without blocking the main thread |
| 🐳 **Fully Dockerized** | Single `docker-compose up` spins up all services |
| ☁️ **AWS EC2 Deployment** | Production-ready deployment on AWS infrastructure |
| 🔁 **CI/CD Pipeline** | Automated lint, build, and deploy via GitHub Actions |
| 🔐 **Authentication** | Clerk-powered user authentication |
| 🗄️ **Type-safe ORM** | Prisma ORM with PostgreSQL for reliable data persistence |
| 🌩️ **Cloud Storage** | Cloudinary stores originals, thumbnails, HLS segments, and playlists |

---

## 🛠️ Tech Stack

### Frontend
- **React** — Component-based UI
- **TypeScript** — End-to-end type safety
- **Zustand** — Lightweight global state management
- **Socket.io Client** — Real-time WebSocket connection
- **Clerk** — Authentication & user management

### Backend
- **Express.js** — REST API server
- **TypeScript** — Type-safe server code
- **BullMQ** — Redis-backed job queues for background processing
- **Socket.io** — WebSocket server for real-time push updates
- **Redis** — Pub/Sub messaging between workers and WebSocket server
- **Prisma ORM** — Type-safe database access layer
- **PostgreSQL** — Primary relational database
- **FFmpeg** — Video transcoding, metadata extraction, thumbnail generation, HLS segmentation
- **Cloudinary** — Cloud storage for videos, thumbnails, HLS segments, and playlists

### Infrastructure & DevOps
- **Docker + Docker Compose** — Multi-service containerization
- **AWS EC2** — Cloud deployment target
- **GitHub Actions** — CI/CD pipeline (lint → build → SSH deploy)

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (React)                      │
│        Zustand State + Socket.io + HLS Player           │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP Upload / REST
                         ▼
┌─────────────────────────────────────────────────────────┐
│               EXPRESS BACKEND (Port 8000)               │
│     Validates file → Uploads to Cloudinary → Enqueues  │
└──────┬────────────────────────────────────┬────────────┘
       │ BullMQ Jobs                        │ Socket.io
       ▼                                    ▼
┌──────────────────┐              ┌─────────────────────┐
│   BullMQ Workers │              │   WebSocket Server  │
│  ┌─────────────┐ │              │  Subscribes to      │
│  │ Metadata Q  │ │◄─Redis───────│  Redis Pub/Sub      │
│  │ Thumbnail Q │ │  Pub/Sub     │  Pushes updates to  │
│  │ Processing Q│ │              │  connected clients  │
│  └──────┬──────┘ │              └─────────────────────┘
└─────────┼────────┘
          │ FFmpeg
          ▼
┌─────────────────────────────────────────────────────────┐
│                      SERVICES                           │
│   Cloudinary (Storage)  │  PostgreSQL (Prisma ORM)     │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 User Flow

```
[User] → uploads video file
  ↓
[Express Backend] → validates file
  ↓
[Cloudinary] → stores original
  ↓
[BullMQ — Metadata Queue]
  → FFmpeg extracts video metadata (duration, resolution, codec, etc.)
  → Prisma saves metadata to PostgreSQL
  → Redis Pub/Sub: "Metadata extracted ✓"
  ↓
[BullMQ — Thumbnail Queue]
  → FFmpeg generates thumbnail frame
  → Cloudinary stores thumbnail → URL saved to DB
  → Redis Pub/Sub: "Thumbnail generated ✓"
  ↓
[BullMQ — Processing Queue]
  → FFmpeg transcodes: 240p | 360p | 480p | 720p | 1080p
  → HLS segments generated per resolution
  → Segments uploaded to Cloudinary
  → .m3u8 playlists uploaded to Cloudinary
  → Master playlist URL saved to DB
  → Redis Pub/Sub: "Processing complete ✓"
  ↓
[WebSocket Server] subscribes to Redis Pub/Sub
  → Socket.io pushes status to connected client
  ↓  ↓  ↓
"Metadata ✓"  "Thumbnail ✓"  "Processed ✓"
  ↓
[Client] streams video via HLS
  → Adaptive bitrate: auto-selects quality based on network speed
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [FFmpeg](https://ffmpeg.org/) (only needed for local non-Docker setup)
- [pnpm](https://pnpm.io/) or npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/TirthBhatt1208/Videoflow.git
cd Videoflow
```

---

### 2. Configure Environment Variables

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

Open `.env` and configure the following:

```env
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/videoflow

# Redis
REDIS_URL=redis://localhost:6379

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# App
PORT=8000
FRONTEND_URL=http://localhost:5173
```

---

### 3. Run with Docker (Recommended)

```bash
docker-compose up --build
```

This will spin up all services:

| Service | Port |
|---|---|
| Frontend (React + Vite) | `http://localhost:5173` |
| Backend (Express) | `http://localhost:8000` |
| PostgreSQL | `5432` |
| Redis | `6379` |

To stop all services:

```bash
docker-compose down
```

---

### 4. Run Locally (Without Docker)

**Backend:**

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

**Workers** (in a separate terminal):

```bash
cd backend
npm run workers
```

---

## 📁 Project Structure

```
Videoflow/
├── .github/
│   └── workflows/              # GitHub Actions CI/CD pipelines
├── backend/
│   ├── src/
│   │   ├── routes/             # Express API route handlers
│   │   ├── queues/             # BullMQ queue definitions
│   │   ├── workers/            # BullMQ workers
│   │   │   ├── metadataWorker  # Extracts video metadata via FFmpeg
│   │   │   ├── thumbnailWorker # Generates thumbnail via FFmpeg
│   │   │   └── processingWorker# Transcodes to HLS multi-bitrate
│   │   ├── socket/             # Socket.io WebSocket server setup
│   │   ├── lib/                # Redis, Cloudinary, Prisma clients
│   │   └── index.ts            # Express app entry point
│   ├── prisma/
│   │   └── schema.prisma       # Database schema definition
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable React UI components
│   │   ├── pages/              # Route-level page components
│   │   ├── store/              # Zustand global state stores
│   │   ├── hooks/              # Custom React hooks
│   │   └── main.tsx            # App entry point
│   └── Dockerfile
├── docker-compose.yml          # Multi-service Docker Compose config
├── .env.example                # Environment variable template
└── .gitignore
```

---

## ⚙️ CI/CD Pipeline

VideoFlow uses **GitHub Actions** for automated deployment to AWS EC2.

```
[Code push to main branch]
  ↓
[GitHub Actions]
  → Lint & TypeScript build check
  ↓
[SSH into AWS EC2]
  → git pull latest changes
  → docker compose up -d --build
  ↓
[Services live]
  → Frontend: port 5173
  → Backend:  port 8000
```

The workflow file is located at `.github/workflows/`.

---

## 🗃️ Database Schema (Prisma)

Core entities managed via Prisma ORM + PostgreSQL:

- **User** — Clerk-authenticated user profile
- **Video** — Uploaded video metadata (title, duration, resolution, codec)
- **ProcessingJob** — Tracks the status of each BullMQ job per video
- **HLSPlaylist** — Stores Cloudinary URLs for master and per-resolution `.m3u8` playlists
- **Thumbnail** — Cloudinary URL and generation status

---

## 📡 WebSocket Events

| Event | Direction | Description |
|---|---|---|
| `join-room` | Client → Server | Subscribe to updates for a specific video |
| `processing:metadata` | Server → Client | Metadata extraction complete |
| `processing:thumbnail` | Server → Client | Thumbnail generated, URL returned |
| `processing:progress` | Server → Client | Per-resolution transcode progress |
| `processing:complete` | Server → Client | All resolutions ready, master playlist URL returned |
| `processing:error` | Server → Client | Processing failed with error message |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/videos/upload` | Upload a new video file |
| `GET` | `/api/videos` | List all videos for the authenticated user |
| `GET` | `/api/videos/:id` | Get video details and HLS playlist URL |
| `DELETE` | `/api/videos/:id` | Delete a video and its assets |
| `GET` | `/api/videos/:id/status` | Poll current processing status |

---

## 🐳 Docker Services

Defined in `docker-compose.yml`:

| Service | Description | Port |
|---|---|---|
| `frontend` | React + Vite dev/production server | 5173 |
| `backend` | Express.js REST + WebSocket API | 8000 |
| `worker` | BullMQ workers running FFmpeg jobs | — |
| `postgres` | PostgreSQL database | 5432 |
| `redis` | Redis for queues and Pub/Sub | 6379 |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'feat: add your feature'`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request**

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 🗺️ Roadmap

- [ ] Audio-only upload support (podcast mode)
- [ ] Per-user storage quota enforcement
- [ ] In-browser video trimming before processing
- [ ] Admin dashboard for monitoring BullMQ queue health
- [ ] AWS S3 as an alternative storage backend to Cloudinary
- [ ] Subtitle / caption track support

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📬 Contact

**Tirth Bhatt**

- GitHub: [@TirthBhatt1208](https://github.com/TirthBhatt1208)

---

<div align="center">

**If you find this project useful, please consider giving it a ⭐ on GitHub!**

Made with ❤️ by Tirth Bhatt

</div>