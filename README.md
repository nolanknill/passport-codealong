# Installation Instructions

## Server
- `cd server`
- `cp .env.example .env`. Update `SESSION_SECRET`, `GITHUB_CLIENT_ID`, and `GITHUB_CLIENT_SECRET` with your application's information!
- `npm install`
- Create database that matches name in `knexfile.js`
- `npm run migrate`
- `npm run seed`
- `npm run dev`

## Client
- `cd client`
- `cp .env.example .env`
- `npm install`
- `npm run dev`