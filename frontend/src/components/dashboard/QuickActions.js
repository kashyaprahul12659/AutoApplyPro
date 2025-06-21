import React from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircleIcon,
  DocumentTextIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  SparklesIcon,
  PuzzlePieceIcon,
  BriefcaseIcon,
  UserIcon
} from '@heroicons/react/24/outline';

/**
 * Enhanced Quick Actions Component with modern card design
 */
const QuickActions = () => {
  const actions = [
    {
      title: 'Upload Resume',
      description: 'Add a new resume or update existing',
      icon: PlusCircleIcon,
      color: 'primary',
      gradient: 'from-primary-500 to-primary-600',
      href: '/dashboard',
      action: 'upload'
    },
    {
      title: 'Generate Cover Letter',
      description: 'AI-powered personalized cover letters',
      icon: SparklesIcon,
      color: 'accent',
      gradient: 'from-accent-500 to-accent-600',
      href: '/coverletter'
    },
    {
      title: 'Analyze Job Description',
      description: 'Match skills and optimize applications',
      icon: ChartBarIcon,
      color: 'secondary',
      gradient: 'from-secondary-500 to-secondary-600',
      href: '/jd-analyzer'
    },
    {
      title: 'Build Resume',
      description: 'Create professional resume with AI',
      icon: DocumentTextIcon,
      color: 'warning',
      gradient: 'from-yellow-500 to-orange-500',
      href: '/resume-builder'
    },
    {
      title: 'Job Tracker',
      description: 'Manage applications and interviews',
      icon: BriefcaseIcon,
      color: 'info',
      gradient: 'from-blue-500 to-cyan-500',
      href: '/job-tracker'
    },
    {
      title: 'Test Autofill',
      description: 'Try our form filling technology',
      icon: RocketLaunchIcon,
      color: 'success',
      gradient: 'from-green-500 to-emerald-500',
      href: '/test-autofill'
    },
    {
      title: 'Extension Setup',
      description: 'Install Chrome extension',
      icon: PuzzlePieceIcon,
      color: 'purple',
      gradient: 'from-purple-500 to-violet-500',
      href: '#extension'
    },
    {
      title: 'Profile Settings',
      description: 'Update personal information',
      icon: UserIcon,
      color: 'neutral',
      gradient: 'from-neutral-600 to-neutral-700',
      href: '/profile'
    }
  ];

  const handleAction = (action, actionType) => {
    if (actionType === 'upload') {
      // Trigger file upload dialog
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.pdf,.doc,.docx';
      fileInput.click();
    }
  };

  return (
    <div className="card p-6 bg-white border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="heading-4 text-neutral-900">Quick Actions</h3>
        <div className="flex items-center text-sm text-muted">
          <SparklesIcon className="h-4 w-4 mr-1" />
          AI Powered
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link
            key={action.title}
            to={action.href}
            onClick={action.action ? (e) => {
              e.preventDefault();
              handleAction(action, action.action);
            } : undefined}
            className="group relative p-4 rounded-2xl border-2 border-neutral-200 hover:border-primary-300 bg-white hover:bg-gradient-to-br hover:from-white hover:to-primary-50 transition-all duration-500 hover:scale-105 hover:-translate-y-1 hover:shadow-large"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Background Gradient Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>

            <div className="relative text-center">
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${action.gradient} text-white mb-3 group-hover:scale-110 transition-transform duration-300 shadow-soft`}>
                <action.icon className="h-6 w-6" />
              </div>

              {/* Title */}
              <h4 className="text-sm font-bold text-neutral-900 group-hover:text-primary-700 transition-colors duration-300 mb-1">
                {action.title}
              </h4>

              {/* Description */}
              <p className="text-xs text-muted leading-relaxed group-hover:text-neutral-600 transition-colors duration-300">
                {action.description}
              </p>
            </div>

            {/* Hover Effect Glow */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10 blur-xl`}></div>
          </Link>
        ))}
      </div>

      {/* Pro Tip */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl border border-primary-200">
        <div className="flex items-start space-x-3">
          <SparklesIcon className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="text-sm font-semibold text-primary-900 mb-1">Pro Tip</h5>
            <p className="text-sm text-primary-700 leading-relaxed">
              Use our Chrome extension to automatically fill job applications while browsing.
              <Link to="#extension" className="font-semibold hover:underline ml-1">Install now →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
