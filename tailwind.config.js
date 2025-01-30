/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./public/**/*.{html,js}", "./src/**/*.{html,js}"],
    theme: {
        extend: {
            backgroundImage: {
                banner: "url('../assets/images/banner.webp')",
            },
            colors: {
                primary: "#120FFD",
                secondary: "#243872",
                yellow: "#FED017",
            },
            fontFamily: {
                primary: ["Ambit", "sans-serif"],
                secondary: ["sf-pro-display", "sans-serif"],
            },
        },
    },
    plugins: [],
};
