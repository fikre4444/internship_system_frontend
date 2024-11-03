import React from 'react';
import BouncyButton from './BouncyButton';
import useTelegramRegistrationCheck from '../hooks/useTelegramRegistrationCheck';

const TelegramButton = () => {
  const needsTelegramRegistration = useTelegramRegistrationCheck();

  if (!needsTelegramRegistration) return null;

  return (
    <div className="absolute top-2 right-2">
      <BouncyButton />
    </div>
  );
};

export default TelegramButton;
