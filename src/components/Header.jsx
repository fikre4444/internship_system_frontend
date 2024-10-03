import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectLoggedInState, logoutSuccess } from '../redux/slices/userSlice';
import LogoNb from '../assets/logo-nb.png';
import { Avatar, Badge, Button, Chip } from "@material-tailwind/react";
import { IoLogOutOutline } from "react-icons/io5";

import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { MdOutlineSupervisorAccount, MdAdminPanelSettings, MdAccountCircle } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";

const roleIcons = {
  "Advisor": FaChalkboardTeacher,
  "Student": FaUserGraduate,
  "Head Coordinator": MdOutlineSupervisorAccount,
  "Department Coordinator": RiTeamLine,
  "Administrator": MdAdminPanelSettings,
};

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedIn = useSelector(selectLoggedInState);
  const loggedInAs = useSelector(state => state.user.loggedInAs);
  const firstName = useSelector(state => state.user.currentUser?.firstName || null);
  const lastName = useSelector(state => state.user.currentUser?.lastName || null);
  const hasMultipleRoles = useSelector(state => state.user.currentUser?.roles.length > 2 || false);

  let IconComponent = roleIcons[loggedInAs];
  if(IconComponent === null || IconComponent === undefined){
    IconComponent = MdAccountCircle;
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to toggle the dropdown
  const dropdownRef = useRef(null); // Ref for dropdown box
  // Function to toggle dropdown when avatar is clicked
  const handleAvatarClick = () => {
    // #todo fix the drop down openning on any click
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if(loggedIn){
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      // Cleanup the event listener when the component unmounts
      if(loggedIn){
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [loggedIn]);

  const [listDisplayed, setListDisplayed] = useState(false);
  const navbar = useRef(null);
  const location = useLocation();

  console.log("The location we are in is "+location.pathname);

  useEffect(() => {
    navbar.current.classList.add('top-[-100vh]');
    navbar.current.classList.remove('top-[8vh]');
    setListDisplayed(false);
  }, [location.pathname])

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


  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleLogout = async () => {
    const loadingToastId = toast.loading("Logging Out...");
    await sleep(1000);
    toast.update(loadingToastId, { 
      render: "Logout successful!", 
      type: "success", 
      isLoading: false,
      closeButton: true,
      autoClose: 2000
    });
    dispatch(logoutSuccess());
    localStorage.removeItem("jwt");
    localStorage.removeItem("defaultHome");
    navigate("/login")
  }

  return (
    <>
      <nav className="relative bg-white shadow">
        <div className="container px-6 py-4 mx-auto md:flex justify-between md:items-center">
            <div className="flex items-center justify-between">
                <Link to="/">
                    <img className="w-auto h-6 sm:h-7" src={LogoNb} alt="" />
                </Link>
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
                <div className="flex flex-col gap-3 md:flex-row items-center md:mx-6">
                    <Link to="/" className={linkStyle + (isActiveLink("/") ? activeLink : nonActiveLink)} href="#">Home</Link>
                    <Link to="/about" className={linkStyle + (isActiveLink("/about") ? activeLink : nonActiveLink)} href="#">About</Link>
                    <Link to="/contact" className={linkStyle + (isActiveLink("/contact") ? activeLink : nonActiveLink)} href="#">Contact</Link>
                    {!loggedIn ? 
                      (<Link
                        className={loginLinkStyle + (isActiveLink("/login") ? activeLink : nonActiveLink)}
                        to="/login"
                      >
                        Login
                      </Link>)
                      :
                      (
                        <div className="flex items-center flex-col md:flex-row justify-between gap-6">
                          <div className="flex flex-col gap-0 items-center bg-blue-gray-300 bg-opacity-20 shadow-md rounded-md p-1">
                            <p className="text-xs font-semibold">Logged in as</p>
                            <Chip className="capitalize" value={loggedInAs} variant="ghost" icon={<IconComponent size="20"/>} />
                          </div>
                          <div className="relative">
                            <Badge color="green" overlap="circular" placement="bottom-end" withBorder>
                              <div 
                                className="flex items-center tracking-wide justify-center w-10 h-10 bg-blue-500 bg-opacity-90 text-white rounded-full font-bold cursor-pointer"
                                onClick={handleAvatarClick}
                              >
                                {firstName[0]}{lastName[0]}
                              </div>
                            </Badge>
                            {isDropdownOpen && (
                              <div
                                ref={dropdownRef}
                                className="absolute mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-lg z-50 right-0"
                              >
                                <ul className="">
                                  <button 
                                    className="px-4 py-2 w-full text-start hover:bg-blue-gray-300 duration-300 cursor-pointer"
                                    onClick={() => { navigate("/edit-account"); setIsDropdownOpen(false);}}
                                  >
                                    Edit Account
                                  </button>
                                  {hasMultipleRoles && 
                                    <button 
                                      className="px-4 py-2 w-full text-start hover:bg-blue-gray-300 duration-300 cursor-pointer"
                                      onClick={() => { navigate("/login-options"); setIsDropdownOpen(false);}}
                                    >
                                      Switch Dashboard
                                    </button>
                                  }
                                  <button 
                                    className="px-4 py-2 w-full text-start hover:bg-blue-gray-300 duration-300 cursor-pointer"
                                    onClick={() => {handleLogout(); setIsDropdownOpen(false);}}
                                  >
                                    <span className="flex gap-3 items-center">Logout</span>
                                  </button>
                                </ul>
                              </div>
                            )}
                          </div>                          
                        </div>
                      )
                    }
                    
                </div>
            </div>
        </div>
      </nav>
    </>
  );
}

export default Header;


