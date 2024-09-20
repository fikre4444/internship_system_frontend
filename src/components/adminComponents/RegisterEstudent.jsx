import { useState } from 'react';
import { Button, Input, Option, Select } from "@material-tailwind/react"
import axios from 'axios';

const RegisterEstudent = () => {
  const [ amount, setAmount ] = useState('');
  const [ department, setDepartment ] = useState('');
  const [ typeUser, setTypeUser ] = useState(null);
  const [ username, setUsername ] = useState('');
  const [ submitting, setSubmitting ] = useState(false);

  const handleAmountChange = (val) => {
    setAmount(val)
    if(val === 'BATCH')
      setUsername('');
    if(val === 'SINGLE')
      setDepartment('');
  }

  const validateRequestObject = (ob) => {
    //TODO add later to this a validator for the object ??
    return true;
  }

  const handleRegister = () => {
    const registerRequestObject = {
      amount: amount,
      department: department,
      typeUser: typeUser,
      username: username
    }

    // console.log("the payload is ");
    // console.log(registerRequestObject);
    if(validateRequestObject(registerRequestObject)){
      let requestUrl = '/api/admin/just-do-something';
      // if(location === 'estudent'){
      //   requestUrl = "/api/admin/just-do-something";
      // } else{
      //   requestUrl = '/api/admin/just-do-something';
      // }
      axios.post(requestUrl, registerRequestObject).then((response) => {
        console.log(response.data);
        setSubmitting(false);
      });
      console.log("sending stuff")
      

    }
    setSubmitting(true);
  }

  return (
    <div className="m-4"> {/* for from estudent registration*/}
      <h1 className="text-xl text-blue-gray-700 font-extrabold">Register From E-Student</h1>
      <div className="m-2">
        <h3 className="text-md text-gray-800 font-extrabold">Amount of Users</h3>
        <div className="w-72 m-2">
          <Select 
            label="Select Amount"
            value={amount}
            onChange={(val) => handleAmountChange(val)}
          >
            <Option value="BATCH">By Batch</Option>
            <Option value="SINGLE">Single User</Option>
          </Select>
        </div>
      </div>
      <div className="m-2">
        <h3 className="text-md text-gray-800 font-extrabold">Department</h3>
        <div className="w-72 m-2">
          <div className="relative group">
            <Select 
              label="Select department"
              value={department}
              onChange={(val) => setDepartment(val)}
              disabled={amount === 'SINGLE'}
            >
              <Option value="Chemical Engineering">Chemical Engineering</Option>
              <Option value="Mechanical Engineering">Mechanical Engineering</Option>
              <Option value="Industrial Engineering">Industrial Engineering</Option>
              <Option value="Civil Engineering">Civil Engineering</Option>
              <Option value="Electrical Engineering">Electrical Engineering</Option>
            </Select>
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
            onChange={(val) => setTypeUser(val)}
          >
            <Option value="STAFF">Staff</Option>
            <Option value="STUDENT">Student</Option>
          </Select>
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
              onChange={(e) => setUsername(e.target.value)}
            />
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
          <Button loading={submitting} onClick={handleRegister} className="bg-blue-gray-500" >
            {!submitting ? <>Register User/s</> : <>Registering User/s</>}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RegisterEstudent;