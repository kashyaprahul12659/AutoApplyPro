import React from 'react';

/**
 * Base skeleton component for loading states
 */
export const Skeleton = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4', 
  rounded = 'rounded' 
}) => {
  return (
    <div 
      className={`${width} ${height} ${rounded} bg-gray-200 animate-pulse ${className}`}
      role="presentation"
      aria-label="Loading..."
    />
  );
};

/**
 * Card skeleton for loading card components
 */
export const CardSkeleton = ({ showImage = true, lines = 3 }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      {showImage && (
        <div className="w-full h-48 bg-gray-200 rounded-md mb-4" />
      )}
      
      <div className="space-y-3">
        <Skeleton height="h-6" width="w-3/4" />
        
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton 
            key={index}
            height="h-4" 
            width={index === lines - 1 ? 'w-1/2' : 'w-full'} 
          />
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <Skeleton width="w-20" height="h-4" />
        <Skeleton width="w-16" height="h-8" rounded="rounded-md" />
      </div>
    </div>
  );
};

/**
 * Table skeleton for loading table data
 */
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Table header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} width="flex-1" height="h-4" />
          ))}
        </div>
      </div>
      
      {/* Table rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton 
                  key={colIndex} 
                  width="flex-1" 
                  height="h-4" 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Profile skeleton for user profile loading
 */
export const ProfileSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
        <div className="flex-1">
          <Skeleton height="h-6" width="w-1/3" className="mb-2" />
          <Skeleton height="h-4" width="w-1/2" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Skeleton height="h-4" width="w-24" className="mb-2" />
          <Skeleton height="h-10" width="w-full" rounded="rounded-md" />
        </div>
        
        <div>
          <Skeleton height="h-4" width="w-24" className="mb-2" />
          <Skeleton height="h-10" width="w-full" rounded="rounded-md" />
        </div>
        
        <div>
          <Skeleton height="h-4" width="w-24" className="mb-2" />
          <Skeleton height="h-24" width="w-full" rounded="rounded-md" />
        </div>
      </div>
    </div>
  );
};

/**
 * List skeleton for loading list items
 */
export const ListSkeleton = ({ items = 5, showAvatar = false }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm animate-pulse">
          {showAvatar && (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
          )}
          
          <div className="flex-1 space-y-2">
            <Skeleton height="h-4" width="w-3/4" />
            <Skeleton height="h-3" width="w-1/2" />
          </div>
          
          <Skeleton width="w-8" height="h-8" rounded="rounded-md" />
        </div>
      ))}
    </div>
  );
};

/**
 * Dashboard skeleton for loading dashboard content
 */
export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton height="h-8" width="w-48" />
        <Skeleton height="h-10" width="w-32" rounded="rounded-md" />
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded" />
              <Skeleton width="w-16" height="h-4" />
            </div>
            <Skeleton height="h-8" width="w-20" className="mb-2" />
            <Skeleton height="h-4" width="w-full" />
          </div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CardSkeleton showImage={false} lines={6} />
        </div>
        <div>
          <ListSkeleton items={3} showAvatar={true} />
        </div>
      </div>
    </div>
  );
};

/**
 * Resume skeleton for loading resume content
 */
export const ResumeSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <Skeleton height="h-6" width="w-1/3" className="mb-2" />
        <Skeleton height="h-4" width="w-1/4" />
      </div>
      
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, sectionIndex) => (
          <div key={sectionIndex}>
            <Skeleton height="h-5" width="w-32" className="mb-3" />
            
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, itemIndex) => (
                <div key={itemIndex} className="pl-4 border-l-2 border-gray-100">
                  <Skeleton height="h-4" width="w-2/3" className="mb-2" />
                  <Skeleton height="h-3" width="w-1/2" className="mb-2" />
                  <Skeleton height="h-3" width="w-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Job card skeleton for loading job listings
 */
export const JobCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded" />
          <div>
            <Skeleton height="h-5" width="w-40" className="mb-1" />
            <Skeleton height="h-4" width="w-32" />
          </div>
        </div>
        <Skeleton width="w-20" height="h-6" rounded="rounded-full" />
      </div>
      
      <div className="space-y-3 mb-4">
        <Skeleton height="h-4" width="w-full" />
        <Skeleton height="h-4" width="w-3/4" />
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex space-x-4">
          <Skeleton width="w-16" height="h-4" />
          <Skeleton width="w-20" height="h-4" />
          <Skeleton width="w-24" height="h-4" />
        </div>
        <Skeleton width="w-16" height="h-4" />
      </div>
    </div>
  );
};

/**
 * Loading spinner component
 */
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`inline-block ${sizes[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 h-full w-full" />
    </div>
  );
};

/**
 * Full page loading component
 */
export const PageLoading = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mx-auto mb-4" />
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
};
