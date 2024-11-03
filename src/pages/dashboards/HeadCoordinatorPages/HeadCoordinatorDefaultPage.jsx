import Services from "../../../components/Services";
import TelegramButton from "../../../components/TelegramButton";
import { useSelector } from 'react-redux';
import { IoIosNotifications } from "react-icons/io";
import { FaSignsPost } from "react-icons/fa6";
import { FaCheckDouble, FaUserCog } from "react-icons/fa";
import { VscGitPullRequest, VscGitPullRequestGoToChanges } from "react-icons/vsc";
import NotificationButton from "../../../components/NotificationButton";
import PulsingButtons from "../../../components/PulsingButtons";

const HeadCoordinatorDefaultPage = () => {
  const currentUser = useSelector(state => state.user.currentUser);
  const token = useSelector(state => state.user.token);

  const servicesGiven = [
    {linkTo: "postInternships", Icon: FaSignsPost, serviceDetail: "You Can Post Internship Opportunities for students to apply."},
    {linkTo: "assignInternships", Icon: FaUserCog, serviceDetail: "You can Assign Internships to Students and Manually Adjust them."},
    {linkTo: "sendCompanyRequest", Icon: VscGitPullRequestGoToChanges, serviceDetail: "You can Send Request To companies to fill in Internship details."},
    {linkTo: "checkCompanyInternships", Icon: FaCheckDouble, serviceDetail: "Approve Company Posted Internships."}
  ]

  return (
    <div className="relative">
      <PulsingButtons />
      <h1 className="text-xl m-2 md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 mt-2 md:mt-4 lg:mt-5">
        Hello, {currentUser.firstName}
      </h1>
      <div className="bg-blue-gray-400 shadow-sm bg-opacity-5 py-3">
        <Services servicesGiven={servicesGiven} role={"Head Coordinator"}/>
      </div>
    </div>
  )
}


export default HeadCoordinatorDefaultPage
