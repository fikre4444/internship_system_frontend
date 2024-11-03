import Services from "../../../components/Services";
import TelegramButton from "../../../components/TelegramButton";
import { useSelector } from 'react-redux';
import { IoIosNotifications } from "react-icons/io";
import { FaSignsPost, FaTableCells, FaTachographDigital } from "react-icons/fa6";
import { FaCheckDouble, FaUserCog } from "react-icons/fa";
import { VscGitPullRequest, VscGitPullRequestGoToChanges, VscGitStashApply } from "react-icons/vsc";
import PulsingButtons from "../../../components/PulsingButtons";

const StudentDefaultPage = () => {
  const currentUser = useSelector(state => state.user.currentUser);
  const token = useSelector(state => state.user.token);

  const servicesGiven = [
    {linkTo: "internshipStatus", Icon: FaTachographDigital, serviceDetail: "Track Your Internship Status and Choose between MU and your own Internship."},
    {linkTo: "applyInternships", Icon: VscGitStashApply, serviceDetail: "Apply To the different Internships Posted By The University."},
    {linkTo: "fillBiodataForm", Icon: FaTableCells, serviceDetail: "Fill In the biodata form after being assigned to internships."},
  ]

  return (
    <div className="relative">
      <PulsingButtons />
      <h1 className="text-xl m-2 md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 mt-2 md:mt-4 lg:mt-5">
        Hello, {currentUser.firstName}
      </h1>
      <div className="bg-blue-gray-400 shadow-sm bg-opacity-5 py-3">
        <Services servicesGiven={servicesGiven} role={"Student"}/>
      </div>
    </div>
  )
}

export default StudentDefaultPage
