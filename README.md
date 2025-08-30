# Raidical BJJ - Brazilian Jiu-Jitsu Training Management System

A comprehensive BJJ training management application built with Next.js, TypeScript, and Tailwind CSS. Features a modern frosted glass design system and full CRUD operations for managing athletes, classes, curriculum, and mind maps.

## 🌟 Features

### ✅ Completed Features

- **Athlete Profile Management**: Create, read, update, and delete athlete profiles with belt tracking, weight, and progress monitoring
- **Dashboard Statistics**: Real-time KPIs showing moves learned, classes attended, and progress to next belt
- **Class Schedule Management**: Import, view, edit, and filter class schedules with attendance tracking
- **Curriculum Library**: Manage BJJ moves library with categories, difficulty levels, and progress tracking
- **Mind Map Editor**: Visual strategy editor with draggable nodes and connections for game planning
- **Class Schedule Importer**: Cloud function to automatically fetch and parse class schedule data
- **Frosted Glass Design System**: Modern UI with translucent panels, blur effects, and smooth animations

### 🎨 Design System

- **Color**: Frosted glass-like translucent panels with blurred backgrounds for depth
- **Layout**: Ample spacing and padding for openness and clarity
- **Typography**: Clean, modern sans-serif typeface (Inter) with excellent legibility
- **Iconography**: Simple, monochrome icons with rounded corners
- **Animation**: Fluid and subtle animations for transitions and interactions

### 🛠 Tech Stack

- **Frontend**: TypeScript, Next.js 15, Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **UI Components**: Custom frosted glass components with Framer Motion
- **Icons**: Heroicons
- **Forms**: React Hook Form with Zod validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd raidical-bjj
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Seed the database with sample data**
   ```bash
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Commands

- **Reset database**: `npm run db:reset`
- **Seed database**: `npm run db:seed`
- **View database**: `npx prisma studio`

## 📱 Application Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── athletes/          # Athlete management pages
│   ├── classes/           # Class schedule pages
│   ├── curriculum/        # Move library pages
│   ├── mind-maps/         # Mind map editor pages
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── MindMapEditor.tsx # Interactive mind map editor
├── lib/                  # Utility functions
│   └── prisma.ts         # Database client
└── prisma/               # Database schema and migrations
    ├── schema.prisma     # Database schema
    └── seed.ts           # Sample data
```

## 🎯 Key Features Explained

### Athlete Management
- Complete CRUD operations for athlete profiles
- Belt progression tracking (White → Blue → Purple → Brown → Black)
- Weight tracking and class attendance monitoring
- Progress statistics and performance metrics

### Class Scheduling
- Create and manage class schedules
- Track instructor assignments and locations
- Monitor class capacity and attendance
- Import schedules from external websites

### Curriculum Library
- Comprehensive BJJ move database
- Categorization by position (Guard, Mount, Submissions, etc.)
- Difficulty levels (Beginner → Expert)
- Progress tracking for each athlete

### Mind Map Editor
- Interactive visual strategy planning
- Drag-and-drop node creation and editing
- Connect moves to create game plans
- Real-time collaboration features

### Schedule Importer
- Automatic parsing of external class schedules
- Support for multiple website formats
- Date range filtering
- Duplicate detection and prevention

## 🎨 Design Philosophy

The application follows a modern frosted glass design system that creates depth and hierarchy through:

- **Translucent panels** with backdrop blur effects
- **Subtle gradients** for enhanced depth perception
- **Smooth animations** for polished user experience
- **Consistent spacing** for visual clarity
- **Accessible color contrasts** for readability

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset and reseed database

### Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Athletes**: Student profiles with belt and progress tracking
- **Classes**: Scheduled training sessions with attendance
- **Moves**: BJJ techniques with categories and difficulty
- **MindMaps**: Visual strategy planning tools
- **Progress**: Learning progress tracking for each athlete

## 🚀 Deployment

The application is ready for deployment on platforms like:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

### Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL="file:./dev.db"
```

For production, replace with your production database URL.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Brazilian Jiu-Jitsu community for inspiration
- Next.js team for the excellent framework
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations

---

**Raidical BJJ** - Elevating your Brazilian Jiu-Jitsu training management experience! 🥋