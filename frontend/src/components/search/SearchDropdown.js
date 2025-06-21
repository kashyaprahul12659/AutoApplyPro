import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MagnifyingGlassIcon,
  DocumentIcon,
  BriefcaseIcon,
  UserIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';

/**
 * Enhanced Search Dropdown Component
 * Provides global search functionality across the app
 */
const SearchDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { apiCall } = useApi();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Perform search
  const performSearch = useCallback(async (searchQuery) => {
    try {
      setLoading(true);
      const response = await apiCall('/api/search', {
        params: { q: searchQuery, limit: 10 }
      });
      setResults(response.data.data || []);
    } catch (error) {
      console.error('Error performing search:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // Debounced search
  useEffect(() => {
    if (query.length > 2) {
      const timeoutId = setTimeout(() => {
        performSearch(query);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [query, performSearch]);

  // Handle search input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (!isOpen) setIsOpen(true);
  };

  // Handle search submission
  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));

      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  // Handle result click
  const handleResultClick = (result) => {
    const searchTerm = result.title || result.name || result.company;
    handleSearch(searchTerm);

    // Navigate to specific result if URL available
    if (result.url) {
      navigate(result.url);
    }
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Get icon for search result type
  const getResultIcon = (type) => {
    switch (type) {
      case 'resume':
        return <DocumentIcon className="w-4 h-4 text-blue-500" />;
      case 'job':
        return <BriefcaseIcon className="w-4 h-4 text-green-500" />;
      case 'user':
        return <UserIcon className="w-4 h-4 text-purple-500" />;
      case 'analytics':
        return <ChartBarIcon className="w-4 h-4 text-orange-500" />;
      default:
        return <DocumentIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  // Quick actions/shortcuts
  const quickActions = [
    { id: 'job-tracker', label: 'Job Tracker', url: '/job-tracker', icon: BriefcaseIcon },
    { id: 'resume-builder', label: 'Resume Builder', url: '/resume-builder', icon: DocumentIcon },
    { id: 'analytics', label: 'Analytics', url: '/analytics', icon: ChartBarIcon },
    { id: 'profile', label: 'Profile Settings', url: '/profile', icon: UserIcon }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Search Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
          }
        }}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
        aria-label="Search"
      >
        <MagnifyingGlassIcon className="w-5 h-5" />
      </button>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                  if (e.key === 'Escape') {
                    setIsOpen(false);
                  }
                }}
                placeholder="Search jobs, resumes, analytics..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <span className="mt-2 block">Searching...</span>
              </div>
            ) : query.length > 2 ? (
              results.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Search Results
                  </div>
                  {results.map((result) => (
                    <button
                      key={result._id || result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {getResultIcon(result.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {result.title || result.name || result.company}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {result.description || result.location || result.type}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No results found</p>
                  <p className="text-sm">Try different keywords</p>
                </div>
              )
            ) : (
              <div className="py-2">
                {/* Quick Actions */}
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Quick Actions
                </div>
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      navigate(action.url);
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <action.icon className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-900">{action.label}</span>
                    </div>
                  </button>
                ))}

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center justify-between">
                      Recent Searches
                      <button
                        onClick={clearRecentSearches}
                        className="text-blue-600 hover:text-blue-700 normal-case font-medium"
                      >
                        Clear
                      </button>
                    </div>
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => handleSearch(search)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <ClockIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{search}</span>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {query.length > 2 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button
                onClick={() => handleSearch()}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Search for "{query}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
