import Services from "../../../components/Services";
import TelegramButton from "../../../components/TelegramButton";
import { useSelector } from 'react-redux';
import { IoIosNotifications } from "react-icons/io";
import PulsingButtons from "../../../components/PulsingButtons";

const AdvisorDefaultPage = () => {
  const currentUser = useSelector(state => state.user.currentUser);
  const token = useSelector(state => state.user.token);

  const servicesGiven = [
    {linkTo: "viewAndNotifyStudents", Icon: IoIosNotifications, serviceDetail: "You can Track your students and notify them about anything."}
  ]

  return (
    <div className="relative">
      <PulsingButtons />
      <h1 className="text-xl m-2 md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 mt-2 md:mt-4 lg:mt-5">
        Hello, {currentUser.firstName}
      </h1>
      <div className="bg-blue-gray-400 shadow-sm bg-opacity-5 py-3">
        <Services servicesGiven={servicesGiven} role={"Advisor"}/>
      </div>
    </div>
  )
}

export default AdvisorDefaultPage;