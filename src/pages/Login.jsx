import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import LogoNb from '../assets/logo-nb.png';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@material-tailwind/react";
import { useDispatch } from 'react-redux';
import { loginSuccess, logoutSuccess, setDefaultHome, setLoggedInAs } from '../redux/slices/userSlice';
import { sleep, getSignedInAs, getLinkAndState } from '../utils/otherUtils';


const Login = () => {
  console.log("login runs")
  const dispatch = useDispatch();

  const [IsSubmitting, setIsSubmitting] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    username: "", password: "",
  });

  const navigate = useNavigate();

  const checkInputs = () => {
    if(username === null || username === ""){
      setErrors({
        ...errors,
        username: "Please Input Username"
      })
      return false;
    }
    if(password === null || password === ""){
      setErrors({
        ...errors,
        password: "Please Input Password"
      })
      return false;
    }
    return true;
  }

  //to create the delay loading effect when navigating to the user dashboard
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleLogin = async () => {

    if(!checkInputs()){
      return;
    }

    setIsSubmitting(true);

    const loadingToastId = toast.loading("Logging in...");
    toast.update(loadingToastId, {
      closeButton: true
    });

    const credentials = {
      username: username, password: password
    };

    
    axios.post("/api/auth/login", credentials)
    .then(async (response) => {
      toast.update(loadingToastId, { 
        render: "Login successful!", 
        type: "success", 
        isLoading: false,
        autoClose: 3000 
      });

      await sleep(1000);
      // check where i need to navigate to here
      toast.dismiss(loadingToastId);
      const token = response.data;
      const decodedToken = jwtDecode(token);
      const {link, state} = getLinkAndState(decodedToken);
      const signedInAs = getSignedInAs(link);
      
      //get the user account details here
      axios.get("/api/account/get-account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        console.log(response.data);
        const account = response.data;
        dispatch(loginSuccess({
          currentUser: account.account,
          token: token,
          needPasswordChange: account.passwordNeedChange,
        }));
        dispatch(setLoggedInAs({
          loggedInAs: signedInAs
        }))
        //if the password is not updated yet, the default link should be there
        dispatch(setDefaultHome({
          defaultHome: account.passwordNeedChange ? "/needs-password-update" : link
        }))
        localStorage.setItem("defaultHome", account.passwordNeedChange ? "/needs-password-update" : link);
        //after setting the account set the token and go to the intended page
        localStorage.setItem("jwt", token);
        navigate(link, { state: state });
      }).catch((error) => {
        dispatch(logoutSuccess({
          currentUser: null,
          token: null,
          needPasswordChange: null
        }));
        localStorage.removeItem("jwt");
        localStorage.removeItem("defaultHome");
        toast.error("Error while loading you're account, please login again.");
      }); 
    }).catch((error) => {
      const errorResponse = error.response.data;
      if(errorResponse.errorType === "INVALID_CREDENTIALS"){
        toast.update(loadingToastId, { 
          render: errorResponse.message, 
          type: "error", 
          isLoading: false,
          autoClose: 3000,
          closeButton: true
        });
      } else if(errorResponse.errorType === "DISABLED_ACCOUNT"){
        toast.update(loadingToastId, { 
          render: "Your account has been disabled, please contact your administrator.", 
          type: "error", 
          isLoading: false,
          autoClose: 3000,
          closeButton: true
        });
      } else {
        console.log(error.response)
        toast.update(loadingToastId, { 
          render: "An unexpected error occurred. Server Might not be working", 
          type: "error", 
          isLoading: false,
          autoClose: 3000,
          closeButton: true
        });
      }
    }).finally(() => {
      setIsSubmitting(false);
    })
  }

  return (
    <div className="w-full max-w-sm p-10 m-auto mx-auto my-8 bg-gray-50 rounded-lg shadow-lg border-2">
      <div className="flex justify-center mx-auto">
          <img className="w-auto h-7 sm:h-8" src={LogoNb} alt=""/>
      </div>

      <div className="mt-6">
        <div>
            <label htmlFor="username" className="block text-md text-gray-800">Username</label>
            <input id="username" value={username} 
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors({username: "", password: ""});
              }} type="text"  
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border-2 border-black border-opacity-10 rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" 
            />
          {errors.username && <span className="text-red-500 m-0 p-0 text-sm">{errors.username}</span>}
        </div>
        <div className="mt-4">
            <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-md text-gray-800">Password</label>
                <Link to="/forgot-password" className="text-sm text-gray-600 hover:underline">Forget Password?</Link>
            </div>
            <input id="password" value={password} 
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({username: "", password: ""});
              }} type="password" 
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border-2 border-black border-opacity-10 rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" 
              />
          {errors.password && <span className="text-red-500 m-0 p-0 text-sm">{errors.password}</span>}
        </div>

        <div className="mt-6">
            <Button loading={IsSubmitting} onClick={handleLogin} 
              className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50" 
            >
              {IsSubmitting ? "Logging In" : "Login"}
            </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;

