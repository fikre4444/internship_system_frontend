import { Button, Card, Chip, Input, Option, Radio, Select } from "@material-tailwind/react";
import { useState, useRef } from "react";
import axios from 'axios';
import AccountsTable from "../../../components/AccountsTable";
import { toast } from "react-toastify";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const SearchUser = () => {
  const [ response, setResponse ] = useState(null);
  const [ searchTerms, setSearchTerms ] = useState([]);
  const [ searchType, setSearchType ] = useState('SIMPLE');
  
  const TABLE_HEAD = ["Member", "Username", "Department", "Generated Password", "Roles", "Status", "Gender"];

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

  const switchSearchType = () => {
    searchType === 'SIMPLE' ? setSearchType('COMPLEX') : setSearchType('SIMPLE');
  }

  return (
    <div>
        { !response ?
          <>
            <h1 className="m-3 mt-6 md:mt-3 mb-6 p-6 md:p-4 text-sm md:text-lg lg:text-xl font-semibold bg-blue-300 bg-opacity-20 rounded-xl shadow-lg text-blue-gray-700 max-w-max">
              This is the Search Page, you can do different types of search and then you can edit the accounts.
            </h1>
            <div className="flex gap-3 justify-between items-center flex-wrap my-4">
              <p 
                className="m-3 text-gray-700 text-sm md:text-base bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded-md shadow-md max-w-max"
              >
                To switch between different options of search, click the button below.
              </p>            
              <Button
                onClick={() => switchSearchType()}
                className="m-3 text-sm md:text-md capitalize tracking-widest bg-green-500 bg-opacity-50 text-black"
              >
                Switch Search Type
              </Button>
            </div>
            { searchType === "SIMPLE" ? // for Rendering the different types of search
              <>
                <SimpleSearch {...{setResponse, setSearchTerms}}/>
              </>
              : searchType === "COMPLEX" ?
                <ComplexSearch {...{setResponse, setSearchTerms}}/>
              :
              <div>There is not a search type of that manner.</div>
            } 
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
                    No Accounts Have been found, Maybe try Complex search for a more comprehensive search.
                  </h1>
                </div>
                :
                <>
                  <div> {/* this is where we write the search results */}
                    <h1 className="mt-6 md:mt-3 mb-6 p-6 md:p-3 text-sm md:text-lg lg:text-xl font-semibold bg-green-400 bg-opacity-30 rounded-md shadow-lg text-blue-gray-700 max-w-max">
                      Results Found: {response.length}
                    </h1>
                    { searchType === 'SIMPLE' ?
                      <div className="my-3 p-2 bg-blue-gray-200 bg-opacity-50">
                        <h1 className="text-sm md:text-md lg:text-lg font-semibold rounded-md">
                          Search Term: 
                          <span className="ml-2 underline p-o bg-blue-gray-300">{searchTerms[0]}</span>
                        </h1>
                      </div>
                      :
                      <div className="my-3 p-2 bg-blue-gray-200 bg-opacity-50">
                        <h1 className="text-md md:text-lg lg:text-xl font-extrabold rounded-md">Search Terms</h1>
                        <h1 className="text-sm md:text-md lg:text-lg font-semibold rounded-md">
                          First Name = 
                          <span className="ml-2 underline p-o bg-blue-gray-300">{searchTerms[0]}</span>
                        </h1>
                        <h1 className="text-sm md:text-md lg:text-lg font-semibold rounded-md">
                          Last Name = 
                          <span className="ml-2 underline p-o bg-blue-gray-300">{searchTerms[1]}</span>
                        </h1>
                        <h1 className="text-sm md:text-md lg:text-lg font-semibold rounded-md">
                          Username = 
                          <span className="ml-2 underline p-o bg-blue-gray-300">{searchTerms[2]}</span>
                        </h1>
                      </div>
                    }
                  </div>
                  <AccountsTable TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={response} searchTerms={searchTerms}/>
                </>
              }
            </div>
          </>
        }
    </div>
  );
}

export default SearchUser;


