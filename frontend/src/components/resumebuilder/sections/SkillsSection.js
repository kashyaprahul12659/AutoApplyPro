import React, { useState } from 'react';
import { FiPlus, FiX, FiEdit3 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import * as resumeBuilderService from '../../../services/resumeBuilderService';

const SkillsSection = ({ data, onUpdate, targetRole }) => {
  const [skills, setSkills] = useState(data.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showJdInput, setShowJdInput] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    const updatedSkills = [...skills, newSkill.trim()];
    setSkills(updatedSkills);
    onUpdate({ skills: updatedSkills });
    setNewSkill('');
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    onUpdate({ skills: updatedSkills });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSuggestSkills = async () => {
    if (!jobDescription.trim()) {
      toast.warning('Please enter a job description to suggest skills');
      return;
    }

    try {
      setIsSuggesting(true);
      toast.info('Suggesting skills based on job description...');

      const response = await resumeBuilderService.improveResumeBlock(
        'skills',
        skills.join(', '),
        targetRole,
        jobDescription
      );

      if (response.success) {
        const suggestedSkillsText = response.data.improved;
        // Split by commas and clean up each skill
        const suggestedSkills = suggestedSkillsText
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0);

        // Merge with existing skills, remove duplicates
        const updatedSkills = [...new Set([...skills, ...suggestedSkills])];
        setSkills(updatedSkills);
        onUpdate({ skills: updatedSkills });
        setShowJdInput(false);
        setJobDescription('');
        toast.success('Skills suggested successfully!');
      }
    } catch (error) {
      console.error('Error suggesting skills:', error);
      toast.error('Failed to suggest skills');
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border border-gray-200 rounded-lg p-3 min-h-[100px]">
        {skills.length === 0 ? (
          <div className="text-gray-400 w-full text-center pt-2">
            Add your skills below
          </div>
        ) : (
          skills.map((skill, index) => (
            <div 
              key={index} 
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
            >
              <span>{skill}</span>
              <button 
                onClick={() => handleRemoveSkill(index)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <FiX size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a skill..."
        />
        <button
          onClick={handleAddSkill}
          className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
        >
          <FiPlus />
        </button>
      </div>

      {showJdInput ? (
        <div className="space-y-2">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the job description here..."
            rows="4"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSuggestSkills}
              disabled={isSuggesting}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
            >
              {isSuggesting ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Suggesting...
                </>
              ) : (
                'Suggest Skills'
              )}
            </button>
            <button
              onClick={() => setShowJdInput(false)}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowJdInput(true)}
          className="w-full px-3 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 flex items-center justify-center"
        >
          <FiEdit3 className="mr-2" />
          Suggest skills based on Job Description
        </button>
      )}

      <div className="text-sm text-gray-500">
        <p>Tips:</p>
        <ul className="list-disc pl-5">
          <li>Include a mix of technical and soft skills</li>
          <li>Add industry-specific skills relevant to your target role</li>
          <li>List skills in order of relevance or proficiency</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillsSection;
