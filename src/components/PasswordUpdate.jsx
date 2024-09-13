import axios from 'axios';
import { useState } from 'react';
const PasswordUpdate = ({setNeedsPasswordUpdate}) => {
  const [current, setCurrent] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeat, setRepeat] = useState('');

  const jwt = localStorage.getItem("jwt");

  const handleUpdate = () => {
    //TODO add password strength stuff here
    if(repeat !== newPassword){
      alert("The new password and the repeat password are not same.");
      return;
    }

    const data = {
      currentPassword: current,
      newPassword: newPassword,
      repeatPassword: repeat
    };
    axios.put("/api/account/update-password", data, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }).then(response => {
      console.log(response.data);
      if(setNeedsPasswordUpdate != null){
        setNeedsPasswordUpdate(false);
      }
    })
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-blue-400">Change Your Password</h1>
      <div className='p-3 bg-slate-500 m-3'>
        <div className='flex gap-4 m-1 mb-3'>
          <label htmlFor="current">Current Password:</label>
          <input id="current" type="text" value={current} onChange={(e) => setCurrent(e.target.value)}/>
        </div>
        <div className='flex gap-4 m-1 mb-3'>
          <label htmlFor="newPassword">New Password:</label>
          <input id="newPassword" type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
        </div>
        <div className='flex gap-4 m-1 mb-3'>
          <label htmlFor="repeat">Repeat Password:</label>
          <input id="repeat" type="text" value={repeat} onChange={(e) => setRepeat(e.target.value)}/>
        </div>
        <button className="bg-red-300 p-1 px-3 rounded-md" onClick={handleUpdate}>
          Update Password
        </button>
      </div>
    </div>
  )
}

export default PasswordUpdate;
