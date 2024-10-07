import { Button } from '@material-tailwind/react';
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
        current: "You have to Input the Current Password Here."
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
    <div>
      <h1 className="text-xl font-bold text-blue-400">Change Your Password</h1>
      <div className="p-3 bg-slate-500 m-3">
        <div className="flex gap-4 m-1 mb-3">
          <label htmlFor="current">Current Password:</label>
          <input
            className={`border-2 rounded border-black ${isKeepingPassword ? "border-red-500" : ""}`}
            id="current"
            type="password"
            value={current}
            onChange={(e) => {setCurrent(e.target.value); setErrors({...errors, current: ""})}}
            ref={currentPasswordInputRef} // Reference to focus when keeping password
          />
        </div>
        {errors.current && (<p className="text-red-500 mb-3">{errors.current}</p>)}
        <div className="flex gap-4 m-1 mb-3">
          <label htmlFor="newPassword">New Password:</label>
          <input
            className={`border-2 rounded ${isKeepingPassword ? "bg-gray-200 border-gray-400" : "border-black"}`}
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => {setNewPassword(e.target.value); setErrors({...errors, newPassword: ""})}}
            disabled={isKeepingPassword}
          />
        </div>
        {errors.newPassword && (<p className="text-red-500 mb-3">{errors.newPassword}</p>)}
        <div className="flex gap-4 m-1 mb-3">
          <label htmlFor="repeat">Repeat Password:</label>
          <input
            className={`border-2 rounded ${isKeepingPassword ? "bg-gray-200 border-gray-400" : "border-black"}`}
            id="repeat"
            type="password"
            value={repeat}
            onChange={(e) => {setRepeat(e.target.value); setErrors({...errors, repeat: ""})}}
            disabled={isKeepingPassword}
          />
        </div>
        {errors.repeat && (<p className="text-red-500 mb-3">{errors.repeat}</p>)}
        <button className="bg-red-300 p-1 px-3 rounded-md" onClick={handleUpdate}>
          Update Password
        </button>
        <Button onClick={handleKeepPassword}>
          { isKeepingPassword ? "Create New Password" : "Keep The Password" }
        </Button>
      </div>
    </div>
  );
};

export default PasswordUpdate;
