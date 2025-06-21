import React, { useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import * as resumeBuilderService from '../../../services/resumeBuilderService';

const SummarySection = ({ data, onUpdate, targetRole }) => {
  const [text, setText] = useState(data.text || '');
  const [isImproving, setIsImproving] = useState(false);

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    onUpdate({ text: newText });
  };

  const handleImproveWithAI = async () => {
    if (!text.trim()) {
      toast.warning('Please add some content to improve');
      return;
    }

    try {
      setIsImproving(true);
      toast.info('Improving summary with AI...');

      const response = await resumeBuilderService.improveResumeBlock(
        'summary',
        text,
        targetRole
      );

      if (response.success) {
        const improvedText = response.data.improved;
        setText(improvedText);
        onUpdate({ text: improvedText });
        toast.success('Summary improved successfully!');
      }
    } catch (error) {
      console.error('Error improving summary:', error);
      toast.error('Failed to improve summary with AI');
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={text}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write a professional summary that highlights your qualifications, experience, and career goals..."
          rows="5"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleImproveWithAI}
          disabled={isImproving}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm"
        >
          {isImproving ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              Improving...
            </>
          ) : (
            <>
              <FiEdit3 className="mr-1" />
              Improve with AI
              {targetRole ? ` for ${targetRole}` : ''}
            </>
          )}
        </button>
      </div>

      <div className="text-sm text-gray-500">
        <p>Tips:</p>
        <ul className="list-disc pl-5">
          <li>Keep your summary concise (3-5 sentences)</li>
          <li>Focus on your most relevant skills and experiences</li>
          <li>Tailor it to your target role</li>
          <li>Include quantifiable achievements when possible</li>
        </ul>
      </div>
    </div>
  );
};

export default SummarySection;
