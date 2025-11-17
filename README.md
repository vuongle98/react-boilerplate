# React Boilerplate

A modern, production-ready React application boilerplate built with TypeScript, featuring comprehensive component libraries, authentication, admin dashboards, and best practices for scalable applications.

## 🚀 Features

### Core Technologies
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Query** for data fetching and caching
- **React Router** for navigation

### Key Features
- 🔐 **Authentication** - Keycloak integration with protected routes
- 📊 **Admin Dashboard** - Service management with CRUD operations
- 🎨 **Component Library** - 50+ pre-built, accessible components
- 🌙 **Dark Mode** - Complete theme system with CSS custom properties
- 📱 **Mobile Responsive** - Mobile-first design with adaptive layouts
- ⚡ **Performance** - Optimized with code splitting, lazy loading, and caching
- 🎯 **TypeScript** - 100% type coverage for better development experience
- 🧪 **Testing Ready** - Pre-configured for unit and integration tests

### Admin Features
- **Service Management** - Full CRUD operations for services
- **Real-time Updates** - Live data synchronization
- **Advanced Filtering** - Multi-criteria search and filter
- **Bulk Operations** - Select and manage multiple items
- **Responsive Tables** - Mobile-optimized data display
- **Modal Dialogs** - Custom modal components with proper accessibility

## 🏗️ Project Structure

```
src/
├── app/                    # Application configuration
│   ├── providers/         # Context providers (Auth, Theme, etc.)
│   └── router/            # Application routing
├── features/              # Feature-based modules
│   ├── auth/             # Authentication feature
│   └── landing/          # Landing page feature
├── layouts/               # Layout components
│   ├── AuthenticatedLayout/
│   └── PublicLayout/
├── pages/                 # Page components
│   ├── HomePage.tsx
│   ├── BotsPage.tsx
│   └── ComponentsDemo.tsx
├── shared/                # Shared utilities and components
│   ├── components/       # Reusable components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services
│   ├── types/           # TypeScript type definitions
│   └── ui/              # UI component library
└── utils/                 # Utility functions
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-boilerplate
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`

5. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (when configured)

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# Keycloak Configuration
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=your-realm
VITE_KEYCLOAK_CLIENT_ID=your-client-id

# Other configuration
VITE_APP_TITLE=React Boilerplate
```

### Theme Customization

The application uses CSS custom properties for theming. You can customize colors in `src/index.css`:

```css
:root {
  --primary: 217 91% 60%;
  --secondary: 262 80% 50%;
  /* ... other color variables */
}
```

## 🎨 Component Library

The project includes a comprehensive component library built with shadcn/ui:

### Layout Components
- `Card`, `CardHeader`, `CardContent`, `CardTitle`, `CardDescription`
- `Button` with multiple variants and sizes
- `Input`, `Textarea`, `Select`
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`

### Data Display
- `Badge` with status variants
- `Avatar`, `AvatarImage`, `AvatarFallback`
- `Skeleton` for loading states
- `DataTable` with pagination, sorting, and filtering

### Navigation
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `DropdownMenu` components
- `Breadcrumb` navigation

### Feedback
- `Alert`, `AlertTitle`, `AlertDescription`
- `Toast` notifications
- `Progress` indicators
- `LoadingSpinner`

### Overlays
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`
- `Sheet` for mobile side panels
- `Popover`, `Tooltip`

## 🔐 Authentication

The application uses Keycloak for authentication:

1. Configure Keycloak server in `.env`
2. Protected routes automatically redirect to login
3. User roles and permissions are available via context
4. Automatic token refresh and session management

## 📊 Admin Dashboard

Access the admin panel at `/admin` to manage services:

### Features
- **Service CRUD** - Create, read, update, delete services
- **Bulk Operations** - Select multiple items for batch actions
- **Advanced Search** - Filter services by multiple criteria
- **Pagination** - Efficient handling of large datasets
- **Responsive Design** - Optimized for mobile and desktop

### API Integration
The admin dashboard integrates with REST APIs using:
- **React Query** for caching and synchronization
- **Custom hooks** for data fetching
- **Error handling** and loading states
- **Optimistic updates** for better UX

## 🧪 Testing

The project is set up for testing with:
- **Vitest** for unit tests
- **React Testing Library** for component testing
- **MSW** for API mocking

Run tests:
```bash
npm run test
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Environment-Specific Builds

Configure different environments in `vite.config.ts`:

```typescript
export default defineConfig(({ mode }) => ({
  // Environment-specific configuration
}));
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Create a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use conventional commit messages
- Write tests for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React Query](https://tanstack.com/query) for data fetching
- [Vite](https://vitejs.dev/) for build tooling
- [Lucide React](https://lucide.dev/) for icons

---

Built with ❤️ using modern web technologies.