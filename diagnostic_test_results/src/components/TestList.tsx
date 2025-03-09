// src/components/TestList.tsx

import React from 'react';
import Link from 'next/link';

interface TestListProps {
  tests: { id: string; patientName: string; testType: string; result: string; testDate: string; notes?: string }[];
  onDelete: (id: string) => void; 
}

const TestList: React.FC<TestListProps> = ({ tests, onDelete }) => {
  return (
    <div className="max-w-7xl mx-auto py-6">
      <h2 className="text-xl font-semibold text-gray-700">Test Results</h2>
      <table className="min-w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Patient Name</th>
            <th className="px-4 py-2 border">Test Type</th>
            <th className="px-4 py-2 border">Result</th>
            <th className="px-4 py-2 border">Test Date</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={test.id}>
              <td className="px-4 py-2 border">{test.patientName}</td>
              <td className="px-4 py-2 border">{test.testType}</td>
              <td className="px-4 py-2 border">{test.result}</td>
              <td className="px-4 py-2 border">{test.testDate}</td>
              <td className="px-4 py-2 border space-x-2">
              <Link href={`/tests/edit/${test.id}`}>
  <button>Edit</button>
</Link>

                <button
                  onClick={() => onDelete(test.id)} // Call the onDelete function with the test id
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestList;
