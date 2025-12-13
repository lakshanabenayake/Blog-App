# BlogApp - Full Stack Blog Application

A modern, full-stack blogging platform with a public blog, content management system (CMS), and RESTful API built with ASP.NET Core and Next.js.

## 🌐 Live Deployment

- **Blog (Public)**: https://blogapp.lakshanabenayake.me
- **CMS (Admin)**: https://blogapp.lakshanabenayake.me/admin
- **API**: https://api.blogapp.lakshanabenayake.me
- **API Documentation**: https://api.blogapp.lakshanabenayake.me/swagger

## 🚀 Tech Stack

### Backend

- **Framework**: ASP.NET Core 9.0
- **Database**: PostgreSQL
- **ORM**: Entity Framework Core
- **Authentication**: JWT Bearer Tokens
- **Password Hashing**: BCrypt
- **Image Storage**: Cloudinary
- **API Documentation**: Swagger/OpenAPI

### Frontend

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: React Context API
- **HTTP Client**: Axios

### DevOps

- **Containerization**: Docker
- **Deployment**: Dokploy, Digital Ocean
- **Version Control**: Git/GitHub

## 📋 Features

### Public Blog

- Browse blog posts with pagination
- Filter posts by category
- Search functionality
- Responsive design
- Dark/Light theme support

### Admin CMS

- Create, edit, and delete blog posts
- Category management
- Rich text editor
- Image upload via Cloudinary
- Dashboard with analytics
- User profile management

### API

- RESTful architecture
- JWT authentication
- Role-based authorization
- Swagger documentation
- CORS enabled

## 🔧 Setup Instructions

### Prerequisites

- .NET 9.0 SDK
- Node.js 20+
- PostgreSQL
- pnpm (or npm/yarn)
- Cloudinary account

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/lakshanabenayake/Blog-App.git
   cd Blog-App/backend
   ```

2. **Create `.env` file**

   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables** (see [Backend Environment Variables](#backend-environment-variables))

4. **Restore dependencies**

   ```bash
   dotnet restore
   ```

5. **Run database migrations**

   ```bash
   dotnet ef database update
   ```

6. **Run the application**

   ```bash
   dotnet run
   ```

   Backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd ../frontend
   ```

