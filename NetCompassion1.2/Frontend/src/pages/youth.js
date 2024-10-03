import React, { useState, useEffect, useContext } from "react";
import AddYouth from "../components/AddYouth";
import AuthContext from "../AuthContext";

function YouthComponent() {
  const [showYouthModal, setShowYouthModal] = useState(false);
  const [youths, setYouthsData] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [ageRange, setAgeRange] = useState({ min: 0, max: 22 });
  const [searchQuery, setSearchQuery] = useState("");
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchYouthData();
  }, [updatePage]);

  const fetchYouthData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`http://localhost:4000/api/youth`);
      if (!response.ok) throw new Error("Failed to fetch youth data");
      const data = await response.json();
      setYouthsData(data);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleYouthModal = () => {
    setShowYouthModal(!showYouthModal);
  };

  const handlePageUpdate = () => {
    setUpdatePage((prev) => !prev);
  };

  // Function to filter youths by age and search query
  const filteredYouths = youths.filter((youth) => {
    const age = new Date().getFullYear() - new Date(youth.birthday).getFullYear();
    const matchesAgeRange = age >= ageRange.min && age <= ageRange.max;
    const matchesSearchQuery = youth.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                youth.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAgeRange && matchesSearchQuery;
  });

  // Age range buttons
  const ageRanges = [
    { label: '0-2 years', min: 0, max: 2 },
    { label: '3-5 years', min: 3, max: 5 },
    { label: '6-10 years', min: 6, max: 10 },
    { label: '11-15 years', min: 11, max: 15 },
    { label: '16-20 years', min: 16, max: 20 },
    { label: '21-22 years', min: 21, max: 22 },
  ];

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {showYouthModal && (
          <AddYouth
            toggleYouthModal={toggleYouthModal}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}

        {/* Header */}
        <div className="flex justify-between pt-5 pb-3 px-3">
          <span className="font-bold">Youth Management</span>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
            onClick={toggleYouthModal}
          >
            Add Youth
          </button>
        </div>
        
        {/* Search Input */}
        <div className="mb-4 px-3">
          <input
            type="text"
            placeholder="Search by first or last name..."
            className="border border-gray-300 rounded p-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Age Range Buttons */}
        <div className="flex space-x-2 mb-4">
          {ageRanges.map((range) => (
            <button
              key={range.label}
              className={`p-2 rounded ${ageRange.min === range.min && ageRange.max === range.max ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => setAgeRange({ min: range.min, max: range.max })}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">First Name</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Last Name</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Birthday</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Address</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Education Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredYouths.map((youth) => (
                <tr key={youth._id}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">{youth.firstName}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{youth.lastName}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{new Date(youth.birthday).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{youth.address}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{youth.educationLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default YouthComponent;
