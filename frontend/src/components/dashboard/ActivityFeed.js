import React from 'react';
import { 
  DocumentCheckIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

/**
 * Enhanced Activity Feed Component with modern timeline design
 */
const ActivityFeed = ({ activities = [] }) => {
  // Use only real data from props, no more mock data
  const activityList = activities;

  const getStatusStyles = (status) => {
    const styles = {
      success: {
        bg: 'bg-secondary-100',
        text: 'text-secondary-700',
        icon: 'text-secondary-600',
        border: 'border-secondary-200'
      },
      info: {
        bg: 'bg-primary-100',
        text: 'text-primary-700',
        icon: 'text-primary-600',
        border: 'border-primary-200'
      },
      warning: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: 'text-yellow-600',
        border: 'border-yellow-200'
      },
      accent: {
        bg: 'bg-accent-100',
        text: 'text-accent-700',
        icon: 'text-accent-600',
        border: 'border-accent-200'
      }
    };
    return styles[status] || styles.info;
  };

  // Map icon type to component
  const getIconComponent = (type) => {
    switch (type) {
      case 'application':
        return PaperAirplaneIcon;
      case 'resume':
        return DocumentCheckIcon;
      case 'interview':
        return CalendarDaysIcon;
      case 'response':
        return ChatBubbleLeftRightIcon;
      case 'ai':
        return SparklesIcon;
      default:
        return DocumentCheckIcon;
    }
  };

  return (
    <div className="card p-6 bg-white border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="heading-4 text-neutral-900">Recent Activity</h3>
        <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200">
          View All
        </button>
      </div>

      <div className="space-y-6">
        {activityList.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <DocumentCheckIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-1">No activity yet</h4>
            <p className="text-gray-500">
              Your recent activities will appear here as you use the application.
            </p>
          </div>
        ) : (
          activityList.map((activity, index) => {
            const styles = getStatusStyles(activity.status);
            const IconComponent = getIconComponent(activity.type);
            
            return (
              <div 
                key={activity.id}
                className="group relative flex items-start space-x-4 hover:bg-surface rounded-xl p-3 -m-3 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Timeline Line */}
                {index < activityList.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-12 bg-neutral-200 group-hover:bg-primary-300 transition-colors duration-300"></div>
                )}
                
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${styles.bg} ${styles.border} border-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`h-6 w-6 ${styles.icon}`} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors duration-300">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-muted">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted mt-1 leading-relaxed">
                    {activity.description}
                  </p>
                </div>
                
                {/* Status Indicator */}
                <div className={`w-3 h-3 rounded-full ${styles.icon.replace('text-', 'bg-')} group-hover:scale-125 transition-transform duration-300`}></div>
              </div>
            );
          })
        )}
      </div>

      {/* View More Button - Only show if there are activities */}
      {activityList.length > 0 && (
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <button className="w-full py-3 text-sm font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-all duration-300">
            Load More Activities
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
