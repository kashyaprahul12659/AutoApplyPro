import React from 'react';
import { Helmet } from 'react-helmet-async';
import JobTrackerComponent from '../components/jobtracker/JobTracker';

/**
 * Job Tracker Page
 *
 * Displays the job application tracking Kanban board
 */
const JobTracker = () => {
  return (
    <>
      <Helmet>
        <title>Job Application Tracker | AutoApply Pro</title>
        <meta name="description" content="Track your job applications in a Kanban board style tracker. Move jobs through your pipeline from interest to offers." />
      </Helmet>

      <JobTrackerComponent />
    </>
  );
};

export default JobTracker;
