import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Cookies from 'js-cookie'

function MainLayout() {
    const navigate = useNavigate()
    const role = Cookies.get("role")
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const authenticate = Cookies.get("sesion")



    useEffect(() => {
        if (!authenticate) {
            navigate("/login")
        }
    }, [])

    return (
        <div className="flex h-screen overflow-hidden">

            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userRole={role} />

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

                {/*  Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="grow">
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

                        {/* Cards */}
                        <div className="">

                            <Outlet />

                        </div>

                    </div>
                </main>

            </div>
        </div>
    );
}

export default MainLayout;