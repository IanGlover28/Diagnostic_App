import { useRouter } from 'next/router';
import TestForm from '../components/TestForm';

const NewTestPage = () => {
  const router = useRouter();

  const handleFormSubmit = async (data: { patientName: string; testType: string; result: string; testDate: string; notes?: string }) => {
    try {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add test result');
      }

      const result = await response.json();
      console.log('Test added successfully:', result);

      alert('Test result added successfully!');

      // Redirect to test list page after submission
      router.push('/'); 
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Error submitting test');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Add New Test</h1>
      <TestForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default NewTestPage;
