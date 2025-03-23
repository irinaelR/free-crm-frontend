import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    const detailsItems = [
        { name: 'Expense', path: '/Home/Details/Expense' },
        { name: 'Campaign', path: '/Home/Details/Campaign' },
        { name: 'Budget', path: '/Home/Details/Budget' },
    ];

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <nav className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link to="/Home/Dashboard" className="text-xl font-bold">
                                Free-CRM
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link
                                    to="/Home/Dashboard"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        isActive('/Home/Dashboard')
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    Dashboard
                                </Link>

                                {/* Details Dropdown */}
                                <div className="relative">
                                    <button
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                                            detailsItems.some(item => isActive(item.path))
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                        onClick={toggleDropdown}
                                    >
                                        Details
                                        <svg
                                            className="ml-1 -mr-0.5 h-4 w-4 inline-block"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                            <div className="py-1">
                                                {detailsItems.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        to={item.path}
                                                        className={`block px-4 py-2 text-sm ${
                                                            isActive(item.path)
                                                                ? 'bg-gray-100 text-gray-900'
                                                                : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                        onClick={closeDropdown}
                                                    >
                                                        {item.name} Details
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    to="/Home/AlertConfig"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        isActive('/Home/AlertConfig')
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    Alert Config
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="block h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            <div className="md:hidden" id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link
                        to="/Home/Dashboard"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                            isActive('/Home/Dashboard')
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        Dashboard
                    </Link>

                    {detailsItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                isActive(item.path)
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            {item.name} Details
                        </Link>
                    ))}

                    <Link
                        to="/Home/AlertConfig"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                            isActive('/Home/AlertConfig')
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        Alert Config
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;