# Magic Workshop

An online store of handmade figurines “Magic Workshop”

---

## Description

A small shop of custom plaster figurines with features for:
- browsing products by category;
- filtering and searching;
- guest and registered user carts;
- placing orders (for guests and authenticated users);
- an admin panel to manage products and orders;
- notifying the manager via Telegram about new orders.

---

## Features

- **Home**: choose category, reset filter.  
- **Product Page**: description, price, SKU code, image.  
- **Cart**:  
  - Guest: stored in `localStorage`.  
  - Authenticated: synced with the database (Postgres).  
  - Ability to change quantities and remove items.  
- **Registration/Authentication**: JWT tokens.  
- **Order Checkout**: forms, validation, Telegram notifications.  
- **Admin Panel**: CRUD for figurines, view all orders.

---

## Technologies

- **Front-end**: React + Vite, MobX, React-Bootstrap, React-Router  
- **Back-end**: Node.js, Express, Sequelize (Postgres)  
- **Authentication**: JWT  
- **Image Storage**: locally in the `/static` folder  
- **Notifications**: Telegram Bot API  
- **Hosting** (suggested): Render.com (Static Site + Web Service + Postgres)  
