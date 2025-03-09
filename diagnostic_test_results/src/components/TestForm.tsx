import React, { useState, useEffect } from 'react';

interface TestFormProps {
  test?: { id: number; patientName: string; testType: string; result: string; testDate: string; notes?: string };
  initialData?: { patientName: string; testType: string; result: string; testDate: string; notes?: string };
  onSubmit: (data: { patientName: string; testType: string; result: string; testDate: string; notes?: string }) => void;
  buttonText: string;
}

const TestForm: React.FC<TestFormProps> = ({ test, initialData, onSubmit }) => {
  const [patientName, setPatientName] = useState<string>(initialData?.patientName || test?.patientName || '');
  const [testType, setTestType] = useState<string>(initialData?.testType || test?.testType || '');
  const [result, setResult] = useState<string>(initialData?.result || test?.result || '');
  const [testDate, setTestDate] = useState<string>(initialData?.testDate || test?.testDate || '');
  const [notes, setNotes] = useState<string>(initialData?.notes || test?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ patientName, testType, result, testDate, notes });
  };

  // Automatically set the form state based on the test prop when it changes
  useEffect(() => {
    if (test) {
      setPatientName(test.patientName);
      setTestType(test.testType);
      setResult(test.result);
      setTestDate(test.testDate);
      setNotes(test.notes || '');
    }
  }, [test]);

  useEffect(() => {
    if (initialData) {
      setPatientName(initialData.patientName);
      setTestType(initialData.testType);
      setResult(initialData.result);
      setTestDate(initialData.testDate);
      setNotes(initialData.notes || '');
    }
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4 bg-white shadow-md rounded">
      <div>
        <label className="block text-sm font-medium text-gray-700">Patient Name</label>
        <input
          type="text"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Test Type</label>
        <input
          type="text"
          value={testType}
          onChange={(e) => setTestType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Result</label>
        <input
          type="text"
          value={result}
          onChange={(e) => setResult(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Test Date</label>
        <input
          type="date"
          value={testDate}
          onChange={(e) => setTestDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {test ? 'Update Test' : 'Add Test'}
      </button>
    </form>
  );
};

export default TestForm;
