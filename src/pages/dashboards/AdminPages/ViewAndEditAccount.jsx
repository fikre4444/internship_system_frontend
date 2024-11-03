import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Badge, Button, Card, Chip, Option, Select, Switch } from '@material-tailwind/react';
import { FaCheck } from "react-icons/fa6";
import axios from 'axios';
import { toast } from 'react-toastify';
import { DEPARTMENTS } from '../../../data/departments';

const ViewAndEditAccount = () => {
  const [ isEditing, setIsEditing ] = useState(false);

  const [ account, setAccount ] = useState(null);
  
  const location = useLocation();
  

  useEffect(() => {
    let account = location.state;
    setAccount(account);
  }, [])
  
  if(account === null){
    return (
      <div className="flex flex-col gap-3 justify-center items-center">
        <h1 
          className="m-3 my-8 text-lg md:text-xl lg:text-2xl font-semibold bg-blue-300 bg-opacity-20 rounded-3xl shadow-2xl text-blue-gray-700 p-6 inline-block"
        >
          There Is No Account To Be Displayed.
        </h1>
        <h2 className="text-sm md:text-md lg:text-lg font-semibold text-blue-gray-800">
          You have to click on an account first to view an account.
        </h2>
      </div>
    )
  }

  console.log(account);

  return (
    <div>
      <HeaderComponent isEditing={isEditing} setIsEditing={setIsEditing} /> 
      {isEditing && 
        <h1 
          className="m-3 my-8 text-sm md:text-md lg:text-lg font-semibold bg-blue-300 bg-opacity-20 rounded-3xl shadow-2xl text-blue-gray-700 p-6 inline-block"
        >
          You are now in edit mode, you can edit the parts that are editable.
        </h1>
      }
      <div className="flex flex-col gap-4 flex-wrap">
        <UserInfo account={account} isEditing={isEditing}/>
        {!isEditing 
          ? <OtherDetails  account={account} setAccount={setAccount} />
          : <EditingComponent account={account} setAccount={setAccount} />
        }
      </div>
      
    </div>
  );
}

export default ViewAndEditAccount;

const HeaderComponent = ({isEditing, setIsEditing}) => {

  return (
    <header className="p-2 flex items-center justify-between flex-wrap">
      <h1 className="text-2xl lg:text-3xl text-blue-gray-800 font-semibold">
        {!isEditing ? 'View Account' : 'Edit Account'}
      </h1>
      <div className="flex items-center justify-center gap-3 bg-gray-100 rounded-lg p-1 w-40 md:w-48">
        <label className="font-serif font-semibold text-sm md:text-lg lg:text-2xl text-gray-800">
          Switch View
        </label>
        <Switch onClick={() => setIsEditing(prevState => !prevState)} 
          className="h-full w-full checked:bg-[#071809]"
          containerProps={{
            className: "w-11 h-6",
          }}
          circleProps={{
            className: "before:hidden left-0.5 border-none",
          }}  
        />
      </div>
    </header>
  );

}

const UserInfo = ({ account, isEditing }) => {
  return (
    <div className="m-3">
      <h1 className="font-inter font-bold text-lg md:text-2xl">Personal Info</h1>
      <div className="flex gap-3 items-center">
        <table className="m-2">
          <tr className="bg-blue-100 bg-opacity-50 border-b-2 border-gray-100">
            <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">First Name</td>
            <td className="bg-green-100 bg-opacity-25 text-left p-2 font-inter text-sm md:text-lg font-bold">{account.firstName}</td>
          </tr>
          <tr className="bg-blue-100 bg-opacity-50 border-b-2 border-gray-100">
            <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Last Name</td>
            <td className="bg-green-100 bg-opacity-25 text-left p-2 font-inter text-sm md:text-lg font-bold">{account.lastName}</td>
          </tr>
          <tr className="bg-blue-100 bg-opacity-50 border-b-2 border-gray-100">
            <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Username</td>
            <td className="bg-green-100 bg-opacity-25 text-left p-2 font-inter text-sm md:text-lg font-bold">{account.username}</td>
          </tr>
          <tr className="bg-blue-100 bg-opacity-50 border-b-2 border-gray-100">
            <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Email</td>
            <td className="bg-green-100 bg-opacity-25 text-left p-2 font-inter text-sm md:text-lg font-bold">{account.email}</td>
          </tr>
          <tr className="bg-blue-100 bg-opacity-50 border-b-2 border-gray-100">
            <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Gender</td>
            <td className="bg-green-100 bg-opacity-25 text-left p-2 text-sm md:text-lg font-bold lowercase font-inter">{account.gender}</td>
          </tr>
        </table>
        { isEditing && 
          <div className="bg-blue-300 bg-opacity-30 p-3 rounded-lg">
            <p className="flex gap-3 items-center">
              <span className="bg-blue-gray-600 text-xl rounded-full p-2 animate-moveUpDown">&#128071;</span> 
              Scroll Down to Edit the parts that are editable
            </p>
          </div>
        }
      </div>
    </div>
  )
}

