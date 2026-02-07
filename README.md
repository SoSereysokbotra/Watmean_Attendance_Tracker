# Watmean Attendance Tracker

A modern, location-based attendance tracking system built with Next.js, designed for educational institutions. Features separate dashboards for teachers and students with real-time attendance monitoring and geolocation verification.

## 🌟 Features

### Teacher Dashboard

- **Session Management**: Launch and manage attendance sessions with geofencing
- **Live Attendance Tracking**: Real-time student check-in monitoring
- **Analytics**: Comprehensive attendance statistics and reporting
- **Student Management**: Mark attendance, manage student lists
- **Schedule View**: Calendar-based schedule management
- **Location-Based Verification**: Set geofence radius for attendance validation

### Student Dashboard

- **Quick Check-In**: Location-verified attendance marking
- **Attendance History**: View personal attendance records
- **Class Schedule**: See upcoming classes and sessions
- **Real-Time Updates**:Instant feedback on check-in status

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Maps**: Leaflet & React-Leaflet
- **Charts**: Recharts
- **State Management**: React Hooks
- **Theme**: next-themes (dark mode support)
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd watmean
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
watmean/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Authentication routes
│   │   ├── (dashboard)/            # Protected dashboard routes
│   │   │   ├── teacher/           # Teacher dashboard
│   │   │   │   ├── active/        # Active session management
│   │   │   │   │   ├── components/ # Page-specific components
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── schedule/      # Schedule management
│   │   │   │   └── page.tsx       # Teacher home
│   │   │   └── student/           # Student dashboard
│   │   │       ├── attendance/
│   │   │       ├── checkin/
│   │   │       ├── classes/
│   │   │       └── page.tsx       # Student home
│   │   ├── api/                   # API routes
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Landing page
│   ├── components/                # Reusable components
│   │   ├── ui/                    # Base UI primitives
│   │   ├── dashboard/             # Shared dashboard components
│   │   ├── teacher/               # Teacher-specific components
│   │   └── student/               # Student-specific components
│   ├── hooks/                     # Custom React hooks
│   │   ├── useStudents.ts         # Student data management
│   │   ├── useAttendance.ts       # Attendance calculations
│   │   └── useClassData.ts        # Class/session data
│   ├── types/                     # TypeScript type definitions
│   │   ├── student.ts             # Student-related types
│   │   ├── class.ts               # Class/session types
│   │   ├── attendance.ts          # Attendance types
│   │   └── index.ts               # Barrel export
│   └── lib/                       # Utilities and helpers
│       └── utils.ts               # Common utilities
├── public/                        # Static assets
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Project dependencies
```

## 🎨 Key Design Patterns

### Component Architecture

- **Composition over Inheritance**: Small, focused components
- **Custom Hooks**: Business logic separated from UI
- **Type Safety**: Comprehensive TypeScript types
- **Consistent Patterns**: All pages follow similar structure

### State Management

- React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`)
- Custom hooks for reusable logic
- Props drilling for simple cases

### Styling

- Tailwind CSS utility classes
- CSS custom properties for theming
- Dark mode support via `next-themes`
- Responsive design (mobile-first)

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Create production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 📱 Key Routes

- `/` - Landing page
- `/teacher` - Teacher dashboard home
- `/teacher/active` - Active session management
- `/teacher/schedule` - Schedule view
- `/student` - Student dashboard home
- `/student/checkin` - Check-in interface
- `/student/attendance` - Attendance history
- `/student/classes` - Class list

## 🔧 Configuration

### Path Aliases

The project uses TypeScript path aliases for clean imports:

```typescript
'@/*' maps to './src/*'
```

### Tailwind Custom Colors

```css
--brand-primary: Orange (hsl(20, 100%, 50%)) --brand-dark: Dark gray for UI
  elements;
```

## 🌙 Dark Mode

The application supports automatic dark mode detection and manual toggle via `next-themes`. All components are designed with dark mode in mind.

## 📝 Development Guidelines

### Creating New Components

1. Place in appropriate folder (`ui/`, `dashboard/`, `teacher/`, `student/`)
2. Use TypeScript with proper prop types
3. Follow existing naming conventions
4. Ensure dark mode compatibility

### Adding Types

1. Create/update files in `src/types/`
2. Export from `src/types/index.ts`
3. Use consistent naming (interfaces, types)

### Custom Hooks

1. Place in `src/hooks/`
2. Prefix with `use`
3. Return object with clear naming
4. Export from `src/hooks/index.ts`

## 🚧 Upcoming Features

- Backend API integration
- Real-time WebSocket updates
- Advanced analytics dashboard
- Export functionality (CSV, PDF)
- Email notifications
- Mobile app version
- Multi-language support

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

Developed by [Your Name/Team]

## 🤝 Contributing

Contributions are welcome! Please follow the existing code patterns and ensure TypeScript compliance.

---

**Built with ❤️ using Next.js and TypeScript**
