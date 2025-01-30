import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaBuilding, FaBusinessTime, FaHome, FaRepublican, FaUsersCog, } from "react-icons/fa";
import SidebarLinkGroup from "./SidebarLinkGroup";
import logo from '../assets/logo.png';

const sidebarLinks = [
  {
    title: "Paginas",
    links: [
      {
        name: "Inicio",
        icon: <FaHome className="text-xl" />,
        to: "/",
        roles: ["SUPERADM", "ADMIN", "OPERADOR"]
      },
      {
        name: 'Empresas',
        icon: <FaBusinessTime className="text-xl" />,
        to: "/empresas",
        roles: ["SUPERADM"]
      },
      {
        name: 'Sucursales',
        icon: <FaBusinessTime className="text-xl" />,
        to: "/sucursales",
        roles: ["SUPERADM", "ADMIN"]
      },
      {
        name: 'Entidades',
        icon: <FaBuilding className="text-xl" />,
        to: "/entidades",
        roles: ["SUPERADM", "ADMIN"]
      },
      {
        name: 'Ususarios',
        icon: <FaUsersCog className="text-xl" />,
        to: "/usuarios",
        roles: ["SUPERADM", "ADMIN"]
      }
    ],
  },
];

function Sidebar({ sidebarOpen, setSidebarOpen, variant = 'default', userRole }) {

  console.log(userRole)
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === "true");

  // Función para filtrar enlaces según el rol del usuario
  const filterLinksByRole = (links) => {
    return links.filter(link => !link.roles || link.roles.includes(userRole));
  };

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div className="min-w-fit">
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      <div
        id="sidebar"
        ref={sidebar}
        className={`flex lg:!flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-72 lg:w-20 lg:sidebar-expanded:!w-72 2xl:!w-72 shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-72"
        } ${variant === 'v2' ? 'border-r border-gray-200 dark:border-gray-700/60' : 'rounded-r-2xl shadow-lg'}`}
      >
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          <NavLink end to="login" className="block">
            <img src={logo} alt="Logo" className="w-[100%]" />
          </NavLink>
        </div>

        <div className="space-y-8">
          {sidebarLinks.map((group, index) => (
            <div key={index}>
              <h3 className="text-sm uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3 mb-4">
                <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                  •••
                </span>
                <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">{group.title}</span>
              </h3>
              <ul className="space-y-2">
                {filterLinksByRole(group.links).map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.subLinks ? (
                      <SidebarLinkGroup activecondition={pathname.includes(link.name.toLowerCase())}>
                        {(handleClick, open) => (
                          <>
                            <a
                              href="#0"
                              className={`block p-3 rounded-lg transition-all duration-150 ${
                                pathname.includes(link.name.toLowerCase())
                                  ? "bg-green-50 dark:bg-green-900/20 shadow-sm"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleClick();
                              }}
                            >
                              <div className="flex items-center">
                                <span
                                  className={`shrink-0 transition-colors duration-150 ${
                                    pathname.includes(link.name.toLowerCase())
                                      ? 'text-green-500 dark:text-green-400'
                                      : 'text-gray-400 dark:text-gray-500'
                                  }`}
                                >
                                  {link.icon}
                                </span>
                                <span className={`text-base font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${
                                  pathname.includes(link.name.toLowerCase())
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-gray-600 dark:text-gray-300'
                                }`}>
                                  {link.name}
                                </span>
                                <svg
                                  className={`shrink-0 ml-auto fill-current text-gray-400 dark:text-gray-500 ${
                                    open && 'rotate-180'
                                  }`}
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                </svg>
                              </div>
                            </a>
                            <div className={`lg:hidden lg:sidebar-expanded:block 2xl:block ${!open && 'hidden'}`}>
                              <ul className="pl-9 mt-2">
                                {filterLinksByRole(link.subLinks).map((subLink, subLinkIndex) => (
                                  <li key={subLinkIndex}>
                                    <NavLink
                                      end
                                      to={subLink.to}
                                      className={({ isActive }) =>
                                        `block p-2 rounded-lg transition-all duration-150 ${
                                          isActive
                                            ? "bg-green-50 dark:bg-green-900/20 shadow-sm"
                                            : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
                                        }`
                                      }
                                    >
                                      <div className="flex items-center">
                                        <span
                                          className={`shrink-0 transition-colors duration-150 ${
                                            pathname.includes(subLink.name.toLowerCase())
                                              ? 'text-green-500 dark:text-green-400'
                                              : 'text-gray-400 dark:text-gray-500'
                                          }`}
                                        >
                                          {subLink.icon}
                                        </span>
                                        <span className={`text-base font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${
                                          pathname.includes(subLink.name.toLowerCase())
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-gray-600 dark:text-gray-300'
                                        }`}>
                                          {subLink.name}
                                        </span>
                                      </div>
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )}
                      </SidebarLinkGroup>
                    ) : (
                      <NavLink
                        end
                        to={link.to}
                        className={({ isActive }) =>
                          `block p-3 rounded-lg transition-all duration-150 ${
                            isActive 
                              ? "bg-green-50 dark:bg-green-900/20 shadow-sm" 
                              : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
                          }`
                        }
                      >
                        <div className="flex items-center">
                          <span
                            className={`shrink-0 transition-colors duration-150 ${
                              pathname.includes(link.name.toLowerCase()) 
                                ? 'text-green-500 dark:text-green-400' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`}
                          >
                            {link.icon}
                          </span>
                          <span className={`text-base font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ${
                            pathname.includes(link.name.toLowerCase())
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-600 dark:text-gray-300'
                          }`}>
                            {link.name}
                          </span>
                          {pathname.includes(link.name.toLowerCase()) && (
                            <span className="ml-auto w-1.5 h-8 rounded-full bg-green-500"></span>
                          )}
                        </div>
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="w-12 pl-4 pr-3 py-2">
            <button className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="shrink-0 fill-current text-gray-400 dark:text-gray-500 sidebar-expanded:rotate-180" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path d="M15 16a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v14a1 1 0 0 1-1 1ZM8.586 7H1a1 1 0 1 0 0 2h7.586l-2.793 2.793a1 1 0 1 0 1.414 1.414l4.5-4.5A.997.997 0 0 0 12 8.01M11.924 7.617a.997.997 0 0 0-.217-.324l-4.5-4.5a1 1 0 0 0-1.414 1.414L8.586 7M12 7.99a.996.996 0 0 0-.076-.373Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
