# LearnGita.com - Project Context

## Project Overview

**LearnGita.com** is a modern web application that brings the timeless wisdom of the Bhagavad Gita to the digital generation through structured study, daily spiritual practices (Sadhna), and AI-powered guidance.

### Purpose
- Educational platform for learning the Bhagavad Gita through structured courses
- Daily Sadhna (spiritual practice) tracker with streak management
- AI-powered spiritual guidance using Gemini API
- Multi-language support (English & Hindi)
- User authentication and progress tracking

---

## Technology Stack

### Frontend
- **Framework**: React 19.2.4 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS (via CDN)
- **Animation**: Framer Motion 12.34.0
- **Icons**: Lucide React 0.563.0
- **Celebration Effects**: Canvas Confetti 1.9.4
- **Date Handling**: date-fns 4.1.0

### Backend & Services
- **Database & Auth**: Supabase 2.45.0
  - PostgreSQL database
  - Row Level Security (RLS) enabled
  - Tables: `users`, `sadhna_logs`
- **AI Integration**: Google Gemini API (@google/genai 1.40.0)
  - Model: gemini-3-flash-preview
  - Use cases: Verse of the Day, AI Chat Companion

### Development Environment
- **Package Manager**: npm (with bun.lock present)
- **TypeScript**: 5.8.2
- **Node Types**: 22.14.0
- **Dev Server**: Runs on port 3000

---

## Project Structure

```
learngita.com/
├── components/              # React Components (13 files)
│   ├── AboutUs.tsx         # About page with director profile
│   ├── AuthForm.tsx        # Login/Signup form
│   ├── CourseCard.tsx      # Course display card
│   ├── CourseView.tsx      # Individual course viewer
│   ├── GitaChat.tsx        # AI chat interface
│   ├── Hero.tsx            # Landing page hero section
│   ├── Navbar.tsx          # Navigation bar
│   ├── ProfileSetup.tsx    # User profile configuration
│   ├── SadhanaMiniStrip.tsx # Daily progress mini calendar
│   ├── SadhnaCalendar.tsx  # Full calendar view
│   ├── SadhnaTracker.tsx   # Main Sadhna tracking interface
│   ├── StreakTracker.tsx   # Streak visualization
│   └── StudentDashboard.tsx # User dashboard
├── services/               # Business Logic Layer (3 files)
│   ├── geminiService.ts   # Gemini AI API integration
│   ├── sadhnaService.ts   # Sadhna CRUD operations & streak logic
│   └── userService.ts     # User profile operations
├── public/                # Static Assets
│   ├── assets/           # Images, icons
│   └── _redirects        # Routing configuration
├── dist/                 # Build output
├── node_modules/         # Dependencies
├── App.tsx              # Main application component
├── index.tsx            # React entry point
├── index.html           # HTML template
├── index.css            # Additional styles
├── types.ts             # TypeScript type definitions
├── constants.tsx        # App constants (courses, icons)
├── supabaseClient.ts    # Supabase client configuration
├── vite.config.ts       # Vite build configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies & scripts
└── .env.local          # Environment variables
```

---

## Core Features

### 1. **Course Learning System**
- **Courses**: Gita Essentials, Karma Yoga, Path of Devotion
- **Levels**: Beginner, Intermediate, Advanced
- **Lessons**: Each includes video, shloka (Sanskrit verse), translation, and content
- **Progress Tracking**: Lesson completion, course enrollment
- **Multi-language**: English and Hindi content

### 2. **Sadhna (Spiritual Practice) Tracker**
**Core Functionality**: Daily spiritual practice tracking with "Punctual Chain" streak logic

**Practice Categories**:
- Mantra Meditation (Japa) - 16 rounds target
- Gita Reading - 15 minutes target
- Verse Memorization - 1 verse target
- Hatha Yoga - 30 minutes target

**Streak Logic (Punctual Chain Algorithm)**:
- A log is "punctual" if submitted within 1 calendar day of the entry date
- Streak calculated using `calculatePunctualStreak()` in `services/sadhnaService.ts`
- Uses `date-fns` for timezone-safe date comparisons
- Streak breaks if a day is missed or submitted too late
- Visual feedback: Green (punctual), Orange (late), Red (missed)

**Database Schema**:
```sql
-- sadhna_logs table
user_id (FK to users)
entry_date (date) - The date for which the practice is recorded
created_at (timestamp) - When the entry was submitted
total_score (numeric)
answers (jsonb)

-- users table
id (PK)
name, email
current_streak, longest_streak
last_sadhna_date
```

### 3. **AI-Powered Features**
- **Gita Chat**: Ask spiritual questions, get Gita-based guidance
- **Verse of the Day**: Random uplifting verse with modern application
- **Language-aware**: Responds in English or Hindi based on user preference

### 4. **User Management**
- **Authentication**: Email/Password via Supabase Auth
- **User Profile**: Name, email, sadhna history, streaks
- **Profile Setup**: Extended user configuration
- **Dashboard**: View enrolled courses, sadhna history, progress stats

