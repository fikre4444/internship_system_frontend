import { Link, useLocation } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [passwordHasBeenResetted, setpasswordHasBeenResetted] = useState(false);
  const [passwordResetResponse, setPasswordResetResponse] = useState("Password Hasn't been reset try again!");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const jwt = queryParams.get('token');

  const handleReset = () => {
    //password strength stuff here
    const token = jwtDecode(jwt);
    console.log("The password you typed is "+newPassword);
    const data = {
      username: token.sub,
      password: newPassword
    };

    axios.put("/api/account/reset-password", data, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }).then(response => {
      console.log(response.data);
      setpasswordHasBeenResetted(true);
      setPasswordResetResponse(response.data);
    }).catch((error) => {
      console.log(error);
      alert("There was an error while resetting your password please try again later!")
    })
  }

  return (
    <div>
      { passwordHasBeenResetted
      ? (
        <div>
          {passwordResetResponse}
          You can login with your new password Now.<br/>
          <Link to="/login">Login Now</Link>
        </div>
      )
      : (
        <>
          <h1>Password Reset Form</h1>
          <div className="bg-slate-500 p-2">
            <div className='flex gap-4 m-1 mb-3 items-center'>
                <label htmlFor="newPassword">New Password:</label>
                <input className="p-2" id="newPassword" type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
              </div>
            <div>
              <button 
                className="p-2 text-xl font-bold rounded-md bg-blue-300 px-8" 
                type="button"
                onClick={handleReset}
              >
                  Reset Password
              </button>
            </div>
          </div>
        </>
      )

      }
    </div>
  );
}

export default ResetPassword;
