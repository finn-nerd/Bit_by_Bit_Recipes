import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function Sidebar({ isOpen, isClose, isLoggedIn}) {
    const sidebarRef = useRef();
    const [visible, setVisible] = useState(false);
    const [showOpen, setShowOpen] = useState(false);
    const router = useRouter();

    const [username, setUsername] = useState('');

    useEffect(() => {
        fetchUsername();

        // if the user clicked outside the sidebar, close it
        function handleClickOutside(e) {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target)) { // checks if sidebar is mounted yet and if the user clicked outside the sidebar, then close sidebar
                isClose();
            }
        }

        // checks if the user's mouse clicked outside sidebar
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            setVisible(true); // show sidebar
            setTimeout(() => setShowOpen(true), 100) // open sidebar smoothly
        } else {
            setShowOpen(false); // show variable is now false
            const timeout = setTimeout(() => setVisible(false), 300); // wait 300ms before removing sidebar from view
            return () => clearTimeout(timeout); // if user reopens sidebar, doesnt break it
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, isClose])

    // Fetch username
    const fetchUsername = async () => {
        if (isLoggedIn) {
            try {
                const res = await fetch(`/api/get_username`);
                const data = await res.json();

                setUsername(data.username);
            } catch (err) {
                console.error("Failed to find username:", err);
                setUsername([]);
            }
        }
        else setUsername([]);
    };

    const handleClick = async () => {
        // If the user is logged in, log them out
        if (isLoggedIn) {
            try {
                const res = await fetch('/api/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (res.ok) {
                    // Redirect to login page after successful logout
                    router.push('/login');
                } else {
                    console.error('Failed to logout');
                }
            } catch (err) {
                console.error('Error during logout:', err);
            }
        }
        // Otherwise, just send them straight to the login page
        else router.push('/login');
    }

    return (
        <>
            {/* darkens rest of screen when sidebar open */}
            <div
            onClick={isClose}
            className={`fixed inset-0 bg-black transition-opacity duration-300
            ${isOpen ? 'opacity-40 pointer-events-auto z-20' : 'opacity-0 pointer-events-none z-[-1]'
            }`} 
            />

            {/* if sidebar is visible */}
            {visible && (
                <>
                    {/* sidebar */}
                    <div 
                    ref={sidebarRef}
                    className={
                        `fixed top-0 w-[20%] h-full bg-gradient-to-b from-[#F05353] to-[#F08853] z-30
                        transition-[left] duration-300 ease-in-out
                        flex flex-col items-center justify-center
                        ${showOpen ? 'left-0' : '-left-full'}`
                    }
                    >

                        <p className="text-xl sm:text-2xl xl:text-[40px] text-white pt-10 font-['Jersey_10']">{isLoggedIn ? "Logged in as:" : "Not logged in."}</p>
                        {isLoggedIn && (
                            <p className="text-xl sm:text-2xl xl:text-[35px] text-white pt-2 font-['Jersey_10']">{username}</p>
                        )}

                        <img className="w-[100px] mt-10 sm:w-[120px] animate-bounce ease-in-out [animation-duration:2s]" 
                        src="/pizza.png" 
                        alt="Pizza"/>

                        <img className="w-[100px] mt-10 sm:w-[120px] animate-bounce ease-in-out [animation-duration:2s]" 
                        src="/pizza.png" 
                        alt="Pizza"/>

                        <img className="w-[100px] mt-10 sm:w-[120px] animate-bounce ease-in-out [animation-duration:2s]" 
                        src="/pizza.png" 
                        alt="Pizza"/>

                        <img className="w-[100px] mt-10 sm:w-[120px] animate-bounce ease-in-out [animation-duration:2s]" 
                        src="/pizza.png" 
                        alt="Pizza"/>
                        
                        {/* Return to login button */}
                        <div className="mt-auto justify-center items-center my-10">
                            <button
                                className="cursor-pointer bg-[#EB4B4B] text-white text-xl sm:text-2xl md:text-3xl lg:text-[40px] mt-5 p-5 rounded-[20px] border-[6px] border-[#B21F1F] font-['Jersey_10']"
                                type="button"
                                onClick={handleClick}
                            >
                                {isLoggedIn ? "Logout" : "Login"}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
        
    )
}

export default Sidebar;
