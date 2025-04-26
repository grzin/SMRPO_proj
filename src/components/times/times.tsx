'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { useActionState } from 'react'
import { Project, Story, TaskTime, TimeTracking } from '@/payload-types'
import { manualTrackTimeAction, trackTimeAction } from '@/actions/time-management-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'

function sumTimes(times: TaskTime[]) {
  const s = times.map((t) => t.seconds).reduce((x, y) => x + y, 0)
  const m = times.map((t) => t.minutes).reduce((x, y) => x + y, 0) + Math.floor(s / 60)
  const h = times.map((t) => t.hours).reduce((x, y) => x + y, 0) + Math.floor(m / 60)
  return formatTime(h, m % 60, s % 60)
}

function formatTime(h: number, m: number, s: number) {
  return `${h}h ${m}m ${s}s`
}

export default function TaskTimes({
  className,
  project,
  story,
  taskId,
  taskDescription,
  isActiveTask,
  activeTaskDescription,
  times,
  ...props
}: React.ComponentProps<'div'> & {
  project: Project
  story: Story
  taskId: string
  taskDescription: string
  isActiveTask: boolean
  activeTaskDescription: string | null
  times: TaskTime[]
}) {
  const initialState = {}
  const manualInitialState = {
    date: new Date(),
    hours: 0,
    minutes: 0,
    seconds: 0,
    est_hours: 0,
    est_minutes: 0,
    est_seconds: 0,
  }
  const [state, formAction, pending] = useActionState(trackTimeAction, initialState)
  const [manualState, manualFormAction, manualPending] = useActionState(
    manualTrackTimeAction,
    initialState,
  )

  console.log('taskid', taskId)

  return (
    <div className={cn('flex', className)} {...props}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex gap-4 min-w-full">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Time tracking</CardTitle>
              <CardDescription>Automatic time tracking</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {activeTaskDescription ? (
                <p>
                  Time tracking is active for task:{' '}
                  <span className="font-bold">{activeTaskDescription}</span>
                </p>
              ) : (
                <form action={formAction}>
                  <Input name="projectId" value={project.id} hidden readOnly />
                  <Input name="taskId" value={taskId} hidden readOnly />
                  {isActiveTask ? (
                    <Button
                      type="submit"
                      name="action"
                      value="stop"
                      className="text-white bg-red-500"
                    >
                      Stop tracking
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      name="action"
                      value="start"
                      className="text-white bg-emerald-400"
                    >
                      Start tracking
                    </Button>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Update time</CardTitle>
              <CardDescription>Update time history</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <form action={manualFormAction} className="flex flex-col gap-4">
                <Input name="projectId" value={project.id} hidden readOnly />
                <Input name="taskId" value={taskId} hidden readOnly />
                <Label htmlFor="date">Date</Label>
                <Input name="date" id="date" type="date" required />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="hours">Hours</Label>
                    <Input
                      name="hours"
                      id="hours"
                      type="number"
                      min="0"
                      max="23"
                      placeholder="Hours"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="minutes">Minutes</Label>
                    <Input
                      name="minutes"
                      id="minutes"
                      type="number"
                      min="0"
                      max="59"
                      placeholder="Minutes"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="seconds">Seconds</Label>
                    <Input
                      name="seconds"
                      id="seconds"
                      type="number"
                      min="0"
                      max="59"
                      placeholder="Seconds"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="est_hours">Est. hours</Label>
                    <Input
                      name="est_hours"
                      id="est_hours"
                      type="number"
                      min="0"
                      max="23"
                      placeholder="Est. hours"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="est_minutes">Est. minutes</Label>
                    <Input
                      name="est_minutes"
                      id="est_minutes"
                      type="number"
                      min="0"
                      max="59"
                      placeholder="Est. minutes"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="est_seconds">Est. seconds</Label>
                    <Input
                      name="est_seconds"
                      id="est_seconds"
                      type="number"
                      min="0"
                      max="59"
                      placeholder="Est. seconds"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" name="action">
                  Update
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>Time management</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Estimated remaining time</TableHead>
                  <TableHead>Time spent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {times.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.date}</TableCell>
                    <TableCell>{`${t.est_hours}h ${t.est_minutes}m ${t.est_seconds}s`}</TableCell>
                    <TableCell>{`${t.hours}h ${t.minutes}m ${t.seconds}s`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>Sum</TableCell>
                  <TableCell></TableCell>
                  <TableCell>{sumTimes(times)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
