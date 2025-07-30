# Admin Seeder

This directory contains scripts to seed the database with default admin credentials.

## Default Admin Credentials

- **Email**: `admin@vote.com`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials immediately after first login!

## How to Run

### Method 1: Using npm script (Recommended)
```bash
npm run seed:admin
```

### Method 2: Direct node execution
```bash
node src/seeds/seedAdmin.js
```

## What it does

1. Connects to your MongoDB database
2. Checks if an admin user already exists
3. If no admin exists, creates one with the default credentials
4. Hashes the password securely using bcrypt
5. Saves the admin user to the database

## Environment Variables Required

Make sure you have these environment variables set:

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

## Notes

- The seeder will not create duplicate admin users
- Password is automatically hashed before storing
- The script will close the database connection after completion
- Safe to run multiple times
