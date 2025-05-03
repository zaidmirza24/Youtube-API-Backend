# 🎬 YouTube API Backend

This is a backend server built with Node.js, Express.js, and MongoDB that powers a YouTube-like application. It provides RESTful APIs for managing users, videos, and comments, and supports file uploads for video content. Features include user management (register, login, etc.), video upload, retrieval, and management, commenting system on videos, file upload support using express-fileupload, MongoDB integration with Mongoose, and organized routing for scalability. The tech stack includes Node.js, Express.js, MongoDB with Mongoose, dotenv, express-fileupload, and body-parser. API Endpoints: GET / (test endpoint returns "Hello"), /api/v1/user for user-related routes, /api/v1/video for video-related routes, /api/v1/comment for comment-related routes. For detailed API usage, refer to the route files: routes/user.routes.js, routes/video.routes.js, routes/comment.routes.js.

To install and run the project:

git clone https://github.com/zaidmirza24/Youtube-API-Backend.git
cd Youtube-API-Backend
npm install

Create a .env file in the root folder and add:

PORT=5000
MONGO_URL=your_mongodb_connection_string

Then start the server:

npm start

The server will be running at http://localhost:5000

Project Structure:

├── config/
│   └── db.config.js
├── routes/
│   ├── user.routes.js
│   ├── video.routes.js
│   └── comment.routes.js
├── index.js
├── package.json
└── .env

Notes: Make sure MongoDB is running (locally or via a cloud service like MongoDB Atlas). API assumes uploads are handled via multipart/form-data.

Author: Developed by Zaid Mirza (https://github.com/zaidmirza24)
