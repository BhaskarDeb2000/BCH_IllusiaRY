# Illusia RY - Inventory Management System

A modern, responsive web application for managing inventory items and bookings for Illusia RY organization.



## Features

- **User Authentication**: Secure login and registration system
  - Email/password authentication
  - JWT-Encryption
- **Dashboard Overview**: Quick access to important information and statistics
- **Inventory Management**: Add, edit, delete, and search items in storage
- **Item Categorization**: Organize items with tags and categories
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Feedback**: Instant notifications for user actions
- **Theme Customization**: Toggle between light and dark modes for comfortable viewing
- **Accessible UI**: Enhanced card visibility and keyboard navigation support

## Technology Stack

### Frontend
- React.js with hooks and context API
- Material UI for component styling
- React Router for navigation
- CSS with custom variables and animations
- Context-based theme management
- Enhanced accessibility features
- JWT authentication integration

### Backend
- Node.js with Express
- TypeScript for type safety
- RESTful API architecture
- JWT for secure authentication

## Getting Started

### Prerequisites
- Node.js (v14.0 or later)
- npm

### Configuration

#### JWT Authentication Setup
1. Configure JWT secret key in backend `.env` file
2. Set up token expiration time as needed
3. Implement token refresh mechanism if required for longer sessions

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/illusia-ry.git
cd illusia-ry
```

2. Install dependencies for both frontend and backend
```bash
# Install frontend dependencies
cd Frontend
npm install

# Install backend dependencies
cd ../Backend
npm install
```

3. Configure environment variables
Create `.env` files in both Frontend and Backend directories with the necessary configuration.

4. Start the development servers
```bash
# Start backend server
cd Backend
npm run dev

# Start frontend server in a new terminal
cd Frontend
npm start
```

## Usage

1. **Registration**: Create a new account with your email and password
2. **Login**: Access your dashboard with your credentials
3. **Items Management**: Add new items to inventory, edit details, or remove items
4. **Search & Filter**: Easily find items using the search functionality and tags
5. **Profile Management**: Update your user profile and settings
6. **Theme Toggle**: Switch between light and dark modes using the toggle in the app bar
7. **Dashboard Navigation**: Use either mouse or keyboard to navigate enhanced feature cards

## Project Structure

```
├── Frontend/                 # React frontend application
│   ├── public/               # Static files
│   ├── src/                  # Source files
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ThemeToggle.js      # Theme switching component
│   │   │   └── DashboardFeatureCard.js # Enhanced card component
│   │   ├── contexts/         # React contexts for state management
│   │   │   ├── ThemeContext.js     # Theme state management
│   │   │   └── AuthContext.js      # Authentication state management
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   ├── routes/           # Routing configuration
│   │   ├── services/         # API service calls
│   │   │   └── authService.js      # JWT authentication service
│   │   └── utils/            # Utility functions
└── Backend/                  # Node.js backend application
    ├── src/                  # Source files
    │   ├── controllers/      # Request handlers
    │   │   └── authController.js   # JWT authentication controller
    │   ├── models/           # Data models
    │   ├── routes/           # API routes
    │   ├── middleware/       # Custom middleware
    │   │   └── auth.js             # JWT verification middleware
    │   └── server/           # Server configuration
```

## Performance Optimizations

- Code splitting with React.lazy for improved initial load time
- Component memoization to reduce unnecessary re-renders
- Optimized API calls with proper caching strategies
- Responsive images and efficient CSS for better mobile performance
- Smooth theme transitions with hardware-accelerated animations

## Visual Design

- Modern UI with gradient accents and subtle animations
- Consistent color scheme with primary and secondary colors
- Card-based interface for intuitive item management
- Responsive layouts that adapt to different screen sizes
- Accessibility-focused design with proper contrast and focus states
- Dark mode with thoughtfully designed color palette
- Enhanced dashboard cards with improved visibility and interactions

## Accessibility Features

- Keyboard navigation support for all interactive elements
- Improved focus indicators for keyboard users
- Proper ARIA labels for screen reader compatibility
- Color contrast ratios that meet WCAG 2.1 AA standards
- Responsive design that works with screen magnifiers and zoom
- Theme preference detection based on user's system settings

## Troubleshooting

### Common Issues

- **Infinite Loading**: If the dashboard keeps loading, check:
  - Backend server connection (localhost:8000 should be running)
  - JWT token validity in localStorage
  - Network errors in browser console
  
- **Authentication Issues**: If you can't log in, verify:
  - Correct credentials are being used
  - JWT token is not expired
  - Backend authentication server is running properly
  
- **Theme Toggle Not Working**: Verify:
  - Local storage permissions are enabled in browser
  - No JavaScript errors in console
  - Check if ThemeContext provider is properly wrapping your application

- **Cards Not Displaying Properly**: Ensure:
  - All Material UI dependencies are installed correctly
  - CSS variables are properly defined in your theme
  - Check for any styling conflicts in browser devtools

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Material UI](https://mui.com/) for the component library
- [React Router](https://reactrouter.com/) for navigation
- [React](https://reactjs.org/) for the frontend framework
- [JWT](https://jwt.io/) for authentication

---

Built with ❤️ for Illusia RY

