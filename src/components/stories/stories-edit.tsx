'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { editStoryAction, deleteStoryAction } from '@/actions/story-action'
import { useUser } from '@/contexts/user-context'
import { Project, Story } from '@/payload-types'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StoryEditProps {
  project: Project
  story: Story
}

export default function StoryEdit({ project, story }: StoryEditProps) {
  const router = useRouter()
  // const user = useUser()
  const searchParams = useSearchParams()
  const storyId = searchParams.get('storyId')
  const projectId = project.id

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [acceptanceTests, setAcceptanceTests] = useState<string[]>([''])
  const [priority, setPriority] = useState<
    'must have' | 'should have' | 'could have' | "won't have this time"
  >('must have')
  const [businessValue, setBusinessValue] = useState<number>(0)
  const [timeEstimate, setTimeEstimate] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  console.log(story)
  console.log(story.acceptanceTests)

  useEffect(() => {
    setTitle(story.title || '')
    setDescription(story.description || '')
    setAcceptanceTests(story.acceptanceTests?.map((test) => test.test) || [''])
    setPriority(story.priority || 'must have')
    setBusinessValue(story.businessValue || 0)
    setTimeEstimate(story.timeEstimate || 0)
  }, [story])

  const handleAddAcceptanceTest = () => {
    setAcceptanceTests([...acceptanceTests, ''])
  }

  const handleRemoveAcceptanceTest = (index: number) => {
    setAcceptanceTests(acceptanceTests.filter((_, i) => i !== index))
  }

  const handleAcceptanceTestChange = (index: number, value: string) => {
    const newAcceptanceTests = [...acceptanceTests]
    newAcceptanceTests[index] = value
    setAcceptanceTests(newAcceptanceTests)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append('storyId', storyId ?? '')

    const result = await editStoryAction(formData, project.members)
    if ('error' in result) {
      setError(result.error)
      return
    }

    router.push(`/projects/${projectId}`) // Redirect to the stories page
  }

  const handleDelete = async () => {
    const result = await deleteStoryAction(storyId)
    if ('error' in result) {
      setError(result.error)
      return
    }

    router.push(`/projects/${projectId}`)
  }

  return (
    <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Edit User Story</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3">
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <label>Acceptance Tests</label>
              {acceptanceTests.map((test, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    name="acceptanceTests"
                    value={test}
                    onChange={(e) => handleAcceptanceTestChange(index, e.target.value)}
                    required
                  />
                  {index === acceptanceTests.length - 1 && (
                    <Button type="button" onClick={handleAddAcceptanceTest}>
                      Add
                    </Button>
                  )}
                  {index === acceptanceTests.length - 1 && acceptanceTests.length > 1 && (
                    <Button type="button" onClick={() => handleRemoveAcceptanceTest(index)} className="bg-red-500 hover:bg-red-600 text-white">
                      Delete
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="grid gap-3">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                required
              >
                <option value="must have">Must Have</option>
                <option value="should have">Should Have</option>
                <option value="could have">Could Have</option>
                <option value="won't have this time">Won&apos;t Have This Time</option>
              </select>
            </div>
            <div className="grid gap-3">
              <label htmlFor="businessValue">Business Value</label>
              <Input
                id="businessValue"
                name="businessValue"
                type="number"
                value={businessValue}
                onChange={(e) => setBusinessValue(Number(e.target.value))}
                required
              />
            </div>
            <div className="grid gap-3">
              <label htmlFor="timeEstimate">Time Estimate</label>
              <Input
                id="timeEstimate"
                name="timeEstimate"
                type="number"
                value={timeEstimate}
                onChange={(e) => setTimeEstimate(Number(e.target.value))}
                min={0}
                required
              />
            </div>
            <div className="flex space-x-4">
              <Button type="submit">Edit User Story</Button>
              <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">
                Delete User Story
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  )
}
