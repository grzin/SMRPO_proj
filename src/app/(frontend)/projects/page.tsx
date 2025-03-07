'use client'

import React, { useEffect, useState } from 'react';
import { Project, User, Role } from '@/payload-types'
import Projects from './projects'

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

export default async function Page() {
  const res = await fetch('http://localhost:3000/api/projects');
  const data = await res.json();
  const project = data.docs[0];

  return <Projects project={project} />
}