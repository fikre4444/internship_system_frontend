import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Button, Input } from "@material-tailwind/react";
import { toast } from 'react-toastify';
import { sleep } from '../utils/otherUtils';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [gotResponse, setGotResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isGoodResponse, setIsGoodResponse] = useState(true)


  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const jwt = queryParams.get('token');

  const handleReset = async () => {
    //password strength stuff here
    const token = jwtDecode(jwt);
    console.log("The password you typed is "+newPassword);

    const resettingToastId = toast.loading("Resetting Password...");
    toast.update(resettingToastId, {closeButton: true});
    await sleep(2000);

    try{
      const request = {
        username: token.sub,
        password: newPassword
      };
      const response = await axios.put("/api/account/reset-password", request, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = response.data;
      if(data?.result === "success"){
        toast.update(resettingToastId, {
          render: data.message,
          autoClose: 1000,
          type: "success",
          isLoading: false
        });
        setIsGoodResponse(true);
        setResponseMessage(data.message);
      }else{
        toast.update(resettingToastId, {
          render: data.message,
          autoClose: 1000,
          type: "error",
          isLoading: false
        });
        setIsGoodResponse(false);
        setResponseMessage(data.message);
      }
    }catch(error){
      console.log(error);
      toast.update(resettingToastId, {
        render: "Some Error Occured!",
        autoClose: 1000,
        type: "error",
        isLoading: false
      });
      setIsGoodResponse(false);
      setResponseMessage("There was an error while resetting please try again.");
    }finally {
      setGotResponse(true);
    }
  }

  return (
    <div>
      { gotResponse
      ? (
        <div className="m-3 my-6">
          <h1 
            className={`text-md md:text-xl ${isGoodResponse ? "bg-green-700" : "bg-red-700"} font-semibold bg-opacity-35 rounded-xl shadow-lg text-blue-gray-700 p-3 w-auto inline-block`}>
            {responseMessage}
          </h1>
          <br />
          <Button className="capitalize my-3 bg-blue-300" onClick={() => navigate("/login")}>
            {isGoodResponse ? "Login Now" : "Go To Login" }
          </Button>
        </div>
      )
      : (
        <>
          <div className="m-4 my-6">
            <h1 className="text-sm md:text-xl font-semibold bg-blue-300 bg-opacity-20 rounded-xl shadow-lg text-blue-gray-700 p-5 w-auto inline-block">
              Password Reset Form: Please Input your desired password then hit the button.
            </h1>
          </div>
          <div className="p-2">
            <div className="mb-3">
              <div className="flex flex-col items-start m-1 mb-3">
                <label className="font-bold text-gray-700" htmlFor="newPassword">New Password:</label>
                <div className="ml-3 mt-2 w-80">
                  <Input
                    label="Input Your New Password"
                    color="blue"
                    id="newPassword"
                    type="text"
                    value={newPassword}
                    onChange={(e) => {setNewPassword(e.target.value);}}
                  />
                </div>
              </div>
            </div>
            <Button 
              className="ml-4 w-40 bg-green-400"
              onClick={handleReset}
            >
                Reset Password
            </Button>
          </div>
        </>
      )

      }
    </div>
  );
}

export default ResetPassword;
