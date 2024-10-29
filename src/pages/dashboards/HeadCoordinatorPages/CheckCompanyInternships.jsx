import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Loader from '../../../components/Loader';
import { sleep } from '../../../utils/otherUtils';
import { Button } from '@material-tailwind/react';
import { toast } from 'react-toastify';

const CheckCompanyInternships = () => {
  const [internships, setInternships] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const token = useSelector(state => state.user.token);

  useEffect (() => {
    const fetchInternships = async () => {
      setIsFetching(true); 
      await sleep(1000);       
      try {
        const response = await axios.get('/api/head-coordinator/get-company-filled-internships', {
          headers: {
            'authorization' : `Bearer ${token}`
          }
        });
        console.log(response.data);
        setInternships(response.data.internships);
      }catch (error){
        console.log(error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchInternships();
    

  }, [])

  return (
    <div className="m-3">
      <div className="flex justify-center">
        <h1 className=" mt-6 md:mt-3 mb-6 p-6 md:p-4 text-sm md:text-lg lg:text-xl font-semibold bg-blue-300 bg-opacity-20 rounded-xl shadow-lg text-blue-gray-700 max-w-max">
          Approve Company Internships
        </h1>
      </div>
      <div className="flex gap-3 justify-between items-center flex-wrap my-4">
        <p 
          className="my-3 text-gray-700 text-sm md:text-base bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded-md shadow-md max-w-max"
        >
          To approve an internship fill in the green approve circle and same for the reject circle. You can then confirm approval.
        </p> 
      </div>
      { isFetching ?
        <Loader message='Fetching Company Filled Internships'/>
        :
        internships === null || internships?.length < 1 ?
        <div className="flex justify-center mt-6">
          <h1 className="m-3 mt-6 md:mt-3 mb-6 p-6 md:p-4 text-sm md:text-lg lg:text-xl font-semibold bg-red-400 bg-opacity-30 rounded-xl shadow-lg text-blue-gray-700 max-w-max">
            No Internship Submissions have been found.
          </h1>
        </div>
        :
        <div>
          <p 
            className="my-1 mb-3 text-gray-700 text-sm md:text-base bg-red-200 border-l-4 border-red-500 px-4 py-2 rounded-md shadow-md max-w-max"
          >
            Warning! Rejected Internships Will be Removed from the database. But Non-Rejected Will not be deleted.
          </p> 
          <InternshipsTable internships={internships} />
        </div>
      }
    </div>
  )
}

export default CheckCompanyInternships;


const InternshipsTable = ({ internships }) => {
  const token = useSelector(state => state.user.token);
  const [isSending, setIsSending] = useState(false);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const [ finishedApproval, setFinishedApproval] = useState(false);

  const handleApprove = (id) => {
    setApproved((prev) => [...prev, id]);
    setRejected((prev) => prev.filter((item) => item !== id));
    setErrorMessage(null); // Clear error when any action is taken
  };

  const handleReject = (id) => {
    setRejected((prev) => [...prev, id]);
    setApproved((prev) => prev.filter((item) => item !== id));
    setErrorMessage(null); // Clear error when any action is taken
  };

  const handleConfirmApprovals = async () => {
    if (approved.length === 0 && rejected.length === 0) {
      setErrorMessage("Please approve or reject at least one internship.");
      return;
    }

    const approvedInternships = internships.filter((internship) =>
      approved.includes(internship.id)
    ).map((internship) => {return {...internship, department: internship.department.department}});;

    const rejectedInternships = internships.filter((internship) => 
      rejected.includes(internship.id)
    ).map((internship) => {return {...internship, department: internship.department.department}});

    const requestObject = {
      "approved" : approvedInternships,
      "rejected" : rejectedInternships
    }
    const sendingToastId = toast.loading("Sending Approvals...");
    toast.update(sendingToastId, {closeButton: true});
    await sleep(1000);
    try {
      
      const response = await axios.post("/api/head-coordinator/approve-company-filled-internships", requestObject, {
        headers: {
          "authorization" : `Bearer ${token}`
        }
      });
      if(response.status === 200){
        toast.update(sendingToastId, {
          render: "Approved The Internships Success!", 
          type: "success", 
          isLoading: false,
          autoClose: 2000
        })
      }
      console.log(response.data)
      setFinishedApproval(true);
    }catch(error) {
      console.log(error);
      toast.update(sendingToastId, {
        render: "Some Error Occured", 
        type: "error", 
        isLoading: false,
        autoClose: 2000
      });
    } finally {
      setIsSending(false);
    }



    console.log("Approved Internships:", approvedInternships);
    console.log("Rejected INternships: ", rejectedInternships);
  };

  const handleConfirmAll = async () => {
    const fixedInternship = internships.map((internship) => {
      return {...internship, department: internship.department.department};
    });
    const requestObject = {
      "approved" : fixedInternship,
      "rejected" : []
    };
    const sendingToastId = toast.loading("Sending Approvals...");
    toast.update(sendingToastId, {closeButton: true});
    await sleep(1000);
    try {
      
      const response = await axios.post("/api/head-coordinator/approve-company-filled-internships", requestObject, {
        headers: {
          "authorization" : `Bearer ${token}`
        }
      });
      if(response.status === 200){
        toast.update(sendingToastId, {
          render: "Approved The Internships Success!", 
          type: "success", 
          isLoading: false,
          autoClose: 2000
        })
      }
      console.log(response.data)
      setFinishedApproval(true);
      
    }catch(error) {
      console.log(error);
      toast.update(sendingToastId, {
        render: "Some Error Occured", 
        type: "error", 
        isLoading: false,
        autoClose: 2000
      });
    } finally {
      setIsSending(false);
    }

  }

  return (
    <div className="overflow-x-auto">
      { finishedApproval ?
        <div className="flex justify-center mt-6">
          <h1 className="m-3 mt-6 md:mt-3 mb-6 p-6 md:p-4 text-sm md:text-lg lg:text-xl font-semibold bg-green-400 bg-opacity-30 rounded-xl shadow-lg text-blue-gray-700 max-w-max">
           Finished Approvals!
          </h1>
        </div>
        :
        <>
          <table className="min-w-full bg-white bg-opacity-30 backdrop-blur-md rounded-md overflow-hidden shadow-md text-blue-gray-700">
            <thead className="bg-blue-500 bg-opacity-50">
              <tr>
                <th className="py-3 px-5 text-left text-sm font-semibold text-white uppercase">Company Name</th>
                <th className="py-3 px-5 text-left text-sm font-semibold text-white uppercase">Location</th>
                <th className="py-3 px-5 text-left text-sm font-semibold text-white uppercase">Department</th>
                <th className="py-3 px-5 text-left text-sm font-semibold text-white uppercase">No. of Students</th>
                <th className="py-3 px-5 text-left text-sm font-semibold text-white uppercase">Pocket Money</th>
                <th className="py-3 px-5 text-left text-sm font-semibold text-white uppercase">Approve</th>
                <th className="py-3 px-5 text-left text-sm font-semibold text-white uppercase">Reject</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {internships.map((internship, index) => {
                const isApproved = approved.includes(internship.id);
                const isRejected = rejected.includes(internship.id);
                const rowClasses = isApproved
                  ? 'bg-green-100 bg-opacity-70'
                  : isRejected
                  ? 'bg-red-200 bg-opacity-50'
                  : index % 2 === 0
                  ? 'bg-blue-50 bg-opacity-20'
                  : 'bg-blue-200 bg-opacity-10';

                return (
                  <tr key={internship.id} className={`${rowClasses} hover:bg-blue-100 transition`}>
                    <td className="py-4 px-5">{internship.companyName}</td>
                    <td className="py-4 px-5">{internship.location}</td>
                    <td className="py-4 px-5">{internship.department.name}</td>
                    <td className="py-4 px-5">{internship.noOfStudents}</td>
                    <td className="py-4 px-5">{internship.pocketMoney ? 'Yes' : 'No'}</td>
                    <td className="py-4 px-5 text-center">
                      <button
                        className={`w-8 h-8 rounded-full ${
                          isApproved ? 'bg-green-500' : 'bg-gray-300 hover:bg-green-500'
                        }`}
                        onClick={() => handleApprove(internship.id)}
                      ></button>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <button
                        className={`w-8 h-8 rounded-full ${
                          isRejected ? 'bg-red-500' : 'bg-gray-300 hover:bg-red-500'
                        }`}
                        onClick={() => handleReject(internship.id)}
                      ></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {errorMessage && (
            <div className="mt-4 p-3 rounded-md bg-red-200 text-red-700 text-center font-semibold">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center gap-3 my-3">
              <Button
                className="bg-green-500"
                onClick={handleConfirmApprovals}
                loading={isSending}
              >
                Confirm Approvals
              </Button>
              <Button className="bg-blue-500" onClick={handleConfirmAll} loading={isSending}>
                Approve All
              </Button>
          </div>
        </>

      }
    </div>
  );
};






