import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../AuthContext";

function AttendanceList() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [youthData, setYouthData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [updatePage, setUpdatePage] = useState(true);
  const [statusCounts, setStatusCounts] = useState({ present: 0, absent: 0, saved: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchAttendanceData();
    fetchYouthData();
  }, [updatePage]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`http://localhost:4000/api/attendance`);
      if (!response.ok) throw new Error("Failed to fetch attendance data");
      const data = await response.json();
      setAttendanceRecords(data);
      updateStatusCounts(data);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchYouthData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`http://localhost:4000/api/youth`);
      if (!response.ok) throw new Error("Failed to fetch youth data");
      const data = await response.json();
      setYouthData(data);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatusCounts = (records) => {
    const counts = { present: 0, absent: 0, saved: 0 };
    records.forEach(record => {
      if (record.status === 'present') counts.present++;
      else if (record.status === 'absent') counts.absent++;
      else if (record.status === 'saved') counts.saved++;
    });
    setStatusCounts(counts);
  };

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // Combine attendance records with youth data
  const combinedRecords = attendanceRecords.map(record => {
    const youth = youthData.find(y => y._id === record.youthId._id);
    return {
      ...record,
      youthFirstName: youth ? youth.firstName : 'Unknown',
      youthLastName: youth ? youth.lastName : 'Unknown',
    };
  });

  // Filter records based on the search query
  const filteredRecords = combinedRecords.filter(record =>
    record.youthFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.youthLastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        
        {/* Header */}
        <div className="flex justify-between pt-5 pb-3 px-3">
          <span className="font-bold text-lg">Attendance Records</span>
          <div className="flex gap-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
              onClick={handlePageUpdate}
            >
              Refresh Records
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="px-3">
          <input
            type="text"
            placeholder="Search by name..."
            className="border border-gray-300 rounded p-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Counts */}
        <div className="flex justify-between px-3">
          <span>Present: {statusCounts.present}</span>
          <span>Absent: {statusCounts.absent}</span>
          <span>Saved: {statusCounts.saved}</span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Youth First Name</th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Youth Last Name</th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Attendance Status</th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map(record => (
                    <tr key={record._id}>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-900">{record.youthFirstName}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{record.youthLastName}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{record.status}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{new Date(record.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">No attendance records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceList;
