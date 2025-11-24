import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
// import Banner from "./Banner.jsx";
import {useLocation} from "react-router-dom";
// import {
//     BLOG_ROUTE,
//     DELIVERY_PAYMENT_ROUTE,
//     HOME_ROUTE,
//     OFERTA_ROUTE,
//     PRIVACY_ROUTE,
//     RETURN_POLICY_ROUTE,
//     CONTACTS_ROUTE,
//     CART_ROUTE
// } from "../utils/consts.js";
import ScrollToTop from "./ScrollToTop.js";
import SeoBlock from "./SeoBlock.jsx";

const Wrapper = ({children}) => {
    const location = useLocation();

    // Тимчасово вимикаю баннер
    // const bannerRoutes = [
    //     HOME_ROUTE,
    //     OFERTA_ROUTE,
    //     DELIVERY_PAYMENT_ROUTE,
    //     RETURN_POLICY_ROUTE,
    //     PRIVACY_ROUTE,
    //     BLOG_ROUTE,
    //     CONTACTS_ROUTE,
    //     CART_ROUTE
    // ];
    // const isBannerShow = bannerRoutes.includes(location.pathname);

    return (
        <div className="wrapper">
            <Header />
            <ScrollToTop />
            <div className="page__content">
                {/*{(isBannerShow) && <Banner />}*/}
                {children}
            </div>
            <SeoBlock />
            <Footer />
        </div>
    );
};

export default Wrapper;
