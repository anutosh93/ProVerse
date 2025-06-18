import React, { useState } from 'react';

// Dummy data for projects and modules
const dummyProjects = [
  { id: '1', name: 'ProVerse AI', description: 'AI-powered product management', context: 'Initial context for LLM' },
  { id: '2', name: 'Pixis Advance', description: 'Advanced analytics', context: 'Analytics context' },
];

const modules = [
  'Idea Validation',
  'Wireframes',
  'UX/UI',
  'PRD',
  'App',
  'App Health Checks',
  'Product Analytics',
  'Bugs and Prioritization',
];

const moduleIcons: Record<string, string> = {
  'Idea Validation': 'lightbulb',
  'Wireframes': 'grid_on',
  'UX/UI': 'brush',
  'PRD': 'description',
  'App': 'smartphone',
  'App Health Checks': 'health_and_safety',
  'Product Analytics': 'analytics',
  'Bugs and Prioritization': 'bug_report',
};

type SidebarProps = {
  activeModule: string;
  onModuleSelect: (module: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState(dummyProjects);
  const [selectedProject, setSelectedProject] = useState(dummyProjects[0]?.id || '');
  const [newProject, setNewProject] = useState({ name: '', description: '', context: '' });

  // Handle hover for open/close
  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  // Handle project selection
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'create') {
      setShowModal(true);
    } else {
      setSelectedProject(e.target.value);
    }
  };

  // Handle new project input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  // Handle new project submit
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const id = (projects.length + 1).toString();
    setProjects([...projects, { ...newProject, id }]);
    setSelectedProject(id);
    setShowModal(false);
    setNewProject({ name: '', description: '', context: '' });
    // TODO: Save to Supabase and Pinecone
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-30 transition-all duration-200 bg-white border-r border-gray-200 shadow-lg ${isOpen ? 'w-72' : 'w-16'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Branding */}
      <div className="flex flex-col items-center py-6 px-2">
        <div className="mb-2">
          <img src="/logo.svg" alt="ProVerse Logo" className="h-8 w-8" />
        </div>
        {isOpen && (
          <>
            <h1 className="text-xl font-bold">ProVerse</h1>
            <p className="text-xs text-gray-500">AI Product Management</p>
          </>
        )}
      </div>

      {/* Project Dropdown */}
      <div className="px-2 mb-4">
        <select
          className={`w-full rounded px-2 py-1 border ${isOpen ? '' : 'hidden'}`}
          value={selectedProject}
          onChange={handleProjectChange}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
          <option value="create">+ Create new project</option>
        </select>
        {!isOpen && (
          <button
            className="w-10 h-10 flex items-center justify-center rounded bg-blue-100 hover:bg-blue-200"
            title="Select Project"
          >
            <span className="material-icons">folder</span>
          </button>
        )}
      </div>

      {/* Modules List */}
      <nav className="flex-1 px-2">
        <ul className="space-y-2">
          {modules.map((mod) => (
            <li
              key={mod}
              className={`flex items-center cursor-pointer rounded px-2 py-1 transition-colors ${activeModule === mod ? 'bg-blue-100 font-bold text-blue-700' : 'hover:bg-gray-100'}`}
              onClick={() => onModuleSelect(mod)}
            >
              <span className="material-icons mr-2">{moduleIcons[mod] || 'apps'}</span>
              {isOpen && <span>{mod}</span>}
            </li>
          ))}
        </ul>
      </nav>

      {/* Profile Section */}
      <div className="absolute bottom-0 left-0 w-full px-2 py-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold">S</div>
          {isOpen && (
            <div>
              <div className="font-semibold">Simran Sumit QA</div>
              <div className="text-xs text-gray-500">ID: pixis</div>
              <button className="text-xs text-red-500 mt-1">Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white rounded-lg shadow-lg p-6 w-96" onSubmit={handleCreateProject}>
            <h2 className="text-lg font-bold mb-4">Create New Project</h2>
            <label className="block mb-2 text-sm">Product Name</label>
            <input
              type="text"
              name="name"
              value={newProject.name}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1 mb-3"
              required
            />
            <label className="block mb-2 text-sm">Product Description</label>
            <textarea
              name="description"
              value={newProject.description}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1 mb-3"
              required
            />
            <label className="block mb-2 text-sm">Context for LLM (Brain Dump)</label>
            <textarea
              name="context"
              value={newProject.context}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1 mb-3"
              required
            />
            <div className="flex justify-end space-x-2">
              <button type="button" className="px-3 py-1 bg-gray-200 rounded" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Create</button>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
};

export default Sidebar; 