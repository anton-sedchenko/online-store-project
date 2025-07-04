import Admin from "./pages/Admin";
import Cart from "./pages/Cart.jsx";
import {
    ADMIN_ROUTE,
    CART_ROUTE,
    PRODUCT_ROUTE,
    LOGIN_ROUTE,
    PROFILE_ROUTE,
    REGISTRATION_ROUTE,
    SHOP_ROUTE,
    ORDER_ROUTE,
    CONTACTS_ROUTE,
} from "./utils/consts.js";
import Shop from "./pages/Shop.jsx";
import Auth from "./pages/Auth.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Profile from "./pages/Profile.jsx";
import Order from "./pages/Order.jsx";
import Contacts from "./pages/Contacts.jsx";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },
]

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: PRODUCT_ROUTE + '/:slug',
        Component: ProductPage
    },
    {
        path: CART_ROUTE,
        Component: Cart
    },
    {
        path: ORDER_ROUTE,
        Component: Order
    },
    {
        path: CONTACTS_ROUTE,
        Component: Contacts
    },
]
