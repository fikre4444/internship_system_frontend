import { Select, Option, Input, Button } from "@material-tailwind/react";
import { useState } from 'react';
import axios from 'axios';
import AccountsTable from "../../../components/AccountsTable";
import { Parser } from '@json2csv/plainjs';

const RegisterUser = () => {
  const [ location, setLocation ] = useState('');
  const [ amount, setAmount ] = useState('');
  const [ department, setDepartment ] = useState('');
  const [ typeUser, setTypeUser ] = useState(null);
  const [ username, setUsername ] = useState('');
  const [ submitting, setSubmitting ] = useState(false);

  const [ getting, setGetting ] = useState(false);


  const [ gotRegistrationResponse, setGotRegistrationResponse] = useState(false);
  const [accounts, setAccounts] = useState(null);
  const TABLE_HEAD = ["Member", "Username", "Department", "Status", "Gender"];


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

  const handleGetting = () => {
    setGetting(true);
    console.log("getting");
    const requestUrl = "/api/admin/get-students?department=Mechanical%20Engineering";
    axios.get(requestUrl).then((response) => {
      console.log(response.data);
      setAccounts(response.data.existingStudents);
      setGetting(false);
      setGotRegistrationResponse(true);
    });
  }

  const validateRequestObject = (ob) => {
    //TODO add later to this a validator for the object ??
    return true;
  }

  const handleAmountChange = (val) => {
    setAmount(val)
    if(val === 'BATCH')
      setUsername('');
    if(val === 'SINGLE')
      setDepartment('');
  }

  const handleReturnToRegistration = () => {
    setAccounts(null);
    setGotRegistrationResponse(false);
  }

  const handleExportTable = () => {
    const fields = [
      { label: 'First Name', value: 'firstName' },
      { label: 'Last Name', value: 'lastName' },
      { label: 'Username', value: 'username' },
      { label: 'Password', value: 'password' },
      { label: 'Email', value: 'email' },
      { label: 'Department', value: 'department' }
    ];

    
    //create a new instance of the parser
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(accounts);

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data.csv';

    // Append to the document and click to trigger download
    document.body.appendChild(link);
    link.click();

    // Clean up the link element
    document.body.removeChild(link);
  }

  return (
    <div className="p-3">
      { !gotRegistrationResponse 
        ? <div>
          <h1 className="text-3xl text-gray-500 font-bold">Register Users</h1>
          <div className="flex gap-4 items-center">
            <h3 className="text-md text-gray-800 font-bold">From Where</h3>
            <div className="w-72 m-2">
              <Select 
                label="Select Location"
                value={location}
                onChange={(val) => setLocation(val)}
              >
                <Option value="estudent">From E-Student</Option>
                <Option value="custom">Custom Registration</Option>
              </Select>
            </div>
          </div>
          {location === '' && 
            <div className="m-3 mt-6 w-[80%] lg:w-[50%] bg-blue-500 bg-opacity-30 rounded-3xl p-3">
              <div className="flex items-center gap-3 p-2">
                <span className="bg-blue-gray-600 text-xl rounded-full p-2 animate-moveUpDown">&#128070;</span>
                <p className="font-serif text-xl text-blue-gray-700 font-semibold">
                  Select option from where you want to register a user.
                </p>
              </div>
            </div>
          }
          { location === "estudent" &&
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
          }
          { location === "custom" &&
            <div className="m-4"> {/* for custom registration*/}
              <h1 className="text-xl text-blue-gray-700 font-extrabold">Custom Registration</h1>
            </div>
          }
          <div> {/* this is where the table will be displayed*/}
            <Button loading={getting} onClick={handleGetting} className="bg-blue-gray-500" >
              {!getting ? <>Get User/s</> : <>Getting User/s</>}
            </Button>
          </div>
          </div>
        :<div>
          <Button onClick={handleReturnToRegistration} className="bg-blue-gray-500 m-2">
            Return to Registration
          </Button>
          <Button onClick={handleExportTable} className="bg-blue-gray-500 m-2">Export to Excel Table</Button>
          <Button className="bg-blue-gray-500 m-2">Notify Accounts Through Email</Button>
          <AccountsTable TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={accounts}/>
        </div> 
      }      
    </div>
  )
}

export default RegisterUser;
