import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const Wrapper = ({children}) => {
    return (
        <div className="wrapper">
            <Header />
            <div className="page__content">
                <div className="zsu__banner">
                    <img src="https://res.cloudinary.com/dngcvygel/image/upload/v1753970699/%D0%B4%D0%BE%D0%BD%D0%B0%D1%82-1_eep1qf.png"
                         alt="баннер 5% від замовлень перераховується на ЗСУ"
                    />
                </div>
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default Wrapper;
