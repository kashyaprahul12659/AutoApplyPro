import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const CertificationsSection = ({ data, onUpdate }) => {
  const [items, setItems] = useState(data.items || []);
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Default empty certification item
  const emptyItem = {
    name: '',
    issuer: '',
    date: '',
    expirationDate: '',
    noExpiration: false,
    credentialID: '',
    credentialURL: '',
    description: ''
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

    // If "noExpiration" is checked, clear the expiration date
    if (field === 'noExpiration' && value === true) {
      updatedItems[index].expirationDate = '';
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

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
          No certifications added yet
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
                    {item.name || 'New Certification'}
                  </div>
                  {item.issuer && (
                    <div className="text-sm text-gray-600">
                      {item.issuer}
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
                        Certification Name *
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. AWS Certified Solutions Architect"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Issuing Organization *
                      </label>
                      <input
                        type="text"
                        value={item.issuer}
                        onChange={(e) => handleUpdateItem(index, 'issuer', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Amazon Web Services"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Issue Date
                      </label>
                      <input
                        type="month"
                        value={item.date}
                        onChange={(e) => handleUpdateItem(index, 'date', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration Date
                      </label>
                      <input
                        type="month"
                        value={item.expirationDate}
                        onChange={(e) => handleUpdateItem(index, 'expirationDate', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={item.noExpiration}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`no-expiration-${index}`}
                        checked={item.noExpiration}
                        onChange={(e) => handleUpdateItem(index, 'noExpiration', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`no-expiration-${index}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        This certification does not expire
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Credential ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={item.credentialID}
                        onChange={(e) => handleUpdateItem(index, 'credentialID', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. ABC123456"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Credential URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={item.credentialURL}
                        onChange={(e) => handleUpdateItem(index, 'credentialURL', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. https://www.credential.net/..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Additional details about this certification..."
                      rows="3"
                    />
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
          Add Certification
        </button>
      </div>

      <div className="text-sm text-gray-500">
        <p>Tips:</p>
        <ul className="list-disc pl-5">
          <li>Include certifications relevant to your target role</li>
          <li>List your most prestigious or in-demand certifications first</li>
          <li>Add credential URLs when available for verification</li>
          <li>Include expiration dates if the certification requires renewal</li>
        </ul>
      </div>
    </div>
  );
};

export default CertificationsSection;
