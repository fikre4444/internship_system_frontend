import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Button, Card, Chip, Option, Select, Switch } from '@material-tailwind/react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
      <div className="flex gap-4 flex-wrap">
        <UserInfo account={account} />
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

const UserInfo = ({ account }) => {
  return (
    <div className="m-3">
      <h1 className="font-inter font-bold text-lg md:text-2xl">Personal Info</h1>
      <table className="m-2">
        <tr className="bg-blue-gray-100 border-b-2 border-gray-100">
          <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">First Name</td>
          <td className="bg-green-100 bg-opacity-25 text-left p-2 font-inter text-sm md:text-lg font-bold">{account.firstName}</td>
        </tr>
        <tr className="bg-blue-gray-100 border-b-2 border-gray-100">
          <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Last Name</td>
          <td className="bg-green-100 bg-opacity-25 text-left p-2 font-inter text-sm md:text-lg font-bold">{account.lastName}</td>
        </tr>
        <tr className="bg-blue-gray-100 border-b-2 border-gray-100">
          <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Username</td>
          <td className="bg-green-100 bg-opacity-25 text-left p-2 font-inter text-sm md:text-lg font-bold">{account.username}</td>
        </tr>
        <tr className="bg-blue-gray-100 border-b-2 border-gray-100">
          <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Email</td>
          <td className="bg-green-100 bg-opacity-25 text-left p-2 font-inter text-sm md:text-lg font-bold">{account.email}</td>
        </tr>
        <tr className="bg-blue-gray-100 border-b-2 border-gray-100">
          <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Gender</td>
          <td className="bg-green-100 bg-opacity-25 text-left p-2 text-sm md:text-lg font-bold lowercase font-inter">{account.gender}</td>
        </tr>
      </table>
    </div>
  )
}

const OtherDetails = ({ account }) => {
  return (
    <div className="m-3">
      <h1 className="font-inter font-bold text-lg md:text-2xl">Other Details</h1>
      <table className="m-2">
        <tr className="bg-blue-gray-100 border-b-2 border-gray-100">
          <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Status</td>
          <td className="bg-green-100 bg-opacity-25 text-left p-2 font-inter text-sm md:text-lg font-bold">
            {account.enabled ? "Active" : "Disabled"}
          </td>
        </tr>
        <tr className="bg-blue-gray-100 border-b-2 border-gray-100">
          <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Department</td>
          <td className="bg-green-100 bg-opacity-25 text-left p-2 font-inter text-sm md:text-lg font-bold">{account.department.name}</td>
        </tr>
        <tr className="bg-blue-gray-100 border-b-2 border-gray-100">
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
        <tr className="bg-blue-gray-100 border-b-2 border-gray-100">
          <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Password</td>
          <td className="bg-green-100 bg-opacity-25 text-left p-2 font-inter text-sm md:text-lg font-bold">
            {!isBcryptHash(account.password) 
              ? <>{account.password}</>
              : <>Hidden</>
            }
          </td>
        </tr>
        { !!account.courseLoad &&
          <tr className="bg-blue-gray-100 border-b-2 border-gray-100">
            <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Courseload</td>
            <td className="bg-green-100 bg-opacity-25 text-left p-2 text-sm md:text-lg font-bold lowercase font-inter">{account.courseLoad}</td>
          </tr>
        }
        { !!account.grade &&

          <tr className="bg-blue-gray-100 border-b-2 border-gray-100">
            <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">GPA</td>
            <td className="bg-green-100 bg-opacity-25 text-left p-2 text-sm md:text-lg font-bold lowercase font-inter">{account.grade}</td>
          </tr>
        }
        {
          !!account.stream &&

          <tr className="bg-blue-gray-100 border-b-2 border-gray-100">
            <td className="text-right p-2 font-inter text-sm md:text-lg font-bold border-r-2 border-white">Stream</td>
            <td className="bg-green-100 bg-opacity-25 text-left p-2 text-sm md:text-lg font-bold lowercase font-inter">{account.stream}</td>
          </tr>
        }
      </table>
    </div>
  );
};

const EditingComponent = ({account, setAccount}) => {
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



  return (
    <div className="m-3">
      <h1 className="font-inter font-bold text-lg md:text-2xl">Other Details</h1>
      <div className="flex gap-2 items-center flex-wrap">
        <Card className={"m-2 p-4 "+ (!!account.enabled ? "bg-green-100" : "bg-red-100")}>
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
        <Card className={"m-2 p-4 bg-blue-100"}>
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
      </div>
      <Card className="m-2 p-4 bg-blue-100 bg-opacity-30">
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
                <Option value="CHEMICAL">Chemical Engineering</Option>
                <Option value="MECHANICAL">Mechanical Engineering</Option>
                <Option value="INDUSTRIAL">Industrial Engineering</Option>
                <Option value="CIVIL">Civil Engineering</Option>
                <Option value="ELECTRICAL">Electrical Engineering</Option>
                <Option value="ARCHITECTURE">Architecture</Option>
              </Select>
            </div>
            {errors.department && <span className="text-red-500 font-semibold m-0 p-0 text-sm">{errors.department}</span>}
          </div>
        </div>
        <Button className="bg-blue-400" onClick={handleDepartmentChange}>
          Submit Changes
        </Button>
      </Card>
    </div>
  )
}

const isBcryptHash = (hash) => {
  // Bcrypt hashes start with "$2a$" or "$2b$" or "$2y$"
  const bcryptPrefix = /^(\$2a\$|\$2b\$|\$2y\$)/;
  return bcryptPrefix.test(hash);
}



