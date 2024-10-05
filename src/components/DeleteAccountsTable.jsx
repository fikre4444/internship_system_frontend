import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Input, Typography, Button, CardBody, Chip, CardFooter,
  Tabs, TabsHeader, Tab, Avatar, IconButton, Tooltip } from "@material-tailwind/react";
import { FaTableCells } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { memo, useState } from 'react';

import MaleAvatar from '../assets/male_avatar.png';
import FemaleAvatar from '../assets/female_avatar.png';
import Highlighter from "react-highlight-words";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);


const createDeleteConfirmation = async () => {
  const result = await MySwal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
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

 
const checkArrayIntegrity = (arr) => {
  console.log("checking integrity");
  if(arr?.length > 0){
    console.log("Integrity is fine");
    return true;
  }
  console.log("Integrity is bad");
  return false;
}

const convertToAppropriateTitle = (str) => {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); }).trim();
}

const DeleteAccountsTable = ({TABLE_HEAD, TABLE_ROWS, TableTitle, searchTerms=[], deleteUser}) => {
  
  if(TableTitle != null)
    TableTitle = convertToAppropriateTitle(TableTitle);

  if(!(checkArrayIntegrity(TABLE_HEAD) && checkArrayIntegrity(TABLE_ROWS))){
    return (
      <>
        <div className="flex justify-center mt-6">
          <h1 className="m-3 mt-6 md:mt-3 mb-6 p-6 md:p-4 text-sm md:text-lg lg:text-xl font-semibold bg-red-400 bg-opacity-30 rounded-xl shadow-lg text-blue-gray-700 max-w-max">
            No Accounts Have been found.
          </h1>
        </div>
      </>
    );
  }

  const handleDeleteUser = async (username) => {
    const isConfirmed = await createDeleteConfirmation();
    if(!isConfirmed){ // if the user clicks cancel then return
      console.log("no we are not deleting it");
      return;
    }
    deleteUser("SINGLE", username);        
  }

  console.log("creating the table here");

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-0 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                {TableTitle ? TableTitle : "Full Accounts List"}
              </Typography>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0 mt-0 overflow-scroll px-0">
          <table className="mt-0 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD?.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS?.map(
                ({ firstName, lastName, email, username, department, password, enabled, gender, roles }, index) => {
                  const isLast = index === TABLE_ROWS.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
  
                  return (
                    <tr key={username} className="hover:bg-blue-300 hover:bg-opacity-25 cursor-pointer hover:scale-[1.01] transition-all duration-[50ms]">
                      <AccountDetailsColumn classes={classes} firstName={firstName} 
                        lastName={lastName} gender={gender} email={email} searchTerms={searchTerms}/>
                      <UsernameColumn classes={classes} username={username} searchTerms={searchTerms} />
                      <DepartmentColumn classes={classes} department={department} />
                      <RemoveColumn {...{classes, username, handleDeleteUser}}/>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </>
    
  );
}

const AccountDetailsColumn = ({ classes, firstName, lastName, gender, email, searchTerms }) => {
  return (
    <td className={classes+" w-80"}>
      <div className="flex items-center gap-3">
        <Avatar src={gender === 'MALE' ? MaleAvatar : FemaleAvatar} alt={firstName + lastName} size="sm" />
        <div className="flex flex-col">
          <Typography
            variant="small"
            color="blue-gray"
            className="font-normal"
          >
            <Highlighter
              highlightClassName="bg-yellow-400"
              searchWords={searchTerms}
              autoEscape={true}
              textToHighlight={firstName + " " + lastName}
            />
          </Typography>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-normal opacity-70"
          >
            {email}
          </Typography>
        </div>
      </div>
    </td>
  )
}

const UsernameColumn = ({ classes, username, searchTerms }) => {
  return (
    <td className={classes}>
      <div className="flex flex-col">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal"
        >
          {/* Highlight the search term in the username */}
          <Highlighter
            highlightClassName="bg-yellow-200"
            searchWords={searchTerms}
            autoEscape={true}
            textToHighlight={username}
          />
        </Typography>
      </div>
    </td>
  )
}

const DepartmentColumn = ({ classes, department }) => {
  return (
    <td className={classes}>
      <div className="flex flex-col">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal"
        >
          {department.name}
        </Typography>
      </div>
    </td>
  )
}

const RemoveColumn = ({classes, handleDeleteUser, username}) => {

  return (
    <td className={classes}>
      <div className="flex flex-col">
        <button onClick={() => {handleDeleteUser(username)}} 
          className="text-gray-700 cursor-pointer hover:text-red-500 duration-100 hover:scale-110 py-1 border-2 border-gray-700 hover:border-red-500 rounded-lg"
        >
          Remove
        </button>
      </div>
    </td>
  );
}



export default memo(DeleteAccountsTable);
