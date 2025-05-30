import Admin from "./pages/Admin";
import Cart from "./pages/Cart.jsx";
import {ADMIN_ROUTE, CART_ROUTE, FIGURE_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "./utils/consts.js";
import Shop from "./pages/Shop.jsx";
import Auth from "./pages/Auth.jsx";
import FigurePage from "./pages/FigurePage.jsx";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: CART_ROUTE,
        Component: Cart
    }
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
        path: FIGURE_ROUTE + '/:id',
        Component: FigurePage
    },
    {
        path: CART_ROUTE,
        Component: Cart
    }
]
