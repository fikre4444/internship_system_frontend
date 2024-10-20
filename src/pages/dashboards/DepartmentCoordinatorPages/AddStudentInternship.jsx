import { Button, Card, Chip, Input, Option, Radio, Select } from "@material-tailwind/react";
import { useState, useRef } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { sleep } from '../../../utils/otherUtils';
import { useSelector } from "react-redux";
import StudentSearchTable from "../../../components/departmentCoordinatorComponents/StudentSearchTable";
const AddStudentInternship = () => {
  return (
    <div>
      <SearchUser />
    </div>
  );
}

export default AddStudentInternship;




const SearchUser = () => {
  const [ response, setResponse ] = useState(null);
  const [ searchTerms, setSearchTerms ] = useState([]);
  
  const TABLE_HEAD = ["Member", "Username", "Department",];

  const handleBackToSearch = async () => {
    const returningTo = toast.loading("Returning to search");
    toast.update(returningTo, {
      closeButton: true
    })
    await sleep(1000);
    toast.update(returningTo, {
      render: "Done",
      type: "success",
      isLoading: false,
      autoClose: 500,
      closeButton: true
    });
    setResponse(null);
  }

  return (
    <div>
        { !response ?
          <>
            <h1 className="m-3 mt-6 md:mt-3 mb-6 p-6 md:p-4 text-sm md:text-lg lg:text-xl font-semibold bg-blue-300 bg-opacity-20 rounded-xl shadow-lg text-blue-gray-700 max-w-max">
              This is the Add Internship Page, where you can add and edit internships for students.
            </h1>
            <div className="flex gap-3 justify-between items-center flex-wrap my-4">
              <p 
                className="m-3 text-gray-700 text-sm md:text-base bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded-md shadow-md max-w-max"
              >
                To add an internship, search a student and then click on the student that you wish to add or edit internship of.
              </p>            
            </div>
            <SimpleSearch {...{setResponse, setSearchTerms}}/>
          </>
          :
          <>
            <div className="m-3">
              <Button onClick={handleBackToSearch} className="bg-blue-gray-500" >
                Back To search
              </Button>
              { response.length < 1 ?
                <div className="flex justify-center mt-6">
                  <h1 className="m-3 mt-6 md:mt-3 mb-6 p-6 md:p-4 text-sm md:text-lg lg:text-xl font-semibold bg-red-400 bg-opacity-30 rounded-xl shadow-lg text-blue-gray-700 max-w-max">
                    No Accounts Have been found.
                  </h1>
                </div>
                :
                <>
                  <div> {/* this is where we write the search results */}
                    <h1 className="mt-6 md:mt-3 mb-6 p-6 md:p-3 text-sm md:text-lg lg:text-xl font-semibold bg-green-400 bg-opacity-30 rounded-md shadow-lg text-blue-gray-700 max-w-max">
                      Results Found: {response.length}
                    </h1>
                    <div className="my-3 p-2 bg-blue-gray-200 bg-opacity-50">
                      <h1 className="text-sm md:text-md lg:text-lg font-semibold rounded-md">
                        Search Term: 
                        <span className="ml-2 underline p-o bg-blue-gray-300">{searchTerms[0]}</span>
                      </h1>
                    </div>
                  </div>
                  <StudentSearchTable TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={response} searchTerms={searchTerms}/>
                </>
              }
            </div>
          </>
        }
    </div>
  );
}



const SimpleSearch = ({ setResponse, setSearchTerms }) => {

  const usernameRef = useRef(null);
  const [ username, setUsername ] = useState('');
  const [ usernameError, setUsernameError ] = useState('');

  const [ isLoading, setIsLoading ] = useState(false);

  const token = useSelector(state => state.user.token);

  const validateInput = () => {
    if(username === null || username === ''){
      setUsernameError("Please Input something first.");
      usernameRef.current.focus();
      return false;
    }
    return true;
  }  

  const handleSearch = () => {
    if(!validateInput()){
      return;
    }
    setUsernameError("");

    setIsLoading(true);
    const requestUrl = "/api/department-coordinator/get-students?searchTerm="+username;
    axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((response) => {
      console.log(response.data);
      const result = response.data;
      setSearchTerms([username]);
      setResponse(result);
    }).catch(error => {
      console.log(error);
      toast.error("some Error occured");
    }).finally(() => {
      setIsLoading(false);
    })
  }

  return (
    <>
      <h1 className="text-md md:text-lg lg:text-2xl font-semibold tracking-wide capitalize text-gray-700 m-3 mb-1">Simple Search</h1>
      <div className="flex gap-3 flex-wrap items-center p-4">
        <div className="flex w-72 flex-col gap-6 m-2">
          <div className="relative group">
            <Input
              color="blue"
              label="Input a search term"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError("");
              }}
              inputRef={usernameRef}
            />
            {usernameError && <span className="text-red-500 m-0 p-0 text-sm">{usernameError}</span>}
          </div>
        </div>
        <div>
          <Button loading={isLoading} onClick={handleSearch} 
            className="bg-blue-gray-500 capitalize m-2 px-10"
          >
            {!isLoading ? <>Search Users</> : <>Searching</>}
          </Button>
        </div>
      </div>
      <div className="ml-5 max-w-72 bg-blue-200 bg-opacity-50 rounded-md shadow-sm p-2 m-2">
        <p className="text-xs text-gray-700 font-semibold">
          The search term can be
        </p>
        <div className="flex flex-wrap gap-2 items-start">
          <Chip className="capitalize p-1 text-gray-50 font-medium bg-black bg-opacity-20" size="sm" variant="ghost" value="First Name" />
          <Chip className="capitalize p-1 text-gray-50 font-medium bg-black bg-opacity-20" size="sm" variant="ghost" value="Last Name" />
          <Chip className="capitalize p-1 text-gray-50 font-medium bg-black bg-opacity-20" size="sm" variant="ghost" value="Username" />
          <Chip className="capitalize p-1 text-gray-50 font-medium bg-black bg-opacity-20" size="sm" variant="ghost" value="Department" />
        </div>
        
      </div>
    </>
  )

}