import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const useTelegramRegistrationCheck = () => {
  const currentUser = useSelector(state => state.user.currentUser);
  const token = useSelector(state => state.user.token);

  const [needsTelegramRegistration, setNeedsTelegramRegistration] = useState(false);

  useEffect(() => {
    const checkTelegramRegistration = async () => {
      try {
        const response = await axios.get(
          `/api/account/check-telegram-registeration?username=${currentUser.username}`,
          {
            headers: {
              authorization: `Bearer ${token}`
            }
          }
        );
        if (!response.data) {
          setNeedsTelegramRegistration(true);
        }
      } catch (error) {
        console.error("Error checking Telegram registration:", error);
      }
    };

    checkTelegramRegistration();
  }, [currentUser.username, token]);

  return needsTelegramRegistration;
};

export default useTelegramRegistrationCheck;
