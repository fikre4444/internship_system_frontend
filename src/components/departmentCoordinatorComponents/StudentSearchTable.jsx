import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Input, Typography, Button, CardBody, Chip, CardFooter,
  Tabs, TabsHeader, Tab, Avatar, IconButton, Tooltip } from "@material-tailwind/react";
import { FaTableCells } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

import MaleAvatar from '../../assets/male_avatar.png';
import FemaleAvatar from '../../assets/female_avatar.png';
import { Parser } from '@json2csv/plainjs';
import Highlighter from "react-highlight-words";

 
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

const StudentSearchTable = ({TABLE_HEAD, TABLE_ROWS, TableTitle, searchTerms=[]}) => {
  const navigate = useNavigate();
  
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
                {TableTitle ? TableTitle : "Accounts List"}
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
                ({ firstName, lastName, email, username, department, password, enabled, gender, roles }, index) => {
                  const isLast = index === TABLE_ROWS.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
  
                  return (
                    <tr key={username} onClick={() => {navigate("/department-coordinator/viewStudent", { state: TABLE_ROWS[index] });}} className="hover:bg-blue-300 hover:bg-opacity-25 cursor-pointer hover:scale-[1.01] transition-all duration-[50ms]">
                      <AccountDetailsColumn classes={classes} firstName={firstName} 
                        lastName={lastName} gender={gender} email={email} searchTerms={searchTerms}/>
                      <UsernameColumn classes={classes} username={username} searchTerms={searchTerms} />
                      <DepartmentColumn classes={classes} department={department} searchTerms={searchTerms} />
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
    <td className={classes}>
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

const DepartmentColumn = ({ classes, department, searchTerms }) => {
  return (
    <td className={classes}>
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
            textToHighlight={department.name}
          />
        </Typography>
      </div>
    </td>
  )
}

// const GenderatedPasswordColumn = ({ classes, password }) => {
//   return (
//     <td className={classes}>
//       <div className="flex flex-col">
//         <Typography
//           variant="small"
//           color="blue-gray"
//           className="font-normal"
//         >
//           {password === null || password === "" || isBcryptHash(password) ? "Password is Set by User." : password }
//         </Typography>
//       </div>
//     </td>
//   )
// }

// const RolesColumn = ({ classes, roles }) => {
//   console.log("the roles are");
//   console.log(roles);
//   return (
//     <td className={classes}>
//       <div className="flex flex-col">
//         { roles.map(role => 
//             <div className="w-max m-1" key={role.role}>
//               <Chip variant="ghost" size="sm" value={role.name}
//                 className="bg-deep-orange-300 bg-opacity-30 text-black text-opacity-70 capitalize"
//               />
//             </div>
//           )
//         }
//       </div>
//     </td>
//   )
// }

// const UserEnabledColumn = ({ classes, enabled }) => {
//   return (
//     <td className={classes}>
//       <div className="w-max">
//         <Chip
//           variant="ghost"
//           size="sm"
//           value={enabled ? "Active" : "Disabled"}
//           color={enabled ? "green" : "red"}
//         />
//       </div>
//     </td>
//   );
// }

// const GenderColumn = ({ classes, gender }) => {
//   return (
//     <td className={classes}>
//       <Typography
//         variant="small"
//         color="blue-gray"
//         className="font-normal"
//       >
//         {gender === 'MALE' ? 'Male' : 'Female'}
//       </Typography>
//     </td>
//   );
// }

// const isBcryptHash = (hash) => {
//   // Bcrypt hashes start with "$2a$" or "$2b$" or "$2y$"
//   const bcryptPrefix = /^(\$2a\$|\$2b\$|\$2y\$)/;
//   return bcryptPrefix.test(hash);
// }

export default StudentSearchTable;
