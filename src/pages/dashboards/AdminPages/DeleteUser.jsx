import { Button, Input, Option, Radio, Select } from "@material-tailwind/react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../../components/Loader';
import DeleteAccountsTable from "../../../components/DeleteAccountsTable";
import { toast } from "react-toastify";
import { useCallback } from "react";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const DeleteUser = () => {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ successfulResponse, setSuccessfulResponse] = useState(false);
  const [ accountsList, setAccountsList ] = useState([]);

  const [ department, setDepartment ] = useState('');
  const [ username, setUsername ] = useState('');
  const [ typeUserDelete, setTypeUserDelete ] = useState('BOTH');
  const [ errors, setErrors ] = useState({
    department: "", typeUser: ""
  });

  const [TABLE_HEAD, setTABLE_HEAD] = useState(["Member", "Username", "Department", "Remove User"])


  useEffect(() => {
    const fetchAllUsers = async () => {
      setIsLoading(true);
      // await sleep(2000);
      try{
        const response = await axios.get("/api/admin/get-all-accounts");
        if(response.status === 200){
          const data = response.data;
          console.log(data);
          setAccountsList([...data]);
          if(data.length > 0)
            setSuccessfulResponse(true);
        } else {
          setSuccessfulResponse(false);
        }
      }catch(error){
        console.log("there was an error while loading");
        console.log(error);
      }finally {
        setIsLoading(false);
      }
      
    }
    console.log("hello doing something");
    fetchAllUsers();
  }, [])

  const handleDepartmentChange = (value) => {
    setDepartment(value);
    setErrors({...errors, department: ''});
  }

  const handleTypeUserChange = (newTypeUser) => {
    setTypeUserDelete(newTypeUser);
  }

  const deleteUser = useCallback(async (type, username, department) => {
    const deletingAccountId = toast.loading("Deleting...");
    toast.update(deletingAccountId, {
      closeButton: true
    });
    await sleep(2000);
    if(type === 'SINGLE'){
      console.log("deleting by username")
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
      console.log("deleting by department")
    }
  }, [accountsList]);

  const removeAccounts = (deletedAccounts) => {
    const newAccountsList = accountsList.filter((account) => {
      return !deletedAccounts.some((deletedAcc) => deletedAcc.username === account.username);
    });
    console.log("the new length of the accounts list is "+newAccountsList.length);
    setAccountsList(newAccountsList);
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
          <div className="flex gap-3 items-end flex-wrap justify-between">
            <div className="m-3">
              <div className="flex items-center gap-2 m-2">
                <label className="text-lg font-semibold text-gray-800">Filter:</label>
                <div className="w-72 relative group">
                  <Input
                    color="blue"
                    label="Input Firstname, Lastname or Username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </div>
              </div>
              <Button className="m-2 capitalize bg-red-400">
                Remove All Accounts
              </Button>
            </div>
            <div className="m-3">
              <div className="flex gap-2 mb-2">
                <div className="flex flex-col items-start gap-3">
                  <h3 className="text-md text-gray-800 font-extrabold">Remove By Department</h3>
                  <div className="relative group">
                    <Select label="Select department" value={department} onChange={handleDepartmentChange}>
                      <Option value="CHEMICAL">Chemical Engineering</Option>
                      <Option value="MECHANICAL">Mechanical Engineering</Option>
                      <Option value="INDUSTRIAL">Industrial Engineering</Option>
                      <Option value="CIVIL">Civil Engineering</Option>
                      <Option value="ELECTRICAL">Electrical Engineering</Option>
                      <Option value="ARCHITECTURE">Architecture</Option>
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
              <Button className="my-2 capitalize bg-red-400">
                Remove Accounts
              </Button>
            </div>
          </div>
          <DeleteAccountsTable TABLE_ROWS = {accountsList} TABLE_HEAD={TABLE_HEAD} deleteUser={deleteUser}/>
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



// const [username, setUsername] = useState('');
// const [isSending, setIsSending] = useState(false);
// const [haveDeletedUser, setHaveDeletedUser ] = useState(false);
// const [deletedUser, setDeletedUser] = useState(null);

// const TABLE_HEAD = ["Member", "Username", "Department", "Generated Password", "Roles", "Status", "Gender"];


// const handleDeleteUser = async () => {
//   setIsSending(true);
//   console.log("The ruse rname is ");
//   console.log(username);

//   const requestUrl = "/api/admin/delete-account?username="+username;
//   try{
//     const response = await axios.delete(requestUrl);
//     console.log(response.data);
//     setDeletedUser(response.data);
//     setIsSending(false);
//     setHaveDeletedUser(true);
//   }catch(e){
//     console.log("Something occured");
//     console.log(e);
//     setIsSending(false);
//   }
// }


// return (
//   <div>
//     {!haveDeletedUser ? 
//     <>
//       <div className="w-72 m-3">
//         <Input
//           color="blue" label="Input Username" value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//       </div>
//       <div className="m-3">
//         <Button loading={isSending} onClick={handleDeleteUser} className="bg-blue-gray-500" >
//           { isSending ? <>Delete User</> : <>Deleting User</> }
//         </Button>
//       </div>
//     </>
//     :
//     <>
//       { deletedUser === null ?
//         <div>
//           <h1 className="text-3xl text-red-500">The User You typed in doesn't exist!</h1>
//         </div>
//         : 
//         <div>
//           <h1 className="text-3xl text-green-500">You have the deleted The Following user.</h1>
//           <AccountsTable TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={[deletedUser]} />
//         </div>
//       }
//     </>
//     }
//   </div>
// )
