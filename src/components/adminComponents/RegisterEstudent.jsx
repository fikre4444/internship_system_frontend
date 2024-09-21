import { useState, useRef } from 'react';
import { Button, Input, Option, Select } from "@material-tailwind/react"
import axios from 'axios';
import { validateUsername } from '../../utils/formatting';
import { ToastContainer, toast } from 'react-toastify';

const RegisterEstudent = () => {
  const [ IsSubmitting, setIsSubmitting ] = useState(false);
  const [ gotResponse, setGotResponse ] = useState(false);

  const amountRef = useRef(null);
  const departmentRef = useRef(null);
  const typeUserRef = useRef(null);
  const usernameRef = useRef(null);

  const [ amount, setAmount ] = useState('');
  const [ department, setDepartment ] = useState('');
  const [ typeUser, setTypeUser ] = useState(null);
  const [ username, setUsername ] = useState('');
  const [ errors, setErrors ] = useState({
    amount: "", department: "", typeUser: "", username: ""
  });
  

  const handleAmountChange = (val) => {
    setAmount(val)
    if(val === 'BATCH')
      setUsername('');
    if(val === 'SINGLE')
      setDepartment('');
  }

  const validateInput = (inputs) => {
    if(amount == null || amount == ''){
      setErrors({
        ...errors, amount: "The Amount is a required."
      })
      amountRef.current.focus();
      return false;
    }
    if(amount === "BATCH" && (department === null || department === '')){
      setErrors({
        ...errors, department: "The department is required when you're registering by batch."
      })
      departmentRef.current.focus();
      return false;
    }
    if(typeUser === null || typeUser === ''){
      setErrors({
        ...errors, typeUser: "The Type of User is a required."
      })
      typeUserRef.current.focus();
      return false;
    }
    if(amount === "SINGLE"){
      const validationResult = validateUsername(username);
      if(!validationResult.valid){
        setErrors({
          ...errors, username: validationResult.error
        });
        usernameRef.current.focus();
        return false;
      }
    }
    return true;
  }

  const getRequestObject = () => {
    const requestObject = {
      amount: amount,
      typeUser: typeUser,
      department: department,
      username: username.trim()
    }
    if(amount === 'SINGLE'){
      requestObject.department = "";
    }
    if(amount === 'BATCH'){
      requestObject.username = "";
    }
    return requestObject;
  }

  const handleRegister = async () => {
    if(!validateInput()){
      return;
    }
    setErrors({amount: "", department: "", typeUser: "", username: ""});
    const requestObject = getRequestObject();

    console.log(requestObject);

    try{
      setIsSubmitting(true);
      const response = await axios.post('/api/admin/register', requestObject, {
        timeout: 10000  //waits ten seconds
      });

      const data = response.data;

      console.log(data);

      // if(!data.errorResponse && !data.incorrectBody){
      //   if(typeUser === 'STUDENT' && data.registeredStudents != null) {
      //     console.log(data.registeredStudents)
      //     setGotResponse(true);
      //     // setRegisteredUser(data.registeredStudents)
      //   } else if( typeUser === 'STAFF' && data.registeredStaffs != null) {
      //     console.log(data.registeredStaffs)
      //     setGotResponse(true);
      //     // setRegisteredUser(data.registeredStaffs)
      //   } else if( data.existingStudents != null){
      //     toast.error(() => <div>
      //       A user by that username already exists. Either change the username or check the user.
      //       <Button className="bg-red-500">
      //         Go to user
      //       </Button>
      //     </div>, {
      //       position: "top-center",
      //       style: {
      //         backgroundColor: '#fee'
      //       }
      //     });
      //   } else if( data.existingStaffs != null){
      //     toast.error(() => <div>
      //       A user by that username already exists. Either change the username or check the user.
      //       <Button className="bg-red-500">
      //         Go to user
      //       </Button>
      //     </div>, {
      //       position: "top-center",
      //       pauseOnFocusLoss: false,
      //       style: {
      //         backgroundColor: '#fee'
      //       }
      //     });
      //   } else {
      //     toast.error("An Unknown error has occured. Please Try again later.")
      //   }
      // }
    } catch(e) {
      toast.error("An Unknown error has occured. Please Try again later.")
      console.log(e);
    } finally {
      setIsSubmitting(false);
    }

    // let requestUrl = '/api/admin/just-do-something';
    // axios.post(requestUrl, requestObject).then((response) => {
    //   console.log(response.data);
    //   setSubmitting(false);
    // });
    // console.log("sending stuff")
    // setSubmitting(true);
  }

  return (
    <div className="m-4"> {/* for from estudent registration*/}
      <ToastContainer />
      <h1 className="text-xl text-blue-gray-700 font-extrabold">Register From E-Student</h1>
      <div className="m-2">
        <h3 className="text-md text-gray-800 font-extrabold">Amount of Users</h3>
        <div className="w-72 m-2">
          <Select 
            label="Select Amount"
            value={amount}
            onChange={(val) => {
              handleAmountChange(val);
              setErrors({amount: "", department: "", typeUser: "", username: ""});
            }}
            ref={amountRef}
          >
            <Option value="BATCH">By Batch</Option>
            <Option value="SINGLE">Single User</Option>
          </Select>
          {errors.amount && <span className="text-red-500 m-0 p-0 text-sm">{errors.amount}</span>}
        </div>
      </div>
      <div className="m-2">
        <h3 className="text-md text-gray-800 font-extrabold">Department</h3>
        <div className="w-72 m-2">
          <div className="relative group">
            <Select 
              label="Select department"
              value={department}
              onChange={(val) => {
                setDepartment(val);
                setErrors({amount: "", department: "", typeUser: "", username: ""});
              }}
              disabled={amount === 'SINGLE'}
              ref={departmentRef}
            >
              <Option value="Chemical Engineering">Chemical Engineering</Option>
              <Option value="Mechanical Engineering">Mechanical Engineering</Option>
              <Option value="Industrial Engineering">Industrial Engineering</Option>
              <Option value="Civil Engineering">Civil Engineering</Option>
              <Option value="Electrical Engineering">Electrical Engineering</Option>
            </Select>
            {errors.department && <span className="text-red-500 m-0 p-0 text-sm">{errors.department}</span>}
            {amount === 'SINGLE' && (
              <span className="absolute top-[-35px] left-0 bg-red-500 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                The Department can be known from the username.
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="m-2">
        <h3 className="text-md text-gray-800 font-extrabold">Type Of User</h3>
        <div className="w-72 m-2">
          <Select 
            label="Select Type of User"
            value={typeUser}
            onChange={(val) => {
              setTypeUser(val);
              setErrors({amount: "", department: "", typeUser: "", username: ""});
            }}
            ref={typeUserRef}
          >
            <Option value="STAFF">Staff</Option>
            <Option value="STUDENT">Student</Option>
          </Select>
          {errors.typeUser && <span className="text-red-500 m-0 p-0 text-sm">{errors.typeUser}</span>}
        </div>
      </div>
      <div className="m-2">
        <h3 className="text-md text-gray-800 font-extrabold">Type Of User</h3>
        <div className="flex w-72 flex-col gap-6 m-2">
          <div className="relative group">
            <Input
              color="blue"
              label="Input Username"
              disabled={amount === 'BATCH'}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors({amount: "", department: "", typeUser: "", username: ""});
              }}
              inputRef={usernameRef}
            />
            {errors.username && <span className="text-red-500 m-0 p-0 text-sm">{errors.username}</span>}
            {amount === 'BATCH' && (
              <span className="absolute top-[-35px] left-0 bg-red-500 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                You are not allowed to enter a username if you are registering by batch.
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="m-2">
        <div className="flex w-max gap-4 m-2 mt-6">
          <Button loading={IsSubmitting} onClick={handleRegister} className="bg-blue-gray-500" >
            {!IsSubmitting ? <>Register User/s</> : <>Registering User/s</>}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RegisterEstudent;