import { Button, Option, Select, Tooltip } from '@material-tailwind/react';
import { useState } from 'react';
import { DEPARTMENTS } from '../../../data/departments';
import sendApiRequest from '../../../utils/apiUtils';
import { useSelector } from 'react-redux';

import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun
} from "docx";
import { saveAs } from 'file-saver';

const ViewPlacements = () => {
  const token = useSelector(state => state.user.token);
  const [ isFetching, setIsFetching] = useState(false);
  const [department, setDepartment] = useState('');

  const [ gotTemporaryPlacementResults, setGotTemporaryPlacementResults] = useState(false);
  const [ temporaryPlacements, setTemporaryPlacements] = useState(null)
  const [errors, setErrors] = useState({
    department: ""
  });

  const handleDepartmentChange = (value) => {
    setDepartment(value);
  }

  const handleFetch = async () => {
    setIsFetching(true);
    await sendApiRequest({
      url: `/api/head-coordinator/get-internship-placements?department=${department}`,
      method: 'GET',
      startMessage: "Fetching Internship Placements...",
      token, // pass the token to automatically include in headers
      successMessage: "Successfully Fetched",
      errorMessage: "There was an error while processing!",
      onSuccess: (data) => {
        console.log(data.temporaryPlacements);
        setGotTemporaryPlacementResults(true);
        setTemporaryPlacements(data.temporaryPlacements);
      },
      onError: (error) => console.log(error),
      onFinally: () => setIsFetching(false)
    });
  }


  return (
    <div className="m-3">
      <h1 className=" mt-6 md:mt-3 mb-6 p-6 md:p-4 text-sm md:text-lg lg:text-xl font-semibold bg-blue-300 bg-opacity-20 rounded-xl shadow-lg text-blue-gray-700 max-w-max">
        View Students Internship Placements
      </h1>
      <div className="flex gap-3 justify-between items-center flex-wrap my-4">
        <p 
          className="my-3 text-gray-700 text-sm md:text-base bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded-md shadow-md max-w-max"
        >
          Choose a Department and then click view Placements.
        </p> 
      </div>
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
            >
              {DEPARTMENTS.map((dept) => (
                <Option key={dept.value} value={dept.value}>
                  {dept.label}
                </Option>
              ))}
            </Select>
            {errors.department && <span className="text-red-500 m-0 p-0 text-sm">{errors.department}</span>}
          </div>
        </div>
      </div>
      <div className="m-2 mt-4 ml-4">
        <Button loading={isFetching} onClick={() => handleFetch()} disabled={department === '' ? true : false} className="bg-blue-300">
          View Placements
        </Button>
      </div>
      { !!gotTemporaryPlacementResults &&
        <div>
          <TemporaryPlacementsTable temporaryPlacements={temporaryPlacements} department={department} />
        </div>
      }
    </div>
  )
}

export default ViewPlacements

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
    await sendApiRequest({
      url: `/api/head-coordinator/confirm-placements?department=${department}`,
      method: "PUT",
      startMessage: "Confirming Placements please wait....",
      token,
      successMessage: "Successfully Confirmed Placements",
      errorMessage: "There was an error while confirming",
      onSuccess: () => {
        setNotificationOption(true);
      },
      onError: (error) => console.log(error),
      onFinally: () => setIsConfirming(false)
    });
  };
  

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

    await sendApiRequest({
      url: "/api/head-coordinator/apply-changes-to-placements",
      method: "PUT",
      requestBody: filteredData,
      startMessage: "Confirming Placements please wait....",
      token,
      successMessage: "Successfully Confirmed Placements",
      errorMessage: "There was an error while confirming",
      onSuccess: () => {
        setNotificationOption(true);
      },
      onError: (error) => console.log(error),
      onFinally: () => setIsConfirming(false)
    });
  }

  const handleGenerateDocx = async () => {

    // const doc = new Document();

    // temporaryPlacements.forEach((item) => {
    //   const student = "abcd";
    //   const companyName = "abcd";
    //   const department = "abcd";

    //   // Template text for each student's letter
    //   const letterContent = [
    //     new Paragraph({
    //       children: [
    //         new TextRun({ text: `Dear ${companyName},`, bold: true, break: 2 }),
    //         new TextRun({
    //           text: `We are pleased to inform you that ${student.firstName} ${student.lastName}, from the ${department} department, has been selected for an internship with your esteemed company, ${companyName}. We appreciate your support in offering valuable practical experience to our students.`,
    //           break: 2,
    //         }),
    //         new TextRun({
    //           text: `Please assist ${student.firstName} in maximizing their learning experience during their internship.`,
    //           break: 2,
    //         }),
    //         new TextRun({
    //           text: 'Thank you for your cooperation.',
    //           break: 2,
    //         }),
    //         new TextRun({
    //           text: 'Sincerely,',
    //           break: 2,
    //         }),
    //         new TextRun({
    //           text: 'University Placement Office',
    //           break: 2,
    //         }),
    //       ],
    //     }),
    //   ];

    //   // Add each letter content as a new section (page)
    //   doc.addSection({
    //     properties: {},
    //     children: letterContent,
    //   });
    // });

    // // Generate and download the DOCX file
    // const blob = await Packer.toBlob(doc);
    // saveAs(blob, 'internship_letters.docx');
    const doc = new Document({
      sections: temporaryPlacements.map((entry) => ({
        properties: {},
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: "Internship Securing Student",
                bold: true,
                size: 32,
              }),
            ],
          }),

          // Blank line for spacing
          new Paragraph({
            children: [new TextRun("")],
          }),

          // Main paragraph for the student information
          new Paragraph({
            children: [
              new TextRun({
                text: `This student, ${entry.student.firstName} ${entry.student.lastName}, from the department of ${entry.student.department.name}, has secured an internship at ${entry.internshipOpportunity.companyName}.`,
              }),
            ],
          }),

          // Additional paragraph for a generic message
          new Paragraph({
            children: [
              new TextRun(
                "We kindly ask for your support in assisting the student as they complete their internship with your company."
              ),
            ],
          }),
        ],
      })),
    });


    // Generate the DOCX file as a Blob and save it
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'sample_document.docx');
  };

  return (
    <div className="overflow-x-auto bg-blue-50 bg-opacity-30 backdrop-blur-md rounded-lg shadow-lg p-6">
      {!notificationOption ?
        <>
          <div className="flex justify-between gap-2 flex-wrap">
            <div className="my-2">
                <button onClick={handleGenerateDocx} className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200">
                  Generate Letters
                </button>
              {/* { !showEditColumn ?
                <button disabled={confirming} onClick={handleConfirmPlacement} className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200">
                  Confirm Placements
                </button>
                :
                <button disabled={confirming} onClick={handleApplyAndConfirmPlacement} className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200">
                  Apply Changes and Confirm Placements
                </button>
              } */}
              
            </div>
            <div className="flex justify-end mb-4">
              {/* {showEditColumn ? (
                <button onClick={cancelEdit} className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition duration-200">
                  Cancel Edit
                </button>
              ) : (
                <button onClick={toggleEditMode} className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200">
                  Edit Placements
                </button>
              )} */}
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
