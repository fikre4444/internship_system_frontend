import { Tooltip } from '@material-tailwind/react';
import { FaTelegram } from "react-icons/fa";


const BouncyButton = ({ icon=<FaTelegram size={45} />, tooltipMessage="Subscribe To Our Telegram Bot To Get Notifications To Telegram." }) => {
  
  const botUsername = "mu_ims_bot";
  const handleClick = () => {
    const telegramURL = `https://t.me/${botUsername}`;
    window.open(telegramURL, '_blank');
  };
  
  return (
    <Tooltip content={tooltipMessage} placement="top" className="bg-blue-200 text-blue-900 shadow-lg">
      <button
        onClick={handleClick}
        className="w-14 h-14 bg-blue-100/30 border border-blue-200/50 backdrop-blur-md rounded-full flex items-center justify-center text-blue-500 hover:animate-none
        animate-heartbeat transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl hover:bg-blue-200/50"
      >
        {icon}
      </button>
    </Tooltip>
  );
};

export default BouncyButton;
