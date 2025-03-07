import Projects from './projects'

export default async function Page() {
  const res = await fetch('http://localhost:3000/api/projects');
  const data = await res.json();
  const project = data.docs[0];

  return <Projects project={project} />
}