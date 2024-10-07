export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

export {getDashboardLinkBasedOnRole, getLinkAndState, getSignedInAs };