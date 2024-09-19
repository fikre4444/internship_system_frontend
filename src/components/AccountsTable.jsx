import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Input, Typography, Button, CardBody, Chip, CardFooter,
  Tabs, TabsHeader, Tab, Avatar, IconButton, Tooltip } from "@material-tailwind/react";

import MaleAvatar from '../assets/male_avatar.png';
import FemaleAvatar from '../assets/female_avatar.png';

// const TABLE_HEAD = ["Member", "Username", "Department", "Status", "Gender"];


// const TABLE_ROWS = [
//           { "id": 42,
//             "firstName": "Taylor",
//             "lastName": "Greenfelder",
//             "username": "eitm/ur819935/55",
//             "password": "$2a$10$6VBMOwe9F662KWhXJL.p7uI1PBFyCYOXjIihLAu3Jxwm1W.fIosSe",
//             "email": "TaylorGreenfelder68@gmail.com",
//             "enabled": true,
//             "gender": "FEMALE",
//             "roles": [
//                 {
//                     "id": 2,
//                     "name": "ROLE_STUDENT"
//                 }
//             ],
//             "department": "Mechanical Engineering",
//             "stream": "going",
//             "grade": 2.43,
//             "authorities": [
//                 {
//                     "authority": "ROLE_STUDENT"
//                 }
//             ],
//             "accountNonLocked": true,
//             "credentialsNonExpired": true,
//             "accountNonExpired": true
//         }
//       ]
 
const checkArrayIntegrity = (arr) => {
  if(arr?.length > 0){
    return true;
  }
  return false;
}

const AccountsTable = ({TABLE_HEAD, TABLE_ROWS}) => {
  
  if(!(checkArrayIntegrity(TABLE_HEAD) && checkArrayIntegrity(TABLE_ROWS))){
    return <></>;
  }

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-0 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Accounts list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all members
            </Typography>
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
                          {department}
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
  );
}

export default AccountsTable;