### 5. **Application Sections**
```typescript
enum AppSection {
  Home = 'home',
  Explore = 'explore',
  Sadhna = 'sadhna',
  Auth = 'auth',
  Dashboard = 'dashboard',
  CourseView = 'course-view',
  About = 'about',
  ProfileSetup = 'profile-setup'
}
```

---

## Design System

### Color Palette
- **Cream**: `#FFFDF0` - Background
- **Saffron**: `#FFB800` - Primary accent (sacred saffron color)
- **Clay**: `#DFC9B4` - Secondary accent
- **Charcoal**: `#333333` - Primary text
- **Deep Brown**: `#4A3728` - Headers, dark elements

### Typography
- **Serif**: "Libre Baskerville" - Headlines, titles, shlokas
- **Sans**: "Montserrat" - Body text, UI elements

### Theme
- **Aesthetic**: Spiritual, warm, premium
- **Layout**: Mandir arch borders, gradient overlays
- **Animations**: Smooth transitions, hover effects

---

## Key Architectural Patterns

### 1. **State Management**
- React hooks (`useState`, `useEffect`)
- Props drilling for state sharing
- Session state managed via Supabase auth
- Local component state for UI interactions

### 2. **Data Flow**
```
User Interaction
    ↓
Component (React)
    ↓
Service Layer (sadhnaService, geminiService, userService)
    ↓
External API (Supabase / Gemini)
    ↓
Update UI State
```

### 3. **Resilient Design**
- **Offline Mode**: Both Supabase and Gemini have fallback/demo modes
- **Error Handling**: Graceful degradation when APIs are unavailable
- **Mock Clients**: Return placeholder data when credentials missing

**Example** (from `supabaseClient.ts`):
```typescript
if (isPlaceholder) {
  console.warn('⚠️ Supabase credentials missing. App running in offline/demo mode.');
  return mockClient;
}
```

### 4. **Environment Variables**
```env
GEMINI_API_KEY=<your-gemini-key>
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

---

## Critical Business Logic

### Punctual Streak Calculation
**Location**: `services/sadhnaService.ts` → `calculatePunctualStreak()`

**Algorithm - Punctual Chain (STRICT IMPLEMENTATION)**:

**Step 1**: Gather all Sadhna logs from the database

**Step 2**: Define 'Punctual' - A log is 'Punctual' if `(SubmissionDate - EntryDate) <= 1 calendar day`
- Same day submission (diff = 0): Punctual ✓
- Next day submission (diff = 1): Punctual ✓  
- 2+ days late (diff >= 2): Late ✗

**Step 3**: Filter to create a list containing only 'Punctual' logs

**Step 4**: Sort the punctual logs by `entry_date` in descending order (newest first)

**Step 5**: Check Starting Point
- If the most recent punctual entry's date is NOT 'Today' or 'Yesterday', streak = 0
- Chain must be current to count

**Step 6**: Count the Chain
- Start with streak = 1
- Iterate through sorted dates
- For each pair, check if gap = exactly 1 day
- Increment streak if consecutive
- Break on first gap > 1 day

**Example Scenarios**:
```
Today = Feb 10

Scenario A: Fill Feb 10 (on Feb 10)
  → Streak = 1 ✓

Scenario B: Fill Feb 10 (on Feb 10), then Fill Feb 9 (on Feb 10)
  → Streak = 2 ✓ (Feb 9 submission is punctual because diff = 1 day)

Scenario C: Fill Feb 10, Feb 9, then Fill Feb 8 (on Feb 10)
  → Streak = 2 (NOT 3)
  → Feb 8 submission is LATE (diff = 2 days)
  → Feb 8 appears ORANGE in UI
  → Chain breaks at Feb 9
