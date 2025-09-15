# SuperAdmin Dashboard

## Overview
The SuperAdmin Dashboard provides a comprehensive overview of the Profinder platform with interactive charts and detailed views for managing users and admins.

## Features

### 📊 Dashboard Statistics
- **Total Users**: Count of all registered users with role 'user'
- **Total Admins**: Count of all admin profiles (both pending and verified)
- **Verified Admins**: Count of admin profiles with 'verified' status
- **Pending Admin Requests**: Count of admin profiles with 'pending' status

### 📈 Interactive Charts
- **Bar Chart**: Visual representation of all statistics
- **Responsive Design**: Charts adapt to different screen sizes
- **Color-coded**: Each statistic has its own color theme

### 🎯 Clickable Functionality
All statistic cards are clickable and open detailed dialogs showing:

1. **Total Users Card** → List of all registered users
2. **Total Admins Card** → List of all admin profiles
3. **Verified Admins Card** → List of verified admin profiles
4. **Pending Requests Card** → List of pending admin requests

### 🔍 Detailed Views
Each dialog shows:
- User avatars with initials
- User names and contact information
- Professional details (for admins)
- Status indicators with color-coded chips
- Professional information (profession, city, etc.)

### 🚀 Quick Actions
- **Review Pending Requests**: Direct access to pending admin verification
- **View Verified Admins**: Quick access to verified admin list

## API Endpoints

### Dashboard Statistics
```
GET /api/superadmin/dashboard-stats
```
Returns:
```json
{
  "totalUsers": 25,
  "totalAdmins": 10,
  "verifiedAdmins": 7,
  "pendingAdmins": 3
}
```

### Detailed Data Endpoints
```
GET /api/superadmin/users          // All users
GET /api/superadmin/admins         // All admin profiles
GET /api/superadmin/verified-admins // Verified admin profiles
GET /api/superadmin/pending        // Pending admin requests
```

## Navigation

The SuperAdmin Panel now includes two tabs:
1. **Dashboard** - Overview with charts and statistics
2. **Pending Admins** - Detailed admin verification interface

## Technical Implementation

### Components
- `SuperAdminDashboard.js` - Main dashboard component
- `StatCard` - Reusable statistic card component
- `SimpleBarChart` - Custom bar chart implementation
- `DetailDialog` - Modal for detailed data views

### Styling
- Material-UI components for consistent design
- Gradient backgrounds for statistic cards
- Hover effects and smooth transitions
- Responsive grid layout

### State Management
- Local state for dashboard statistics
- Loading states for better UX
- Dialog state management for detailed views

## Usage

1. Navigate to `/super-admin` route
2. The dashboard tab is selected by default
3. Click on any statistic card to view detailed information
4. Use the "Quick Actions" buttons for common tasks
5. Switch to "Pending Admins" tab for admin verification

## Data Flow

1. Dashboard loads and fetches statistics from `/api/superadmin/dashboard-stats`
2. User clicks on a statistic card
3. Component fetches detailed data from corresponding endpoint
4. Dialog opens with detailed information
5. User can close dialog and return to dashboard

## Security

- All endpoints require superadmin authentication
- Role-based access control implemented
- JWT token validation on all requests 