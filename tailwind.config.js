/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./public/**/*.{html,js}", "./src/**/*.{html,js}"],
    theme: {
        extend: {
            backgroundImage: {
                banner: "url('/public/assets/images/banner.png')",
            },
            colors: {
                primary: "#243872",
                secondary: "#DFF3FC",
                yellow: "#EEAB54",
            },
            fontFamily: {
                primary: ["sf-pro-display", "sans-serif"],
            },
        },
    },
    plugins: [],
};
