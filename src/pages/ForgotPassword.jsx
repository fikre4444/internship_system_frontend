import { Button, Input } from '@material-tailwind/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { sleep } from '../utils/otherUtils.js';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [gotResponse, setGotResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isGoodResponse, setIsGoodResponse] = useState(true)
  const [username, setUsername] = useState("");

  const handleReset = async () => {
    const checkingToastId = toast.loading("Checking username please wait...");
    toast.update(checkingToastId, {closeButton: true});
    await sleep(2000);

    try{
      const response = await axios.put("api/account/forgot-password?username="+username);
      const data = response.data;
      console.log(response.data);
      if(data?.result === "success"){
        toast.update(checkingToastId, {
          render: "Done Checking",
          autoClose: 500,
          type: "success",
          isLoading: false
        });
        setIsGoodResponse(true);
        setResponseMessage(data.message);
      } else {
        toast.update(checkingToastId, {
          render: "Done Checking",
          type: "error",
          isLoading: false
        });
        setIsGoodResponse(false);
        setResponseMessage(data.message);
      }
    }catch(error){
      console.log(error);
      toast.update(checkingToastId, {
        render: "Either User not found or server might not be working.",
        autoClose: 2000,
        type: "error",
        isLoading: false
      })
      setIsGoodResponse(false);
      setResponseMessage("Either User not found or server might not be working.");
    }finally {
      setGotResponse(true);
    }

  }

  const handleTryAgain = async () => {
    const returningToastId = toast.loading("Returning...");
    toast.update(returningToastId, {
      closeButton: true
    });
    await sleep(500);
    toast.update(returningToastId, {
      autoClose: 500,
      render: "Done!",
      type: "success",
      isLoading: false
    });
    setGotResponse(false);
    setUsername("");
  }


  return (
    <div>
      <div className="m-4 my-6">
        <h1 className="text-lg md:text-xl font-semibold bg-blue-300 bg-opacity-20 rounded-xl shadow-lg text-blue-gray-700 p-3 w-auto inline-block">
          To Reset Your Password, Please Input your username and follow the steps from there.
        </h1>
      </div>
      <div className="m-5">
        {gotResponse
        ? (
          <div>
            <h1 
              className={`text-md md:text-xl ${isGoodResponse ? "bg-green-700" : "bg-red-700"} font-semibold bg-opacity-35 rounded-xl shadow-lg text-blue-gray-700 p-3 w-auto inline-block`}>
              {responseMessage}
            </h1>
            <br />
            <Button className="m-2 my-6 bg-blue-300 tracking-widest uppercase"
              onClick={handleTryAgain}
            >
              Go back to Input
            </Button>
          </div>
          )
        : (
          <div>
            <div className="mb-3">
              <div className="flex flex-col items-start m-1 mb-3">
                <label className="font-bold text-gray-700" htmlFor="username">Username</label>
                <div className="ml-1 mt-2 w-80">
                  <Input
                    label="Input Your Username"
                    color="blue"
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => {setUsername(e.target.value);}}
                  />
                </div>
              </div>
            </div>
            <Button className="m-2 bg-green-400 capitalize" onClick={handleReset}>
              Reset Password
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
