import { Button, Input } from "@material-tailwind/react";
import { useState, useRef } from "react";
import axios from 'axios';
import AccountsTable from "../../../components/AccountsTable";
import { toast } from "react-toastify";


const SearchUser = () => {
  const usernameRef = useRef(null);
  const [ username, setUsername ] = useState('');
  const [ usernameError, setUsernameError ] = useState('');

  const [ isLoading, setIsLoading ] = useState(false);
  const [ response, setResponse ] = useState(null);

  const TABLE_HEAD = ["Member", "Username", "Department", "Generated Password", "Roles", "Status", "Gender"];

  const validateInput = () => {
    if(username === null || username === ''){
      setUsernameError("Please Input Username first.");
      usernameRef.current.focus();
      return false;
    }
    return true;
  }

  const handleBackToSearch = () => {
    setResponse(null);
    setUsername("");
  }

  const handleSearch = () => {
    if(!validateInput()){
      return;
    }
    setUsernameError("");

    setIsLoading(true);
    const requestUrl = "/api/admin/get-accounts-by-username?username="+username;
    axios.get(requestUrl).then((response) => {
      console.log(response.data);
      const result = response.data;
      setResponse(result);
    }).catch(error => {
      console.log(error);
      toast.error("some Error occured");
    }).finally(() => {
      setIsLoading(false);
    })
  }

  return (
    <div>
        { !response ?
          <>
            <h1 className="m-3 mt-6 md:mt-3 p-5 text-sm md:text-lg lg:text-xl font-semibold bg-blue-300 bg-opacity-20 rounded-xl shadow-lg text-blue-gray-700 md:p-2 inline-block">
              Please Input a username or part of a username and click Search to see a result.
            </h1>
            <div className="flex gap-3 flex-wrap items-center p-4">
              <div className="flex w-72 flex-col gap-6 m-2">
                <div className="relative group">
                  <Input
                    color="blue"
                    label="Input part of a username"
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
          </>
          :
          <>
            <div className="m-3">
                <Button onClick={handleBackToSearch} className="bg-blue-gray-500" >
                  Back To search
                </Button>
                <AccountsTable TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={response} />
            </div>
          </>
        }
    </div>
  );
}

export default SearchUser;
