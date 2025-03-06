// pages/tests/edit/[id].tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import TestForm from '../../../../components/TestForm';

type TestFormData = {
  patientName: string;
  testType: string;
  result: string;
  testDate: string;
  notes?: string;
};

export default function EditTest() {
  const router = useRouter();
  const { id } = router.query;
  
  const [test, setTest] = useState<TestFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch test data
  useEffect(() => {
    if (!id) return;
    
    const fetchTest = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/tests/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/404');
            return;
          }
          throw new Error('Failed to fetch test result');
        }
        
        const data = await response.json();
        
        // Format date for the form
        const formattedDate = new Date(data.testDate).toISOString().split('T')[0];
        
        setTest({
          ...data,
          testDate: formattedDate,
        });
      } catch (err: any) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load test result. Please try again later.';
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTest();
  }, [id, router]);
  
  // Handle form submission
  const handleSubmit = async (data: TestFormData) => {
    try {
      const response = await fetch(`/api/tests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update test result');
      }
      
      // Redirect to homepage on success
      router.push('/');
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating the test result';
      setError(errorMessage);
      console.error(err);
    }
  };
  
  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Head>
        <title>Edit Test Result</title>
        <meta name="description" content="Edit a diagnostic test result" />
      </Head>
      
      <div className="mb-6">
        <Link href="/">
          <a className="text-indigo-600 hover:text-indigo-800">
            &larr; Back to all tests
          </a>
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Test Result</h1>
      
      {error && (
        <div className="bg-red-50 p-4 mb-6 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {test && (
        <TestForm
          initialData={test}
          onSubmit={handleSubmit}
          buttonText="Update Test Result"
        />
      )}
    </div>
  );
}