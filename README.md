# Habit Tracker

A full-stack web application for tracking daily habits and building streaks. Users can log in, record their daily activities, visualize progress through an interactive calendar, and maintain records of their habit streaks.

## Project Structure

```
habit-tracker/
├── back/                 # Flask backend API
│   ├── auth.py          # Authentication endpoints (register/login)
│   ├── db.py            # Database initialization and connection
│   ├── user.py          # User-related endpoints
│   ├── schema.sql       # Database schema
│   └── .env             # Environment variables
└── habit-tracker/       # React + Vite frontend
    ├── src/
    │   ├── components/  # React components
    │   │   ├── Calendar.jsx        # Calendar view
    │   │   ├── DayEditor.jsx       # Day/habit editor
    │   │   ├── Login.jsx           # Login form
    │   │   ├── Register.jsx        # Registration form
    │   │   ├── Messages.jsx        # Alert/message display
    │   │   ├── UserRecods.jsx      # User records view
    │   │   └── Map.jsx             # Map/data visualization
    │   ├── App.jsx                 # Main app component
    │   ├── editingContext.js       # Context for edit state
    │   ├── editingDatContext.js    # Context for data state
    │   ├── fetchData.js            # API utilities
    │   └── index.css               # Styles
    ├── package.json
    ├── vite.config.js
    └── index.html
```

## Features

- **User Authentication**: Register and login with secure password hashing
- **Habit Tracking**: Log daily habits and track streaks
- **Visual Calendar**: Interactive calendar view of habit history
- **Data Visualization**: View maps and records of habits over time
- **User Dashboard**: Track current and all-time best streaks

## Tech Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite
- **Security**: Werkzeug for password hashing, session management

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: CSS

## Getting Started

### Prerequisites
- Python 3.x
- Node.js & npm

### Backend Setup

1. Navigate to the backend directory:
```bash
cd back
```

2. Create a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install flask
```

4. Configure environment variables:
Create a `.env` file in the `back/` directory with necessary configuration.

5. Initialize the database:
```bash
python -m fask --app back init-db
```
or
```bash
flask --app back init-db
```
(Note that you must be outside of "back" directory/folder)

6. Run the server:
```bash
python -m flask run
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd habit-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your backend API URL:
```
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `password` - Hashed password

### Data Table
- `id` - Primary key
- `user_id` - Foreign key to user
- `data` - JSON string containing streak information (current streak, best streak)

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### User
- User-specific endpoints for habit data retrieval and updates

## Contributing

Feel free to fork and create pull requests with improvements.

## License

This project is open source and available under the MIT License.
