import { Button, Option, Select } from "@material-tailwind/react";
import { useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';
import { Tooltip } from "@material-tailwind/react";
import { sleep } from '../../../utils/otherUtils'



const MySwal = withReactContent(Swal);

const createNotification = async (
  title = "Notification",
  text = "This is a notification message."
) => {
  await MySwal.fire({
    title: title,
    text: text,
    icon: 'info', // You can change this to 'success', 'warning', etc.
    confirmButtonText: 'OK',
    customClass: {
      confirmButton: 'bg-blue-500 text-white px-4 py-2 rounded' // Custom class for styling
    }
  });
};

const AssignInternships = () => {

  const currentUser = useSelector(state => state.user.currentUser);

  const token = useSelector(state => state.user.token);

  const departmentRef = useRef(null);
  const [ department, setDepartment ] = useState('');

  const [isChecking, setIsChecking] = useState(false);
  const [gotCheckingResponse, setGotCheckingResponse] = useState(false);

  const [ isAssigningStudents, setIsAssigningStudents ] = useState(false);
  const [ temporaryPlacements, setTemporaryPlacements] = useState(null);
  const [ gotTemporaryPlacementResults, setGotTemporaryPlacementResults] = useState(false);
  
  const [ errors, setErrors ] = useState({
    amount: "", department: "", typeUser: "", username: ""
  });

  const [isAssigningPossible, setIsAssigningPossible ] = useState(false);

  const handleDepartmentChange = (val) => {
    setDepartment(val);
    setGotCheckingResponse(false);
  }

  const handleChecking = async () => {
    setIsChecking(true);
    const checkingToastId = toast.loading("Checking Students of "+department+" department...");
    toast.update(checkingToastId, {closeButton: true});
    try{
      const response = await axios.get("/api/head-coordinator/check-all-students-applied?department="+department, {
        headers: {
          'authorization' : `Bearer ${token}`
        }
      });
      if(response.status === 200){
        if(response.data === true){
          toast.dismiss(checkingToastId);
          await createNotification("Possible", "It possible to start the student to internship placement process.");
          setIsAssigningPossible(true);
        }
        else {
          setIsAssigningPossible(false);
          toast.dismiss(checkingToastId);
          await createNotification("Not Possible", "All Students haven't applied, please notify them first.");
        }
      }
      setGotCheckingResponse(true);
    }catch(error){
      console.log(error);
      toast.update(checkingToastId, {
        render: "There Was An error while checking, please try again later.",
        type: "error", 
        isLoading: false,
        autoClose: 1000
      })
    }finally {
      setIsChecking(false);
    }
  }

  const handleStartAssignment = async () => {
    setIsAssigningStudents(true);
    const assigningToastId = toast.loading("Processing Students and Internships...");
    toast.update(assigningToastId, {closeButton: true});
    try {
      const response = await axios.post("/api/head-coordinator/apply-internships?department="+department, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      });
      toast.update(assigningToastId, {
        render: "Successfully processed Applications",
        type: "success", 
        autoClose: 2000,
        isLoading: false
      })
      console.log(response.data.temporaryPlacementsEssentials);
      setGotTemporaryPlacementResults(true);
      setTemporaryPlacements(response.data.temporaryPlacements);
    }catch(error){
      console.log(error);
      toast.update(assigningToastId, {
        render: "There was an error while, processing!",
        type: "error", 
        autoClose: 2000,
        isLoading: false
      });
    }finally {
      setIsAssigningStudents(false);
    }
    
  }
  const [notifying, setNotifying] = useState(false);

  const handleNotifyStudentsToApply = async () => {
    console.log("the department is "+department);
    const notifyingToastId = toast.loading("Notifying Students...");
    toast.update(notifyingToastId, {closeButton: true});
    await sleep(1000);
    try {
      setNotifying(true);
      const response = axios.post("/api/head-coordinator/notify-students-to-apply?department="+department+"&senderUsername="+currentUser.username, {
        headers: {
          "authorization": `Bearer ${token}`
        }
      });
      console.log(response.data);
      toast.update(notifyingToastId, {
        render: "Successfully notified students",
        type: "success", 
        isLoading: false,
        closeButton: true
      })
    }catch(error){
      console.log(error);
      toast.update(notifyingToastId, {
        render: "There was an error while, processing!",
        type: "error", 
        autoClose: 2000,
        isLoading: false,
        closeButton: true
      });
    }finally {
      // do somehting
      setNotifying(false);
    }
  }


  return (
    <div className="m-3">
      <div className="flex justify-center">
        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold bg-blue-300 bg-opacity-20 rounded-xl shadow-lg text-blue-gray-700 p-3 w-auto inline-block">
          Assign Internships
        </h1>
      </div>
      <div className="my-6">
        <p 
          className="my-3 text-gray-700 text-sm md:text-base bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded-md shadow-md max-w-max"
        >
          You can automatically assign students to internships here. First choose department and check if all students have applied and then click assign.
        </p> 
      </div>
      {!gotTemporaryPlacementResults ?
        <div className="">
          <div className="m-2">
            <h3 className="text-md text-gray-800 font-extrabold">Department</h3>
            <div className="w-72 m-2">
              <div className="relative group">
                <Select 
                  label="Select department"
                  value={department}
                  onChange={(val) => {
                    handleDepartmentChange(val);
                  }}
                  ref={departmentRef}
                >
                  <Option value="CHEMICAL">Chemical Engineering</Option>
                  <Option value="MECHANICAL">Mechanical Engineering</Option>
                  <Option value="INDUSTRIAL">Industrial Engineering</Option>
                  <Option value="CIVIL">Civil Engineering</Option>
                  <Option value="ELECTRICAL">Electrical Engineering</Option>
                  <Option value="ARCHITECUTRE">Architecture</Option>
                </Select>
                {errors.department && <span className="text-red-500 m-0 p-0 text-sm">{errors.department}</span>}
              </div>
            </div>
          </div>
          <div className="m-2 mt-4 ml-4">
            <Button loading={isChecking} onClick={() => handleChecking()} disabled={department === '' ? true : false} className="bg-blue-300">Check All Student Applications</Button>
          </div>
          { !!gotCheckingResponse && 
            <div className="m-4">
              { isAssigningPossible ?
                <div> {/* here we will assign students and then display the result */}
                  <Button loading={isAssigningStudents} onClick={() => handleStartAssignment()} className="bg-green-400">
                    Start Student Assignment
                  </Button>
                </div>
                :
                <div> {/* #TODO add a notification for this department to apply */}
                  <Button loading={notifying} onClick={() => {handleNotifyStudentsToApply()}} className="bg-red-400">Notify Students to Apply!</Button>
                </div>
              }
            </div>
          }
        </div>
        :
        <div>
          {gotTemporaryPlacementResults && 
            <>
              <Button onClick={() => {setGotTemporaryPlacementResults(false)}} className="bg-deep-orange-500">
                Back
              </Button>
              <TemporaryPlacementsTable temporaryPlacements={temporaryPlacements} department={department}/>
            </>
          }
        </div>
      }
    </div>
  )
}

