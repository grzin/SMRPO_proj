'use client'

import React, { useEffect, useState } from 'react';
import { Project, User, Role } from '@/payload-types'

interface ProjectInterface {
  name: string;
  user: UserInterface | null;
}
interface UserInterface {
  id: number;
  name?: string | null;
  role?:  null | Role;
  updatedAt: string;
  createdAt: string;
  email?: string | null;
  username: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}

const Projects = () => {
  const [projects, setProjects] = useState<ProjectInterface[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch('http://localhost:3000/api/projects');
      const data = await res.json();
      setProjects(data.docs); // Payload returns an array of documents in the "docs" field
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.name}>
            <h2>User assigned to project: {project.user ? project.user.name : ""} with role: {project.user && project.user.role ? project.user.role.role : ""}</h2>
            <p>Project name: {project.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;