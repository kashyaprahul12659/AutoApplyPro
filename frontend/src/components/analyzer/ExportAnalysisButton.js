import React from 'react';
import { FaFileDownload } from 'react-icons/fa';

const ExportAnalysisButton = ({ analysis }) => {
  const downloadCSV = () => {
    if (!analysis) return;

    // Format the matched skills and missing skills into comma-separated strings
    const matchedSkills = analysis.matchedSkills.join(', ');
    const missingSkills = analysis.missingSkills.join(', ');

    // Create CSV content
    const csvContent = [
      ['Job Analysis Report'],
      ['Generated on', new Date(analysis.createdAt).toLocaleString()],
      [''],
      ['Job Title', analysis.jobTitle],
      ['Match Score', `${analysis.matchScore}%`],
      [''],
      ['Matched Skills', matchedSkills],
      ['Missing Skills', missingSkills],
      [''],
      ['Suggestions'],
      ...analysis.suggestions.map(suggestion => [suggestion])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Set up download attributes
    link.setAttribute('href', url);
    link.setAttribute('download', `job-analysis-${analysis.jobTitle.replace(/\s+/g, '-').toLowerCase()}.csv`);

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={downloadCSV}
      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      title="Export as CSV"
    >
      <FaFileDownload className="mr-2" />
      Export Results
    </button>
  );
};

export default ExportAnalysisButton;
