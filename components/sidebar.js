import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function Sidebar({ isOpen, isClose}) {
    const sidebarRef = useRef();
    const [visible, setVisible] = useState(false);
    const [showOpen, setShowOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
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

    const handleClick = () => router.push('/login');

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
                        ${showOpen ? 'left-0' : '-left-full'}`
                    }
                    >
                        {/* Return to login button */}
                        <div className="flex justify-center flex-col items-center my-10">
                            <button
                                className="w-[80%] sm:w-[20%] md:w-[40%] lg:w-[60%] xl:w-[80%] bg-[#EB4B4B] text-white text-xl sm:text-2xl md:text-3xl lg:text-[30px] p-5 rounded-[20px] border-[6px] border-[#B21F1F] font-['Jersey_10']"
                                type="button"
                                onClick={handleClick}
                            >
                                Return to Login Page
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
        
    )
}

export default Sidebar;