```

**Important**: Uses `date-fns` functions:
- `parseISO()`: Parse date strings
- `differenceInCalendarDays()`: Calculate day difference (must be >= 0 and <= 1 for punctual)
- `format()`: Format dates to `yyyy-MM-dd`
- `subDays()`: Calculate yesterday
- `extractDateStr()`: Helper to normalize timestamp formats

**Color Coding** (in `SadhanaMiniStrip.tsx`):
- **Green**: Punctual (diff >= 0 && diff <= 1)
- **Orange**: Late (diff > 1)
- **Red**: Missed (no entry for past date)
- **Cream**: Future or today without entry

### Sadhna Save Flow
1. User submits daily practice report
2. `sadhnaService.saveSadhna()` upserts to `sadhna_logs` table
3. Fetches all user logs from database
4. Recalculates current streak using `calculatePunctualStreak()`
5. Updates `users` table with `current_streak`, `longest_streak`, `last_sadhna_date`
6. Returns updated data to App.tsx
7. `handleSadhnaComplete` refetches history and updates React state
8. UI components (SadhanaMiniStrip, StreakTracker) re-render with new data

---

## Database Configuration

### Supabase Tables

#### `users`
- `id` (uuid, PK)
- `name` (text)
- `email` (text)
- `current_streak` (integer)
- `longest_streak` (integer)
- `last_sadhna_date` (date)
- Row Level Security: Enabled

#### `sadhna_logs`
- `id` (uuid, PK)
- `user_id` (uuid, FK → users.id)
- `entry_date` (date)
- `created_at` (timestamp with time zone)
- `total_score` (numeric)
- `answers` (jsonb)
- **Unique Constraint**: `(user_id, entry_date)`
- Row Level Security: Enabled

---

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Set environment variables in .env.local
GEMINI_API_KEY=your_key_here
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here

# Run development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Type Safety
- All components use TypeScript
- Types defined in `types.ts`:
  - `Language`, `SadhnaRecord`, `User`, `Lesson`, `Course`, `SadhnaItem`, `ChatMessage`, `AppSection`
- Strict type checking enabled

### Build Configuration
- **Vite Config**: Defines environment variable injection
- **TSConfig**: ES2022 target, React JSX, module resolution: bundler
- **Path Alias**: `@/*` maps to project root

---

## Recent Development History

### Latest Changes (from conversation history)
1. **Streak Logic Debugging** (2026-02-10)
   - Fixed "Punctual Chain" streak calculation
   - Implemented timezone-safe date handling with `date-fns`
   - Added comprehensive debug logging
   - Fixed issue where filling multiple days on same day showed 0 streak

2. **Supabase Integration** (2026-02-09)
   - Resolved foreign key constraint issues
   - Applied SQL schema corrections
   - Fixed data saving issues

3. **About Us Page** (2026-02-09)
   - Built comprehensive About page
   - Mandir arch border design
   - 3-tab director profile system
   - Responsive design with theme colors

4. **Module Resolution** (2026-02-09)
   - Fixed lucide-react module not found errors

---

## Known Issues & Gotchas

### 1. **Streak Calculation Edge Cases**
- Entries submitted on the same day for different dates are properly handled
- Timezone differences accounted for using `date-fns`
- Debug logs available in console for troubleshooting

### 2. **API Key Management**
- Gemini API key stored in `.env.local`
- App runs in demo mode if keys are missing
- Fallback responses prevent crashes

### 3. **Database Constraints**
- Unique constraint on `(user_id, entry_date)` prevents duplicate entries for same day
- Foreign key to `users` table must exist before inserting sadhna logs

### 4. **Browser Date Handling**
- Always use `date-fns` for date operations, not native Date methods
- Store dates as `yyyy-MM-dd` strings in database
- Use `extractDateStr()` helper to normalize timestamp formats

---

## File Maintenance Guidelines

### When to Update This File

**ALWAYS update `project_context.md` when**:
1. Adding new major features or components
2. Changing database schema
3. Modifying core business logic (especially streak calculation)
4. Adding new external service integrations
5. Updating tech stack dependencies (major versions)
6. Changing environment variable requirements
7. Discovering and documenting gotchas/bugs
8. Modifying application architecture or patterns

**Update Sections**:
- **Tech Stack**: When dependencies change
- **Core Features**: When adding/removing features
- **Critical Business Logic**: When algorithms change
- **Known Issues**: When bugs are discovered/fixed
- **Database Schema**: When tables/columns change

### Who Should Maintain
- ALL developers (human or AI) working on this codebase
- Update as part of pull request process
- Reference in code review checklist

---

## Testing & Verification

### Manual Testing Checklist
- [ ] Sadhna submission and streak update
- [ ] Login/Signup flow
- [ ] Course enrollment and lesson viewing
- [ ] Gita Chat AI responses
- [ ] Language switching (EN ↔ HI)
- [ ] Calendar and mini-strip updates
- [ ] Responsive design on mobile

### Key Test Scenarios
1. **Streak Logic**: 
   - Fill Feb 10 (on Feb 10) → streak = 1
   - Fill Feb 9 (on Feb 10) → streak = 2
   - Fill Feb 8 (on Feb 10) → streak = 2 (NOT 3, Feb 8 is late/orange)
2. **Late Submission**: Fill Feb 8 entry on Feb 10 → Should show as ORANGE, NOT count toward streak
3. **API Failure**: Disconnect internet → App should use demo mode

---

## Contact & Resources

### Project Links
- **AI Studio App**: https://ai.studio/apps/drive/1vsCKQqDIVKEacbY45sKzlXQDRAFSQtga
- **Supabase Instance**: https://gapvcipfqggnbiidiols.supabase.co

### Documentation References
- [Supabase Docs](https://supabase.com/docs)
- [Gemini API Docs](https://ai.google.dev/docs)
- [date-fns Docs](https://date-fns.org/docs)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)

---

## Version Information

**Last Updated**: 2026-02-10 (Streak Calculation Fix)  
**Project Version**: 0.0.0  
**Document Version**: 1.0.1

---

*This document is a living artifact. Keep it updated as the project evolves.*
