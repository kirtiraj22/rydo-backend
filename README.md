# Rydo Backend

Server side application for the Rydo platform, a ride-sharing service application. This backend handles authentication, user management, ride requests, and other core functionalities to power the Rydo app.

---

## Features

- **Authentication and Authorization**
  - User login and signup.
  - Secure token-based authentication (access and refresh tokens).

- **User Management**
  - Manage customer and captain roles.
  - Update user profiles.

- **Ride Management**
  - Create, update, and manage ride requests.
  - Track ride statuses.

- **Notifications**
  - Send ride-related notifications to users.

- **Real-Time Updates**
  - Live location tracking for captains.

- **Payment Integration**
  - Seamless payment processing for rides.

---

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (>= 16.x)
- **npm** or **yarn**
- **MongoDB** (>= 5.x)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/rydo-backend.git
   cd rydo-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=3000
   BASE_URL=http://localhost:3000
   MONGO_URI=mongodb://localhost:27017/rydo
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The server will run on `http://localhost:3000` by default.

---

## API Endpoints

### Authentication

- **POST** `/auth/signin`
  - Sign in a user.

- **POST** `/auth/signup`
  - Sign up a new user.

- **POST** `/auth/refresh-token`
  - Refresh access tokens.

### User

- **GET** `/user/profile`
  - Fetch user profile details.

- **PUT** `/user/profile`
  - Update user profile.

### Ride

- **POST** `/ride/request`
  - Create a new ride request.

- **GET** `/ride/status/:rideId`
  - Get the status of a ride.

- **PUT** `/ride/update/:rideId`
  - Update ride details.

### Notifications

- **POST** `/notifications/send`
  - Send a notification to a user.

---

## Project Structure

```
rydo-backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
├── .env
├── .gitignore
├── package.json
├── README.md
└── server.js
```

- **controllers/**: Handles incoming HTTP requests and executes business logic.
- **models/**: Defines MongoDB schemas and models.
- **routes/**: API route definitions.
- **services/**: Contains reusable services (e.g., authentication, notification).
- **utils/**: Helper functions and utilities.
- **app.js**: Main application setup.
- **server.js**: Entry point for the application.

---

## Testing

Run unit and integration tests using:
```bash
npm test
# or
yarn test
```

---

## Deployment

To deploy the backend, use any cloud provider or containerization platform. Below is an example using Docker:

1. Build the Docker image:
   ```bash
   docker build -t rydo-backend .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 3000:3000 --env-file .env rydo-backend
   ```

3. Access the backend at `http://localhost:3000`.

---

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add a new feature"
   ```
4. Push the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---
## Acknowledgements

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Axios](https://axios-http.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Expo](https://expo.dev/)

