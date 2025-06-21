import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSave, FiDownload, FiTrash2 } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as resumeBuilderService from '../../services/resumeBuilderService';

// Resume section components
import SummarySection from './sections/SummarySection';
import SkillsSection from './sections/SkillsSection';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import ProjectsSection from './sections/ProjectsSection';
import CertificationsSection from './sections/CertificationsSection';

// Resume templates
import ClassicTemplate from './templates/ClassicTemplate';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const resumePreviewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [resumeTitle, setResumeTitle] = useState('My Resume');
  const [resumeId, setResumeId] = useState(null);
  const [targetRole, setTargetRole] = useState('');

  // Resume data structure
  const [resumeData, setResumeData] = useState({
    blocks: [
      { type: 'summary', content: { text: '' }, order: 0 },
      { type: 'skills', content: { skills: [] }, order: 1 },
      { type: 'experience', content: { items: [] }, order: 2 },
      { type: 'education', content: { items: [] }, order: 3 },
      { type: 'project', content: { items: [] }, order: 4 },
      { type: 'certification', content: { items: [] }, order: 5 }
    ]
  });

  // Load resume data if ID is provided
  useEffect(() => {
    if (id) {
      loadResumeData(id);
    }
  }, [id]);

  const loadResumeData = async (resumeId) => {
    try {
      setLoading(true);
      const response = await resumeBuilderService.getResumeById(resumeId);

      if (response.success) {
        const { title, blocks, templateId } = response.data;
        setResumeTitle(title);
        setResumeId(resumeId);
        setSelectedTemplate(templateId || 'classic');

        // Sort blocks by order
        const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);
        setResumeData({ blocks: sortedBlocks });
      }
    } catch (error) {
      toast.error('Failed to load resume');
      console.error('Error loading resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResume = async () => {
    try {
      setSaving(true);

      const saveData = {
        title: resumeTitle,
        blocks: resumeData.blocks,
        templateId: selectedTemplate
      };

      let response;

      if (resumeId) {
        response = await resumeBuilderService.updateResume(resumeId, saveData);
      } else {
        response = await resumeBuilderService.createResume(saveData);
      }

      if (response.success) {
        toast.success('Resume saved successfully');

        if (!resumeId) {
          setResumeId(response.data._id);
          // Update URL to include the new resume ID
          navigate(`/resume-builder/${response.data._id}`, { replace: true });
        }
      }
    } catch (error) {
      toast.error('Failed to save resume');
      console.error('Error saving resume:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!resumePreviewRef.current) return;

    try {
      setExporting(true);
      toast.info('Generating PDF, please wait...');

      const scale = 2; // Higher scale for better quality
      const canvas = await html2canvas(resumePreviewRef.current, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${resumeTitle.replace(/\s+/g, '_')}.pdf`);

      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to export PDF');
      console.error('Error exporting PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleUpdateBlock = (type, content) => {
    setResumeData(prevData => {
      const updatedBlocks = prevData.blocks.map(block => {
        if (block.type === type) {
          return { ...block, content };
        }
        return block;
      });

      return { ...prevData, blocks: updatedBlocks };
    });
  };

  const handleMoveBlock = (type, direction) => {
    setResumeData(prevData => {
      const blocks = [...prevData.blocks];
      const currentIndex = blocks.findIndex(block => block.type === type);

      if (currentIndex === -1) return prevData;

      const newIndex = direction === 'up'
        ? Math.max(0, currentIndex - 1)
        : Math.min(blocks.length - 1, currentIndex + 1);

      if (newIndex === currentIndex) return prevData;

      // Swap blocks
      [blocks[currentIndex], blocks[newIndex]] = [blocks[newIndex], blocks[currentIndex]];

      // Update order properties
      return {
        ...prevData,
        blocks: blocks.map((block, index) => ({ ...block, order: index }))
      };
    });
  };

  const handleToggleBlockVisibility = (type) => {
    setResumeData(prevData => {
      const blockExists = prevData.blocks.some(block => block.type === type);

      if (blockExists) {
        // Remove block
        return {
          ...prevData,
          blocks: prevData.blocks
            .filter(block => block.type !== type)
            .map((block, index) => ({ ...block, order: index }))
        };
      } else {
        // Add block
        const newBlock = {
          type,
          content: getDefaultContentForType(type),
          order: prevData.blocks.length
        };

        return {
          ...prevData,
          blocks: [...prevData.blocks, newBlock]
            .sort((a, b) => a.order - b.order)
        };
      }
    });
  };

  const getDefaultContentForType = (type) => {
    switch (type) {
      case 'summary':
        return { text: '' };
      case 'skills':
        return { skills: [] };
      case 'experience':
        return { items: [] };
      case 'education':
        return { items: [] };
      case 'project':
        return { items: [] };
      case 'certification':
        return { items: [] };
      default:
        return {};
    }
  };

  const renderSectionComponent = (block) => {
    switch (block.type) {
      case 'summary':
        return (
          <SummarySection
            key={block.type}
            data={block.content}
            onUpdate={(content) => handleUpdateBlock('summary', content)}
            targetRole={targetRole}
          />
        );
      case 'skills':
        return (
          <SkillsSection
            key={block.type}
            data={block.content}
            onUpdate={(content) => handleUpdateBlock('skills', content)}
            targetRole={targetRole}
          />
        );
      case 'experience':
        return (
          <ExperienceSection
            key={block.type}
            data={block.content}
            onUpdate={(content) => handleUpdateBlock('experience', content)}
            targetRole={targetRole}
          />
        );
      case 'education':
        return (
          <EducationSection
            key={block.type}
            data={block.content}
            onUpdate={(content) => handleUpdateBlock('education', content)}
          />
        );
      case 'project':
        return (
          <ProjectsSection
            key={block.type}
            data={block.content}
            onUpdate={(content) => handleUpdateBlock('project', content)}
          />
        );
      case 'certification':
        return (
          <CertificationsSection
            key={block.type}
            data={block.content}
            onUpdate={(content) => handleUpdateBlock('certification', content)}
          />
        );
      default:
        return null;
    }
  };

  const renderTemplatePreview = () => {
    switch (selectedTemplate) {
      case 'classic':
      default:
        return (
          <ClassicTemplate
            resumeData={resumeData}
            ref={resumePreviewRef}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <input
            type="text"
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            className="text-2xl font-bold border-none focus:outline-none focus:ring-2 focus:ring-blue-500 p-1 rounded"
            placeholder="Resume Title"
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSaveResume}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            disabled={saving}
          >
            <FiSave className="mr-2" />
            {saving ? 'Saving...' : 'Save Resume'}
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center"
            disabled={exporting}
          >
            <FiDownload className="mr-2" />
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Left Panel - Resume Sections */}
        <div className="w-full md:w-1/2 p-4 bg-gray-50 rounded-lg shadow mb-4 md:mb-0 md:mr-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Target Role (Optional)</h3>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Software Engineer, Product Manager"
            />
            <p className="text-sm text-gray-500 mt-1">Providing a target role helps AI tailor content specifically to that position</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Resume Sections</h3>
            <div className="space-y-6">
              {resumeData.blocks.map(block => (
                <div key={block.type} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold capitalize">{block.type}</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleMoveBlock(block.type, 'up')}
                        className="p-1 text-gray-500 hover:text-gray-700"
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleMoveBlock(block.type, 'down')}
                        className="p-1 text-gray-500 hover:text-gray-700"
                        title="Move Down"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => handleToggleBlockVisibility(block.type)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Remove Section"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  {renderSectionComponent(block)}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Add Sections</h3>
            <div className="flex flex-wrap gap-2">
              {['summary', 'skills', 'experience', 'education', 'project', 'certification'].map(type => {
                const isAdded = resumeData.blocks.some(block => block.type === type);

                return (
                  <button
                    key={type}
                    onClick={() => handleToggleBlockVisibility(type)}
                    className={`px-3 py-1 rounded text-sm ${
                      isAdded
                        ? 'bg-gray-200 text-gray-500'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                    disabled={isAdded}
                  >
                    {isAdded ? `${type} (Added)` : `+ Add ${type}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel - Resume Preview */}
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow p-4 overflow-hidden">
          <h3 className="text-lg font-semibold mb-4">Resume Preview</h3>
          <div className="bg-gray-100 p-4 rounded-lg" style={{ minHeight: 'calc(100vh - 240px)' }}>
            <div className="bg-white shadow-md mx-auto" style={{ width: '8.5in', minHeight: '11in', padding: '0.5in' }}>
              {renderTemplatePreview()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
