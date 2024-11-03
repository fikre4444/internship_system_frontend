import { Button, Card, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";
import TelegramButton from "../../../components/TelegramButton";
import { useSelector } from "react-redux";
import Services from "../../../components/Services";
import { MdAddToPhotos } from "react-icons/md";
import { FaRegistered } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import PulsingButtons from "../../../components/PulsingButtons";


const DepartmentCoordinatorDefaultPage = () => {
  const token = useSelector(state => state.user.token);
  const currentUser = useSelector(state => state.user.currentUser)
  const servicesGiven = [
    {linkTo: "addStudentInternship", Icon: MdAddToPhotos, serviceDetail: "Add Self Secured Internships For Students"},
    {linkTo: "matchStudentsToAdvisors", Icon: FaRegistered, serviceDetail: "Automatically Match Students and Advisors"},
    {linkTo: "notifyStudentsAdvisors", Icon: IoIosNotifications, serviceDetail: "Notify Students and Advisors About Anything."},
  ];


  return (
    <div className="relative">
      <PulsingButtons />
      <h1 className="text-xl m-2 md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 mt-2 md:mt-4 lg:mt-5">
        Hello, {currentUser.firstName}
      </h1>
      <div className="bg-blue-gray-400 shadow-sm bg-opacity-5 py-3">
        <Services servicesGiven={servicesGiven} role={"Department Coordinator"}/>
      </div>
    </div>
  )
}

export default DepartmentCoordinatorDefaultPage
