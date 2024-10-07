import { Select, Option, Button } from "@material-tailwind/react";
import { useState } from 'react';
import axios from 'axios';
import AccountsTable from "../../../components/AccountsTable";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import RegisterCustom from "../../../components/adminComponents/RegisterCustom";
import RegisterEstudent from '../../../components/adminComponents/RegisterEstudent';

const RegisterUser = () => {
  const [ location, setLocation ] = useState('');
  
  const [ getting, setGetting ] = useState(false);
  const [ gotRegistrationResponse, setGotRegistrationResponse] = useState(false);
  const [accounts, setAccounts] = useState(null);
  const TABLE_HEAD = ["Member", "Username", "Department", "Status", "Gender"];

  const checkSuccess = () => {
    if(!gotRegistrationResponse){ //if we didn't get response
      setGetting(false);
    }
  }

  const handleReturnToRegistration = () => {
    setAccounts(null);
    setGotRegistrationResponse(false);
  }

  const getRegisteredUsernames = () => {
    return ['abcd', 'efgh'];
  }

  const handleEmailNotification = () => {
    const registredUsernames = getRegisteredUsernames();
    console.log(registredUsernames);
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
                <p className="font-serif text-sm lg:text-xl text-blue-gray-700 font-semibold">
                  Select option from where you want to register a user.
                </p>
              </div>
            </div>
          }
          { location === "estudent" && <RegisterEstudent />}
          { location === "custom" && <RegisterCustom />}
        </div>
        :<div>
          <Button onClick={handleReturnToRegistration} className="bg-blue-gray-500 m-2">
            Return to Registration
          </Button>
          <Button 
            className="bg-blue-gray-500 m-2"
            onClick={() => handleEmailNotification()}
          >
            Notify Accounts Through Email
          </Button>
          <AccountsTable TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={accounts}/>
        </div> 
      }      
    </div>
  )
}


export default RegisterUser;
 