export default AssignInternships

const TemporaryPlacementsTable = ({ temporaryPlacements, department }) => {
  const token = useSelector(state => state.user.token);
  // Step 1: Create a map to track the number of students assigned to each internship
  const initialInternshipCounts = temporaryPlacements.reduce((acc, placement) => {
    const internshipId = placement.internshipOpportunity.uniqueIdentifier;
    acc[internshipId] = (acc[internshipId] || 0) + 1;
    return acc;
  }, {});
  const [copiedPlacements, setCopiedPlacements] = useState(JSON.parse(JSON.stringify(temporaryPlacements)));
  const [internshipCounts, setInternshipCounts] = useState(initialInternshipCounts);
  const [showEditColumn, setShowEditColumn] = useState(false);

  // Step 2: Handle internship selection change
  const handleInternshipChange = (placementIndex, selectedId) => {
    const placement = copiedPlacements[placementIndex];
    const currentInternshipId = placement.internshipOpportunity.uniqueIdentifier;

    // Check if selected internship has reached its capacity
    const selectedOpportunity = placement.student.internshipApplications.find(
      app => app.internshipOpportunity.uniqueIdentifier === selectedId
    ).internshipOpportunity;

    if (internshipCounts[selectedId] >= selectedOpportunity.noOfStudents) {
      alert("This internship opportunity "+selectedOpportunity.companyName+" has reached its capacity.");
      return;
    }

    // Update internship counts
    setInternshipCounts(prevCounts => ({
      ...prevCounts,
      [currentInternshipId]: prevCounts[currentInternshipId] - 1,
      [selectedId]: (prevCounts[selectedId] || 0) + 1,
    }));

    // Update the placement's internshipOpportunity
    //and the student's associated priority of that opportunity
    placement.internshipOpportunity = selectedOpportunity;
    console.log("slelected opportunity is "+selectedOpportunity.uniqueIdentifier);
    let priority = placement.priority;
    for(let i = 0; i < placement.student.internshipApplications.length; i++){
      let internshipOpportunity = placement.student.internshipApplications[i].internshipOpportunity;
      console.log(internshipOpportunity.uniqueIdentifier);
      if(internshipOpportunity.uniqueIdentifier === selectedOpportunity.uniqueIdentifier){
        priority = placement.student.internshipApplications[i].priority;
      }
    }
    placement.priority = priority;
    
  };

  // Function to toggle edit mode and show/hide the selection column
  const toggleEditMode = () => setShowEditColumn(!showEditColumn);

  // Function to cancel edit, reset internship counts and hide the selection column
  const cancelEdit = () => {
    setCopiedPlacements(JSON.parse(JSON.stringify(temporaryPlacements)));
    setInternshipCounts(initialInternshipCounts); // Reset internship counts
    setShowEditColumn(false); // Hide edit column
  };

  const [confirming, setIsConfirming] = useState(false);
  const [notificationOption, setNotificationOption] = useState(false);
  const handleConfirmPlacement = async () => {
    setIsConfirming(true);
    const confirmingToastId = toast.loading("Confirming Placements please wait....");
    toast.update(confirmingToastId, {closeButton: true});
    try {
      const response = await axios.put("/api/head-coordinator/confirm-placements?department="+department, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      });
      toast.update(confirmingToastId, {
        render: "Successfully Confirmed Placements",
        type: "success", 
        autoClose: 2000,
        isLoading: false
      })
      setNotificationOption(true);
    }catch(error){
      console.log(error);
      toast.update(confirmingToastId, {
        render: "There was an error while, confirming",
        type: "error", 
        autoClose: 2000,
        isLoading: false
      });
    }finally {
      setIsConfirming(false);
    }
  }

  const handleApplyAndConfirmPlacement = async () => {
    console.log("apply and confirming...")
    const extractedData = copiedPlacements.map(placement => ({
      studentUsername: placement.student.username,
      internshipOpportunityUniqueIdentifier: placement.internshipOpportunity.uniqueIdentifier,
      priority: placement.priority
    }));

    let filteredData = [];
    for(let i = 0; i < temporaryPlacements.length; i++){
      if(extractedData[i].priority !== temporaryPlacements[i].priority){
        filteredData.push(extractedData[i]);
      }
    }
        
    console.log("Extracted Placement Data:", extractedData);

    setIsConfirming(true);
    const confirmingToastId = toast.loading("Confirming Placements please wait....");
    toast.update(confirmingToastId, {closeButton: true});
    try {
      const response = await axios.put("/api/head-coordinator/apply-changes-to-placements",filteredData, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      });
      toast.update(confirmingToastId, {
        render: "Successfully Confirmed Placements",
        type: "success", 
        autoClose: 2000,
        isLoading: false
      })
      setNotificationOption(true);
    }catch(error){
      console.log(error);
      toast.update(confirmingToastId, {
        render: "There was an error while, confirming",
        type: "error", 
        autoClose: 2000,
        isLoading: false
      });
    }finally {
      setIsConfirming(false);
    }


  }

  return (
    <div className="overflow-x-auto bg-blue-50 bg-opacity-30 backdrop-blur-md rounded-lg shadow-lg p-6">
      {!notificationOption ?
        <>
          <div className="flex justify-between gap-2 flex-wrap">
            <div>
              { !showEditColumn ?
                <button disabled={confirming} onClick={handleConfirmPlacement} className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200">
                  Confirm Placements
                </button>
                :
                <button disabled={confirming} onClick={handleApplyAndConfirmPlacement} className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200">
                  Apply Changes and Confirm Placements
                </button>
              }
              
            </div>
            <div className="flex justify-end mb-4">
              {showEditColumn ? (
                <button onClick={cancelEdit} className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition duration-200">
                  Cancel Edit
                </button>
              ) : (
                <button onClick={toggleEditMode} className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200">
                  Edit Placements
                </button>
              )}
            </div>
          </div>

          <table className="min-w-full table-auto border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-white bg-blue-500 bg-opacity-50">
                <th className="px-6 py-4 border border-blue-200">Student</th>
                <th className="px-6 py-4 border border-blue-200">Student Grade</th>
                <th className="px-6 py-4 border border-blue-200">Matched Internship</th>
                <th className="px-6 py-4 border border-blue-200">Student's Preference(Priority)</th>
                {showEditColumn && (
                  <th className="px-6 py-4 border border-blue-200">Change Internship</th>
                )}
              </tr>
            </thead>
            <tbody>
              {copiedPlacements?.map((placement, index) => (
                <tr
                  key={index}
                  className="bg-white bg-opacity-60 hover:bg-opacity-80 transition duration-200"
                >
                  <td className="px-6 py-4 border border-blue-200">
                    <Tooltip
                      content={
                        <>
                          <p>Username: {placement.student.username}</p>
                          <p>Email: {placement.student.email}</p>
                          <div>
                            Student's Internship Applications:
                            <ul>
                              {placement.student.internshipApplications.map(
                                (app, i) => (
                                  <li key={i}>
                                    {app.internshipOpportunity.companyName} -{" "}
                                    Priority {app.priority}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </>
                      }
                      placement="top"
                      delay={1000}
                      animate={{ mount: { scale: 1 }, unmount: { scale: 0 } }}
                      className="rounded-lg shadow-lg p-2 bg-white text-gray-800"
                    >
                      <span className="cursor-pointer text-black font-semibold">
                        {placement.student.firstName} {placement.student.lastName}
                      </span>
                    </Tooltip>
                  </td>

                  <td className="px-6 py-4 border border-blue-200">
                    {placement.student.grade}
                  </td>

                  <td className="px-6 py-4 border border-blue-200">
                    <Tooltip
                      content={
                        <>
                          <p>Location: {placement.internshipOpportunity.location}</p>
                          <p>Filled: {internshipCounts[placement.internshipOpportunity.uniqueIdentifier]}/{placement.internshipOpportunity.noOfStudents} Students</p>
                        </>
                      }
                      placement="top"
                      delay={1000}
                      animate={{ mount: { scale: 1 }, unmount: { scale: 0 } }}
                      className="rounded-lg shadow-lg p-2 bg-white text-gray-800"
                    >
                      <span className="cursor-pointer text-blue-600 font-semibold">
                        {placement.internshipOpportunity.companyName}
                      </span>
                    </Tooltip>
                  </td>

                  <td className="px-6 py-4 border border-blue-200 text-center">
                    {placement.priority}
                  </td>

                  {showEditColumn && (
                    <td className="px-6 py-4 border border-blue-200 text-center">
                      <select
                        value={placement.internshipOpportunity.uniqueIdentifier}
                        onChange={(e) => handleInternshipChange(index, e.target.value)}
                        className="rounded-lg p-2 border border-blue-300 bg-white"
                      >
                        {placement.student.internshipApplications.map(app => (
                          <option
                            key={app.internshipOpportunity.uniqueIdentifier}
                            value={app.internshipOpportunity.uniqueIdentifier}
                          >
                            {app.internshipOpportunity.companyName} ({internshipCounts[app.internshipOpportunity.uniqueIdentifier] || 0}/{app.internshipOpportunity.noOfStudents})
                          </option>
                        ))}
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
        :
        <div>
          <Button className="bg-green-400">
            Notify Students About Placements
          </Button>
        </div>

      }
    </div>
  );
};

// #TODO don't forget to add instructions here because it can be confusing.