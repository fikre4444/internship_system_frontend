import { Link } from 'react-router-dom';
import LogoNb from '../assets/logo-nb.png';

const Footer = () => {
  return (
    <footer className="bg-gray-50 mt-auto border">
        <div className="container p-3 mx-auto">
            <div className="lg:flex">
                <div className="w-full -mx-6 lg:w-2/5">
                    <div className="px-6">
                        <Link to="/">
                            <img className="w-auto h-7" src={LogoNb} alt="" />
                        </Link>

                        <p className="max-w-sm mt-2 text-gray-500">The best place to streamline your Internship semester.</p>
                    </div>
                </div>

                <div className="mt-6 lg:mt-0 lg:flex-1 hidden md:block">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <div>
                            <h3 className="text-gray-700 uppercase">About</h3>
                            <Link to="/contact" className="block mt-2 text-sm text-gray-600">The Developers</Link>
                            <Link to="/about" className="block mt-2 text-sm text-gray-600">The Webapp</Link>
                        </div>

                        <div>
                            <h3 className="text-gray-700 uppercase">Used By</h3>
                            <p href="#" className="block mt-2 text-sm text-gray-600">Students</p>
                            <p href="#" className="block mt-2 text-sm text-gray-600">University Staff</p>
                        </div>

                        <div>
                            <h3 className="text-gray-700 uppercase">Contact</h3>
                            <span className="block mt-2 text-sm text-gray-600">+251939187254</span>
                            <span className="block mt-2 text-sm text-gray-600">fikretesfay4444@gmail.com</span>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="h-px my-1 bg-gray-200 border-none" />

            <div>
                <p className="text-center text-gray-500">© Internship Management System 2024 - All rights reserved</p>
            </div>
        </div>
    </footer>
  );
}

export default Footer;
