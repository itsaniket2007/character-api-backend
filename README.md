# Character API (Node, Express, MongoDB)

Backend tutorial project: user authentication (register, login, logout with bcrypt + JWT cookie) and CRUD for character posts, using the Model-Route-Controller pattern.

## Structure
```
config/db.js            MongoDB connection
models/                 Mongoose schemas (User, Post)
controllers/            Request logic
routes/                 URL -> controller mapping
middleware/             Auth check (protect)
server.js               Entry point
```

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill in your MongoDB Atlas `MONGO_URI` and a `JWT_SECRET`
3. `npm run dev` (or `npm start`)

## API
| Method | URL | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | no | Create account |
| POST | /api/auth/login | no | Login, sets cookie |
| POST | /api/auth/logout | no | Clear cookie |
| GET | /api/auth/me | yes | Current user |
| POST | /api/posts | yes | Create character post |
| GET | /api/posts | no | List all posts |
| GET | /api/posts/:id | no | Get one post |
| PUT | /api/posts/:id | yes (owner) | Update post |
| DELETE | /api/posts/:id | yes (owner) | Delete post |

Example body for creating a post:
```json
{ "name": "Naruto Uzumaki", "description": "Ninja of the Hidden Leaf", "series": "Naruto", "imageUrl": "" }
```
