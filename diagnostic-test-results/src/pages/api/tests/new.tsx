// pages/tests/new.tsx
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import TestForm from '../../../components/TestForm';

type TestFormData = {
  patientName: string;
  testType: string;
  result: string;
  testDate: string;
  notes?: string;
};

export default function NewTest() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (data: TestFormData) => {
    try {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create test result');
      }
      
      // Redirect to homepage on success
      router.push('/');
    } catch (err: any) {
      // Properly type the error
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating the test result';
      setError(errorMessage);
      console.error(err);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Head>
        <title>Add New Test Result</title>
        <meta name="description" content="Add a new diagnostic test result" />
      </Head>
      
      <div className="mb-6">
        <Link href="/">
          <a className="text-indigo-600 hover:text-indigo-800">
            &larr; Back to all tests
          </a>
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Test Result</h1>
      
      {error && (
        <div className="bg-red-50 p-4 mb-6 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <TestForm
        onSubmit={handleSubmit}
        buttonText="Create Test Result"
      />
    </div>
  );
}