// This acts as the entry point for the app, and wraps all pages.

// Import global styles to apply to all pages
import "../../styles/app.css";
import { useState, useEffect } from "react"; // For client-side logic
import { Geist, Geist_Mono } from "next/font/google"; // Import fonts

// Declare fonts but avoid executing font loading on the server-side
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// Main entry point for the application
function _App({ Component, pageProps }) {
    // State to track if the client-side code has run
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Set to true when mounted on the client
    }, []);

    if (!isClient) {
        // If still server-side rendering, don't render the fonts
        return null;
    }

    return (
        <div className={`${geistSans.variable} ${geistMono.variable}`}>
            <Component {...pageProps} />
        </div>
    );
}

export default _App;
