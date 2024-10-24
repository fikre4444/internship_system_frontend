import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ViewStudent = () => {

  const [ account, setAccount ] = useState(null);
  
  const location = useLocation();
  

  useEffect(() => {
    let account = location.state;
    setAccount(account);
  }, [])



  return (
    <div>
      This will be where we add the student internship.
      {JSON.stringify(account)}
    </div>
  )
}

export default ViewStudent;
