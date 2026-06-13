import React from "react";
import {Helmet} from "react-helmet-async";

const OrganizationSchema = () => {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://charivna-craft.com.ua/#organization",
        name: "Charivna Craft",
        alternateName: "Чарівна Крафт",
        url: "https://charivna-craft.com.ua",
        logo: {
            "@type": "ImageObject",
            url: "https://charivna-craft.com.ua/logo.png",
        },
        image: "https://charivna-craft.com.ua/logo.png",
        email: "mailto:charivna-craft@gmail.com",
        telephone: "+380680361597",
        address: {
            "@type": "PostalAddress",
            addressCountry: "UA",
        },
        contactPoint: [
            {
                "@type": "ContactPoint",
                telephone: "+380680361597",
                contactType: "customer service",
                availableLanguage: ["Ukrainian"],
                areaServed: "UA",
            },
            {
                "@type": "ContactPoint",
                telephone: "+380967846399",
                contactType: "customer service",
                availableLanguage: ["Ukrainian"],
                areaServed: "UA",
            },
        ],
        sameAs: [
            "https://www.instagram.com/charivnacraft/",
            "https://www.facebook.com/charivna.craft",
            "https://www.youtube.com/@CharivnaCraft",
        ],
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
        </Helmet>
    );
};

export default OrganizationSchema;