2. **Create `.env` file**

   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables** (see [Frontend Environment Variables](#frontend-environment-variables))

4. **Install dependencies**

   ```bash
   pnpm install
   ```

5. **Run development server**

   ```bash
   pnpm dev
   ```

   Frontend will be available at `http://localhost:3000`

## 🔐 Environment Variables

### Backend Environment Variables

Create `backend/.env`:

```env
# Database Connection
ConnectionStrings__DefaultConnection=Host=localhost;Port=5432;Database=blogdb;Username=postgres;Password=your_password

# JWT Settings
Jwt__Key=your-super-secret-jwt-key-minimum-32-characters-long
Jwt__Issuer=BlogSpaceApp
Jwt__Audience=BlogSpaceAppUsers

# Cloudinary Settings
CloudinarySettings__CloudName=your_cloudinary_cloud_name
CloudinarySettings__ApiKey=your_cloudinary_api_key
CloudinarySettings__ApiSecret=your_cloudinary_api_secret

# CORS Origins (comma-separated)
AllowedOrigins=http://localhost:3000,https://yourdomain.com

# ASP.NET Core Environment
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://localhost:5000
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📚 API Overview

### Authentication Endpoints

| Method | Endpoint             | Description       | Auth Required |
| ------ | -------------------- | ----------------- | ------------- |
| POST   | `/api/auth/register` | Register new user | No            |
| POST   | `/api/auth/login`    | Login user        | No            |
| GET    | `/api/auth/me`       | Get current user  | Yes           |

### Posts Endpoints

| Method | Endpoint                 | Description               | Auth Required     |
| ------ | ------------------------ | ------------------------- | ----------------- |
| GET    | `/api/posts`             | Get all posts (paginated) | No                |
| GET    | `/api/posts/{id}`        | Get post by ID            | No                |
| GET    | `/api/posts/slug/{slug}` | Get post by slug          | No                |
| POST   | `/api/posts`             | Create new post           | Yes (Admin/User)  |
| PUT    | `/api/posts/{id}`        | Update post               | Yes (Owner/Admin) |
| DELETE | `/api/posts/{id}`        | Delete post               | Yes (Owner/Admin) |

### Categories Endpoints

| Method | Endpoint               | Description        | Auth Required |
| ------ | ---------------------- | ------------------ | ------------- |
| GET    | `/api/categories`      | Get all categories | No            |
| GET    | `/api/categories/{id}` | Get category by ID | No            |
| POST   | `/api/categories`      | Create category    | Yes (Admin)   |
| PUT    | `/api/categories/{id}` | Update category    | Yes (Admin)   |
| DELETE | `/api/categories/{id}` | Delete category    | Yes (Admin)   |

### Image Endpoints

| Method | Endpoint                | Description                  | Auth Required |
| ------ | ----------------------- | ---------------------------- | ------------- |
| POST   | `/api/image/upload`     | Upload image to Cloudinary   | Yes           |
| DELETE | `/api/image/{publicId}` | Delete image from Cloudinary | Yes           |

### Dashboard Endpoints

| Method | Endpoint               | Description              | Auth Required |
| ------ | ---------------------- | ------------------------ | ------------- |
| GET    | `/api/dashboard/stats` | Get dashboard statistics | Yes (Admin)   |

### Request/Response Examples

**Login Request:**

```json
POST /api/auth/login
{
  "email": "admin@blogapp.com",
  "password": "Admin@123"
}
```

**Login Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@blogapp.com",
    "role": "Admin"
  }
}
```

**Create Post Request:**

```json
POST /api/posts
Authorization: Bearer {token}

{
  "title": "My Blog Post",
  "content": "Post content here...",
  "excerpt": "Short description",
  "featuredImage": "https://res.cloudinary.com/...",
  "categoryId": 1,
  "tags": ["technology", "web development"]
}
```

## 🐳 Docker Deployment

### Backend Dockerfile

Located at `backend/Dockerfile`:

- Multi-stage build
- Uses .NET 9.0 SDK and Runtime
- Optimized for production
- Exposes port 5000

### Frontend Dockerfile

Located at `frontend/Dockerfile`:

- Multi-stage build with Node.js 20
- Standalone output for optimal size
- Exposes port 3000

### Build and Run with Docker

**Backend:**

```bash
cd backend
docker build -t blogapp-backend .
docker run -p 5000:5000 \
  -e ConnectionStrings__DefaultConnection="..." \
  -e Jwt__Key="..." \
  blogapp-backend
```

**Frontend:**

```bash
cd frontend
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.blogapp.lakshanabenayake.me/api \
  -t blogapp-frontend .
docker run -p 3000:3000 blogapp-frontend
```

## 🚢 Deployment (Dokploy)

### Prerequisites

- Dokploy instance running
- GitHub repository connected
- Custom domain configured

### Backend Deployment

1. **Create PostgreSQL Database** in Dokploy
2. **Create Application** with:

   - Repository: `Blog-App`
   - Branch: `main`
   - Build Type: Dockerfile
   - Dockerfile Path: `backend/Dockerfile`
   - Context: `backend`
   - Port: `5000`

3. **Set Environment Variables** (without ASPNETCORE_URLS)
4. **Configure Domain**: `api.blogapp.lakshanabenayake.me`
5. **Deploy**

### Frontend Deployment

1. **Create Application** with:

   - Repository: `Blog-App`
   - Branch: `main`
   - Build Type: Dockerfile
   - Dockerfile Path: `frontend/Dockerfile`
   - Context: `frontend`
   - Port: `3000`

2. **Set Build Arguments**:

   ```
   NEXT_PUBLIC_API_URL=https://api.blogapp.lakshanabenayake.me/api
   ```

3. **Configure Domain**: `blogapp.lakshanabenayake.me`
4. **Deploy**

### DNS Configuration

Add these A records to your domain:

```
api.blogapp    →  [Dokploy Server IP]
blogapp        →  [Dokploy Server IP]
```

Dokploy will automatically provision SSL certificates via Let's Encrypt.

## 📁 Project Structure

```
BlogApp/
├── backend/
│   ├── Controllers/         # API controllers
│   ├── Models/             # Entity models
│   ├── DTOs/               # Data transfer objects
│   ├── Services/           # Business logic
│   ├── Repositories/       # Data access layer
│   ├── Interfaces/         # Service contracts
│   ├── Data/               # Database context
│   ├── Migrations/         # EF migrations
│   ├── Config/             # Configuration classes
│   ├── Utilities/          # Helper functions
│   ├── Program.cs          # Application entry point
│   ├── Dockerfile          # Docker configuration
│   └── appsettings.json    # App configuration
│
├── frontend/
│   ├── app/                # Next.js app directory
│   │   ├── (blog)/        # Public blog pages
│   │   ├── admin/         # Admin CMS pages
│   │   ├── auth/          # Authentication pages
│   │   └── user/          # User dashboard pages
│   ├── components/         # React components
│   │   ├── ui/            # Base UI components
│   │   ├── blog/          # Blog-specific components
│   │   ├── admin/         # Admin components
│   │   └── user/          # User components
│   ├── contexts/           # React contexts
│   ├── lib/                # Utilities and API client
│   ├── hooks/              # Custom React hooks
│   ├── public/             # Static assets
│   ├── Dockerfile          # Docker configuration
│   └── next.config.mjs     # Next.js configuration
│
└── README.md
```

## 🧪 Testing

### Backend

```bash
cd backend
dotnet test
```

### Frontend

```bash
cd frontend
pnpm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Lakshan Abenayake**

- GitHub: [@lakshanabenayake](https://github.com/lakshanabenayake)
- Website: https://lakshanabenayake.me

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Cloudinary](https://cloudinary.com/) for image management
- [Dokploy](https://dokploy.com/) for easy deployment

## 📞 Support

For support, email contact@lakshanabenayake.me or open an issue on GitHub.

---


