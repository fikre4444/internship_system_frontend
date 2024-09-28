import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const defaultHome = useSelector(state => state.user.defaultHome);
  const roles = useSelector(state => state.user.currentUser?.roles);
  console.log(roles);
  console.log("protected route runs and we are currently loggedIn or not", isLoggedIn)

  if(isLoggedIn === null){
    //if undecided yet just stall by returning null
    return null
  }
  if (!isLoggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }
  if(!allowedToAccess(location.pathname, defaultHome)){
    return <Navigate to="not-found" />
  }
  

  // If the user is logged in, allow access to the route
  return children;
};

export default ProtectedRoute;

const allowedToAccess = (currentUrl, defaultHome) => {
  const dashboards = ["/advisor", "/student", "/admin", "/head-coordinator", "/department-coordinator"];

  if (dashboards.includes(defaultHome)) {
    //remove the one that is allowed
    const otherDashboards = dashboards.filter((dashboard) => dashboard !== defaultHome);
    //check if the current url starts with one of the other dashboards
    return !otherDashboards.some((dashboard) => currentUrl.startsWith(dashboard));
  }

  return true;
}