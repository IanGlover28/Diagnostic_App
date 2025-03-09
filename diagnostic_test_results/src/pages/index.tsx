import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import TestList from "../components/TestList";

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
      const response = await fetch("/api/tests");

      if (!response.ok) {
        throw new Error("Failed to fetch test results");
      }

      const data = await response.json();
      setTests(data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load test results. Please try again later.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a test result
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test result?")) {
      return;
    }

    try {
      const response = await fetch(`/api/tests/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete test result");
      }

      // Remove deleted test from state
      setTests((prev) => prev.filter((test) => test.id !== id));
    } catch (err: unknown) {
      console.error(err);
      alert("Failed to delete test result. Please try again.");
    }
  };

  // Load tests on component mount
  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <Head>
        <title>Diagnostic Test Results</title>
        <meta name="description" content="Diagnostic test results management system" />
      </Head>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 underline">Diagnostic Test Results</h1>
        <Link
          href="/new"
          className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2 text-white font-medium shadow-md hover:bg-indigo-700 transition-all duration-300"
        >
          + Add New Test
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-800 p-4 rounded-md shadow-md">
          <p>{error}</p>
          <button
            onClick={fetchTests}
            className="mt-2 text-sm font-medium underline hover:text-red-900"
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
