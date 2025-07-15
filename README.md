# Pine Labs Persona Directory

A modern, responsive persona directory interface built with React, TypeScript, and Material-UI. This application allows users to browse, search, and filter through different personas within an organization.

## 🚀 Features

- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices
- **Search Functionality**: Real-time search through persona names and roles
- **Department Filtering**: Filter personas by Tech, Marketing, and Sales departments
- **Pagination**: Efficient pagination for large datasets
- **Interactive UI**: Hover effects, smooth transitions, and professional styling
- **TypeScript**: Full type safety and better developer experience
- **Material-UI**: Modern, accessible UI components

## 📸 Screenshots

The interface includes:

- Clean header with Pine Labs branding and navigation
- Search bar for finding specific personas
- Department filter chips (Tech, Marketing, Sales)
- Responsive grid of persona cards
- Pagination controls

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) 5.15.0
- **Styling**: Emotion (CSS-in-JS)
- **Build Tool**: Vite 6.3.5
- **Package Manager**: npm

## 📦 Installation & Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd AI-Persona/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint for code quality checks

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── pages/               # Application pages
│   │   └── Discovery.tsx    # Main persona directory page
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx       # Top navigation header
│   │   ├── SearchBar.tsx    # Main search functionality
│   │   ├── FilterChips.tsx  # Department filter chips
│   │   ├── PersonaCard.tsx  # Individual persona cards
│   │   ├── PersonaGrid.tsx  # Grid layout for personas
│   │   └── Pagination.tsx   # Pagination controls
│   ├── data/
│   │   └── mockData.ts      # Sample persona data
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── hooks/               # Custom React hooks (ready for future use)
│   ├── services/            # API services (ready for future use)
│   ├── assets/              # Static assets
│   ├── App.tsx              # Application entry point and routing
│   ├── main.tsx             # React application bootstrap
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🎨 Design Features

### Color Palette

- **Primary Green**: #2e7d32 (Pine Labs brand color)
- **Light Green**: #e8f5e8 (Hover states and accents)
- **Dark Green**: #1b5e20 (Active states)
- **Neutral Gray**: #666 (Text and borders)
- **Background**: #ffffff (Clean white background)

### Typography

- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Responsive Breakpoints

- **Mobile**: xs (0-600px) - 1 column
- **Tablet**: sm (600-900px) - 2 columns
- **Desktop**: md (900-1200px) - 3 columns
- **Large**: lg (1200px+) - 4 columns

## 🔧 Architecture Overview

### Pages-Based Structure

The application follows a modern pages-based architecture where:

- **App.tsx**: Simple entry point that renders the current page
- **pages/Discovery.tsx**: Complete persona directory page with all business logic
- **components/**: Reusable UI components shared across pages

This structure makes it easy to add new pages (Chat History, Profile, Settings) while keeping components modular and reusable.

## 🔧 Key Components

### Discovery Page

- Complete persona directory functionality
- State management for search, filtering, and pagination
- Theme provider and layout structure
- Business logic for persona interactions

### Header Component

- Pine Labs branding
- Navigation links (Discover, Chat History)
- Global search functionality
- User profile and settings

### PersonaCard Component

- Professional profile photos
- Name and role display
- Interactive "Start Chat" button for selected personas
- Hover effects and smooth transitions

### FilterChips Component

- Department-based filtering
- Active/inactive states
- Filter icon for additional options

### SearchBar Component

- Real-time search functionality
- Search by name or role
- Clean, accessible design

### Pagination Component

- Page navigation controls
- Previous/Next buttons
- Active page highlighting

## 🚀 Performance Optimizations

- **useMemo**: Optimized filtering and search operations
- **Responsive Images**: Optimized persona photos with appropriate sizing
- **Code Splitting**: Ready for lazy loading implementation
- **Efficient Re-renders**: Minimized unnecessary component updates

## 🎯 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔮 Future Enhancements

### New Pages (Easy to Add)

- Chat History page
- User Profile management page
- Settings and preferences page
- Admin dashboard

### Feature Enhancements

- Dark mode support
- Advanced filtering options
- Real-time chat integration
- Export functionality
- Accessibility improvements (ARIA labels, keyboard navigation)
- Routing with React Router
- Authentication and authorization

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support, email [support@pinelabs.com](mailto:support@pinelabs.com) or create an issue in the repository.

---

Built with ❤️ by the Pine Labs team
