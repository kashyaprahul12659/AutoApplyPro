import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { format, formatDistanceToNow } from 'date-fns';
import { getAllJobApplications, updateJobStatus } from '../../services/jobTrackerService';
import AddJobModal from './AddJobModal';
import JobCard from './JobCard';
import EmptyState from '../common/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertMessage from '../common/AlertMessage';
import { FiPlus, FiFilter, FiRefreshCw } from 'react-icons/fi';

const JobTracker = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Status columns configuration
  const columns = [
    { id: 'interested', title: 'Interested', color: 'bg-blue-100' },
    { id: 'applied', title: 'Applied', color: 'bg-purple-100' },
    { id: 'interview', title: 'Interview', color: 'bg-amber-100' },
    { id: 'offer', title: 'Offer', color: 'bg-green-100' },
    { id: 'rejected', title: 'Rejected', color: 'bg-red-100' }
  ];

  // Load jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch all job applications
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllJobApplications();
      setJobs(response.data);
    } catch (err) {
      console.error('Error fetching job applications:', err);
      setError('Failed to load job applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh job list
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  // Handle drag end event
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Return if dropped outside a droppable area or in the same position
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // If the status changed, update in backend
    if (destination.droppableId !== source.droppableId) {
      try {
        // Optimistically update UI
        const updatedJobs = [...jobs];
        const jobIndex = updatedJobs.findIndex(job => job._id === draggableId);
        
        if (jobIndex !== -1) {
          updatedJobs[jobIndex] = {
            ...updatedJobs[jobIndex],
            status: destination.droppableId,
            lastStatusUpdate: new Date().toISOString()
          };
          setJobs(updatedJobs);
          
          // Update in backend
          await updateJobStatus(draggableId, destination.droppableId);
        }
      } catch (err) {
        console.error('Error updating job status:', err);
        setError('Failed to update job status. Please try again.');
        // Revert UI by refetching data
        fetchJobs();
      }
    }
  };

  // Group jobs by status
  const getJobsByStatus = (status) => {
    return jobs.filter(job => job.status === status);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Job Application Tracker</h1>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }
  return (
    <div className="job-tracker container mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Application Tracker</h1>
        
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <button 
            onClick={handleRefresh}
            className="btn-secondary py-2 px-3 text-sm flex items-center"
            disabled={refreshing}
          >
            <FiRefreshCw className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary py-2 px-3 text-sm flex items-center"
          >
            <FiPlus className="mr-1" />
            Add Job
          </button>
        </div>
      </div>

      {error && (
        <AlertMessage 
          type="error"
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {jobs.length === 0 ? (
        <EmptyState
          type="job-tracker"
          title="No jobs tracked yet"
          message="Start tracking your job applications by clicking the 'Add Job' button."
          actionText="Add Your First Job"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 pb-8">
            {columns.map(column => (
              <div key={column.id} className={`rounded-lg p-3 ${column.color} shadow-sm`}>
                <h2 className="font-semibold text-gray-700 mb-3 flex justify-between">
                  {column.title}
                  <span className="bg-white text-sm py-0.5 px-2 rounded-full">
                    {getJobsByStatus(column.id).length}
                  </span>
                </h2>
                
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-h-[calc(100vh-240px)]"
                    >
                      {getJobsByStatus(column.id).length === 0 ? (
                        <div className="bg-white bg-opacity-50 rounded p-3 text-center text-sm text-gray-500">
                          Drag jobs here
                        </div>
                      ) : (
                        getJobsByStatus(column.id).map((job, index) => (
                          <Draggable 
                            key={job._id} 
                            draggableId={job._id} 
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-3"
                              >
                                <JobCard 
                                  job={job} 
                                  onRefresh={fetchJobs}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {showAddModal && (
        <AddJobModal
          onClose={() => setShowAddModal(false)}
          onJobAdded={fetchJobs}
        />
      )}
    </div>
  );
};

export default JobTracker;
