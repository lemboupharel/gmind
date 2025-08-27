# GMind

GMind is a dockerized Node.js AI chat application powered by Google AI Studio API and PostgreSQL, using Prisma ORM for database management.

## Features

- User registration and login with JWT authentication
- Secure password hashing using bcrypt
- Chat interface with Google Gemini AI responses
- Persistent chat history per user
- RESTful API endpoints
- Dockerized for easy deployment
- PostgreSQL database integration via Prisma

## Project Structure

```
├── src/
│   ├── server.js            # Main server entry point
│   ├── prismaClient.js      # Prisma client setup
│   ├── routes/
│   │   ├── authroutes.js    # Authentication routes
│   │   └── chatroutes.js    # Chat routes
│   └── middleware/
│       └── authmiddleware.js# JWT authentication middleware
├── prisma/
│   ├── schema.prisma        # Prisma schema
│   └── migrations/          # Database migrations
├── public/                  # Static frontend files
│   └── style/               # CSS/JS assets
├── views/
│   ├── login.html           # Login page
│   └── chat.html            # Chat page
├── Dockerfile               # Docker build instructions
├── docker-compose.yaml      # Multi-container orchestration
├── package.json             # Node.js dependencies and scripts
└── .env                     # Environment variables
```

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (for local development)
- [PostgreSQL](https://www.postgresql.org/) (if not using Docker)

### Environment Variables

Create a `.env` file with the following (see [`.env`](.env)):

```
API_KEY=your_google_api_key
PORT=5000
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=postgresql://postgres:postgres@db:5432/gmind
```

### Local Development

1. Install dependencies:
    ```sh
    npm run setup
    ```
2. Initialize Prisma:
    ```sh
    npm run setupPrismaORM
    npm run generateDB
    ```
3. Start the server:
    ```sh
    npm run dev
    ```

### Docker Deployment

1. Build and start containers:
    ```sh
    docker compose build
    ```

2. Match prisma schema to postgresql db by setting migration:
    ```sh
    docker compose run serverapp npx prisma migrate dev --name init
    ```

2. Run server and db services:
    ```sh
    docker compose up
    ```
    
3. Access the app at [http://localhost:5000](http://localhost:5000)

## API Endpoints

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and receive JWT token
- `GET /chat/dash` — Serve chat interface
- `POST /chat/` — Send a message to Gemini AI
- `GET /chat/` — Retrieve chat history

## Technologies Used

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Docker & Docker Compose
- Google AI Studio API (Gemini)
- JWT & bcryptjs

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note:** Replace API keys and secrets in `.env` and `docker-compose.yaml` with your own