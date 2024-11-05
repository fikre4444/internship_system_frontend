import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import sendApiRequest from '../../../utils/apiUtils';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { sleep } from '../../../utils/otherUtils';
import AccountsTable from '../../../components/AccountsTable';
import { Button } from '@material-tailwind/react';
import axios from 'axios';

function UploadRegister() {
  const token = useSelector(state => state.user.token);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadType, setUploadType] = useState(''); // 'student' or 'staff'

  const [gotResponse, setGotResponse] = useState(false);
  const [ returnedResponse, setReturnedReponse] = useState({
    existingStaffs: null, existingStudents: null,
    registeredStaffs: null, registeredStudents: null
  });

  const TABLE_HEAD = ["Member", "Username", "Department", "Generated Password", "Roles", "Status", "Gender"];

  const requiredHeaders = {
    student: ["firstName", "lastName", "username", "email", "gender", "department"],
    staff: ["firstName", "lastName", "username", "email", "gender", "department"]
  };
  const optionalHeaders = {
    student: ["grade"],
    staff: ["courseLoad"]
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!uploadType) {
      setErrorMessage("Please select an upload type: Student or Staff.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headersInFile = jsonData[0];
      const required = requiredHeaders[uploadType];
      const optional = optionalHeaders[uploadType];
      const allHeaders = [...required, ...optional];

      const missingHeaders = required.filter((header) => !headersInFile.includes(header));
      const unexpectedHeaders = headersInFile.filter((header) => !allHeaders.includes(header));

      if (missingHeaders.length > 0) {
        setErrorMessage(`Invalid file: Missing required columns - ${missingHeaders.join(", ")}`);
        return;
      }

      if (unexpectedHeaders.length > 0) {
        setErrorMessage(`Invalid file: Unexpected columns - ${unexpectedHeaders.join(", ")}`);
        return;
      }

      // Extract rows as objects with validation
      const rows = jsonData.slice(1).map((row) => {
        return allHeaders.reduce((acc, header, index) => {
          const value = row[index] || null;
          if (header === "grade" && (value < 0 || value > 4)) {
            acc[header] = `${value} (error: should be between 0 and 4)`;
          } else if (header === "courseLoad" && (value < 0 || value > 12)) {
            acc[header] = `${value} (error: should be between 0 and 12)`;
          } else {
            acc[header] = value;
          }
          return acc;
        }, {});
      });

      setHeaders(headersInFile);
      setData(rows);
      setErrorMessage('');
    };

    reader.readAsBinaryString(file);
  };

  const handleStudentRegister = async () => {
    // Add typeUser: 'STUDENT' to each row in the data array
    const studentData = data.map(row => ({
      ...row,
      typeUser: 'STUDENT'
    }));
  
    // Send the API request to register students
    await sendApiRequest({
      url: '/api/admin/register-students-by-table',
      method: 'POST',
      requestBody: studentData,
      startMessage: 'Registering students...',
      token, // Pass the token if available
      successMessage: 'Students registered successfully!',
      errorMessage: 'Failed to register students!',
      onSuccess: (responseData) => {
        console.log(responseData); // Display response data in the console
        const data = responseData.response;
        console.log("the data is ");
        console.log(data);
        displayRegisteredTable(responseData?.response);

      }
    });
  };
  
  const handleStaffRegister = async () => {
    // Add typeUser: 'STAFF' to each row in the data array
    const staffData = data.map(row => ({
      ...row,
      typeUser: 'STAFF'
    }));
  
    // Send the API request to register staff
    await sendApiRequest({
      url: '/api/admin/register-staff-by-table',
      method: 'POST',
      requestBody: staffData,
      startMessage: 'Registering staff...',
      token, // Pass the token if available
      successMessage: 'Staff registered successfully!',
      errorMessage: 'Failed to register staff!',
      onSuccess: (responseData) => {
        console.log(responseData); // Display response data in the console
        displayRegisteredTable(responseData?.response);
      }
    });
  };

  const displayRegisteredTable = (data) => {
    if(!data.errorResponse && !data.incorrectBody){
      setReturnedReponse({
        registeredStaffs: data.registeredStaffs,
        registeredStudents: data.registeredStudents,
        existingStaffs: data.existingStaffs,
        existingStudents: data.existingStudents
      });
      setGotResponse(true);
    } else {
      toast.error("Something Occured While displaying registred Accounts.")
    }
  }

  const getRegisteredUsernames = () => {
    if(!gotResponse){
      return;
    }
    let registeredUsernames = [];
    returnedResponse.registeredStudents?.forEach(student => {
      registeredUsernames.push(student.username);
    })
    returnedResponse.registeredStaffs?.forEach(staff => {
      registeredUsernames.push(staff.username);
    })
    return registeredUsernames;
  }

  const handleEmailNotifications = async () => {
    const registeredUsernames = getRegisteredUsernames();
    if(registeredUsernames.length < 1) {
      toast.error("There was an error there are no list of emails");
    }
    console.log(registeredUsernames);
    const sendingRequestId = toast.loading("Sending Emails!");
    toast.update(sendingRequestId, {
      closeButton: true
    });
    await sleep(2000);
    try{
      const requestUrl = "/api/admin//notify-through-email";
      const response = await axios.post(requestUrl, registeredUsernames);
      if(response.status === 200){
        console.log(response.data);
        toast.update(sendingRequestId, {
          render: response.data.message,
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });
      }else {
        console.log(response.data);
        toast.update(sendingRequestId, {
          render: response.data.message,
          type: 'error',
          isLoading: false,
          autoClose: 2000,
        });
      }
    }catch(error){
      console.log(error);
      toast.update(sendingRequestId, {
        render: "there was an error while trying to send",
        type: 'error',
        isLoading: false,
        autoClose: 2000,
      });
    }
  }

  const handleReturnToRegistration = () => {
    setGotResponse(false);
    setReturnedReponse({
      registeredStaffs: null, registeredStudents: null, 
      existingStaffs: null, existingStudents: null
    });
    clearStates();
  }

  const clearStates = () => {
    setData([]);
    setHeaders([]);
  }

  return (
    <div className="m-4">
      { !gotResponse ?
        <div className="flex flex-col items-center p-6 rounded-lg shadow-lg bg-white/30 backdrop-blur-md border border-white/40 w-3/4 mx-auto mt-10">
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Upload Student or Staff Data</h2>
          
          {/* Select Upload Type */}
          <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md ${uploadType === 'student' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500'}`}
            onClick={() => {
              setUploadType('student');
              setData([]);      // Clear the data when switching to Student List
              setHeaders([]);   // Clear the headers when switching to Student List
            }}
          >
            Student List
          </button>
          <button
            className={`px-4 py-2 rounded-md ${uploadType === 'staff' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500'}`}
            onClick={() => {
              setUploadType('staff');
              setData([]);      // Clear the data when switching to Staff List
              setHeaders([]);   // Clear the headers when switching to Staff List
            }}
          >
            Staff List
          </button>
        </div>


          {/* File Upload */}
          <label
            className="cursor-pointer flex flex-col items-center p-5 border-dashed border-2 border-blue-300 rounded-lg text-blue-500 hover:bg-blue-50 transition-all"
          >
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
            <span className="text-lg">Drag & drop or click to upload Excel file</span>
          </label>

          {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
          {/* Register Button */}
          {data.length > 0 && (
            <button
              className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all"
              onClick={uploadType === 'student' ? handleStudentRegister : handleStaffRegister}
            >
              {uploadType === 'student' ? 'Register Students' : 'Register Staff'}
            </button>
          )}
          {/* Display Table if Data is Available */}
          {data.length > 0 && (
            <div className="mt-8 w-full overflow-x-auto">
              <table className="table-auto w-full text-left bg-white/50 rounded-lg shadow-md">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    {headers.map((header, index) => (
                      <th key={index} className="p-3">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={`${
                        rowIndex % 2 === 0 ? 'bg-white/60' : 'bg-blue-50/50'
                      } hover:bg-blue-100 transition-colors`}
                    >
                      {headers.map((header, colIndex) => (
                        <td key={colIndex} className="p-3 text-gray-700">{row[header]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        :
        <>
          <h1 className="text-xl font-bold text-green-500">Got Back Response!</h1>
          <Button onClick={handleReturnToRegistration} className="bg-blue-gray-500" >
              Back to Estudent Registration
          </Button>
          <Button 
            className="bg-blue-gray-500 m-2"
            onClick={() => handleEmailNotifications()}
          >
            Notify Accounts Through Email
          </Button>
          { Object.keys(returnedResponse).map(key => 
              (
                (returnedResponse[key] && returnedResponse[key]?.length > 0) ?
                <div key={key}>
                  <AccountsTable TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={returnedResponse[key]} TableTitle={key} />
                </div>
                :
                <></>
              )
            )
          }
        </>

      }
    </div>
  );
}

export default UploadRegister;
