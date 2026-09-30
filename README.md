# 🎓 LearnIt - E-Learning Management System

A comprehensive full-stack Learning Management System (LMS) built with modern technologies, enabling instructors to create and sell courses while providing learners with an interactive learning experience.

![Next.js](https://img.shields.io/badge/Next.js-14.2.4-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue?style=flat&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.19.1-2D3748?style=flat&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-316192?style=flat&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat&logo=tailwind-css)

## ✨ Features

### 👥 Dual Role System
- **Learner Role**: Browse, purchase, and consume courses
- **Tutor Role**: Create, manage, and publish courses
- Dynamic role switching capability
- Separate dashboards for each role

### 📚 Course Management (Tutor)
- Create and publish courses with rich descriptions
- Chapter-based course structure with drag-and-drop reordering
- Video upload and management with **Mux** integration
- Attachment support for supplementary materials
- Course categorization and subcategorization
- Pricing and coupon management with expiration
- Course publish/unpublish functionality
- Real-time analytics and revenue tracking

### 🎯 Learning Experience (Learner)
- Browse courses by category with carousel navigation
- Advanced search functionality with debouncing
- Course preview before purchase
- Video player with progress tracking and resume playback
- Chapter completion tracking with progress bars
- Timestamp-based note-taking during video playback
- Quiz system with passing score requirements
- Certificate generation upon course completion
- Course rating and review system (1-5 stars)
- Learning history and achievements tracking

### 💳 Payment System
- **Razorpay** integration for payments (cards, UPI, net banking)
- Demo checkout while Razorpay keys are unset, so the flow works without a gateway
- Coupon/discount code support with validation
- Shopping cart with multi-course checkout, synced to the learner's account
- Payment verification and instant course access
- Razorpay webhook integration for async payment processing
- Payment success modal with celebration animations

### 💬 Interactive Features
- Q&A system (learners ask questions, tutors answer)
- AI Chat Assistant powered by **Ollama** (local LLM)
- Code syntax highlighting in AI responses
- Real-time progress tracking
- Confetti animations for achievements
- Toast notifications for user feedback

### 🔐 Authentication & Security
- NextAuth v5 (Auth.js) implementation
- OAuth providers (Google, GitHub)
- Role-based access control (RBAC)
- Protected routes and API endpoints
- Session management with JWT strategy
- Secure video playback with signed tokens

### 📊 Analytics Dashboard
- **Learner Analytics**:
  - Course progress visualization
  - Daily/weekly completion charts (Recharts)
  - Time spent tracking
  - Achievement milestones
- **Tutor Analytics**:
  - Revenue tracking and trends
  - Course performance metrics
  - Student enrollment statistics
  - Popular courses insights

### 🎨 UI/UX Features
- Responsive design (mobile-first approach)
- Dark/Light theme support
- Skeleton loading states
- Smooth animations and transitions
- Drag-and-drop interfaces
- Infinite scroll for course listings
- Modal management system
- Accessible components (Radix UI)

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Shadcn/UI](https://ui.shadcn.com/)** - Component library (Radix UI + Tailwind)
- **[Lucide React](https://lucide.dev/)** - Icon library

### Backend
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Serverless backend
- **[Prisma ORM](https://www.prisma.io/)** - Type-safe database queries
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database

### Authentication
- **[NextAuth v5](https://authjs.dev/)** - Authentication solution
- **[@auth/prisma-adapter](https://authjs.dev/reference/adapter/prisma)** - Prisma integration

### State Management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Global state (cart, modals, notes)
- **[SWR](https://swr.vercel.app/)** - Server state caching
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** - Form handling

### Payment & File Storage
- **[Razorpay](https://razorpay.com/)** - Payment processing
- **[Mux](https://www.mux.com/)** - Video streaming and hosting
- **[EdgeStore](https://edgestore.dev/)** - File uploads
- **[Cloudinary](https://cloudinary.com/)** - Image optimization

### AI & Rich Content
- **[Ollama](https://ollama.ai/)** - Local LLM for AI chat
- **[BlockNote](https://www.blocknotejs.org/)** - Rich text editor
- **[Excalidraw](https://excalidraw.com/)** - Whiteboard/canvas
- **[React Quill](https://github.com/zenoamaro/react-quill)** - WYSIWYG editor

### UI Libraries & Animations
- **[Recharts](https://recharts.org/)** - Charts for analytics
- **[Lottie React](https://github.com/Gamote/lottie-react)** - Animations
- **[React Confetti](https://github.com/alampros/react-confetti)** - Celebration effects
- **[@hello-pangea/dnd](https://github.com/hello-pangea/dnd)** - Drag and drop
- **[Embla Carousel](https://www.embla-carousel.com/)** - Carousel component

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database
- Razorpay account (optional — without keys, checkout runs in demo mode)
- Mux account (for video hosting)
- Ollama installed locally (for AI features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Chiragj2003/lms.git
cd lms
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lms"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Razorpay (leave empty to use the demo checkout)
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
RAZORPAY_WEBHOOK_SECRET="your-razorpay-webhook-secret"

# Mux
MUX_TOKEN_ID="your-mux-token-id"
MUX_TOKEN_SECRET="your-mux-token-secret"
MUX_SIGNING_KEY_ID="your-mux-signing-key-id"
MUX_SIGNING_KEY_SECRET="your-mux-signing-key-secret"

# EdgeStore
EDGE_STORE_ACCESS_KEY="your-edgestore-access-key"
EDGE_STORE_SECRET_KEY="your-edgestore-secret-key"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

4. **Set up the database**
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npx ts-node prisma/seed.ts
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
lms/
├── app/                      # Next.js App Router
│   ├── (public)/            # Public routes (home, course listings)
│   ├── (site)/              # Protected routes (dashboards, learning)
│   │   ├── (learner)/       # Learner-specific pages
│   │   └── tutor/           # Tutor-specific pages
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── courses/         # Course management
│   │   ├── user/            # User operations
│   │   └── webhook/         # Razorpay webhooks
│   ├── globals.css          # Global styles
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── auth/                # Authentication components
│   ├── courses/             # Course-related components
│   ├── dashboard/           # Analytics & dashboard
│   ├── modals/              # Modal dialogs
│   ├── ui/                  # Reusable UI components
│   └── utils/               # Utility components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
├── prisma/                  # Database schema & migrations
│   ├── schema.prisma        # Prisma schema
│   └── migrations/          # Migration files
├── providers/               # Context providers
├── public/                  # Static assets
├── schemas/                 # Zod validation schemas
├── server/                  # Server-side functions
└── types.ts                 # TypeScript types
```

## 🎨 Key Features Implementation

### Video Streaming
- Mux handles video transcoding and adaptive bitrate streaming
- Signed playback tokens for security (1-hour expiration)
- Resume playback from last position
- Chapter-based video organization

### Progress Tracking
- Real-time chapter completion tracking
- Course progress percentage calculation
- Daily/weekly completion charts
- Time spent analytics with Recharts

### Quiz System
- Multiple-choice questions with drag-and-drop ordering
- Automatic grading on submission
- Passing score requirements (customizable by tutor)
- One attempt per user (unique constraint)
- Detailed results with correct/incorrect answers

### AI Chat Assistant
- Powered by Ollama (local LLM)
- Context-aware responses based on chapter transcripts
- Markdown and code syntax highlighting
- Chat history persisted in Zustand store

### Payment Flow
1. User enrolls in a course, or adds courses to the cart (synced to their account)
2. Checkout creates a Razorpay order for the course(s), recording them in the order's notes
3. User completes payment in the Razorpay popup
4. The server verifies the payment signature and that the order belongs to this user and course(s)
5. Purchase records are created (the Razorpay webhook does the same as a fallback)
6. Course access is granted immediately

## 🔒 Security

- **Authentication**: OAuth 2.0 with NextAuth v5
- **Authorization**: Role-based access control (RBAC)
- **Session Management**: JWT with HttpOnly cookies
- **API Protection**: All routes require authentication
- **CSRF Protection**: SameSite cookies + CSRF tokens
- **XSS Prevention**: React escapes output by default
- **SQL Injection**: Prisma uses prepared statements
- **Video Security**: Signed Mux tokens with expiration

## 📊 Database Schema

Key entities and relationships:
- **User** → Profile (1:1), Courses (1:N), Purchases (N:M)
- **Course** → Chapters (1:N), SubCategory (N:1), Ratings (1:N)
- **Chapter** → Quiz (1:1), Attachments (1:N), Notes (1:N)
- **Quiz** → Questions (1:N) → Options (1:N)
- **UserProgress**: Tracks chapter completion
- **Purchase**: Many-to-many with metadata

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type checking
npx tsc --noEmit

# Build check
npm run build
```

## 📦 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
Ensure all environment variables are set in your deployment platform.

### Database
- Use managed PostgreSQL (e.g., Supabase, Railway, Neon)
- Run migrations: `npx prisma migrate deploy`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Chirag Jain**
- GitHub: [@Chiragj2003](https://github.com/Chiragj2003)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com/) for deployment platform
- [Shadcn/UI](https://ui.shadcn.com/) for beautiful components
- [Prisma](https://www.prisma.io/) for type-safe database access

## 📞 Support

If you have any questions or need help, please open an issue or contact me.

---

**Note**: Make sure to configure all external services (Razorpay, EdgeStore, Cloudinary, etc.) before running the application. Refer to their respective documentation for setup instructions.