const OtherDetails = ({ account }) => {
  return (
    <div className="m-3">
      <h1 className="font-inter font-bold text-lg md:text-2xl">Other Details</h1>
      <table className="m-2">
        <tr className="bg-blue-100 bg-opacity-50 border-b-2 border-gray-100">
          <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Status</td>
          <td className="bg-green-100 bg-opacity-25 text-left p-2 font-inter text-sm md:text-lg font-bold">
            {account.enabled ? "Active" : "Disabled"}
          </td>
        </tr>
        <tr className="bg-blue-100 bg-opacity-50 border-b-2 border-gray-100">
          <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Department</td>
          <td className="bg-green-100 bg-opacity-25 text-left p-2 font-inter text-sm md:text-lg font-bold">{account.department.name}</td>
        </tr>
        <tr className="bg-blue-100 bg-opacity-50 border-b-2 border-gray-100">
          <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Roles</td>
          <td className="bg-green-100 bg-opacity-25 text-left p-2 font-inter text-sm md:text-lg font-bold">
            {
              account.roles.map(role => 
                <div className="w-max m-1" key={role.role}>
                  <Chip variant="ghost" size="sm" value={role.name}
                    className="bg-deep-orange-300 bg-opacity-30 text-black text-opacity-70 capitalize"
                  />
                </div>
              )
            }
          </td>
        </tr>
        <tr className="bg-blue-100 bg-opacity-50 border-b-2 border-gray-100">
          <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Password</td>
          <td className="bg-green-100 bg-opacity-25 text-left p-2 font-inter text-sm md:text-lg font-bold">
            {!isBcryptHash(account.password) 
              ? <>{account.password}</>
              : <>Hidden</>
            }
          </td>
        </tr>
        { !!account.courseLoad &&
          <tr className="bg-blue-100 bg-opacity-50 border-b-2 border-gray-100">
            <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Courseload</td>
            <td className="bg-green-100 bg-opacity-25 text-left p-2 text-sm md:text-lg font-bold lowercase font-inter">{account.courseLoad}</td>
          </tr>
        }
        { !!account.grade &&

          <tr className="bg-blue-100 bg-opacity-50 border-b-2 border-gray-100">
            <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">GPA</td>
            <td className="bg-green-100 bg-opacity-25 text-left p-2 text-sm md:text-lg font-bold lowercase font-inter">{account.grade}</td>
          </tr>
        }
        {
          !!account.stream &&

          <tr className="bg-blue-100 bg-opacity-50 border-b-2 border-gray-100">
            <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Stream</td>
            <td className="bg-green-100 bg-opacity-25 text-left p-2 text-sm md:text-lg font-bold lowercase font-inter">{account.stream}</td>
          </tr>
        }
      </table>
    </div>
  );
};

