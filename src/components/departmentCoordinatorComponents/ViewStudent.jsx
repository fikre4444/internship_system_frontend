import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import BigMessage from '../BigMessage';
import { Avatar, Button, Input } from '@material-tailwind/react';
import MaleAvatar from '../../assets/male_avatar.png';
import FemaleAvatar from '../../assets/female_avatar.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { sleep } from '../../utils/otherUtils'


const ViewStudent = () => {

  const [ account, setAccount ] = useState(null);
  
  const location = useLocation();
  

  useEffect(() => {
    let account = location?.state;
    setAccount(account);
    console.log(account.assignedInternship);
  }, [])


 // you might also need to add the applied internships.
  return (
    <div>
      { account == null ?
        <>
          <BigMessage text="No Student Account Has Been Selected." />
        </>
        :
        <>
          <div className="flex flex-wrap justify-center md:justify-start gap-20">
            {/* {JSON.stringify(account)} */}
            <StudentPersonalDetails account={account} />
            <InternshipComponent account={account} setAccount={setAccount} />
          </div>
        </>
      }
    </div>
  )
}

const StudentPersonalDetails = ({account}) => {
  return (
    <div className="flex flex-col gap-3 md:w-min md:items-center m-3 p-2 lg:ml-12 rounded-md">
      <h1 className="text-lg font-bold md:text-xl">
        Student Personal Details
      </h1>
      <div className="m-2 p-2 flex flex-col gap-3 mt-1 rounded-lg bg-black bg-opacity-5 min-w-72 max-w-min">
        <div className="flex gap-2 items-center bg-blue-300 bg-opacity-15 rounded-lg p-3 px-6">
          <Avatar className="bg-black bg-opacity-30 m-2 p-1" src={account.gender === 'MALE' ? MaleAvatar : FemaleAvatar} alt={account.firstName + account.lastName} size="lg" /> 
          <div>
            <h1>{account.firstName + " " +account.lastName}</h1>
            <h1>{account.username}</h1>
          </div>
        </div>
        <div className="min-w-72 bg-green-300 bg-opacity-15 p-3 px-6 rounded-lg mt-2">
          <h1 className="text-sm font-bold tracking-wider">
            {account.email ? account.email+"" : "No Email"}
          </h1>
          <h1 className="text-sm font-bold tracking-wider">
            {account.department.name}
          </h1>
          <h1 className="text-sm font-bold tracking-wider">
            {account.gender}
          </h1>
          <h1 className="text-sm font-bold tracking-wider">
            Grade: {account.grade}
          </h1>          
        </div>
      </div>
    </div>
  )
}

