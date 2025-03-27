'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { addStoryAction } from '@/actions/story-action'
import { Project, User } from '@/payload-types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StoryAddProps {
  project: Project
  user: User
}

export default function StoryAdd({ project, user }: StoryAddProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [acceptanceTests, setAcceptanceTests] = useState<string[]>([''])
  const [priority, setPriority] = useState<
    'must have' | 'should have' | 'could have' | "won't have this time"
  >('must have')
  const [businessValue, setBusinessValue] = useState<string>('1')
  const [error, setError] = useState<string | null>(null)

  const projectId = searchParams.get('projectId')

  const handleAddAcceptanceTest = () => {
    setAcceptanceTests([...acceptanceTests, ''])
  }

  const handleAcceptanceTestChange = (index: number, value: string) => {
    const newAcceptanceTests = [...acceptanceTests]
    newAcceptanceTests[index] = value
    setAcceptanceTests(newAcceptanceTests)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append('project', projectId as string)

    const result = await addStoryAction(formData, project.members)
    if (result.error) {
      setError(result.error)
      return
    }

    router.push(`/projects/${projectId}`) // Redirect to the stories page
  }

  return (
    <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Add User Story</CardTitle>
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
                    onChange={(e) => handleAcceptanceTestChange(index, e.target.value)}
                    required
                  />
                  {index === acceptanceTests.length - 1 && (
                    <Button type="button" onClick={handleAddAcceptanceTest}>
                      Add
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="grid gap-3">
              <label htmlFor="priority">Priority</label>
              <Select value={priority} onValueChange={(e) => setPriority(e as any)} name="priority">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="1" value="must have">Must Have</SelectItem>
                  <SelectItem key="2" value="should have">Should Have</SelectItem>
                  <SelectItem key="3" value="could have">Could Have</SelectItem>
                  <SelectItem key="4" value="won't have this time">Won&apos;t Have This Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <label htmlFor="businessValue">Business Value</label>
              <Select value={businessValue} onValueChange={setBusinessValue} name="businessValue">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select business value" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Add User Story</Button>
          </form>
        </CardContent>
      </Card>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  )
}
