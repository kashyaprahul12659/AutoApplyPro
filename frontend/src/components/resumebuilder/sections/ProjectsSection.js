import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiEdit3 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import * as resumeBuilderService from '../../../services/resumeBuilderService';

const ProjectsSection = ({ data, onUpdate }) => {
  const [items, setItems] = useState(data.items || []);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isImproving, setIsImproving] = useState(false);
  const [improvingIndex, setImprovingIndex] = useState(null);

  // Default empty project item
  const emptyItem = {
    title: '',
    technologies: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    link: ''
  };

  const handleAddItem = () => {
    const updatedItems = [...items, { ...emptyItem }];
    setItems(updatedItems);
    onUpdate({ items: updatedItems });
    setExpandedIndex(updatedItems.length - 1);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    onUpdate({ items: updatedItems });

    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleUpdateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    // If "current" is checked, clear the end date
    if (field === 'current' && value === true) {
      updatedItems[index].endDate = '';
    }

    setItems(updatedItems);
    onUpdate({ items: updatedItems });
  };

  const handleToggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleMoveItem = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === items.length - 1)
    ) {
      return;
    }

    const updatedItems = [...items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    [updatedItems[index], updatedItems[newIndex]] = [updatedItems[newIndex], updatedItems[index]];

    setItems(updatedItems);
    onUpdate({ items: updatedItems });

    if (expandedIndex === index) {
      setExpandedIndex(newIndex);
    } else if (expandedIndex === newIndex) {
      setExpandedIndex(index);
    }
  };

  const handleImproveWithAI = async (index) => {
    const item = items[index];

    if (!item.description.trim()) {
      toast.warning('Please add a description to improve');
      return;
    }

    try {
      setIsImproving(true);
      setImprovingIndex(index);
      toast.info('Improving project description with AI...');

      const response = await resumeBuilderService.improveResumeBlock(
        'project',
        item.description
      );

      if (response.success) {
        const improvedDescription = response.data.improved;
        handleUpdateItem(index, 'description', improvedDescription);
        toast.success('Project description improved successfully!');
      }
    } catch (error) {
      console.error('Error improving project description:', error);
      toast.error('Failed to improve project description with AI');
    } finally {
      setIsImproving(false);
      setImprovingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
          No projects added yet
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div
                className="bg-gray-50 p-3 flex justify-between items-center cursor-pointer"
                onClick={() => handleToggleExpand(index)}
              >
                <div>
                  <div className="font-medium">
                    {item.title || 'New Project'}
                  </div>
                  {item.technologies && (
                    <div className="text-sm text-gray-600">
                      {item.technologies}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveItem(index, 'up');
                    }}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    title="Move Up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveItem(index, 'down');
                    }}
                    className="p-1 text-gray-500 hover:text-gray-700"
                    title="Move Down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(index);
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                  {expandedIndex === index ? (
                    <FiChevronUp size={20} />
                  ) : (
                    <FiChevronDown size={20} />
                  )}
                </div>
              </div>

              {expandedIndex === index && (
                <div className="p-3 space-y-3 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. E-commerce Website"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Technologies Used
                      </label>
                      <input
                        type="text"
                        value={item.technologies}
                        onChange={(e) => handleUpdateItem(index, 'technologies', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. React, Node.js, MongoDB"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="month"
                          value={item.startDate}
                          onChange={(e) => handleUpdateItem(index, 'startDate', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="month"
                          value={item.endDate}
                          onChange={(e) => handleUpdateItem(index, 'endDate', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={item.current}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Link (Optional)
                      </label>
                      <input
                        type="url"
                        value={item.link}
                        onChange={(e) => handleUpdateItem(index, 'link', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. https://github.com/username/project"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`current-project-${index}`}
                        checked={item.current}
                        onChange={(e) => handleUpdateItem(index, 'current', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`current-project-${index}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        This is an ongoing project
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the project, your role, and achievements..."
                      rows="4"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleImproveWithAI(index)}
                      disabled={isImproving}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm"
                    >
                      {isImproving && improvingIndex === index ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          Improving...
                        </>
                      ) : (
                        <>
                          <FiEdit3 className="mr-1" />
                          Improve with AI
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleAddItem}
          className="px-3 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 flex items-center"
        >
          <FiPlus className="mr-1" />
          Add Project
        </button>
      </div>

      <div className="text-sm text-gray-500">
        <p>Tips:</p>
        <ul className="list-disc pl-5">
          <li>Focus on projects relevant to your target role</li>
          <li>Highlight your technical skills and problem-solving abilities</li>
          <li>Quantify results and impact when possible</li>
          <li>Include links to GitHub repositories or live demos when available</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectsSection;
