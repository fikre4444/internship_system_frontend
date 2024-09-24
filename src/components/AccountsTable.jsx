import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Input, Typography, Button, CardBody, Chip, CardFooter,
  Tabs, TabsHeader, Tab, Avatar, IconButton, Tooltip } from "@material-tailwind/react";
import { FaTableCells } from "react-icons/fa6";

import MaleAvatar from '../assets/male_avatar.png';
import FemaleAvatar from '../assets/female_avatar.png';
import { Parser } from '@json2csv/plainjs';

 
const checkArrayIntegrity = (arr) => {
  console.log("checking integrity");
  if(arr?.length > 0){
    console.log("Integrity is fine");
    return true;
  }
  console.log("Integrity is bad");
  return false;
}

const handleExportTable = (accounts) => {
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

const convertToAppropriateTitle = (str) => {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); }).trim();
}

const AccountsTable = ({TABLE_HEAD, TABLE_ROWS, TableTitle}) => {
  if(TableTitle != null)
    TableTitle = convertToAppropriateTitle(TableTitle);

  if(!(checkArrayIntegrity(TABLE_HEAD) && checkArrayIntegrity(TABLE_ROWS))){
    return <></>;
  }

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-0 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                {TableTitle ? TableTitle : <>Accounts list</>}
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all members
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button className="flex items-center gap-3 bg-blue-gray-500 m-2" onClick={() => handleExportTable(TABLE_ROWS)} size="sm">
                <FaTableCells size={20} /> Export to Excel Table
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
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
                ({ firstName, lastName, email, username, department, enabled, gender }, index) => {
                  const isLast = index === TABLE_ROWS.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
  
                  return (
                    <tr key={username}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar src={gender === 'MALE' ? MaleAvatar : FemaleAvatar} alt={firstName + lastName} size="sm" />
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {firstName + " " + lastName}
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
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {username}
                          </Typography>
                        </div>
                      </td>
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
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={enabled ? "Active" : "Disabled"}
                            color={enabled ? "green" : "blue-gray"}
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {gender === 'MALE' ? 'Male' : 'Female'}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Edit User">
                          <IconButton variant="text">
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
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

export default AccountsTable;
