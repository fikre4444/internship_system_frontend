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
          needPasswordChange: account.needPasswordChange,
        }));
        dispatch(setLoggedInAs({
          loggedInAs: signedInAs
        }))
        dispatch(setDefaultHome({
          defaultHome: link
        }))
        localStorage.setItem("defaultHome", link);
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

const roleMap = {
  "ROLE_ADVISOR" : "/advisor",
  "ROLE_STUDENT" : "/student",
  "ROLE_HEAD_INTERNSHIP_COORDINATOR" : "/head-coordinator",
  "ROLE_DEPARTMENT_INTERNSHIP_COORDINATOR" : "/department-coordinator",
  "ROLE_ADMIN" : "/admin", 
  "ROLE_STAFF" : "/no-role"
}

const roleNamesFromLink = {
  "/advisor" : "Advisor",
  "/student" : "Student",
  "/head-coordinator" : "Head Coordinator",
  "/department-coordinator" : "Department Coordinator",
  "/admin" : "Administrator",
  "/login-options" : "Undetermined-Yet",
  "/no-role" : "Undetermined"
}

const getDashboardLinkBasedOnRole = (role) => {
  return roleMap[role];
};

const getSignedInAs = (linkName) => {
  return roleNamesFromLink[linkName]; 
}

const getLinkAndState = (decodedToken) => {
  const linkAndState = {
    link : "",
    state : null
  };
  const roles = decodedToken.roles;
  if(roles.length == 1){
    if(roles.includes("ROLE_STUDENT")){
      linkAndState.link = getDashboardLinkBasedOnRole(roles[0]);
    } else if(roles.includes("ROLE_STAFF")){
      linkAndState.link = getDashboardLinkBasedOnRole(roles[0]); //assign the link no-role
    }
  }else if(roles.length == 2){
    if(roles.includes("ROLE_STAFF")){ //if it is a staff member and has another role
      const index = roles.indexOf("ROLE_STAFF");
      const otherRole = roles[1 - index];
      linkAndState.link = getDashboardLinkBasedOnRole(otherRole);
    }
    else {
      linkAndState.link = "/no-role";
    }
  } else if(roles.length > 2){
      if(roles.includes("ROLE_STAFF")){
        linkAndState.link = "/login-options";
        linkAndState.state = {roles: roles};
      }else { //might change later with a more better logic
        linkAndState.link = "/no-role";
      }
  }
  return linkAndState;
};



export default Login;



    // <div className="bg-red-300 flex flex-col gap-3 p-3">
    //   <div>
    //     <label htmlFor="username">Username</label>
    //     <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} type="text" />
    //   </div>
    //   <div>
    //     <label htmlFor="password">Password</label>
    //     <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
    //   </div>
    //   <div>
    //     <button 
    //       className="p-2 text-xl font-bold rounded-md bg-blue-300 px-8" 
    //       type="button"
    //       onClick={handleLogin}
    //     >
    //         Login
    //     </button>
    //     <Link to="/forgot-password">Forgot Password</Link>
    //   </div>
    // </div>


    //an option of using async with the toast promise
  //   const loginPromise = new Promise(async (resolve, reject) => {
  //     try {
  //       const response = await axios.post("/api/auth/login", {
  //         username: username,
  //         password: password
  //       });

  //       const token = response.data;
  //       const decodedToken = jwtDecode(token);

  //       const linkAndState = getLinkAndState(decodedToken);
  //       localStorage.setItem("jwt", token);

  //       // Navigate after successful login
  //       navigate(linkAndState.link, { state: linkAndState.state });

  //       resolve();  // Resolve the promise when successful
  //     } catch (error) {
  //       console.error("Login failed", error);
  //       reject(error);  // Reject the promise on error
  //     }
  //   });

  //   // Use toast.promise for handling the toast notifications
  //   toast.promise(loginPromise, {
  //     pending: 'Logging in...',
  //     success: 'Successfully logged in!',
  //     error: 'Login failed. Please check your credentials.'
  //   });
  // };

