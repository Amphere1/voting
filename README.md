# 🗳️ VoteWise - Modern Voting Application

A comprehensive, secure, and user-friendly voting platform built with Next.js, MongoDB, and modern web technologies.

## ✨ Features

### 🔐 **Multi-Role Authentication System**
- **Voters**: Register, login, and participate in elections
- **Candidates**: Create detailed profiles with photos and manifestos
- **Admins**: Manage elections, candidates, and view results
- JWT-based authentication with HTTP-only cookies
- Role-based access control and protected routes

### 🗳️ **Election Management**
- Create and manage multiple elections
- Set voting periods with start/end dates
- Real-time election status (upcoming, active, completed)
- Comprehensive election details and candidate listings

### 👤 **Candidate System**
- Rich candidate profiles with photos (Cloudinary integration)
- Detailed information: manifesto, experience, education, achievements
- Social media links and contact information
- Campaign slogans and political party affiliations

### 📊 **Advanced Results & Analytics**
- **Real-time Results**: Live vote counting and candidate rankings
- **Comprehensive Statistics**: Turnout rates, victory margins, and participation metrics
- **Winner Declaration**: Automatic winner determination for completed elections
- **Visual Analytics**: Progress bars, charts, and detailed breakdowns
- **Admin Dashboard**: Advanced admin-only results with CSV export functionality
- **Public Results**: Voter-friendly results display with auto-refresh for active elections
- **Historical Data**: Complete election archives and result history

### 🗳️ **Voting & Election Management**
- Secure one-vote-per-election system
- Anonymous voting with vote verification
- Real-time vote counting and result displays
- Prevent duplicate voting with user tracking

### 📱 **Modern UI/UX**
- Fully responsive design (mobile, tablet, desktop)
- Clean and intuitive interface with ShadCN/UI components
- Loading states, error handling, and user feedback
- Contact page and comprehensive navigation

### 🛡️ **Security & Privacy**
- Secure password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies for session management
- Input validation and sanitization
- Comprehensive Terms of Service and Privacy Policy

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 18, TailwindCSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcrypt
- **File Upload**: Cloudinary
- **UI Components**: ShadCN/UI, Radix UI
- **Styling**: TailwindCSS, CSS Variables

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB database
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/voting-app.git
   cd voting-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env.example` to `.env` and configure:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/voting-app
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   
   # Environment
   NODE_ENV=development
   ```

4. **Seed Default Admin**
   ```bash
   npm run seed:admin
   ```
   Default admin credentials:
   - Email: `admin@vote.com`
   - Password: `admin123`
   
   ⚠️ **Change these credentials immediately after first login!**

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### For Voters
1. **Register**: Create account with personal information
2. **Login**: Access with your credentials
3. **Browse Elections**: View available elections
4. **Vote**: Select candidates and cast your vote
5. **View Results**: Check election outcomes

### For Candidates
1. **Register**: Complete detailed profile with photo
2. **Campaign Info**: Add manifesto, experience, social media
3. **Election Participation**: Get added to relevant elections
4. **Track Performance**: Monitor votes and engagement

### For Administrators
1. **Login**: Use admin credentials to access dashboard
2. **Manage Elections**: Create, edit, and delete elections
3. **Manage Candidates**: Review and approve candidate registrations
4. **Monitor Results**: View real-time voting statistics
5. **User Management**: Oversee voter registrations

## 🧪 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed:admin` - Create default admin user

## 🌟 Key Functionalities Completed

✅ **Complete Authentication System**
- Multi-role user management (voter, candidate, admin)
- Secure login/logout with JWT tokens
- Protected routes and API endpoints

✅ **Election Management**
- Full CRUD operations for elections
- Real-time status tracking
- Candidate assignment to elections

✅ **Voting System**
- Secure one-vote-per-election mechanism
- Anonymous voting with result tracking
- Duplicate vote prevention

✅ **File Upload System**
- Cloudinary integration for candidate photos
- Image validation and optimization
- Secure file handling

✅ **UI/UX Enhancements**
- Responsive design for all devices
- Loading states and error handling
- Comprehensive navigation with Contact page
- Terms of Service and Privacy Policy pages
- Error handling (404, 500) pages

✅ **Admin Dashboard**
- Election management interface
- Candidate oversight
- Real-time statistics
- Properly protected with authentication

✅ **Security Features**
- Admin API routes properly protected
- Authentication utilities fixed
- Environment configuration completed

✅ **Advanced Results System**
- Real-time election results with live updates
- Comprehensive statistics and analytics
- Winner determination and ranking system
- Admin-specific results dashboard with CSV export
- Public results view with auto-refresh
- Turnout analysis and competition metrics

## 🔗 API Endpoints

### Authentication Routes
- `POST /api/auth/voter/signup` - Voter registration
- `POST /api/auth/voter/login` - Voter login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/check` - Check authentication status
- `GET /api/auth/voter/isLoggedIn` - Check voter login status

### Election Routes
- `GET /api/elections` - Get all elections
- `POST /api/elections` - Create new election (admin)
- `GET /api/elections/[id]` - Get specific election
- `PUT /api/elections/[id]` - Update election (admin)
- `DELETE /api/elections/[id]` - Delete election (admin)
- `GET /api/elections/[id]/candidates` - Get election candidates
- `GET /api/elections/[id]/results` - Get election results ⭐
- `POST /api/elections/[id]/vote` - Submit vote

### Admin Routes
- `GET /api/admin/elections` - Admin election management
- `POST /api/admin/elections` - Create election (admin only)
- `DELETE /api/admin/elections/[id]` - Delete election (admin only)

### Candidate Routes
- `GET /api/candidate` - Get all candidates
- `POST /api/candidate` - Create candidate profile
- `GET /api/candidate/[id]` - Get specific candidate
- `PUT /api/candidate/[id]` - Update candidate (owner/admin)
- `DELETE /api/candidate/[id]` - Delete candidate (owner/admin)

### Voting Routes
- `POST /api/vote` - Submit vote
- `GET /api/auth/voter/elections` - Get voter's election access

### Results Features ⭐
- **Real-time Updates**: Results refresh every 30 seconds for active elections
- **Comprehensive Analytics**: Total votes, turnout rates, victory margins
- **Winner Determination**: Automatic calculation for completed elections
- **Export Functionality**: CSV download for admin users
- **Public Access**: Voters can view results without authentication
- **Admin Dashboard**: Enhanced admin view with detailed statistics

## 📊 Results Feature Highlights

### Public Results View (`/elections/[id]/results`)
- Real-time vote counting and candidate rankings
- Visual progress bars and percentage displays
- Winner announcements for completed elections
- Turnout statistics and participation metrics
- Auto-refresh for live elections
- Mobile-responsive design

### Admin Results Dashboard (`/admin/elections/[id]/results`)
- Enhanced admin-only analytics
- CSV export functionality
- Detailed competition analysis
- Victory margin calculations
- Real-time monitoring tools
- Advanced turnout analysis

## 📞 Support

For support, email support@votewise.com or visit our [Contact Page](http://localhost:3000/contact).

---

**Built with ❤️ for democratic participation and transparency in elections.**


Voter login : /api/auth/voter/login
Voter Signup : /api/auth/voter/signup
Admin login : /api/auth/admin/login   'admin data is not seeded'
Admin Actions (Delete, Update): /api/admin/elections/${ElectionId}
              (GET, POST): /api/admin/elections

             
