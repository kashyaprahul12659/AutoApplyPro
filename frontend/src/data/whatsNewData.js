// Data for the What's New modal displaying recent feature updates
const whatsNewData = [
  {
    id: 1,
    version: 'v1.3.5',
    date: 'May 25, 2025',
    title: 'Final Polish & UX Enhancements',
    description: 'Final polish and quality-of-life improvements for a seamless experience.',
    highlights: [
      {
        title: 'Empty State Messages',
        description: 'Clear empty state UI with helpful guidance when no data is available.',
        tag: 'new'
      },
      {
        title: 'Last Used Timestamps',
        description: 'Resume cards now show when they were last used for autofill.',
        tag: 'new'
      },
      {
        title: 'Logout in Extension',
        description: 'Added logout functionality to the Chrome extension for better control.',
        tag: 'new'
      },
      {
        title: 'Better Error Messages',
        description: 'More user-friendly error messages for common issues like expired tokens.',
        tag: 'improved'
      },
      {
        title: 'Faster Extension Loading',
        description: 'Optimized extension performance with smart caching and debounced API calls.',
        tag: 'improved'
      },
      {
        title: 'Version Labels',
        description: 'Version information added throughout the app for better tracking.',
        tag: 'new'
      }
    ]
  },
  {
    id: 2,
    version: 'v1.3.0',
    date: 'May 24, 2025',
    title: 'UI/UX Polish & New Features',
    description: 'Major interface improvements and new features to enhance your application experience.',
    highlights: [
      {
        title: 'New JD Analyzer Tool',
        description: 'Compare job descriptions against your resume to see skill matches and get customized suggestions.',
        tag: 'new'
      },
      {
        title: 'Improved Tooltips',
        description: 'Helpful tooltips added throughout the interface to provide guidance and context.',
        tag: 'improved'
      },
      {
        title: 'Consistent Toast Notifications',
        description: 'Standardized notification system for better feedback across the application.',
        tag: 'improved'
      },
      {
        title: 'Subscription Plan Badge',
        description: 'Clear visibility of your current subscription plan and remaining credits.',
        tag: 'new'
      },
      {
        title: 'Feedback Button',
        description: 'Easily submit feedback to help us improve the application.',
        tag: 'new'
      },
      {
        title: 'Responsive Design',
        description: 'Better support for different screen sizes, including mobile devices.',
        tag: 'improved'
      }
    ]
  },
  {
    id: 2,
    version: 'v1.2.0',
    date: 'April 15, 2025',
    title: 'Cover Letter Generator & Performance Improvements',
    description: 'New AI-powered cover letter generation and system-wide performance enhancements.',
    highlights: [
      {
        title: 'AI Cover Letter Generator',
        description: 'Generate customized cover letters based on job descriptions and your resume.',
        tag: 'new'
      },
      {
        title: 'Enhanced Form Detection',
        description: 'Improved detection of application forms for more accurate autofilling.',
        tag: 'improved'
      },
      {
        title: 'Faster Page Load Times',
        description: 'Optimized code for quicker dashboard and application loading.',
        tag: 'improved'
      }
    ]
  },
  {
    id: 3,
    version: 'v1.1.0',
    date: 'March 1, 2025',
    title: 'Initial Release',
    description: 'First public release of AutoApply Pro with core functionality.',
    highlights: [
      {
        title: 'Automatic Form Filling',
        description: 'Fill job applications automatically with your profile data.',
        tag: 'new'
      },
      {
        title: 'Resume Management',
        description: 'Store and manage multiple resume profiles.',
        tag: 'new'
      },
      {
        title: 'Application History',
        description: 'Track your job application history in one place.',
        tag: 'new'
      }
    ]
  }
];

export default whatsNewData;
