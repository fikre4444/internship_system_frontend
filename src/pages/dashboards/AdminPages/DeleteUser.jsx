import { Button, Input } from "@material-tailwind/react";
import { useState } from 'react';
import axios from 'axios';
import AccountsTable from "../../../components/AccountsTable";

const DeleteUser = () => {
  const [username, setUsername] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [haveDeletedUser, setHaveDeletedUser ] = useState(false);
  const [deletedUser, setDeletedUser] = useState(null);

  const TABLE_HEAD = ["Member", "Username", "Department", "Generated Password", "Roles", "Status", "Gender"];


  const handleDeleteUser = async () => {
    setIsSending(true);
    console.log("The ruse rname is ");
    console.log(username);

    const requestUrl = "/api/admin/delete-account?username="+username;
    try{
      const response = await axios.delete(requestUrl);
      console.log(response.data);
      setDeletedUser(response.data);
      setIsSending(false);
      setHaveDeletedUser(true);
    }catch(e){
      console.log("Something occured");
      console.log(e);
      setIsSending(false);
    }
  }


  return (
    <div>
      {!haveDeletedUser ? 
      <>
        <div className="w-72 m-3">
          <Input
            color="blue" label="Input Username" value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="m-3">
          <Button loading={isSending} onClick={handleDeleteUser} className="bg-blue-gray-500" >
            { isSending ? <>Delete User</> : <>Deleting User</> }
          </Button>
        </div>
      </>
      :
      <>
        { deletedUser === null ?
          <div>
            <h1 className="text-3xl text-red-500">The User You typed in doesn't exist!</h1>
          </div>
          : 
          <div>
            <h1 className="text-3xl text-green-500">You have the deleted The Following user.</h1>
            <AccountsTable TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={[deletedUser]} />
          </div>
        }
      </>
      }
    </div>
  )
}

export default DeleteUser;
