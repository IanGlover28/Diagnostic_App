// components/TestForm.tsx
import React, { useState } from 'react';
import { z } from 'zod';

// Schema for form validation
const TestSchema = z.object({
  patientName: z.string().min(1, { message: "Patient name is required" }),
  testType: z.string().min(1, { message: "Test type is required" }),
  result: z.string().min(1, { message: "Result is required" }),
  testDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  notes: z.string().optional(),
});

type TestFormData = z.infer<typeof TestSchema>;

type TestFormProps = {
  initialData?: Partial<TestFormData>;
  onSubmit: (data: TestFormData) => Promise<void>;
  buttonText: string;
};

const TestForm: React.FC<TestFormProps> = ({ initialData = {}, onSubmit, buttonText }) => {
  const [formData, setFormData] = useState<Partial<TestFormData>>({
    patientName: '',
    testType: '',
    result: '',
    testDate: new Date().toISOString().split('T')[0],
    notes: '',
    ...initialData,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Validate form data
      const validatedData = TestSchema.parse(formData);
      
      // Submit data
      await onSubmit(validatedData);
      
      // Clear form if it's for creating a new test
      if (!initialData.patientName) {
        setFormData({
          patientName: '',
          testType: '',
          result: '',
          testDate: new Date().toISOString().split('T')[0],
          notes: '',
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
          Patient Name
        </label>
        <input
          type="text"
          id="patientName"
          name="patientName"
          value={formData.patientName || ''}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.patientName ? 'border-red-500' : ''
          }`}
        />
        {errors.patientName && (
          <p className="mt-1 text-sm text-red-600">{errors.patientName}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="testType" className="block text-sm font-medium text-gray-700">
          Test Type
        </label>
        <select
          id="testType"
          name="testType"
          value={formData.testType || ''}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.testType ? 'border-red-500' : ''
          }`}
        >
          <option value="">Select a test type</option>
          <option value="Blood Test">Blood Test</option>
          <option value="Urine Test">Urine Test</option>
          <option value="X-Ray">X-Ray</option>
          <option value="MRI">MRI</option>
          <option value="CT Scan">CT Scan</option>
          <option value="Ultrasound">Ultrasound</option>
          <option value="Other">Other</option>
        </select>
        {errors.testType && (
          <p className="mt-1 text-sm text-red-600">{errors.testType}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="result" className="block text-sm font-medium text-gray-700">
          Result
        </label>
        <input
          type="text"
          id="result"
          name="result"
          value={formData.result || ''}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.result ? 'border-red-500' : ''
          }`}
        />
        {errors.result && (
          <p className="mt-1 text-sm text-red-600">{errors.result}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="testDate" className="block text-sm font-medium text-gray-700">
          Test Date
        </label>
        <input
          type="date"
          id="testDate"
          name="testDate"
          value={formData.testDate || ''}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.testDate ? 'border-red-500' : ''
          }`}
        />
        {errors.testDate && (
          <p className="mt-1 text-sm text-red-600">{errors.testDate}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Processing...' : buttonText}
        </button>
      </div>
    </form>
  );
};

export default TestForm;