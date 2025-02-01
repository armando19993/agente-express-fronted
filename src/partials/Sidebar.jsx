import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaBuilding, FaBusinessTime, FaChevronDown, FaHandshake, FaHome, FaUsersCog } from "react-icons/fa";
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
        name: 'Usuarios',
        icon: <FaUsersCog className="text-xl" />,
        to: "/usuarios",
        roles: ["SUPERADM", "ADMIN"]
      },
      {
        name: 'Operaciones',
        icon: <FaHandshake className="text-xl" />,
        roles: ["ADMIN", "OPERADOR"],
        subLinks: [
          { name: 'Cash Out', to: '/operaciones/crear/cashout' },
          { name: 'Cash In', to: '/operaciones/crear/cashin' },
          { name: 'Historial', to: '/operaciones/historial' },
          { name: 'Reportes', to: '/operaciones/reportes' },
        ]
      }
    ],
  },
];

function Sidebar({ sidebarOpen, setSidebarOpen, variant = 'default', userRole }) {
  const location = useLocation();
  const { pathname } = location;
  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // Estado para manejar el submenú activo
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const filterLinksByRole = (links) => {
    return links.filter(link => !link.roles || link.roles.includes(userRole));
  };

  // Cerrar el submenú cuando se cierra el sidebar
  useEffect(() => {
    if (!sidebarOpen) {
      setActiveSubmenu(null);
    }
  }, [sidebarOpen]);


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
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col fixed z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 
        h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-72 lg:w-20 lg:sidebar-expanded:!w-72 2xl:!w-72 
        shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-72"
          } ${variant === 'v2' ? 'border-r border-gray-200 dark:border-gray-700/60' : 'rounded-r-2xl shadow-lg'}`}
      >
        {/* Logo */}
        <div className="flex justify-between mb-6 pr-3 sm:px-2">
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          <NavLink end to="login" className="block">
            <img src={logo} alt="Logo" className="w-auto h-8" />
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-4">
          {sidebarLinks.map((group, index) => (
            <div key={index}>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-4">
                <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6">•••</span>
                <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">{group.title}</span>
              </h3>

              <ul className="space-y-1">
                {filterLinksByRole(group.links).map((link, linkIndex) => (
                  <li key={linkIndex} className="px-3">
                    {link.subLinks ? (
                      <div>
                        <button
                          onClick={() => setActiveSubmenu(activeSubmenu === link.name ? null : link.name)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors duration-150 
                          ${pathname.includes(link.name.toLowerCase())
                              ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                              : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                            }`}
                        >
                          <div className="flex items-center">
                            <span className={`shrink-0 ${pathname.includes(link.name.toLowerCase())
                                ? "text-green-500 dark:text-green-400"
                                : "text-gray-400 dark:text-gray-500"
                              }`}>
                              {link.icon}
                            </span>
                            <span className="text-sm font-medium ml-3">
                              {link.name}
                            </span>
                          </div>
                          <FaChevronDown
                            className={`w-4 h-4 transition-transform duration-200 
                            ${activeSubmenu === link.name ? 'rotate-180' : ''} 
                            ${pathname.includes(link.name.toLowerCase())
                                ? "text-green-500 dark:text-green-400"
                                : "text-gray-400 dark:text-gray-500"
                              }`}
                          />
                        </button>

                        {/* Sublinks - solo se muestran si el submenú está activo Y el sidebar está expandido */}
                        {(activeSubmenu === link.name && (sidebarExpanded || !sidebarExpanded)) && (
                          <div className="mt-1">
                            <ul className="pl-4 space-y-1">
                              {link.subLinks.map((subLink, subIndex) => (
                                <li key={subIndex}>
                                  <NavLink
                                    end
                                    to={subLink.to}
                                    className={({ isActive }) => `
                                      flex items-center py-1 px-3 rounded-lg text-sm transition-colors duration-150
                                      ${isActive
                                        ? "text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-900/10"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                                      }
                                    `}
                                    onClick={() => {
                                      if (!sidebarExpanded) {
                                        setActiveSubmenu(null);
                                        setSidebarOpen(false);
                                      }
                                    }}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full mr-3 ${pathname === subLink.to ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                      }`}></span>
                                    {subLink.name}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <NavLink
                        end
                        to={link.to}
                        className={({ isActive }) => `
                          flex items-center p-2 rounded-lg transition-colors duration-150
                          ${isActive
                            ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                          }
                        `}
                      >
                        <span className={`shrink-0 ${pathname.includes(link.name.toLowerCase())
                            ? "text-green-500 dark:text-green-400"
                            : "text-gray-400 dark:text-gray-500"
                          }`}>
                          {link.icon}
                        </span>
                        <span className="text-sm font-medium ml-3">
                          {link.name}
                        </span>
                        {pathname.includes(link.name.toLowerCase()) && (
                          <span className="ml-auto w-1.5 h-6 rounded-full bg-green-500"></span>
                        )}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Expand button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3">
            <button
              onClick={() => {
                setSidebarExpanded(!sidebarExpanded);
                if (!sidebarExpanded) {
                  setActiveSubmenu(null);
                }
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/30"
            >
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg
                className={`w-6 h-6 fill-current text-gray-400 dark:text-gray-500 ${sidebarExpanded ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;