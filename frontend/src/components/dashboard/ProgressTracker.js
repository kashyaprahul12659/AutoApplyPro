import React from 'react';
import { 
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

/**
 * Enhanced Progress Tracker with modern design and animations
 */
const ProgressTracker = ({ progressData = {} }) => {
  const defaultData = {
    profileComplete: 85,
    monthlyGoal: 20,
    currentApplications: 14,
    weeklyStreak: 5,
    skillMatches: 78,
    ...progressData
  };

  const progressItems = [
    {
      title: 'Profile Completion',
      current: defaultData.profileComplete,
      target: 100,
      unit: '%',
      color: 'primary',
      icon: CheckCircleIcon,
      description: 'Complete your profile for better matches'
    },
    {
      title: 'Monthly Goal',
      current: defaultData.currentApplications,
      target: defaultData.monthlyGoal,
      unit: 'apps',
      color: 'secondary',
      icon: TrophyIcon,
      description: `${defaultData.monthlyGoal - defaultData.currentApplications} more to reach your goal`
    },
    {
      title: 'Weekly Streak',
      current: defaultData.weeklyStreak,
      target: 7,
      unit: 'days',
      color: 'accent',
      icon: ClockIcon,
      description: 'Keep applying daily to maintain streak'
    },
    {
      title: 'Skill Match Score',
      current: defaultData.skillMatches,
      target: 100,
      unit: '%',
      color: 'warning',
      icon: ChartBarIcon,
      description: 'Average match with recent applications'
    }
  ];

  const getProgressColor = (percentage, color) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 70) return `text-${color}-600 bg-${color}-100`;
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressBarColor = (percentage, color) => {
    if (percentage >= 90) return 'from-green-500 to-green-600';
    if (percentage >= 70) return `from-${color}-500 to-${color}-600`;
    if (percentage >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="card p-6 bg-white border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="heading-4 text-neutral-900">Your Progress</h3>
        <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200">
          View Details
        </button>
      </div>

      <div className="space-y-6">
        {progressItems.map((item, index) => {
          const percentage = Math.min((item.current / item.target) * 100, 100);
          
          return (
            <div 
              key={item.title}
              className="group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl ${getProgressColor(percentage, item.color)} group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-black text-neutral-900">
                    {item.current}
                    <span className="text-sm text-muted">/{item.target}</span>
                  </div>
                  <div className="text-xs font-semibold text-muted">
                    {Math.round(percentage)}%
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getProgressBarColor(percentage, item.color)} transition-all duration-1000 ease-out rounded-full relative overflow-hidden`}
                    style={{ width: `${percentage}%` }}
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                
                {/* Milestone Markers */}
                <div className="absolute inset-0 flex justify-between items-center">
                  {[25, 50, 75].map(milestone => (
                    <div 
                      key={milestone}
                      className={`w-1 h-5 rounded-full ${
                        percentage >= milestone ? 'bg-white shadow-sm' : 'bg-neutral-300'
                      } transition-colors duration-500`}
                      style={{ left: `${milestone}%`, transform: 'translateX(-50%)' }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Achievement Badge */}
              {percentage >= 100 && (
                <div className="mt-2 inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold animate-bounce-subtle">
                  <TrophyIcon className="h-4 w-4 mr-1" />
                  Goal Achieved!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Progress Summary */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-semibold text-primary-900 mb-1">
                Overall Progress Score
              </h5>
              <p className="text-xs text-primary-700">
                Based on profile completion and activity
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black gradient-text">
                {Math.round(progressItems.reduce((acc, item) => 
                  acc + Math.min((item.current / item.target) * 100, 100), 0
                ) / progressItems.length)}%
              </div>
              <div className="text-xs text-primary-600 font-semibold">
                Excellent!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
