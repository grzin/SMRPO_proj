import React, { useState } from 'react';
import { Project } from '@/payload-types';

const AddProjectForm = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('');
  const project = { name: name };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    const response = await fetch('http://localhost:3000/api/projects', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    const data = await response.json();
    } catch (error) {
        console.error('Failed to add project.', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Project Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Project</button>
    </form>
  );
};

export default AddProjectForm;