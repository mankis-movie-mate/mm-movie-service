# mm-movie-service

## 🚀 Features

- Stores and retrieves movie data, genres, and associated metadata.
- Supports CRUD operations for movies and genres.
- Designed for integration with other Movie Mate microservices.
- Packaged as a container image, ready for deployment to Kubernetes or Docker environments.
- Integrated with 3rd party movies service [TMDB](https://developer.themoviedb.org/docs/getting-started)

## 🛠️ Tech Stack

| Technology      | Version    |
|-----------------|-----------|
| Node.js         | >=18.0.0         |

## ⚙️ Environment Variables

Environment variables are defined in `.env.example`.

- Copy `.env.example` to `.env`
- Fill in the required values for your local or production setup

## 🛠️ Building and Running

**Run locally:**
```bash
npm install
npm run start
```

You can also build Docker image
```bash
docker build -t mm-movie-serivce .
```

## 📄 API Documentation

- **OpenAPI docs:** `${context.path}/docs`
- **Swagger UI:** `${context.path}/docs/swagger`

_Replace `${context.path}` with deployment context (e.g. `/api/movies`)._
