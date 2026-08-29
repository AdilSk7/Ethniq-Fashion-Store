# Dakshayani Shopping Mall 🛍️

Welcome to the **Dakshayani Shopping Mall** (Ethniq Fashion Store) repository! This is a modern, fully-featured e-commerce web application designed for a premium clothing retailer serving traditional and modern aesthetics.

## 🌟 Key Features

*   **Responsive Customer Interface**: A beautifully designed, mobile-first frontend experience where customers can browse categories, view product galleries, explore new arrivals, and place orders directly to WhatsApp.
*   **Intuitive E-Commerce Flow**: Real-time cart management, localized pricing, product galleries, and a frictionless "checkout via WhatsApp" pipeline avoiding complex payment gateways.
*   **Customer Profiles & Wishlists**: Integrated Firebase authentication gives customers persistent access to their order history, saved favorites, and enquiries across devices.
*   **Powerful Admin Dashboard**: A secure, isolated portal allowing store owners to:
    *   Manage product listings, categories, and promotional banners.
    *   Monitor and review daily store analytics.
    *   Respond directly to customer enquiries and order submissions.
    *   Control backend store settings (WhatsApp routing, emails).

## 🛠️ Technology Stack

This project was built using modern web development standards with zero bulky UI frameworks, opting for pure React and custom CSS for absolute design control.

*   **Frontend**: React (Vite)
*   **Routing**: React Router DOM
*   **Styling**: Pure CSS (Custom responsive grid systems and variables)
*   **Database & Auth**: Google Firebase (Firestore Database, Firebase Authentication)
*   **Deployment**: Firebase Hosting
*   **Icons**: React Icons (Feather Icons)
*   **Notifications**: React Hot Toast

## 🚀 Local Development

Follow these steps to run the store locally on your own machine:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AdilSk7/Ethniq-Fashion-Store.git
    cd Ethniq-Fashion-Store
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open in your browser:**
    Navigate to `http://localhost:5173` to view the application.

## 📁 Project Structure

*   **/src/components/** - Reusable UI elements (Navbar, Footer, Product Cards).
*   **/src/pages/** - Core customer-facing screens (Home, Shop, Cart, Profile).
*   **/src/admin/** - Isolated administration dashboard (Auth, Product manager, Analytics).
*   **/src/context/** - Global React state management (Auth, Cart, Wishlist, Settings).
*   **/src/services/** - Firebase controller logic executing external database queries.
*   **/src/firebase/** - Core initialization and connectivity config.

## 📡 Deployment

The application is configured to deploy directly to Firebase Hosting.
Run the following build script to bundle production assets and push them live:

```bash
npm run build
npx firebase-tools deploy --only hosting
```

---
*Built with React & Firebase.*
