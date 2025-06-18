import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { format, formatDistanceToNow } from 'date-fns';
import { getAllJobApplications, updateJobStatus } from '../../services/jobTrackerService';
import AddJobModal from './AddJobModal';
import JobCard from './JobCard';
import EmptyState from '../common/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';
import AlertMessage from '../common/AlertMessage';
import { 
  PlusIcon, 
  FunnelIcon, 
  ArrowPathIcon,
  EyeIcon,
  ChartBarIcon,
  BriefcaseIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const JobTracker = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('kanban'); // kanban or list

  // Enhanced status columns configuration with better design
  const columns = [
    { 
      id: 'interested', 
      title: 'Interested', 
      description: 'Jobs you want to apply for',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      icon: EyeIcon
    },
    { 
      id: 'applied', 
      title: 'Applied', 
      description: 'Applications submitted',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      icon: BriefcaseIcon
    },
    { 
      id: 'interview', 
      title: 'Interview', 
      description: 'In interview process',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      icon: ClockIcon
    },
    { 
      id: 'offer', 
      title: 'Offer', 
      description: 'Received job offers',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      icon: ChartBarIcon
    },
    { 
      id: 'rejected', 
      title: 'Rejected', 
      description: 'Unfortunately not selected',
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      icon: ClockIcon
    }
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

  // Calculate statistics
  const getStats = () => {
    const total = jobs.length;
    const applied = getJobsByStatus('applied').length;
    const interviews = getJobsByStatus('interview').length;
    const offers = getJobsByStatus('offer').length;
    const rejected = getJobsByStatus('rejected').length;
    
    return {
      total,
      applied,
      interviews,
      offers,
      rejected,
      conversionRate: applied > 0 ? Math.round((interviews / applied) * 100) : 0,
      successRate: interviews > 0 ? Math.round((offers / interviews) * 100) : 0
    };
  };

  const stats = getStats();

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <BriefcaseIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Job Application Tracker
              </h1>
            </div>
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <BriefcaseIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Job Application Tracker
                </h1>
                <p className="text-gray-600 text-sm">Manage your job applications with our Kanban board</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 disabled:opacity-50"
                disabled={refreshing}
              >
                <ArrowPathIcon className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button 
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Job
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {jobs.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Jobs</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-purple-200/50 p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.applied}</div>
              <div className="text-sm text-gray-600">Applied</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-amber-200/50 p-4">
              <div className="text-2xl font-bold text-amber-600">{stats.interviews}</div>
              <div className="text-sm text-gray-600">Interviews</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-green-200/50 p-4">
              <div className="text-2xl font-bold text-green-600">{stats.offers}</div>
              <div className="text-sm text-gray-600">Offers</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-red-200/50 p-4">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-200/50 p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.conversionRate}%</div>
              <div className="text-sm text-gray-600">Interview Rate</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-emerald-200/50 p-4">
              <div className="text-2xl font-bold text-emerald-600">{stats.successRate}%</div>
              <div className="text-sm text-gray-600">Offer Rate</div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6">
            <AlertMessage 
              type="error"
              title="Error"
              message={error}
              onClose={() => setError(null)}
            />
          </div>
        )}        {jobs.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-8">
            <EmptyState
              type="job-tracker"
              title="No jobs tracked yet"
              message="Start tracking your job applications by clicking the 'Add Job' button."
              actionText="Add Your First Job"
              onAction={() => setShowAddModal(true)}
            />
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {columns.map(column => {
                const Icon = column.icon;
                const jobsInColumn = getJobsByStatus(column.id);
                
                return (
                  <div 
                    key={column.id} 
                    className={`${column.bgColor} ${column.borderColor} border-2 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300`}
                  >
                    {/* Column Header */}
                    <div className="p-4 border-b border-white/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 bg-gradient-to-r ${column.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <h2 className={`font-bold ${column.textColor}`}>
                            {column.title}
                          </h2>
                        </div>
                        <span className={`${column.textColor} bg-white/70 text-sm font-semibold py-1 px-3 rounded-full shadow-sm`}>
                          {jobsInColumn.length}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{column.description}</p>
                    </div>
                    
                    {/* Droppable Area */}
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`p-4 min-h-[calc(100vh-350px)] transition-all duration-200 ${
                            snapshot.isDraggingOver 
                              ? 'bg-white/50 ring-2 ring-blue-300 ring-opacity-50' 
                              : ''
                          }`}
                        >
                          {jobsInColumn.length === 0 ? (
                            <div className="bg-white/50 rounded-xl p-6 text-center">
                              <div className="text-gray-400 mb-2">
                                <Icon className="w-8 h-8 mx-auto opacity-50" />
                              </div>
                              <p className="text-sm text-gray-500">
                                {snapshot.isDraggingOver ? 'Drop job here' : 'No jobs yet'}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {jobsInColumn.map((job, index) => (
                                <Draggable 
                                  key={job._id} 
                                  draggableId={job._id} 
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`transform transition-all duration-200 ${
                                        snapshot.isDragging 
                                          ? 'rotate-3 scale-105 shadow-2xl z-50' 
                                          : 'hover:scale-102 hover:shadow-lg'
                                      }`}
                                    >
                                      <JobCard 
                                        job={job} 
                                        onRefresh={fetchJobs}
                                        isDragging={snapshot.isDragging}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        )}

        {/* Add Job Modal */}
        {showAddModal && (
          <AddJobModal
            onClose={() => setShowAddModal(false)}
            onJobAdded={fetchJobs}
          />
        )}
      </div>
    </div>
  );
};

export default JobTracker;
