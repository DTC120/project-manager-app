# Project Manager App

A dynamic web application built with Next.js for Vercel, featuring a MongoDB database, responsive UI with Tailwind CSS, and integration with cloud services like Google Drive links.

## Features

- **Database**: MongoDB for storing projects and tasks
- **Responsive UI**: Built with Tailwind CSS for mobile and desktop
- **Cloud Integration**: Add Google Drive links to projects for document sharing
- **Task Management**: Create, view, and manage tasks within projects

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- View all projects on the home page
- Click "Add New Project" to create a new project
- Add Google Drive links to projects for cloud document access
- Manage tasks within each project (add, toggle completion)

## Deploy on Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the `MONGODB_URI` environment variable in Vercel's dashboard
4. Deploy!

## Technologies Used

- Next.js 16
- TypeScript
- Tailwind CSS
- MongoDB with Mongoose
- Vercel for deployment
