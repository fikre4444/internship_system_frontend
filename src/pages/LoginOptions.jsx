import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Typography } from '@material-tailwind/react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { MdOutlineSupervisorAccount, MdAdminPanelSettings } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
import { useSelector, useDispatch } from 'react-redux';
import { setDefaultHome, setLoggedInAs } from '../redux/slices/userSlice';


const LoginOptions = () => {
  // const currentUser = useSelector(state => state.user.currentUser);
  // const loggedInAs = useSelector(state => state.user.loggedInAs);
  // console.log(currentUser);
  // console.log("We are logged in as ", loggedInAs);

  const navigate = useNavigate();
  const location = useLocation();
  //get the roles from the state of the location routing that i set in the login page
  const roles = location.state.roles.filter(role => role !== "ROLE_STAFF");

  return (
    <div className="my-4 mb-7">
      <div className="flex justify-center mx-auto my-6">
        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold bg-blue-300 bg-opacity-20 rounded-xl shadow-lg text-blue-gray-700 p-3 w-auto inline-block">
          You have multiple login options (Choose One)!
        </h1>
      </div>
      <div className="flex gap-5 flex-wrap justify-evenly">
        {
          roles.map(role =>
            <>
              <LoginOption role={role} />
            </>
          ) 
        }
      </div>
    </div>
  )
}


const roleDetails = {
  "ROLE_ADVISOR" : {
    name: "Advisor",
    description: "Advise Students on their internship.",
    link: "/advisor"
  },
  "ROLE_STUDENT" : {
    name : "Student",
    description: "Track your Internship Applications.",
    link: "/student"
  },
  "ROLE_HEAD_INTERNSHIP_COORDINATOR" : {
    name: "Head Coordinator",
    description: "Manage the entire Internship Semester",
    link: "/head-coordinator"
  },
  "ROLE_DEPARTMENT_INTERNSHIP_COORDINATOR" : {
    name: "Department Coordinator",
    description: "Manage the Internship for the department",
    link: "/department-coordinator"
  },
  "ROLE_ADMINISTRATOR" : {
    name: "Administrator",
    description: "Manage the accounts within the system",
    link: "/admin"
  }
}

const roleIcons = {
  "ROLE_ADVISOR": FaChalkboardTeacher,
  "ROLE_STUDENT": FaUserGraduate,
  "ROLE_HEAD_INTERNSHIP_COORDINATOR": MdOutlineSupervisorAccount,
  "ROLE_DEPARTMENT_INTERNSHIP_COORDINATOR": RiTeamLine,
  "ROLE_ADMINISTRATOR": MdAdminPanelSettings
};

const LoginOption = ({ role }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roleDetailed = {...roleDetails[role]};

  const IconComponent = roleIcons[role];

  return (
    <Card className="mt-6 w-72 hover:scale-105 transition-transform duration-200">
      <CardHeader className="relative h-36 bg-blue-50">
        <div className="w-full flex p-2 justify-center">
          <span className="inline-block m-2 p-3 text-blue-500 bg-blue-100 rounded-full">
            <IconComponent size={70} />
          </span>
        </div>
      </CardHeader>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {roleDetailed.name}
        </Typography>
        <Typography>
          {roleDetailed.description}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <h1 className="text-center text-md font-semibold">
          Login As
        </h1>
        <Button onClick={() => {
          dispatch(setLoggedInAs({
            loggedInAs: roleDetailed.name
          }));
          dispatch(setDefaultHome({
            defaultHome: roleDetailed.link
          }));
          navigate(roleDetailed.link);
        }} className="capitalize text-sm bg-blue-gray-500" size="lg" fullWidth={true}>
          {roleDetailed.name}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default LoginOptions;