const SimpleSearch = ({ setResponse, setSearchTerms }) => {

  const usernameRef = useRef(null);
  const [ username, setUsername ] = useState('');
  const [ usernameError, setUsernameError ] = useState('');

  const [ isLoading, setIsLoading ] = useState(false);

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
    const requestUrl = "/api/admin/simple-search?searchTerm="+username;
    axios.get(requestUrl).then((response) => {
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
          The search term can be first name, last name, username, or department.
        </p>
      </div>
    </>
  )

}

const ComplexSearch = ({ setResponse, setSearchTerms }) => {
  const [helperInfoOpen, setHelperInfoOpen] = useState(true);
  const [searching, setSearching] = useState(false);
  
  const [mode, setMode] = useState('INCLUSIVE');
  const [gender, setGender] = useState('BOTH');
  const [typeOfUser, setTypeOfUser] = useState('BOTH');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('ALL');

  const getRequestObject = () => {
    return {
      gender: gender,
      typeOfUser: typeOfUser,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      department: department
    };
  };

  const handleComplexSearch = async () => {
    const searchingUsers = toast.loading("Searching For Users Based on your inputs.");
    toast.update(searchingUsers, {
      closeButton: true
    })
    setSearching(true);
    await sleep(1000);
    console.log("Searching")
    const requestObject = getRequestObject();
    console.log("the request object is");
    console.log(requestObject)
    let requestUrl = '/api/admin/complex-search' + (mode === 'INCLUSIVE' ? '/inclusive' : '/restrictive');
    try{
      const response = await axios.post(requestUrl, requestObject);
      if(response.status === 200){
        //#todo do somehting iwth the result
        console.log(response.data);
        toast.update(searchingUsers, {
          render: "Got a Response",
          type: "success",
          isLoading: false,
          autoClose: 500,
          closeButton: true
        });
        setSearchTerms([firstName, lastName, username]) //to show the highlighting
        setResponse(response.data);
      }else {
        toast.update(searchingUsers, {
          render: "There was an error while Searching or either no account was found with those criteria.",
          type: "error",
          isLoading: false,
          autoClose: 1000,
          closeButton: true
        });
      }
    }catch(error){
      console.log("there was a catch error")
      console.log(error);
      toast.update(searchingUsers, {
        render: "There was an error while Searching or either no account was found with those criteria.",
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true
      });
    }finally{
      setSearching(false);
    }
  }
  

  return (
    <div className="p-4">
      <h1 className="text-md md:text-lg lg:text-2xl font-semibold tracking-wide capitalize text-gray-700 m-3 mb-1">Complex Search</h1>
      <div>
          <div className="flex gap-6 items-center flex-wrap">
            <div className="my-5">
              <h3 className="text-md text-gray-800 font-extrabold">Mode</h3>
              <div className="flex gap-8 items-center flex-wrap">
                <div className="flex gap-10 m-[5px]">
                  <Radio name="mode" label="Inclusive" 
                    checked={mode === 'INCLUSIVE'} onChange={() => setMode('INCLUSIVE')}
                  />
                  <Radio name="mode" label="Restrictive" 
                    checked={mode === 'RESTRICTIVE'} onChange={() => setMode('RESTRICTIVE')}
                  />
                </div>
                {!helperInfoOpen && //button to show the info about the terms inclusive/restrive
                  <div>
                    <Button
                      className="bg-green-400 p-2 capitalize"
                      onClick={() => setHelperInfoOpen(true)}
                    >
                      Show Helper Info
                    </Button>
                  </div>
                }
              </div>
            </div>
            <div>
              { helperInfoOpen &&
                <Card className="m-2 p-4 pt-6 bg-blue-100 bg-opacity-30">
                  <p 
                    className="cursor-pointer absolute right-0 top-0 bg-red-500 bg-opacity-50 hover:scale-110 transition-all duration-200 px-2 rounded-full"
                    onClick={() => setHelperInfoOpen(false)}
                  >
                    x
                  </p>
                  <p className="text-sm md:text-md"><span className="text-red-400 font-bold">Restrictive</span> Means: All Inputs (firstname, lastname & username) of the search should apply to an account for it to be fetched.</p>
                  <p className="text-sm md:text-md"><span className="text-green-400 font-bold">Inclusive</span> Means: That only one of the input fields (firstname, lastname, or username) should apply for the account to be fetched.</p>
                </Card>
              }
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div> {/* used for all the input fields */}
              <div>
                <h3 className="text-md text-gray-800 font-extrabold">First Name</h3>
                <div className="flex w-72 flex-col gap-2 m-2 my-4">
                  <Input
                    color="blue" label="Input First Name (Optional)" value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-md text-gray-800 font-extrabold">Last Name</h3>
                <div className="flex w-72 flex-col gap-2 m-2 my-4">
                  <Input
                    color="blue" label="Input Last Name (Optional)" value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-md text-gray-800 font-extrabold">Username</h3>
                <div className="flex w-72 flex-col gap-2 m-2 my-4">
                  <Input
                    color="blue" label="Input Username (Optional)" value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div> {/* used for the weird fields like gender and dep */}
              <div className="">
                <h3 className="text-md text-gray-800 font-extrabold">Gender</h3>
                <div className="flex gap-10 m-2 my-3">
                  <Radio name="gender" label="Both" 
                    checked={gender === 'BOTH'} onChange={() => setGender('BOTH')}
                  />
                  <Radio name="gender" label="Male" 
                    checked={gender === 'MALE'} onChange={() => setGender('MALE')}
                  />
                  <Radio name="gender" label="Female" 
                    checked={gender === 'FEMALE'} onChange={() => setGender('FEMALE')}
                  />
                </div>
              </div>
              <div className="">
                <h3 className="text-md text-gray-800 font-extrabold">Type Of User</h3>
                <div className="flex gap-10 m-2 my-3">
                  <Radio name="typeOfUser" label="Both" 
                    checked={typeOfUser === 'BOTH'} onChange={() => setTypeOfUser('BOTH')}
                  />
                  <Radio name="typeOfUser" label="Staff" 
                    checked={typeOfUser === 'STAFF'} onChange={() => setTypeOfUser('STAFF')}
                  />
                  <Radio name="typeOfUser" label="Student" 
                    checked={typeOfUser === 'STUDENT'} onChange={() => setTypeOfUser('STUDENT')}
                  />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-md text-gray-800 font-extrabold">Department</h3>
                <div className="w-72 m-2 mt-6">
                  <div className="relative group">
                    <Select  label="Select department" value={department} onChange={(value) => setDepartment(value)}>
                      <Option value="ALL">All Departments</Option>
                      <Option value="CHEMICAL">Chemical Engineering</Option>
                      <Option value="MECHANICAL">Mechanical Engineering</Option>
                      <Option value="INDUSTRIAL">Industrial Engineering</Option>
                      <Option value="CIVIL">Civil Engineering</Option>
                      <Option value="ELECTRICAL">Electrical Engineering</Option>
                      <Option value="ARCHITECTURE">Architecture</Option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button 
            className="bg-blue-gray-500 capitalize m-3"
            loading={searching}
            onClick={() => handleComplexSearch()}
          >
            {mode === 'INCLUSIVE' ? 'Inclusive' : 'Restrictive'} Complex Search
          </Button>
      </div>
    </div>
  );
};
