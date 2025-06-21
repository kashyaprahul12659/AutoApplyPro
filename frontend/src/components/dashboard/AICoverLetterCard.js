import React from 'react';
import { Link } from 'react-router-dom';

const AICoverLetterCard = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-white bg-opacity-20 rounded-full p-2">
            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="ml-3 text-xl font-bold text-white">AI Cover Letter Generator</h2>
        </div>

        <p className="text-indigo-100 mb-6">
          Create customized cover letters tailored to specific job descriptions using AI. Save time and increase your chances of landing interviews.
        </p>

        <ul className="mb-6 space-y-2">
          <li className="flex items-center text-indigo-100">
            <svg className="h-5 w-5 mr-2 text-indigo-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Tailored to job descriptions
          </li>
          <li className="flex items-center text-indigo-100">
            <svg className="h-5 w-5 mr-2 text-indigo-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Matches your skills and experience
          </li>
          <li className="flex items-center text-indigo-100">
            <svg className="h-5 w-5 mr-2 text-indigo-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Professional formatting
          </li>
        </ul>

        <Link
          to="/coverletter"
          className="block w-full bg-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-indigo-500 text-center"
        >
          Generate Cover Letter
        </Link>
      </div>
    </div>
  );
};

export default AICoverLetterCard;