const EditingComponent = ({account, setAccount}) => {
  const allRoles = [
    {role: "ROLE_STUDENT" , name: "Student"},
    {role: "ROLE_STAFF", name: "Staff"} ,
    {role: "ROLE_ADVISOR", name: "Advisor"},
    {role: "ROLE_HEAD_INTERNSHIP_COORDINATOR", name: "Head Internship Coordinator"},
    {role: "ROLE_DEPARTMENT_INTERNSHIP_COORDINATOR", name: "Department Internship Coordinator"},
    {role: "ROLE_ADMINISTRATOR", name: "Administrator"}
  ];

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const departmentRef = useRef(null);

  const [ errors, setErrors ] = useState({
    department: ""
  });

  const handleDepartmentChange = async () => {
    if(selectedDepartment === null || selectedDepartment === ""){
      setErrors({
        ...errors,
        department: "Please Choose a department first."
      })
      return;
    }
    if(selectedDepartment === account.department.department){
      setErrors({
        ...errors,
        department: "This is the same as the current department."
      })
      return;
    }
    const urlRequest = "/api/admin/change-department";
    const requestBody = {
      username: account.username,
      department: selectedDepartment
    };
    const updatingToastId = toast.loading("Changing Department...");
    try{
      const response = await axios.put(urlRequest, requestBody);
      if(response.status === 200){
        toast.update(updatingToastId, { 
          render: "Department Changed successfully!", 
          type: "success", 
          isLoading: false,
          autoClose: 2000 ,
          closeButton: true
        });
        setAccount({
          ...account, 
          department: response.data
        })
      } else{
        toast.update(updatingToastId, { 
          render: "Something went wrong while updating try again.", 
          type: "error", 
          isLoading: false,
          autoClose: 2000 ,
          closeButton: true
        });
      }
    } catch (error) {
      toast.update(updatingToastId, { 
        render: "Something went wrong while updating try again.", 
        type: "error", 
        isLoading: false,
        autoClose: 2000 ,
        closeButton: true
      });
    }
  }

  const toggleAccountState = async ({currentState}) => {
    const urlRequest = "/api/admin/set-enableness";
    const requestBody = {
      username: account.username,
      enabled: !account.enabled
    };
    const updatingToastId = toast.loading("Updating Status...");
    try{
      const response = await axios.put(urlRequest, requestBody);
      if(response.status === 200){
        toast.update(updatingToastId, { 
          render: "Status has been updated successfully!", 
          type: "success", 
          isLoading: false,
          autoClose: 2000 ,
          closeButton: true
        });
        setAccount({
          ...account, 
          enabled: !account.enabled
        })
      } else{
        toast.update(updatingToastId, { 
          render: "Something went wrong while updating try again.", 
          type: "error", 
          isLoading: false,
          autoClose: 2000 ,
          closeButton: true
        });
      }
    } catch (error) {
      toast.update(updatingToastId, { 
        render: "Something went wrong while updating try again.", 
        type: "error", 
        isLoading: false,
        autoClose: 2000 ,
        closeButton: true
      });
    }
  }

  const handleResetPassword = async () => {
    const urlRequest = "/api/admin/reset-password?username="+account.username;
    const updatingToastId = toast.loading("Reseting Password...");
    try{
      const response = await axios.put(urlRequest);
      if(response.status === 200){
        toast.update(updatingToastId, { 
          render: "Password Has Been Reset!", 
          type: "success", 
          isLoading: false,
          autoClose: 2000 ,
          closeButton: true
        });
        setAccount({
          ...account, 
          password: response.data.password
        })
      } else{
        toast.update(updatingToastId, { 
          render: "Something went wrong while resetting try again.", 
          type: "error", 
          isLoading: false,
          autoClose: 2000 ,
          closeButton: true
        });
      }
    } catch (error) {
      toast.update(updatingToastId, { 
        render: "Something went wrong while resetting try again.", 
        type: "error", 
        isLoading: false,
        autoClose: 2000 ,
        closeButton: true
      });
    }
    
  }

  const toggleRole = async (roleEnum, typeOfToggle) => {
    const urlRequest = typeOfToggle === 'ADD' ? "/api/admin/add-role" : "/api/admin/remove-role";
    const requestBody = {
      "username" : account.username,
      "role" : roleEnum
    };
    console.log(requestBody);
    const settingToastId = toast.loading("Updating Roles");
    toast.update(settingToastId, {
      closeButton: true
    })
    try{
      const response = await axios.put(urlRequest, requestBody);
      if(response.status === 200){
        toast.update(settingToastId, { 
          render: "Roles has been updated successfully!", 
          type: "success", 
          isLoading: false,
          autoClose: 2000 ,
          closeButton: true
        });
        const data = response.data;
        if(data.result === 'success'){
          if(typeOfToggle === 'ADD'){
            setAccount({
              ...account,
              roles: [
                ...account.roles,
                data.addedRole,
              ]
            })
          }
          else if(typeOfToggle === 'REMOVE'){
            const removedRole = data.removedRole;
            const updatedRoles = account.roles.filter(role => role.role !== removedRole.role);
            setAccount({
              ...account, 
              roles: [
                ...updatedRoles
              ]
            })
          }
        }
        else if(data.result === 'failure'){
          toast.update(settingToastId, {
            render: data.message, 
            type: "error", 
            isLoading: false,
            autoClose: 2000 ,
            closeButton: true
          })
        }
      } else{
        toast.update(settingToastId, { 
          render: "Something went wrong while updating roles please try again.", 
          type: "error", 
          isLoading: false,
          autoClose: 2000 ,
          closeButton: true
        });
      }
    } catch (error) {
      toast.update(settingToastId, { 
        render: "Something went wrong while updating roles please try again.", 
        type: "error", 
        isLoading: false,
        autoClose: 2000 ,
        closeButton: true
      });
    }
  }

  return (
    <div className="m-3 max-w-max">
      <h1 className="font-inter font-bold text-lg md:text-2xl">Other Details</h1>
        <Card className={"max-w-max m-2 p-4 "+ (!!account.enabled ? "bg-green-100" : "bg-red-100")}>
          <div className="">
            <div className="mb-3">
              <label className="text-xl text-black font-semibold block">
                Status : 
                <span className={"ml-1 text-xl font-semibold "+ (account.enabled ? "text-green-900": "text-red-900")}>
                  {account.enabled ? "Active" : "Disabled"}
                </span>
              </label>
            </div>
            <Button 
              className={"bg-opacity-90 "+ (account.enabled ? "bg-red-500" : "bg-green-500")}
              onClick={toggleAccountState}
            >
              {!account.enabled ? "Enable Account" : "Disable Account"}
            </Button>
          </div>
        </Card>
        <Card className={"max-w-max m-2 p-4 bg-blue-100"}>
          <div className="">
            <div className="mb-3">
              <label className="text-xl text-black font-semibold block">
                Password : 
                <span className={"ml-1 text-xl font-semibold"}>
                  {!isBcryptHash(account.password) ? account.password : "Hidden"}
                </span>
              </label>
            </div>
            <Button 
              className={"bg-opacity-90 bg-blue-400"}
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
          </div>
        </Card>
      <Card className="max-w-max m-2 p-4 bg-blue-100 bg-opacity-30">
        <div className="m-2 my-3">
          <h3 className="text-sm md:text-md lg:text-lg text-gray-900 font-extrabold">
            Current Department: <span className="font-normal">{account.department.name}</span>
          </h3>
          <div className="w-72">
            <div className="relative group my-4">
              <Select 
                ref={departmentRef}  
                label="Change department" 
                value={selectedDepartment}
                onChange={(e) => {setSelectedDepartment(e); setErrors({department: ""})}}
              >
                {DEPARTMENTS.map(department => (
                  <Option key={department.value} value={department.value}>
                    {department.label}
                  </Option>
                ))}
              </Select>
            </div>
            {errors.department && <span className="text-red-500 font-semibold m-0 p-0 text-sm">{errors.department}</span>}
          </div>
        </div>
        <Button className="bg-blue-400" onClick={handleDepartmentChange}>
          Submit Changes
        </Button>
      </Card>
      <div className="flex gap-1">
        <Card className="m-2 p-4 bg-blue-100 bg-opacity-30">
          <h1 className="text-lg font-semibold tracking-wide">Roles</h1>
          { account.roles.some(accountRole => accountRole.role === "ROLE_STUDENT") ?
            <div>
              This account is a student and cannot be assigned any roles other than that.
            </div>
            :
            allRoles.map(role => {
            if(role.role === "ROLE_STUDENT"){
              return <></>
            }
            let hasRole = false;
            hasRole = account.roles.some(accountRole => accountRole.role === role.role);
            return (
              <div key={role.role}>
                <RoleComponent role={role} hasRole={hasRole} toggleRole={toggleRole} />
              </div>
            )
          })}        
        </Card>
        { !account.roles.some(accountRole => accountRole.role === "ROLE_STUDENT") &&
          <div>
            <Card className="m-2 p-4 bg-blue-100 bg-opacity-30">
              <p className="flex gap-3 items-center"><div className="text-green-400"><FaCheck /></div> Means: User has the role.</p>
              <p><span className="text-red-400 font-bold">X</span> Means: User doesn't have the role.</p>
            </Card>
          </div>
        }
      </div>
    </div>
  )
}

const RoleComponent = ({role, hasRole, toggleRole}) => {
  return (
    <div className="bg-blue-300 p-3 bg-opacity-40 my-2 flex gap-3 items-center justify-between rounded-md">
      <Badge color={hasRole ? 'green' : 'red'} content={hasRole ? <FaCheck /> : <p className="font-bold">X</p>}>
        <div className="p-2 md:w-40 m-1 bg-gray-200 bg-opacity-50 shadow-md rounded-lg">
          <p className="">{role.name}</p> 
        </div>
      </Badge>
      <Button 
        className={"md:w-40 capitalize tracking-wider "+(hasRole ? "bg-red-300" : "bg-green-300")}
        onClick={() => {
          if(hasRole)
            toggleRole(role.role, 'REMOVE');
          else
            toggleRole(role.role, 'ADD');
        }}
      >
        {hasRole ? "Remove Role" : "Add Role"}
      </Button>      
    </div>
  )
}

const isBcryptHash = (hash) => {
  // Bcrypt hashes start with "$2a$" or "$2b$" or "$2y$"
  const bcryptPrefix = /^(\$2a\$|\$2b\$|\$2y\$)/;
  return bcryptPrefix.test(hash);
}



