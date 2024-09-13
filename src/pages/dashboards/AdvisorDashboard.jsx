import axios from 'axios';
import { useEffect, useState } from 'react';
import PasswordUpdate from '../../components/PasswordUpdate';


const AdvisorDashboard = () => {
  const [needsPasswordUpdate, setNeedsPasswordUpdate] = useState(false);

  const jwt = localStorage.getItem("jwt");


  useEffect(() => {
    axios.get("/api/account/get-account", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }).then((response) => {
      console.log(response.data);
      const account = response.data;
      setNeedsPasswordUpdate(account.passwordNeedChange);
    });
  }, [jwt]);

  return (
    <div>
      advisor dashboard
      <br />
      {needsPasswordUpdate && <PasswordUpdate setNeedsPasswordUpdate={setNeedsPasswordUpdate}/>}
    </div>
  )
}

export default AdvisorDashboard;
