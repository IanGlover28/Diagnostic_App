import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import TestList from '../components/TestList';

type DiagnosticTest = {
  id: string; 
  patientName: string;
  testType: string;
  result: string;
  testDate: string;
  notes?: string;
};

export default function Home() {
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all test results
  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tests');

      if (!response.ok) {
        throw new Error('Failed to fetch test results');
      }

      const data = await response.json();
      setTests(data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load test results. Please try again later.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a test result
  const handleDelete = async (id: string) => {  
    if (!confirm('Are you sure you want to delete this test result?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tests/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete test result');
      }

      // Remove deleted test from state
      setTests((prev) => prev.filter((test) => test.id !== id));
    } catch (err: any) {
      console.error(err);
      alert('Failed to delete test result. Please try again.');
    }
  };

  // Load tests on component mount
  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Head>
        <title>Diagnostic Test Results</title>
        <meta name="description" content="Diagnostic test results management system" />
      </Head>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Diagnostic Test Results</h1>
        <Link
          href="/new"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add New Test
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading test results...</p> 
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchTests}
            className="mt-2 text-sm text-red-700 underline hover:text-red-800"
          >
            Try again
          </button>
        </div>
      ) : (
        <TestList tests={tests} onDelete={handleDelete} />
      )}
    </div>
  );
}
