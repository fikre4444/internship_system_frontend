import { Button, Chip, Input, Option, Radio, Select } from "@material-tailwind/react";
import { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import Loader from '../../../components/Loader';
import DeleteAccountsTable from "../../../components/DeleteAccountsTable";
import { toast } from "react-toastify";
import { useCallback } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { DEPARTMENTS } from "../../../data/departments";

const MySwal = withReactContent(Swal);


const createDeleteConfirmation = async (
    title="Are You sure?", 
    text="You won't be able to revert this!"
) => {
  const result = await MySwal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete!',
    cancelButtonText: 'No, cancel!',
    customClass: {
      confirmButton: 'bg-red-300' // Apply your custom class here
    }
  });
  return result.isConfirmed;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const DeleteUser = () => {
  const debouncingRef = useRef(null);

  const [ isLoading, setIsLoading ] = useState(false);
  const [ successfulResponse, setSuccessfulResponse] = useState(false);
  const [ unchangeableAccountList, setUnchangeableAccountList] = useState([]);
  const [ accountsList, setAccountsList ] = useState([]);
  const [ searchTerms, setSearchTerms ] = useState([]);

  const [ department, setDepartment ] = useState('');
  const [ filter, setFilter ] = useState('');
  const [ typeUserDelete, setTypeUserDelete ] = useState('BOTH');
  const [ errors, setErrors ] = useState({
    department: "", typeUser: ""
  });

  const [page, setPage] = useState(0); // Current page
  const [size] = useState(10); // Number of items per page
  const [totalPages, setTotalPages] = useState(0); // Total pages available
  const [paginationControlsVisible, setPaginationControlsVisible] = useState(true);

  const [TABLE_HEAD, setTABLE_HEAD] = useState(["Member", "Username", "Department", "Remove User"])

  const fetchAllUsers = async () => {
    setIsLoading(true);
    try {
        const response = await axios.get(`/api/admin/get-all-accounts?page=${page}&size=${size}`);
        if (response.status === 200) {
            const data = response.data;
            console.log(data);
            setAccountsList([...data.content]); // Accessing the content of the page
            setUnchangeableAccountList([...data.content]);
            setSuccessfulResponse(data.content.length > 0);
            setTotalPages(data.totalPages); // Set total pages from response
        } else {
            setSuccessfulResponse(false);
        }
    } catch (error) {
        console.log("there was an error while loading");
        console.log(error);
        setSuccessfulResponse(false);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    
    console.log("hello doing something");
    fetchAllUsers();
}, [page, size]);

const handlePreviousPage = () => {
  if (page > 0) setPage(page - 1);
};

const handleNextPage = () => {
  if (page < totalPages - 1) setPage(page + 1);
};

  const handleDepartmentChange = (value) => {
    console.log("the value is "+value);
    setDepartment(value);
    setErrors({...errors, department: ''});
  }

  const handleTypeUserChange = (newTypeUser) => {
    setTypeUserDelete(newTypeUser);
  }


  const [ searchError, setSearchError ] = useState('');
  const validateInput = () => {
    if(filter === null || filter === ''){
      setSearchError("Please Input something first.");
      return false;
    }
    return true;
  }  

  const handleSearch = () => {
    if(!validateInput()){
      return;
    }
    setSearchError("");

    setIsLoading(true);
    const requestUrl = "/api/admin/simple-search?searchTerm="+filter;
    axios.get(requestUrl).then((response) => {
      console.log(response.data);
      const result = response.data;
      setSearchTerms([filter]);
      setUnchangeableAccountList(result);
      setAccountsList(result);
      setPaginationControlsVisible(false);
    }).catch(error => {
      console.log(error);
      toast.error("some Error occured");
    }).finally(() => {
      setIsLoading(false);
    })
  }


  const deleteUser = useCallback(async (type, username, department, typeUserDelete) => {
    // the reason i am passing the 3 arguments here instead of using the states above is because of 
    // the useCallback hook uses the previous states before they were updated so i need to pass
    // them and the reason i am using this useCallback hook is since i pass this delete user 
    // to the table below i don't want this function to be re-rendered everytime the parent renders

    if(type === 'SINGLE'){
      console.log("deleting by username")
      const deletingAccountId = toast.loading("Deleting...");
      toast.update(deletingAccountId, {
        closeButton: true
      });
      await sleep(2000);
      const requestUrl = "/api/admin/delete-account?username="+username;
      try{
        const response = await axios.delete(requestUrl);
        if(response.status === 200){ //if the response is ok
          const data = response.data;
          removeAccounts([data]);
          toast.update(deletingAccountId, {
            render: "Successfully Deleted!",
            type: "success",
            autoClose: 2000,
            isLoading: false,
            closeButton: true
          })
        } else {
          console.log("Some Error Occured")
          toast.update(deletingAccountId, {
            render: "Some Unknown Error Occured while deleting please try again.",
            type: "error",
            isLoading: false,
            autoClose: 2000,
            closeButton: true
          })
        }
      }catch(error){
        toast.update(deletingAccountId, {
          render: "Some Unknown Error Occured while deleting please try again.",
          type: "error",
          autoClose: 2000,
          isLoading: false,
          closeButton: true
        })
      }
    }
    else if(type === 'GROUP') {
      console.log("deleting by department");
      console.log("the department is "+department);
      console.log("and the tyep user is "+typeUserDelete);
      if(department === '' || department === null){
        console.log("this is null");
        setErrors({
          ...errors,
          department: "Please Choose a department first!."
        })
        return;
      }
      let isConfirmed = await createDeleteConfirmation("Are You Sure?", "Are you sure that you want to delete a whole department?");
      if(!isConfirmed){ // if the user clicks cancel then return
        console.log("no we are not deleting it");
        return;
      }
      await sleep(500);
      isConfirmed = await createDeleteConfirmation(
        "Pretty Sure?", 
        "Are you really really sure to delete, because there is not takebacks after this?"
      );
      if(!isConfirmed){ // if the user clicks cancel then return
        console.log("no we are not deleting it");
        return;
      }
      const deletingAccountId = toast.loading("Deleting...");
      toast.update(deletingAccountId, {
        closeButton: true
      });
      await sleep(2000);
      const requestUrl = "/api/admin/delete-accounts-by-department";
      const requestBody = {
        typeUser: typeUserDelete,
        department: department
      }
      try{
        const response = await axios.delete(requestUrl, {
          headers: {
            'Content-Type' : 'application/json'
          },
          data: requestBody
        });
        if(response.status === 200){ //if the response is ok
          const data = response.data; //since data is an array we pass it directly
          removeAccounts(data);
          toast.update(deletingAccountId, {
            render: "Successfully Deleted Department!",
            type: "success",
            autoClose: 2000,
            isLoading: false,
            closeButton: true
          })
        } else {
          console.log("Some Error Occured")
          toast.update(deletingAccountId, {
            render: "Some Unknown Error Occured while deleting please try again.",
            type: "error",
            isLoading: false,
            autoClose: 2000,
            closeButton: true
          })
        }
      }catch(error){
        toast.update(deletingAccountId, {
          render: "Some Unknown Error Occured while deleting please try again.",
          type: "error",
          autoClose: 2000,
          isLoading: false,
          closeButton: true
        })
      }
    }
  }, [accountsList]);

  const removeAccounts = (deletedAccounts) => {
    console.log(deletedAccounts);
    const newAccountsList = accountsList.filter((account) => {
      return !deletedAccounts.some((deletedAcc) => deletedAcc.username === account.username);
    });
    console.log("the new length of the accounts list is "+newAccountsList.length);
    setAccountsList(newAccountsList);
    setUnchangeableAccountList(newAccountsList);
  }

  const handleShowAll = () => {
    console.log("hello");
    setFilter("");
    setSearchError("");
    setSearchTerms([]);
    setPage(prev => prev + 1);
    setPage(prev => prev - prev);
    setPaginationControlsVisible(true);
  }

  return (
    <div>
      { isLoading ?
        <div className="my-4">
          <Loader message="Getting Users, Please Wait..."/>
        </div>
        : successfulResponse ?
        <div> {/* insert the delete table here */}
          <h1 className="text-3xl m-1 font-bold">Remove Users</h1>
          <div className="flex gap-12 items-start flex-wrap">
            <div className="m-3">
              <label className="text-lg mb-1 font-semibold text-gray-800">Search Filter:</label>
              <div className="flex items-center gap-2 m-2">
                <div className="w-72 relative group">
                  <Input
                    color="blue"
                    label="Input Something"
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value)
                    }}
                  />
                </div>
                <Button className="bg-blue-500" onClick={() => {handleSearch()}}>
                  Search
                </Button>
              </div>
              {searchError && <span className="text-red-500 m-0 p-0 text-sm">{searchError}</span>}
              <div className="max-w-72 bg-blue-200 bg-opacity-50 rounded-md shadow-sm p-2 m-2">
                <p className="text-xs text-gray-700 font-semibold">
                  Please Input a first name, last name, username, or department to search accounts.
                </p>
              </div>
              { !paginationControlsVisible &&
                <div className="flex ml-2">
                  <Chip onClick={() => {handleShowAll()}} className="cursor-pointer hover:bg-gray-900 transition-all duration-150" color="cyan" value="Show All" />
                </div>
              }
            </div>
            <div className="m-3 ml-4">
              <div className="flex gap-2 mb-2">
                <div className="flex flex-col items-start gap-3">
                  <h3 className="text-md text-gray-800 font-extrabold">Remove By Department</h3>
                  <div className="relative group">
                    <Select label="Select department" value={department} onChange={handleDepartmentChange}>
                    {DEPARTMENTS.map(department => (
                      <Option key={department.value} value={department.value}>
                        {department.label}
                      </Option>
                    ))}
                    </Select>
                  </div>
                  {errors.department && <span className="text-red-500 m-0 p-0 text-sm">{errors.department}</span>}
                </div>
                <div className="flex flex-col gap-2 items-start">
                  <h3 className="text-md text-gray-800 font-extrabold">Type Of User</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Radio name="typeUser" checked={typeUserDelete === 'BOTH'} 
                      label="Both" onChange={() => handleTypeUserChange('BOTH')}
                    />
                    <Radio name="typeUser" checked={typeUserDelete === 'STUDENT'} 
                      label="Student" onChange={() => handleTypeUserChange('STUDENT')}
                    />
                    <Radio name="typeUser" checked={typeUserDelete === 'STAFF' } 
                      label="Staff" onChange={() => handleTypeUserChange('STAFF')}
                    />
                  </div>
                </div>
              </div>
              <Button 
                className="my-2 capitalize bg-red-400"
                onClick={() => {deleteUser("GROUP", "", department, typeUserDelete)}}
              >
                Remove Accounts
              </Button>
            </div>
          </div>
          {/* <div className="container mx-auto p-4 text-center"> */}
            {/* Pagination Controls */}
            { !!paginationControlsVisible &&
              <div className="flex justify-center mb-6 space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={page === 0}
                  className="px-4 py-2 rounded-lg shadow-md bg-white bg-opacity-30 hover:bg-opacity-50 backdrop-blur-md border border-blue-300 text-blue-500 font-semibold transition duration-200"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setPage(index)}
                    className={`px-4 py-2 rounded-lg shadow-md backdrop-blur-md ${
                      page === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-white bg-opacity-30 hover:bg-opacity-50 border border-blue-300 text-blue-500'
                    } font-semibold transition duration-200`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages - 1}
                  className="px-4 py-2 rounded-lg shadow-md bg-white bg-opacity-30 hover:bg-opacity-50 backdrop-blur-md border border-blue-300 text-blue-500 font-semibold transition duration-200"
                >
                  Next
                </button>
              </div>
            }
          <DeleteAccountsTable TABLE_ROWS = {accountsList} TABLE_HEAD={TABLE_HEAD} deleteUser={deleteUser} searchTerms={searchTerms}/>
        </div>
        :
        <div>
          There was an error while fetching the accounts please try again later or refresh the page.
        </div>
      }
    </div>
  )
 
}

export default DeleteUser;

  // const changeAccountsList = (filterValue) => {
  //   const newAccountList = unchangeableAccountList.filter((account) => {
  //     if(account.firstName.toLowerCase().includes(filterValue.toLowerCase())) return true;
  //     if(account.lastName.toLowerCase().includes(filterValue.toLowerCase())) return true;
  //     if(account.username.toLowerCase().includes(filterValue.toLowerCase())) return true;
  //     if(account.department.name.toLowerCase().includes(filterValue.toLowerCase())) return true;
  //     return false;
  //   });
  //   setSearchTerms([filterValue]);
  //   setAccountsList(newAccountList);
  // }

  // const handleFilterChange = (filterValue) => {

      // const handleFilterChange = () => {
  //   // console.log("doing something")
  //   // setFilter(filterValue);
  //   // if(debouncingRef.current){
  //   //   clearTimeout(debouncingRef.current)
  //   // }
  //   // debouncingRef.current = setTimeout(() => changeAccountsList(filterValue) , 1000);
  //   // console.log("done");

  // }