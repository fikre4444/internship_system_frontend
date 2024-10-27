import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { sleep } from '../../../utils/otherUtils';
import { toast } from 'react-toastify';
import BigMessage from '../../../components/BigMessage';
import Loader from '../../../components/Loader';
import { Button } from '@material-tailwind/react';

const ApplyInternships = () => {
  const token = useSelector((state) => state.user.token);
  const account = useSelector((state) => state.user.currentUser);

  const [fetchingInternships, setFetchingInternships] = useState(true);
  const [internships, setInternships] = useState([]);
  const [priorities, setPriorities] = useState({});
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchInternships = async () => {
      const requestUrl = `/api/student/get-internships?username=${account.username}`;
      const fetchingToastId = toast.loading("Fetching Internships...");
      await sleep(1000);

      try {
        const response = await axios.get(requestUrl, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        toast.update(fetchingToastId, {
          render: "Successfully Fetched Available Internships.",
          type: "success",
          autoClose: 2000,
          isLoading: false,
        });
        setInternships(response.data);
      } catch (error) {
        toast.update(fetchingToastId, {
          render: "There was an error while fetching",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        console.log(error);
      } finally {
        setFetchingInternships(false);
      }
    };

    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchInternships();
  }, []);

  const handlePriorityChange = (e, uniqueIdentifier) => {
    const newPriority = parseInt(e.target.value, 10);
    const maxPriority = internships.length;

    setError(null);

    if (newPriority < 1 || newPriority > maxPriority) {
      setError(`Priority must be between 1 and ${maxPriority}.`);
      setPriorities((prev) => ({ ...prev, [uniqueIdentifier]: "" }));
      return;
    }

    if (Object.values(priorities).includes(newPriority)) {
      setError(`Priority ${newPriority} is already taken.`);
      setPriorities((prev) => ({ ...prev, [uniqueIdentifier]: "" }));
      return;
    }

    setPriorities((prev) => ({ ...prev, [uniqueIdentifier]: newPriority }));
  };

  const handleSubmit = async () => {
    const applications = Object.entries(priorities).map(([uniqueIdentifier, priority]) => ({
      internshipOpportunityUniqueIdentifier: uniqueIdentifier,
      priority: priority,
    }));

    const applicationObject = {
      username: account.username,
      applications: applications,
    };

    setIsSubmitting(true);
    const submittingToastId = toast.loading("Submitting Applications...");
    toast.update(submittingToastId, { closeButton: true });
    await sleep(1000);
    try {
      const requestUrl = "/api/student/apply-internships";
      const response = await axios.post(requestUrl, applicationObject, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 && response.data.result === "success") {
        console.log(response.data);
        toast.update(submittingToastId, {
          render: response.data.message,
          type: "success",
          autoClose: 2000,
          isLoading: false,
        });
        setIsSubmitted(true);
      }
    } catch (error) {
      console.log(error);
      toast.update(submittingToastId, {
        render: "There was an error while submitting the applications.",
        type: "error",
        autoClose: 2000,
        isLoading: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="m-3">
      <div className="flex justify-center mx-auto my-3">
        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold bg-blue-300 bg-opacity-20 rounded-xl shadow-lg text-blue-gray-700 p-3 w-auto inline-block">
          Posted Internships
        </h1>
      </div>
      <div className="flex gap-3 justify-between items-center flex-wrap my-4">
        <p className="my-3 text-gray-700 text-sm md:text-base bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded-md shadow-md max-w-max">
          You can apply to these by inputting a priority number into the input box. 1 has higher priority than 2.
        </p>
      </div>

      {fetchingInternships ? (
        <Loader message="Fetching Internships" />
      ) : (
        <div className="overflow-auto bg-blue-50 bg-opacity-20 shadow-lg rounded-lg">
          <table className="min-w-full text-center">
            <thead>
              <tr className="bg-blue-200 text-blue-gray-700">
                <th className="py-2 px-4 border-b-2">Company Name</th>
                <th className="py-2 px-4 border-b-2">Location</th>
                <th className="py-2 px-4 border-b-2">No. of Students</th>
                <th className="py-2 px-4 border-b-2">Pocket Money</th>
                <th className="py-2 px-4 border-b-2">Priority</th>
              </tr>
            </thead>
            <tbody>
              {internships.map((internship) => (
                <tr key={internship.uniqueIdentifier} className="bg-white bg-opacity-20 hover:bg-blue-100 transition">
                  <td className="py-2 px-4 border-b">{internship.companyName}</td>
                  <td className="py-2 px-4 border-b">{internship.location}</td>
                  <td className="py-2 px-4 border-b">{internship.noOfStudents}</td>
                  <td className="py-2 px-4 border-b">{internship.pocketMoney ? "Yes" : "No"}</td>
                  <td className="py-2 px-4 border-b">
                    {isSubmitted ? (
                      priorities[internship.uniqueIdentifier] || "-"
                    ) : (
                      <input
                        type="number"
                        min="1"
                        max={internships.length}
                        value={priorities[internship.uniqueIdentifier] || ""}
                        onChange={(e) => handlePriorityChange(e, internship.uniqueIdentifier)}
                        className="w-16 p-1 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && (
        <div className="bg-red-500 text-white text-sm rounded mt-3 p-2 shadow-lg">
          {error}
        </div>
      )}

      <div className="flex justify-start my-5">
        <Button
          disabled={isSubmitted || isSubmitting}
          onClick={handleSubmit}
          className="bg-green-300 text-black hover:bg-teal-600 transition duration-300"
        >
          {isSubmitting ? "Submitting!" : "Submit Applications"}
        </Button>
      </div>
    </div>
  );
};

export default ApplyInternships;
