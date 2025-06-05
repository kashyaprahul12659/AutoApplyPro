import React, { forwardRef } from 'react';

const ClassicTemplate = forwardRef(({ resumeData }, ref) => {
  const findBlockByType = (type) => {
    return resumeData.blocks.find(block => block.type === type);
  };

  // Format date range (e.g., "May 2020 - Present" or "May 2020 - Dec 2022")
  const formatDateRange = (startDate, endDate, current) => {
    let formattedStart = '';
    let formattedEnd = '';

    if (startDate) {
      const startDateObj = new Date(startDate);
      formattedStart = startDateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
    }

    if (current) {
      formattedEnd = 'Present';
    } else if (endDate) {
      const endDateObj = new Date(endDate);
      formattedEnd = endDateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
    }

    if (formattedStart && formattedEnd) {
      return `${formattedStart} - ${formattedEnd}`;
    } else if (formattedStart) {
      return formattedStart;
    } else {
      return '';
    }
  };

  // Render Summary Section
  const renderSummary = () => {
    const summaryBlock = findBlockByType('summary');
    if (!summaryBlock || !summaryBlock.content.text) return null;

    return (
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Professional Summary</h2>
        <p className="text-sm">{summaryBlock.content.text}</p>
      </section>
    );
  };

  // Render Skills Section
  const renderSkills = () => {
    const skillsBlock = findBlockByType('skills');
    if (!skillsBlock || !skillsBlock.content.skills || skillsBlock.content.skills.length === 0) return null;

    return (
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Skills</h2>
        <div className="flex flex-wrap">
          {skillsBlock.content.skills.map((skill, index) => (
            <span 
              key={index} 
              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2 mb-2"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    );
  };

  // Render Experience Section
  const renderExperience = () => {
    const experienceBlock = findBlockByType('experience');
    if (!experienceBlock || !experienceBlock.content.items || experienceBlock.content.items.length === 0) return null;

    return (
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Experience</h2>
        <div className="space-y-4">
          {experienceBlock.content.items.map((experience, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{experience.jobTitle}</h3>
                  <p className="text-sm">{experience.company}{experience.location ? `, ${experience.location}` : ''}</p>
                </div>
                <div className="text-sm text-gray-600">
                  {formatDateRange(experience.startDate, experience.endDate, experience.current)}
                </div>
              </div>
              <p className="text-sm mt-2 whitespace-pre-line">{experience.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Render Education Section
  const renderEducation = () => {
    const educationBlock = findBlockByType('education');
    if (!educationBlock || !educationBlock.content.items || educationBlock.content.items.length === 0) return null;

    return (
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Education</h2>
        <div className="space-y-4">
          {educationBlock.content.items.map((education, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{education.degree}</h3>
                  <p className="text-sm">{education.institution}{education.location ? `, ${education.location}` : ''}</p>
                  {education.gpa && (
                    <p className="text-sm">GPA: {education.gpa}</p>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {formatDateRange(education.startDate, education.endDate, education.current)}
                </div>
              </div>
              {education.description && (
                <p className="text-sm mt-2 whitespace-pre-line">{education.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Render Projects Section
  const renderProjects = () => {
    const projectBlock = findBlockByType('project');
    if (!projectBlock || !projectBlock.content.items || projectBlock.content.items.length === 0) return null;

    return (
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Projects</h2>
        <div className="space-y-4">
          {projectBlock.content.items.map((project, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-sm">
                    {project.title}
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="ml-2 text-blue-600 hover:underline text-xs"
                      >
                        (Link)
                      </a>
                    )}
                  </h3>
                  {project.technologies && (
                    <p className="text-sm italic">{project.technologies}</p>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {formatDateRange(project.startDate, project.endDate, project.current)}
                </div>
              </div>
              <p className="text-sm mt-2 whitespace-pre-line">{project.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Render Certifications Section
  const renderCertifications = () => {
    const certificationBlock = findBlockByType('certification');
    if (!certificationBlock || !certificationBlock.content.items || certificationBlock.content.items.length === 0) return null;

    return (
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-3">Certifications</h2>
        <div className="space-y-4">
          {certificationBlock.content.items.map((certification, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-sm">
                    {certification.name}
                    {certification.credentialURL && (
                      <a 
                        href={certification.credentialURL} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="ml-2 text-blue-600 hover:underline text-xs"
                      >
                        (Verify)
                      </a>
                    )}
                  </h3>
                  <p className="text-sm">{certification.issuer}</p>
                  {certification.credentialID && (
                    <p className="text-xs text-gray-600">Credential ID: {certification.credentialID}</p>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {certification.date ? new Date(certification.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    year: 'numeric' 
                  }) : ''}
                  {certification.expirationDate && !certification.noExpiration ? 
                    ` - Expires: ${new Date(certification.expirationDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}` : 
                    certification.noExpiration ? ' (No Expiration)' : ''}
                </div>
              </div>
              {certification.description && (
                <p className="text-sm mt-2 whitespace-pre-line">{certification.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div ref={ref} className="bg-white p-8 text-gray-800 font-sans">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">John Doe</h1>
        <div className="text-sm">
          <span>San Francisco, CA</span>
          <span className="mx-2">|</span>
          <span>(555) 123-4567</span>
          <span className="mx-2">|</span>
          <span>johndoe@example.com</span>
        </div>
      </header>

      {/* Content */}
      <div className="space-y-2">
        {renderSummary()}
        {renderSkills()}
        {renderExperience()}
        {renderEducation()}
        {renderProjects()}
        {renderCertifications()}
      </div>
    </div>
  );
});

ClassicTemplate.displayName = 'ClassicTemplate';

export default ClassicTemplate;
