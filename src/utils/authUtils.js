import axios from 'axios';
import { loginSuccess, logoutSuccess, setLoggedInAs, setDefaultHome } from '../redux/slices/userSlice'; // Import your Redux actions
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const checkAuthTokenAndFetchUser = async (dispatch, navigate) => {
  const token = localStorage.getItem('jwt');
 

  //to create the delay loading effect when navigating to the user dashboard
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  if (token) {
    const loadingToastId = toast.loading("Loading User...");
    const decodedToken = jwtDecode(token);
    let {link, state} = getLinkAndState(decodedToken);
    let signedInAs = getSignedInAs(link);
    
    //get the user account details here
    axios.get("/api/account/get-account", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async (response) => {
      toast.update(loadingToastId, { 
        render: "Loaded User!", 
        type: "success", 
        isLoading: false,
        closeButton: true,
        autoClose: 300
      });
      const account = response.data;
      dispatch(loginSuccess({
        currentUser: account.account,
        token: token,
        needPasswordChange: account.needPasswordChange,
      }));

      const defaultHomeLink = localStorage.getItem("defaultHome");
      if(defaultHomeLink !== null){
        link = defaultHomeLink;
        signedInAs = roleNamesFromLink[link];
      }
      dispatch(setDefaultHome({
        defaultHome: link
      }))

      dispatch(setLoggedInAs({
        loggedInAs: signedInAs
      }));
      
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
      toast.update(loadingToastId, { 
        render: "Error While loading user, please Login again!", 
        type: "error", 
        isLoading: false,
        closeButton: true
      });
      navigate("/login");
    }); 
  }
};

export { checkAuthTokenAndFetchUser };



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

  //     try {
  //     // Fetch the user details using the token
  //     const response = await axios.get('/api/getCurrentUser', { headers: { Authorization: `Bearer ${token}` } });
  //     const { currentUser, needPasswordChange } = response.data;

  //     // Dispatch login success and store user data in Redux
  //     dispatch(loginSuccess({
  //       currentUser,
  //       token,
  //       needPasswordChange,
  //     }));
  //   } catch (error) {
  //     console.error('Error fetching user:', error);
  //     // If token is invalid or expired, clear it and log out
  //     localStorage.removeItem('jwt');
  //     dispatch(logoutSuccess());
  //     navigate('/login');
  //   }
  // } else {
  //   // If no token, redirect to login
  //   navigate('/login');
  // }