const InternshipComponent = ({account, setAccount}) => {
  const [internshipInputVisible, setInternshipInputVisible] = useState(false);
  const token = useSelector(state => state.user.token);

  const [editInternshipVisible, setEditInternshipVisible] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");


  const handleAdd = () => {
    setInternshipInputVisible(true);
  }

  const handleNotifyStudent = async () => {
    console.log("notifying");
    const requestObject = {
      username: account.username,
      typeOfNotification: "add_internship"
    };
    console.log(requestObject);
    setIsNotifying(true);
    const notifyingToastId = toast.loading("Notifying Student...");
    toast.update(notifyingToastId, {closeButton: true});
    await sleep(1000);
    try {
      const response = await axios.post("/api/department-coordinator/notify-student-about-internship-add",
        requestObject, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if(response.status === 200){
        console.log(response.data);
        toast.update(notifyingToastId, {
          render: "Successfully Notified the student!",
          type: "success",
          isLoading: false,
          autoClose: 1000
        });
      }
    }catch(error){
      console.log(error);
      toast.update(notifyingToastId, {
        render: "There was an error while notifying the student!",
        type: "error", 
        isLoading: false,
        autoClose: 1000
      });
    }finally{
      setIsNotifying(false);
    }
    


  }

  return (
    <div className="flex flex-col gap-3 md:items-center m-3 p-2 rounded-md">
      <h1 className="text-lg font-bold md:text-xl">
        Internship Status
      </h1>
      <div> {/* this will be the assigned Internship stuff */}
          { account.assignedInternship === null ?
            <div>
              { internshipInputVisible ?
                <>
                  <div>
                    <h1 className="text-xs md:text-sm lg:text-md font-semibold text-blue-gray-700">
                      Please Input The Internship Details Here and then Submit for the student
                    </h1>
                    <div>
                      <InternshipInputForm account={account} setAccount={setAccount}/>
                    </div>
                  </div>
                </>
                :
                <div className="w-80">
                  No Internship Assigned.
                  <Button className="bg-green-500"
                    onClick={() => {handleAdd()}}
                  >
                    Add Self Secured Internship
                  </Button>
                </div>
              }
              
            </div>
            :
            !editInternshipVisible ? //if the edit internship is not visible
              <div>
                <div>
                  <div className="flex gap-0 items-center">
                    <p className="p-2 w-40 bg-blue-300 bg-opacity-40 text-sm md:text-md m-1 ">
                      Company Name
                    </p>
                    <p className="p-2 w-40 bg-blue-700 bg-opacity-20 text-sm md:text-md m-1">
                      {account.assignedInternship?.companyName}
                    </p>
                  </div>
                  <div className="flex gap-0 items-center">
                    <p className="p-2 w-40 bg-blue-300 bg-opacity-40 text-sm md:text-md m-1 ">
                      Location
                    </p>
                    <p className="p-2 w-40 bg-blue-700 bg-opacity-20 text-sm md:text-md m-1">
                      {account.assignedInternship?.location}
                    </p>
                  </div>
                  <div className="flex gap-0 items-center">
                    <p className="p-2 w-40 bg-blue-300 bg-opacity-40 text-sm md:text-md m-1 ">
                      Type of Internship
                    </p>
                    <p className="p-2 w-40 bg-blue-700 bg-opacity-20 text-sm md:text-md m-1">
                      {account.assignedInternship?.typeOfInternship === "SELF_PROVIDED" ? "Self Provided" : "MU provided"}
                    </p>
                  </div>
                  <div className="flex gap-0 items-center">
                    <p className="p-2 w-40 bg-blue-300 bg-opacity-40 text-sm md:text-md m-1 ">
                      Internship Status
                    </p>
                    <p className="p-2 w-40 bg-blue-700 bg-opacity-20 text-sm md:text-md m-1 capitalize">
                      {account.assignedInternshipStatus}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button className="bg-blue-gray-600 rounded-sm my-2"
                    onClick={() => setEditInternshipVisible(true)}
                  >
                    Edit Internship
                  </Button>
                  <Button loading={isNotifying} className="bg-blue-500 rounded-sm my-2 "
                    onClick={() => {handleNotifyStudent()}}
                  >
                    {!isNotifying ? <>Notify Student About Internship</> : <>Notifying</> }
                  </Button>
                </div>
              </div>
              :
              <div>
                <InternshipInputFormEdit account={account} setAccount={setAccount} setEditInternshipVisible={setEditInternshipVisible} />
              </div> 
          }
      </div>
    </div>
  )
}

export default ViewStudent;


const InternshipInputForm = ({account, setAccount}) => {
  const token = useSelector(state => state.user.token);
  const companyNameRef = useRef(null);
  const locationRef = useRef(null);

  const [IsSubmitting, setIsSubmitting] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState({
    companyName: "", location: ""
  });

  const validateInputs = () => {
    if(companyName === null || companyName.trim() === ""){
      setErrors({...errors, companyName: "Please Input The Company's Name."})
      return false;
    }
    if(location === null || location.trim() === ""){
      setErrors({...errors, location: "Please Input The Company's Location."})
      return false;
    }
    return true;
  }

  const handleAdd = async () => {
    if(!validateInputs()){
      return;
    }

    const requestObject = {
      username: account.username,
      companyName: companyName,
      location: location
    };
    console.log(requestObject);
    console.log("Adding internship!");

    setIsSubmitting(true);
    const addingToastId = toast.loading("Adding Internship..");
    toast.update(addingToastId, {closeButton: true});
    await sleep(1000);
    try {
      const response = await axios.post("/api/department-coordinator/add-self-internship",
        requestObject, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if(response.status === 200){
        console.log(response.data);
        toast.update(addingToastId, {
          render: "Successfully Added The internship!",
          type: "success",
          isLoading: false,
          autoClose: 1000
        });
        const addedIntership = response.data.internship;
        setAccount({...account, assignedInternship: addedIntership, assignedInternshipStatus: "Pending"});
      }
    }catch(error){
      console.log(error);
      toast.update(addingToastId, {
        render: "Some Unknown Error Occured!",
        type: "error", 
        isLoading: false,
        autoClose: 1000
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex w-72 flex-col gap-2 m-2">
        <h3 className="text-md text-gray-800 font-extrabold">Company Name</h3>
        <div className="relative group">
          <Input
            color="blue"
            label="Input Student's Company Name"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              setErrors({...errors, companyName: ""})
            }}
            inputRef={companyNameRef}
          />
          {errors.companyName && <span className="text-red-500 m-0 p-0 text-sm">{errors.companyName}</span>}
        </div>
      </div>
      <div className="flex w-72 flex-col gap-2 m-2">
        <h3 className="text-md text-gray-800 font-extrabold">Location</h3>
        <div className="relative group">
          <Input
            color="blue"
            label="Input The Company's Location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setErrors({...errors, location: ""})
            }}
            inputRef={locationRef}
          />
          {errors.location && <span className="text-red-500 m-0 p-0 text-sm">{errors.location}</span>}
        </div>
      </div>
      <div className="">
        <div className="flex w-max gap-4 m-2 mt-6">
          <Button loading={IsSubmitting} onClick={handleAdd} className="bg-blue-gray-500" >
            {!IsSubmitting ? <>Add Internship</> : <>Adding Internship</>}
          </Button>
        </div>
      </div>
    </div>
  )
}

const InternshipInputFormEdit = ({account, setAccount, setEditInternshipVisible}) => {
  const token = useSelector(state => state.user.token);
  const companyNameRef = useRef(null);
  const locationRef = useRef(null);

  const [IsSubmitting, setIsSubmitting] = useState(false);

  const [companyName, setCompanyName] = useState(account.assignedInternship?.companyName);
  const [location, setLocation] = useState(account.assignedInternship?.location);
  const [errors, setErrors] = useState({
    companyName: "", location: ""
  });

  const validateInputs = () => {
    if(companyName === null || companyName.trim() === ""){
      setErrors({...errors, companyName: "Please Input The Company's Name."})
      return false;
    }
    if(location === null || location.trim() === ""){
      setErrors({...errors, location: "Please Input The Company's Location."})
      return false;
    }
    return true;
  }

  const handleEdit = async () => {
    if(!validateInputs()){
      return;
    }

    const requestObject = {
      username: account.username,
      companyName: companyName,
      location: location
    };
    console.log(requestObject);
    console.log("Edit internship!");

    setIsSubmitting(true);
    const editingToastId = toast.loading("Confirming Edit of Internship..");
    toast.update(editingToastId, {closeButton: true});
    await sleep(1000);
    try {
      const response = await axios.post("/api/department-coordinator/edit-self-internship",
        requestObject, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if(response.status === 200){
        console.log(response.data);
        toast.update(editingToastId, {
          render: "Successfully Edited The internship!",
          type: "success",
          isLoading: false,
          autoClose: 1000
        });
        const addedIntership = response.data.internship;
        setAccount({...account, assignedInternship: addedIntership, assignedInternshipStatus: "Pending"});
        setEditInternshipVisible(false);
      }
    }catch(error){
      console.log(error);
      toast.update(editingToastId, {
        render: "Some Unknown Error Occured!",
        type: "error", 
        isLoading: false,
        autoClose: 1000
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex w-72 flex-col gap-2 m-2">
        <h3 className="text-md text-gray-800 font-extrabold">Company Name</h3>
        <div className="relative group">
          <Input
            color="blue"
            label="Edit Student's Company Name"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              setErrors({...errors, companyName: ""})
            }}
            inputRef={companyNameRef}
          />
          {errors.companyName && <span className="text-red-500 m-0 p-0 text-sm">{errors.companyName}</span>}
        </div>
      </div>
      <div className="flex w-72 flex-col gap-2 m-2">
        <h3 className="text-md text-gray-800 font-extrabold">Location</h3>
        <div className="relative group">
          <Input
            color="blue"
            label="Edit The Company's Location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setErrors({...errors, location: ""})
            }}
            inputRef={locationRef}
          />
          {errors.location && <span className="text-red-500 m-0 p-0 text-sm">{errors.location}</span>}
        </div>
      </div>
      <div className="">
        <div className="flex w-max gap-4 m-2 mt-6">
          <Button loading={IsSubmitting} onClick={handleEdit} className="bg-green-500 rounded-sm my-2" >
            {!IsSubmitting ? <>Confirm Edit</> : <>Confirming Edit</>}
          </Button>
          <Button className="bg-red-500 rounded-sm my-2"
            onClick={() => setEditInternshipVisible(false)}
          >
            Cancel Edit
          </Button>
        </div>
      </div>
    </div>
  )
}
