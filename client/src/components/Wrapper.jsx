import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const Wrapper = ({children}) => {
    return (
        <div className="wrapper">
            <Header />
            <div className="page__content">{children}</div>
            <Footer />
        </div>
    );
};

export default Wrapper;
