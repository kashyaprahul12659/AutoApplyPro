import React from 'react';
import { format } from 'date-fns';
import EmptyState from '../common/EmptyState';

const CoverLetterHistory = ({ coverLetters, isLoading, onView, onDelete }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!coverLetters || coverLetters.length === 0) {
    return (
      <EmptyState
        type="coverletter"
        title="No Cover Letters Yet"
        message="Create personalized cover letters tailored to each job you apply for. Our AI will help you highlight relevant skills and experience."
        actionText="Generate a Cover Letter"
        onAction={() => window.location.href = '/cover-letter-generator'}
        className="bg-white shadow-md"
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Cover Letters</h2>

      <div className="grid grid-cols-1 gap-4">
        {coverLetters.map((letter) => (
          <div key={letter._id} className="border rounded-lg p-4 hover:border-primary transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-800">{letter.jobTitle}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Created: {format(new Date(letter.createdAt), 'MMM dd, yyyy')}
                </p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {letter.descriptionSnippet}
                </p>

                {letter.keywords && letter.keywords.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {letter.keywords.slice(0, 5).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                    {letter.keywords.length > 5 && (
                      <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full">
                        +{letter.keywords.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onView(letter)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit cover letter"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this cover letter?')) {
                      onDelete(letter._id);
                    }
                  }}
                  className="text-red-600 hover:text-red-800"
                  title="Delete cover letter"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => onView(letter)}
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                View & Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoverLetterHistory;
