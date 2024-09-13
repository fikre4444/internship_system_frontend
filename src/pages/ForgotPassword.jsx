import axios from 'axios';
import { useEffect, useState } from 'react';

const ForgotPassword = () => {
  const [passwordRequestSent, setPasswordRequestSent] = useState(false);
  const [resetRequest, setResetRequest] = useState("Sending Reset Request!");
  const [username, setUsername] = useState("");

  const handleReset = () => {
    setPasswordRequestSent(true);
    axios.put("api/account/forgot-password?username="+username).then((response) => 
      {
        console.log(response.data);
        setResetRequest(response.data);
      }
    )

  }


  return (
    <div>
      {passwordRequestSent
      ? (
        <div>
          <h1>{resetRequest}</h1>
        </div>
        )
      : (
        <>
          <div className="bg-slate-500 p-2">
            <div className='flex gap-4 m-1 mb-3 items-center'>
                <label htmlFor="username">Your Username:</label>
                <input className="p-2" id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
              </div>
            <div>
              <button 
                className="p-2 text-xl font-bold rounded-md bg-blue-300 px-8" 
                type="button"
                onClick={handleReset}
              >
                  Request Password Reset
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ForgotPassword;
