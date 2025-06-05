import React, { useState, useEffect } from 'react';
import { FiBell, FiX } from 'react-icons/fi';
import { FaTag } from 'react-icons/fa';
import Tooltip from './Tooltip';
import whatsNewData from '../../data/whatsNewData';

// Convert whatsNewData to compatible format for checking viewed status
const FEATURE_UPDATES = whatsNewData.flatMap(release => {
  // Only mark the latest release as new
  const isLatestRelease = release.id === 1;
  
  return release.highlights.map(highlight => ({
    id: `${release.version}-${highlight.title.toLowerCase().replace(/\s+/g, '-')}`,
    title: highlight.title,
    description: highlight.description,
    date: release.date,
    isNew: isLatestRelease && highlight.tag === 'new'
  }));
});

/**
 * What's New Button Component
 * Shows a small button that opens a modal displaying recent feature updates
 */
const WhatsNewButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasNewFeatures, setHasNewFeatures] = useState(false);
  const [viewedFeatures, setViewedFeatures] = useState([]);

  // Check for unviewed new features on mount
  useEffect(() => {
    const storedViewedFeatures = localStorage.getItem('viewedFeatures');
    const parsedViewedFeatures = storedViewedFeatures ? JSON.parse(storedViewedFeatures) : [];
    setViewedFeatures(parsedViewedFeatures);
    
    // Check if there are any new features not yet viewed
    const hasUnviewedFeatures = FEATURE_UPDATES.some(
      feature => feature.isNew && !parsedViewedFeatures.includes(feature.id)
    );
    
    setHasNewFeatures(hasUnviewedFeatures);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    
    // Mark all features as viewed
    const newViewedFeatures = [
      ...viewedFeatures,
      ...FEATURE_UPDATES.filter(feature => feature.isNew).map(feature => feature.id)
    ];
    
    setViewedFeatures(newViewedFeatures);
    localStorage.setItem('viewedFeatures', JSON.stringify(newViewedFeatures));
    setHasNewFeatures(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Helper function to get tag color
  const getTagColor = (tag) => {
    switch (tag) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'improved': return 'bg-blue-100 text-blue-800';
      case 'fixed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Tooltip text="See what's new">
        <button
          className="relative p-2 text-gray-600 hover:text-primary focus:outline-none"
          onClick={openModal}
          aria-label="What's New"
        >
          <FiBell className="h-5 w-5" />
          {hasNewFeatures && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
          )}
        </button>
      </Tooltip>

      {/* What's New Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">What's New in AutoApply Pro</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  aria-label="Close"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-8">
                {whatsNewData.map(release => (
                  <div key={release.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{release.title}</h3>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-primary mr-2">{release.version}</span>
                        <span className="text-xs text-gray-500">{release.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{release.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {release.highlights.map((highlight, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center mb-2">
                            <h4 className="font-semibold text-gray-900">{highlight.title}</h4>
                            <span className={`ml-2 px-2 py-0.5 ${getTagColor(highlight.tag)} text-xs rounded-full flex items-center`}>
                              <FaTag className="mr-1 h-2 w-2" />
                              {highlight.tag}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{highlight.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 rounded-b-lg">
              <button
                onClick={closeModal}
                className="w-full py-2 px-4 bg-primary text-white rounded hover:bg-primary-dark focus:outline-none transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsNewButton;
