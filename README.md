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

## Setup & Run

1. **Clone the repository**  
   git clone https://github.com/your-username/online-store.git
   cd online-store

2. **Back-end**

  cd server
  npm install
  cp .env.example .env

**Edit .env with your DB and Telegram credentials, e.g.:**
  DATABASE_URL=postgres://user:pass@host:port/dbname
  SECRET_KEY=your_jwt_secret
  TELEGRAM_BOT_TOKEN=your_bot_token
  TELEGRAM_CHAT_ID=your_chat_id
  npm run dev

4. **Front-end**

  cd ../client
  npm install
  cp .env.example .env

**Edit .env with your API URL, e.g.:**
  VITE_APP_API_URL=http://localhost:5000/static/
  npm run dev

6. **Open in browser**

  Front-end: http://localhost:5173
  Back-end API: http://localhost:5000/api
