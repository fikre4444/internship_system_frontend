import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const RedirectToHomeWithToast = ({ defaultHome }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Show toast when the user is already logged in and tries to access the login page
    toast.success("You are already logged in.", {
      type: "warning", 
      closeButton: true,
      autoClose: 3000, // Auto close after 3 seconds
    });

    // Redirect after showing the toast
    console.log("Running once")
    navigate(defaultHome);
  }, []);

  return null; // No need to render anything
};

export default RedirectToHomeWithToast;