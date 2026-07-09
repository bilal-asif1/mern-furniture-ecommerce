# Junaid Furniture

![License](https://img.shields.io/badge/license-MIT-8B5E3C.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)
![Node](https://img.shields.io/badge/Node.js-18%2B-3C873A.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-4%2B-47A248.svg)

Luxury furniture e-commerce platform built with the MERN stack. The project includes a polished storefront, admin dashboard, JWT authentication, catalog management, shopping flow, and product image handling with a production-style backend.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Overview](#api-overview)
- [Database Overview](#database-overview)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Developer Contact](#developer-contact)

## Overview

Junaid Furniture is a production-style furniture storefront and admin system designed to feel recruiter-friendly and portfolio-ready.

The app ships with:

- A premium luxury-themed storefront
- Admin catalog management
- Product creation, update, restore, and soft delete
- Multiple image previews and upload normalization
- Customer auth, wishlist, cart, and checkout flow
- Server-side MongoDB seeding for demo data

## Features

- Responsive luxury storefront with warm beige, cream, wood brown, and charcoal styling
- React Router based navigation
- Redux Toolkit-powered state management
- JWT login and protected routes
- Product listing, details, search, filters, and category browsing
- Wishlist and cart persistence
- Checkout and order history views
- Admin dashboard with catalog and inventory management
- Product lifecycle controls: active, inactive, featured, best seller, new arrival, trash, restore
- Multiple image previews with replace and delete actions
- MongoDB-backed data layer with Mongoose models
- Local uploads served from `server/public/uploads/products`
- Optional Cloudinary normalization for remote image URLs

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion
- State: Redux Toolkit, React Redux
- Routing: React Router DOM
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Auth: JWT
- Uploads: Multer, local static serving, Cloudinary-ready helpers
- Tooling: npm workspaces, Concurrently

## Project Structure

```text
.
|-- client/
|   |-- src/
|   |-- public/
|   |-- vite.config.js
|-- server/
|   |-- src/
|   |-- public/uploads/products/
|   |-- scripts/
|-- tests/
|-- package.json
```

## Installation

1. Install dependencies from the repository root:

```bash
npm install
```

2. Create your environment files:

- `server/.env` for the backend
- `client/.env` for the frontend, if needed

3. Start the full stack:

```bash
npm run dev
```

4. Build the frontend:

```bash
npm run build
```

## Environment Variables

Use `.env.example` as the reference. Do not commit real secrets.

### Root `.env.example`

```env
MONGODB_URI=mongodb://127.0.0.1:27017/junaid_furniture
JWT_SECRET=replace_with_a_strong_secret
CLIENT_URL=http://localhost:5173
PORT=5000
VITE_API_BASE_URL=http://localhost:5000/api
```

### `server/.env.example`

```env
MONGODB_URI=mongodb://127.0.0.1:27017/junaid_furniture
JWT_SECRET=replace_with_a_strong_secret
CLIENT_URL=http://localhost:5173
PORT=5000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_APP_PASSWORD=
ADMIN_EMAIL=admin@junaidfurniture.com
ADMIN_PASSWORD=Admin@12345
ADMIN_NAME=Admin Junaid
DEMO_USER_EMAIL=customer@junaidfurniture.com
DEMO_USER_PASSWORD=Customer@12345
DEMO_USER_NAME=Junaid Customer
```

## Scripts

### Root

- `npm run dev` - runs backend and frontend together
- `npm run build` - builds the frontend
- `npm run start` - starts the backend
- `npm run test:e2e` - runs Playwright tests

### Client

- `npm run dev`
- `npm run build`
- `npm run preview`

### Server

- `npm run dev`
- `npm run start`

## API Overview

Base path: `/api`

- `GET /health` - API health check
- `POST /auth/register` - register user
- `POST /auth/login` - login user
- `GET /auth/me` - current profile
- `PUT /auth/profile` - update profile
- `GET /products` - list products
- `GET /products/slug/:slug` - product details
- `POST /products` - create product
- `PUT /products/:id` - update product
- `DELETE /products/:id` - soft delete product
- `PATCH /products/:id/restore` - restore product
- `PATCH /products/:id/status` - toggle active/inactive
- `GET /categories` - list categories
- `GET /brands` - list brands
- `GET /cart` - get cart
- `PUT /cart` - sync cart
- `GET /wishlist` - get wishlist
- `POST /wishlist/toggle` - toggle item
- `DELETE /wishlist/clear` - clear wishlist
- `POST /orders` - create order
- `GET /orders/mine` - customer orders
- `GET /admin/summary` - dashboard metrics
- `GET /admin/products` - admin product list
- `GET /admin/inventory` - inventory overview
- `GET /admin/users` - admin users

## Database Overview

Main MongoDB collections:

- `users`
- `products`
- `categories`
- `brands`
- `orders`
- `carts`
- `wishlists`
- `reviews`

Product documents support:

- Name, SKU, description, pricing, stock
- Category and brand references
- Featured / best seller / new arrival flags
- Multiple images and thumbnail image
- Dimensions, material, color, warranty, tags, badges
- Active / inactive and soft-delete flags

## Screenshots

Add your screenshots here for GitHub presentation:

```md
![Homepage](./docs/screenshots/home.png)
![Product Details](./docs/screenshots/product-details.png)
![Admin Dashboard](./docs/screenshots/admin-dashboard.png)
![Checkout](./docs/screenshots/checkout.png)
```

## Future Improvements

- Stripe or PayPal payment integration
- Real-time order tracking
- Email notifications for order events
- Advanced analytics charts for the admin dashboard
- CDN-backed media pipeline
- Server-side validation hardening with shared schemas

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

Please keep changes focused and avoid introducing secrets into version control.

## License

This project is licensed under the MIT License.

## Developer Contact

- GitHub: [bilal-asif1](https://github.com/bilal-asif1)

