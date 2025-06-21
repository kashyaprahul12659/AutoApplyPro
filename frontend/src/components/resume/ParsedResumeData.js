import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const ParsedResumeData = ({ resumeId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: [],
    education: [],
    experience: []
  });
  const [newSkill, setNewSkill] = useState('');

  // Fetch parsed data on component mount
  useEffect(() => {
    const fetchParsedData = async () => {
      try {
        setLoading(true);
        // Try to get existing parsed data first
        try {
          const existingDataRes = await axios.get('/api/resumes/parsed-data');
          setFormData({
            name: existingDataRes.data.data.name || '',
            email: existingDataRes.data.data.email || '',
            phone: existingDataRes.data.data.phone || '',
            skills: existingDataRes.data.data.skills || [],
            education: existingDataRes.data.data.education || [],
            experience: existingDataRes.data.data.experience || []
          });
          setLoading(false);
          return;
        } catch (err) {
          // If no parsed data exists, trigger parsing
          if (err.response?.status === 404 && resumeId) {
            // Parse the resume
            const parseRes = await axios.post(`/api/resumes/${resumeId}/parse`);
            setFormData({
              name: parseRes.data.data.name || '',
              email: parseRes.data.data.email || '',
              phone: parseRes.data.data.phone || '',
              skills: parseRes.data.data.skills || [],
              education: parseRes.data.data.education || [],
              experience: parseRes.data.data.experience || []
            });

            toast.success('Resume parsed successfully! Review & confirm your details.');
          } else {
            console.error('Error fetching parsed data:', err);
            toast.error('Error parsing resume. Please try again.');
          }
        }
      } catch (err) {
        console.error('Error in parsing flow:', err);
        toast.error('Error processing resume. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchParsedData();
  }, [resumeId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle skill changes
  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  // Handle education changes
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };

    setFormData({
      ...formData,
      education: updatedEducation
    });
  };

  const handleAddEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { degree: '', institution: '', year: '' }
      ]
    });
  };

  const handleRemoveEducation = (index) => {
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);

    setFormData({
      ...formData,
      education: updatedEducation
    });
  };

  // Handle experience changes
  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    };

    setFormData({
      ...formData,
      experience: updatedExperience
    });
  };

  const handleAddExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { company: '', role: '', duration: '' }
      ]
    });
  };

  const handleRemoveExperience = (index) => {
    const updatedExperience = [...formData.experience];
    updatedExperience.splice(index, 1);

    setFormData({
      ...formData,
      experience: updatedExperience
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const res = await axios.put('/api/resumes/parsed-data', formData);

      toast.success('Profile data updated successfully!');

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Error updating profile data:', err);
      toast.error('Error updating profile data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Extracting data from your resume...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Resume Data</h2>
          <p className="text-sm text-gray-500">Review and confirm extracted information</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-3">Skills</h3>
            <div className="mb-2">
              <div className="flex">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="input flex-grow mr-2"
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill, index) => (
                <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {formData.skills.length === 0 && (
                <p className="text-sm text-gray-500">No skills added yet</p>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-700">Education</h3>
              <button
                type="button"
                onClick={handleAddEducation}
                className="text-sm text-primary hover:text-blue-700"
              >
                + Add Education
              </button>
            </div>
            {formData.education.length === 0 ? (
              <p className="text-sm text-gray-500">No education details added yet</p>
            ) : (
              <div className="space-y-4">
                {formData.education.map((edu, index) => (
                  <div key={index} className="border rounded-md p-4 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      &times;
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                        <input
                          type="text"
                          value={edu.degree || ''}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                        <input
                          type="text"
                          value={edu.institution || ''}
                          onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <input
                          type="text"
                          value={edu.year || ''}
                          onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                          className="input"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-700">Work Experience</h3>
              <button
                type="button"
                onClick={handleAddExperience}
                className="text-sm text-primary hover:text-blue-700"
              >
                + Add Experience
              </button>
            </div>
            {formData.experience.length === 0 ? (
              <p className="text-sm text-gray-500">No work experience added yet</p>
            ) : (
              <div className="space-y-4">
                {formData.experience.map((exp, index) => (
                  <div key={index} className="border rounded-md p-4 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      &times;
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company || ''}
                          onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input
                          type="text"
                          value={exp.role || ''}
                          onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          value={exp.duration || ''}
                          onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                          className="input"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end mt-6">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline mr-3"
                disabled={saving}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParsedResumeData;
