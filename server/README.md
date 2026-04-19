# SkillSwap+ Backend API

**AI-powered peer-to-peer skill exchange platform.**
Trade skills with others — earn credits by teaching, spend credits by learning. No money involved.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ installed
- **MongoDB Atlas** account (or local MongoDB)

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your MongoDB Atlas URI and JWT secrets
```

**Required `.env` values:**
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for access tokens |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens |

### 3. Create Uploads Directory
```bash
mkdir uploads
```

### 4. Seed the Database (Optional)
```bash
npm run seed
```
This creates 5 test users, 4 sessions, sample transactions, and notifications.
All test accounts use password: `password123`

### 5. Start the Server
```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:5000`

---

## 📡 API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server status |

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | No | Create account |
| `POST` | `/api/auth/login` | No | Login, get tokens |
| `POST` | `/api/auth/refresh` | No | Refresh access token |
| `POST` | `/api/auth/logout` | Yes | Logout |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/users/profile` | Yes | Get own profile |
| `PUT` | `/api/users/profile` | Yes | Update profile |
| `POST` | `/api/users/profile/avatar` | Yes | Upload profile picture |
| `GET` | `/api/users/:id` | No | Get public profile |

### Sessions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/sessions` | Yes | Create session (teach) |
| `GET` | `/api/sessions` | No | Browse sessions |
| `GET` | `/api/sessions/mine` | Yes | My hosted/attending sessions |
| `GET` | `/api/sessions/:id` | No | Session details |
| `POST` | `/api/sessions/:id/request` | Yes | Request to join |
| `POST` | `/api/sessions/:id/respond` | Yes | Accept/reject request |
| `PATCH` | `/api/sessions/:id/complete` | Yes | Mark session complete |

### Credits
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/credits` | Yes | Get credit balance |
| `GET` | `/api/credits/transactions` | Yes | Transaction history |

### Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/reviews` | Yes | Submit review |
| `GET` | `/api/reviews/user/:userId` | No | User's reviews |

### Notifications
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/notifications` | Yes | List notifications |
| `PATCH` | `/api/notifications/:id/read` | Yes | Mark as read |
| `PATCH` | `/api/notifications/read-all` | Yes | Mark all read |

---

## 🏗️ Architecture

```
server/
├── src/
│   ├── config/          # DB connection, env validation
│   ├── middleware/       # Auth, validation, rate limiting, error handling
│   ├── models/          # Mongoose schemas (User, Session, Transaction, Review, Notification)
│   ├── routes/          # Express route definitions
│   ├── controllers/     # Request handling logic
│   ├── services/        # Business logic (credits, sessions, reviews, notifications)
│   ├── validators/      # Joi validation schemas
│   ├── utils/           # Helpers (AppError, catchAsync, constants)
│   ├── app.js           # Express app setup
│   └── seed.js          # Database seeder
├── server.js            # Entry point
├── uploads/             # Profile picture storage
├── .env.example         # Environment template
└── package.json
```

## 🔐 Security Features
- **bcrypt** password hashing (12 rounds)
- **JWT** access + refresh token auth
- **Helmet** security headers
- **CORS** configured for frontend origin
- **Rate limiting** (100 req/15min general, 10 req/15min auth)
- **Input validation** with Joi
- **Atomic transactions** for credit transfers

## 💡 Key Design Decisions
- **Atomic Credit Transfers**: MongoDB transactions ensure credits are never lost or duplicated
- **Negative Balance Prevention**: `$gte` guard on credit deduction queries
- **Time Conflict Detection**: Prevents double-booking sessions
- **Dynamic Rating**: Aggregation-based recalculation on each review
