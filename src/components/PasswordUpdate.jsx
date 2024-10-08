import { Button, Input } from '@material-tailwind/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { sleep, getSignedInAs, getLinkAndState } from '../utils/otherUtils';
import { jwtDecode } from "jwt-decode";
import { loginSuccess, logoutSuccess, setNeedPasswordChange, setDefaultHome, setLoggedInAs } from '../redux/slices/userSlice';



const PasswordUpdate = ({ setNeedsPasswordUpdate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [current, setCurrent] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [errors, setErrors] = useState({
    current:"", newPassword: "", repeat: ""
  })
  const [isKeepingPassword, setIsKeepingPassword] = useState(false); // Track if user chose to keep password
  const currentPasswordInputRef = useRef(null);

  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    console.log("clicked the keep password")
    
    if (isKeepingPassword) {
      // Focus on current password input when 'Keep Password' is selected
      setErrors({
        ...errors,
        current: "Please input your current password to confirm."
      })
      currentPasswordInputRef.current.focus();
    }else {
      setErrors({
        ...errors,
        current: ""
      })
    }
    setErrors(prevState => ({
      ...prevState, newPassword: "", repeat: ""
    }))
  }, [isKeepingPassword]);

  const validateInput = () => {
    //todo might need to add validation later and there is
    //where i will also add strength
    
    //first check whether the current password is empty regardless if we're keeping it or not
    if(current === null || current.trim() === ''){
      console.log("current is null or emplty")
      setErrors({
        ...errors, 
        current: "Please input your current password first."
      })
      return false;
    }
    if(!isKeepingPassword){ //if they are not keeping it 
      if(newPassword === null || newPassword.trim() === ''){
        setErrors({
          ...errors, 
          newPassword: "New Password Cannot be Empty."
        })
        return false;
      }
      if(repeat === null || repeat.trim() === ''){
        setErrors({
          ...errors,
          repeat: "Repeat Password Cannot be Empty."
        })
        return false;
      }

      if(newPassword !== repeat){
        setErrors({
          ...errors,
          repeat: "New Password and repeated Passwords Don't match."
        })
        return false;
      }
      //###### TODO this is where you check the strength of the password
    } 
    return true;
  }

  const handleUpdate = async () => {
    setErrors({
      current: "", newPassword: "", repeat: ""
    })
    if(!validateInput()){
      return;
    }

    const data = {
      currentPassword: current,
      newPassword: isKeepingPassword ? current : newPassword,
      repeatPassword: isKeepingPassword ? current : repeat,
    };

    const updatingToastId = toast.loading("Updating Password");
    toast.update(updatingToastId, {
      closeButton: true,
    })
    await sleep(2000);
    try {
     const response = await axios.put("/api/account/update-password", data, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const responseData = response.data;
      console.log(response.data);
      if(response.status === 200 && responseData.result === 'success'){
        toast.update(updatingToastId, {
          render: responseData.message,
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
        goToProperLink(dispatch, navigate);
      } else if(responseData.result === 'failure'){
        toast.update(updatingToastId, {
          render: responseData.message,
          type: 'error',
          isLoading: false,
          autoClose: 2000
        })
      }
    }catch(error){
      console.log("an error occured");
      console.log(error);
      toast.update(updatingToastId, {
        render: "There was an error while updating the password.",
        type: 'error',
        isLoading: false,
        autoClose: 2000
      })
    }
  };

  const goToProperLink = (dispatch, navigate) => {
    const token = localStorage.getItem('jwt');
    const decodedToken = jwtDecode(token);
    const {link, state} = getLinkAndState(decodedToken);
    const signedInAs = getSignedInAs(link);
    dispatch(setNeedPasswordChange({
      needPasswordChange: false,
    }));
    dispatch(setLoggedInAs({
      loggedInAs: signedInAs
    }))
    dispatch(setDefaultHome({
      defaultHome: link
    }))
    localStorage.setItem("defaultHome", link);
    localStorage.setItem("jwt", token);
    navigate(link, { state: state });
  }

  const handleKeepPassword = () => {
    setIsKeepingPassword(prevState => !prevState); // Disable the password inputs
  };

  return (
    <div className="">
      <h1 className="m-2 p-1 text-lg md:text-2xl font-bold text-blue-400 tracking-wide">Your Password Needs to be Updated</h1>
      <div className="flex gap-20 flex-wrap items-center">
        <div className="m-3 ml-5 md:ml-10">
          <div> {/* this is a whole input component */}
            <div className="flex flex-col items-start m-1 mb-3">
              <label className="font-bold text-gray-600" htmlFor="current">Current Password</label>
              <div className="ml-1 mt-2 w-80">
                <Input
                  label="Input Your Current Password"
                  color="red"
                  className={`border-2 rounded border-black ${isKeepingPassword ? "border-red-500" : ""}`}
                  id="current"
                  type="password"
                  value={current}
                  onChange={(e) => {setCurrent(e.target.value); setErrors({...errors, current: ""})}}
                  ref={currentPasswordInputRef} // Reference to focus when keeping password
                />
              </div>
            </div>
            {errors.current && (<p className="text-red-500 m-2 text-xs font-bold tracking-wide">{errors.current}</p>)}
          </div>
          <div> {/* another input component */}
            <div className="flex flex-col items-start m-1 mb-3">
              <label className="font-bold text-gray-600" htmlFor="newPassword">New Password</label>
              <div className="ml-1 mt-2 w-80">
                <Input
                  label="Input A New Password"
                  color="blue"
                  className={`border-2 rounded ${isKeepingPassword ? "bg-gray-200 border-gray-400" : "border-black"}`}
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {setNewPassword(e.target.value); setErrors({...errors, newPassword: ""})}}
                  disabled={isKeepingPassword}
                />
              </div>
            </div>
            {errors.newPassword && (<p className="text-red-500 m-2 text-xs font-bold tracking-wide">{errors.newPassword}</p>)}
          </div>
          <div> {/* this is the third and last input component */}
            <div className="flex flex-col items-start m-1 mb-3">
              <label className="font-bold text-gray-600" htmlFor="repeat">Repeat Password</label>
              <div className="ml-1 mt-2 w-80">
                <Input
                  label="Repeat The New Password"
                  color="green"
                  className={`border-2 rounded ${isKeepingPassword ? "bg-gray-200 border-gray-400" : "border-black"}`}
                  id="repeat"
                  type="password"
                  value={repeat}
                  onChange={(e) => {setRepeat(e.target.value); setErrors({...errors, repeat: ""})}}
                  disabled={isKeepingPassword}
                />
              </div>
            </div>
            {errors.repeat && (<p className="text-red-500 m-2 text-xs font-bold tracking-wide">{errors.repeat}</p>)}
          </div>
          <div className="m-2 mt-5 flex gap-2 items-center flex-wrap"> {/* Buttons holder div */}
            <Button className="bg-green-400 capitalize" onClick={handleUpdate}>
              Update Password
            </Button>
            <Button className="bg-blue-400 capitalize" onClick={handleKeepPassword}>
              { isKeepingPassword ? "Create New Password" : "Keep The Password" }
            </Button>
          </div>
        </div>
        <div className="">
          <InstructionsCard />
        </div>
      </div>
    </div>
  );
};

export default PasswordUpdate;

import { motion } from 'framer-motion';

const InstructionsCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleInstructions = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="m-4">
      <button
        onClick={toggleInstructions}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow-md hover:bg-blue-600 transition-all"
      >
        {isExpanded ? 'Hide Instructions' : 'Show Instructions For Password Update'}
      </button>

      {/* Framer Motion for animation */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        className={`overflow-hidden bg-blue-500 bg-opacity-15 shadow-xl rounded-xl lg:mt-4 p-5 border-2 border-gray-200`}
      >
        <h2 className="text-lg font-semibold text-gray-700">How to Update Your Password</h2>
        <p className="text-sm text-gray-600 mt-2">
          To update your password, please fill in the following fields:
        </p>
        <ul className="list-disc ml-6 mt-2 text-sm text-gray-600">
          <li>Enter your current password.</li>
          <li>Enter a new password (if you choose to update it).</li>
          <li>Repeat the new password to confirm.</li>
          <li>Press "Update Password" when you're done.</li>
        </ul>
        <p className="text-sm text-gray-600 mt-2">
          To keep the password:
        </p>
        <ul className="list-disc ml-6 mt-2 text-sm text-gray-600">
          <li>Click Keep the password button.</li>
          <li>Enter your current password.</li>
          <li>Press "Update Password" when you're done.</li>
        </ul>
      </motion.div>
    </div>
  );
};

