import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = () => {
    // axios.post("/api/auth/login", {
    //   "username" : username,
    //   "password" : password
    // }).then((response) => {
    //   console.log(response);
    // })
    axios.post("/api/auth/login", {
      username : username,
      password : password
    }).then((response) => {
      console.log(response.data);
      const token = response.data;
      const decodedToken = jwtDecode(token);
      console.log("The decoded tokebn is ");
      console.log(decodedToken);

      const linkAndState = getLinkAndState(decodedToken);
      console.log("The link is ", linkAndState.link);
      console.log("The state is ", linkAndState.state);
      localStorage.setItem("jwt", token);
      navigate(linkAndState.link, {state: linkAndState.state});
      
    })
  }

  return (
    <div className="w-full max-w-sm p-10 m-auto mx-auto mt-5 bg-gray-50 rounded-lg shadow-md">
      <div className="flex justify-center mx-auto">
          <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt=""/>
      </div>

      <div className="mt-6">
        <div>
            <label htmlFor="username" className="block text-sm text-gray-800">Username</label>
            <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} type="text"  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
        </div>

        <div className="mt-4">
            <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm text-gray-800">Password</label>
                <Link to="/forgot-password" className="text-sm text-gray-600 hover:underline">Forget Password?</Link>
            </div>

            <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
        </div>

        <div className="mt-6">
            <button onClick={handleLogin} className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
                Login
            </button>
        </div>
      </div>
    </div>
  );
}

const getDashboardLinkBasedOnRole = (role) => {
  const roleMap = {
    "ROLE_ADVISOR" : "/advisor",
    "ROLE_STUDENT" : "/student",
    "ROLE_HEAD_INTERNSHIP_COORDINATOR" : "/head-coordinator",
    "ROLE_DEPARTMENT_INTERNSHIP_COORDINATOR" : "/department-coordinator",
    "ROLE_ADMIN" : "/admin", 
    "ROLE_STAFF" : "/not-found"
  }

  return roleMap[role];
};

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
      linkAndState.link = getDashboardLinkBasedOnRole(roles[0]);
    }
  }else if(roles.length == 2){
    if(roles.includes("ROLE_STAFF")){ //if it is a staff member and has another role
      const index = roles.indexOf("ROLE_STAFF");
      const otherRole = roles[1 - index];
      linkAndState.link = getDashboardLinkBasedOnRole(otherRole);
    }
    else {
      linkAndState.link = "/not-found";
    }
  } else if(roles.length > 2){
      if(roles.includes("ROLE_STAFF")){
        linkAndState.link = "/login-options";
        linkAndState.state = {roles: roles};
      }else { //might change later with a more better logic
        linkAndState.link = "/not-found";
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
