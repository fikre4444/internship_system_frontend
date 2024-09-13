import { useLocation, Link } from 'react-router-dom';

const LoginOptions = () => {

  const location = useLocation();
  const roles = location.state.roles.filter(role => role !== "ROLE_STAFF");

  return (
    <div>
      <h1>Who do you want to login as?</h1>
      {
        roles.map(role => 
        <div key={role}>
          <Link to={getDashboardLinkBasedOnRole(role)}>{role}</Link>
        </div>)
      }
    </div>
  )
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

export default LoginOptions;
