import { EnvelopeIcon } from "@heroicons/react/24/outline"
import { Button, Input, Textarea } from "@material-tailwind/react"
import { useState, useRef } from 'react';
import { validateEmail } from "../../../utils/formatting";
import { sleep } from '../../../utils/otherUtils';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
const SendCompanyRequest = () => {
  const token = useSelector(state => state.user.token);

  const emailRef = useRef(null);
  const messageRef = useRef(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({
    email: "", message: ""
  });

  const [isSending, setIsSending] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrors({...errors, email: ''});
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    setErrors({...errors, message: ""});
  }

  const validateInput = () => {
    const emailValidation = validateEmail(email);
    if(!emailValidation.valid){
      setErrors({...errors, email: emailValidation.error});
      emailRef.current.focus();
      return false;
    }
    if(email === null || email === ""){
      setErrors({...errors, email: "Please Input an Email"});
      emailRef.current.focus();
      return false;
    }
    if(message === null || message === ""){
      setErrors({...errors, message: "You Need to input Some message."})
      messageRef.current.focus();
      return false;
    }
    return true;
  }

  const handleSendRequest = async () => {
    if(!validateInput())
      return;
    const requestObject = {
      "email": email,
      "message": message
    };
    const sendingToastId = toast.loading("Sending the Request...");
    toast.update(sendingToastId, {closeButton: true});
    await sleep(1000);
    setIsSending(true);

    try {
      const response = await axios.post("/api/head-coordinator/send-request-to-company", requestObject, {
        headers: {
          "authorization" : `Bearer ${token}`
        }
      });
      console.log(response.data);
      if(response.status === 200){
        toast.update(sendingToastId, {
          render: "Request Form Successfully Sent",
          type: "success", 
          autoClose: 1000, 
          isLoading: false
        })
      }

    }catch(error) {
      console.log(error);
      toast.update(sendingToastId, {
        render: "There Was An Error while Sending!",
        type: "error", 
        autoClose: 1000, 
        isLoading: false
      });
    } finally {
      setIsSending(false);
    }

    console.log("sending");
  }

  return (
    <div className="m-3">
      <h1 className=" mt-6 md:mt-3 mb-6 p-6 md:p-4 text-sm md:text-lg lg:text-xl font-semibold bg-blue-300 bg-opacity-20 rounded-xl shadow-lg text-blue-gray-700 max-w-max">
        Send Form Requests To Companies
      </h1>
      <div className="flex gap-3 justify-between items-center flex-wrap my-4">
        <p 
          className="my-3 text-gray-700 text-sm md:text-base bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded-md shadow-md max-w-max"
        >
          To Send Form request to companies, fill in the email of the person, and add a message and then click send.
        </p> 
      </div>
      <div className="m-3">
        <div className="">
          <h3 className="text-md text-gray-800 font-extrabold">Email</h3>
          <div className="flex w-72 flex-col gap-2 m-2 my-4">
            <Input color="blue" label="Input Email Address" icon={<EnvelopeIcon />} value={email}
              onChange={handleEmailChange}
              inputRef = {emailRef}
            />
            {errors.email && <span className="text-red-500 m-0 p-0 text-sm">{errors.email}</span>}
          </div>
        </div>
        <div className="ml-2 flex w-96 flex-col gap-6">
          <Textarea color="green" label="Input Email Message" value={message} onChange={handleMessageChange} inputRef={messageRef}/>
          {errors.message && <span className="text-red-500 m-0 p-0 text-sm">{errors.message}</span>}
        </div>
        <div className="ml-2 my-3">
          <Button loading={isSending} className="bg-green-400" onClick={handleSendRequest}>Send Form Request</Button>
        </div>
      </div>
    </div>  
  )
}

export default SendCompanyRequest
