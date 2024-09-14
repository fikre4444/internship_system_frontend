import { Link, useLocation } from "react-router-dom";
import { useState, useRef } from 'react';

const Header = () => {
  const [listDisplayed, setListDisplayed] = useState(false);
  const navbar = useRef(null);
  const location = useLocation();

  console.log("The location we are in is "+location.pathname);

  const linkStyle = "my-2 transition-colors duration-300 transform hover:text-blue-500 md:mx-4 md:my-0";
  const loginLinkStyle="p-2 px-5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50";
  const nonActiveLink = " text-gray-700";
  const activeLink = " text-orange-500";

  const handleNavbarToggle = () => {
    if(navbar.current.classList.contains('top-[8vh]')){
      navbar.current.classList.add('top-[-100vh]');
      navbar.current.classList.remove('top-[8vh]');
    } else {
      navbar.current.classList.add('top-[8vh]');
      navbar.current.classList.remove('top-[-100vh]');
    }
    
  }

  const isActiveLink = (pathname) => {
    return location.pathname === pathname;
  };

  return (
      <nav className="relative bg-white shadow">
        <div className="container px-6 py-4 mx-auto md:flex md:justify-between md:items-center">
            <div className="flex items-center justify-between">
                <a href="#">
                    <img className="w-auto h-6 sm:h-7" src="https://merakiui.com/images/full-logo.svg" alt="" />
                </a>

                <div className="flex md:hidden">
                    <button onClick={() => {setListDisplayed(!listDisplayed); handleNavbarToggle();}} style={listDisplayed ? {display: 'none'} : {display: 'block'}} type="button" className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600" aria-label="toggle menu">
                        <svg  xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                        </svg>
                    </button>
                    <button onClick={() => {setListDisplayed(!listDisplayed); handleNavbarToggle();}} style={!listDisplayed ? {display: 'none'} : {display: 'block'}} type = "button" className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div ref={navbar} className="absolute top-[-100vh] inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-linear bg-white md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center">
                <div className="flex flex-col md:flex-row items-center md:mx-6">
                    <Link to="/" className={linkStyle + (isActiveLink("/") ? activeLink : nonActiveLink)} href="#">Home</Link>
                    <Link to="/about" className={linkStyle + (isActiveLink("/about") ? activeLink : nonActiveLink)} href="#">About</Link>
                    <Link to="/contact" className={linkStyle + (isActiveLink("/contact") ? activeLink : nonActiveLink)} href="#">Contact</Link>
                    <Link
                        className={loginLinkStyle + (isActiveLink("/login") ? activeLink : nonActiveLink)}
                        to="/login"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    </nav>
  );
}

export default Header;
