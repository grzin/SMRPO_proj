'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { addStoryAction } from '@/actions/story-action'

export default function StoryAdd() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [acceptanceTests, setAcceptanceTests] = useState<string[]>([''])
  const [priority, setPriority] = useState<'must have' | 'should have' | 'could have' | 'won\'t have this time'>('must have')
  const [businessValue, setBusinessValue] = useState<number>(0)
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
    formData.append('project', projectId)

    const result = await addStoryAction(formData)
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
              <Input
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
                    <Button type="button" onClick={handleAddAcceptanceTest}>Add</Button>
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
                onChange={(e) => setPriority(e.target.value)}
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
            <Button type="submit">Add User Story</Button>
          </form>

        </CardContent>
      </Card>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  )
}