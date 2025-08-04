import Admin from "./pages/Admin";
import Cart from "./pages/Cart.jsx";
import {
    ADMIN_ROUTE,
    CART_ROUTE,
    PRODUCT_ROUTE,
    LOGIN_ROUTE,
    PROFILE_ROUTE,
    REGISTRATION_ROUTE,
    HOME_ROUTE,
    ORDER_ROUTE,
    CONTACTS_ROUTE,
    FORGOT_PASSWORD_ROUTE,
    RESET_PASSWORD_ROUTE,
    RETURN_POLICY_ROUTE,
    OFERTA_ROUTE,
    DELIVERY_PAYMENT_ROUTE,
    CATEGORY_ROUTE,
    PRIVACY_ROUTE,
    BLOG_ROUTE,
    ARTICLE_ROUTE,
} from "./utils/consts.js";
import Auth from "./pages/Auth.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Profile from "./pages/Profile.jsx";
import Order from "./pages/Order.jsx";
import Contacts from "./pages/Contacts.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ReturnPolicy from "./pages/ReturnPolicy.jsx";
import Oferta from "./pages/Oferta.jsx";
import DeliveryPayment from "./pages/DeliveryPayment.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import Privacy from "./pages/Privacy.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";
import BlogList from "./pages/BlogList.jsx";

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
        path: HOME_ROUTE,
        Component: HomePage
    },
    {
        path: CATEGORY_ROUTE,
        Component: CategoryPage
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
    {
        path: FORGOT_PASSWORD_ROUTE,
        Component: ForgotPassword
    },
    {
        path: RESET_PASSWORD_ROUTE + '/:token',
        Component: ResetPassword
    },
    {
        path: RETURN_POLICY_ROUTE,
        Component: ReturnPolicy
    },
    {
        path: OFERTA_ROUTE,
        Component: Oferta
    },
    {
        path: DELIVERY_PAYMENT_ROUTE,
        Component: DeliveryPayment
    },
    {
        path: PRIVACY_ROUTE,
        Component: Privacy
    },
    {
        path: BLOG_ROUTE,
        Component: BlogList
    },
    {
        path: ARTICLE_ROUTE,
        Component: ArticlePage
    },
]
