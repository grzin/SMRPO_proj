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
import { Label } from '@/components/ui/label'

import { useActionState } from 'react'
import { Project, Story, TaskTime } from '@/payload-types'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import datetimeDifference from 'datetime-difference'
import { createTimeAction } from '@/actions/time-management-actions'
import { Badge } from '../ui/badge'

function sumTimes(taskTimes: TaskTime[]) {
  dayjs.extend(duration)
  let sum = dayjs.duration(0)

  taskTimes.forEach((taskTime) => {
    if (taskTime.customHMS) {
      const negative = taskTime.customHMS.charAt(0) === '-'
      if (negative) {
        const arr = taskTime.customHMS.substring(2).split(' ')
        sum = sum.subtract({
          hours: Number(arr[0].split('h')[0]),
          minutes: Number(arr[1].split('m')[0]),
          seconds: Number(arr[2].split('s')[0]),
        })
      } else {
        const arr = taskTime.customHMS.split(' ')
        sum = sum.add({
          hours: Number(arr[0].split('h')[0]),
          minutes: Number(arr[1].split('m')[0]),
          seconds: Number(arr[2].split('s')[0]),
        })
      }
    } else if (taskTime.end) {
      const diff = datetimeDifference(new Date(taskTime.start), new Date(taskTime.end))
      sum = sum.add({
        hours: diff.hours,
        minutes: diff.minutes,
        seconds: diff.seconds,
      })
    }
  })

  return `${sum.hours()}h ${sum.minutes()}m ${sum.seconds()}s`
}

export default function TaskTimes({
  className,
  project,
  story,
  taskId,
  taskDescription,
  times,
  ...props
}: React.ComponentProps<'div'> & {
  project: Project
  story: Story
  taskId: string
  taskDescription: string
  times: TaskTime[]
}) {
  let initialState = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  }
  const [state, formAction, pending] = useActionState(createTimeAction, initialState)

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-xl font-bold">
          {story.title} - {taskDescription}
        </h1>
        <form>
          {times.find((taskTime) => taskTime.end === null && taskTime.customHMS === undefined) ? (
            <Button type="submit" className="text-white bg-red-500">
              Stop tracking
            </Button>
          ) : (
            <Button type="submit" className="text-white bg-emerald-400">
              Start tracking
            </Button>
          )}
        </form>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Start time</TableHead>
              <TableHead>End time</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {times.map((taskTime) => (
              <TableRow key={taskTime.id}>
                {taskTime.customHMS ? (
                  <>
                    <TableCell>{new Date(taskTime.start).toLocaleTimeString()}</TableCell>
                    <TableCell className="text-gray-400">custom entry</TableCell>
                    <TableCell>
                      {taskTime.customHMS.charAt(0) === '-' ? (
                        <Badge className="bg-red-500">{taskTime.customHMS}</Badge>
                      ) : (
                        <Badge className="bg-emerald-500">{taskTime.customHMS}</Badge>
                      )}
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{new Date(taskTime.start).toLocaleTimeString()}</TableCell>
                    {taskTime.end ? (
                      <>
                        <TableCell>{new Date(taskTime.end).toLocaleTimeString()}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500">
                            {datetimeDifference(new Date(taskTime.start), new Date(taskTime.end))
                              .hours +
                              'h ' +
                              datetimeDifference(new Date(taskTime.start), new Date(taskTime.end))
                                .minutes +
                              'm ' +
                              datetimeDifference(new Date(taskTime.start), new Date(taskTime.end))
                                .seconds +
                              's'}
                          </Badge>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-bold text-emerald-500">in progress...</TableCell>
                        <TableCell>
                          <Badge className="bg-gray-400">-</Badge>
                        </TableCell>
                      </>
                    )}
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Sum</TableCell>
              <TableCell></TableCell>
              <TableCell>{sumTimes(times)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <h2 className="font-bold mt-12 bg-emerald-200 p-4">Add custom</h2>
        <form action={formAction} className="flex flex-col gap-4 max-w-sm mx-auto">
          <Input name="projectId" value={project.id} hidden readOnly />
          <Input name="taskId" value={taskId} hidden readOnly />
          <Label htmlFor="hours">Hours</Label>
          <Input
            name="hours"
            id="hours"
            type="number"
            placeholder="Hours"
            min="0"
            max="23"
            required
          />
          <Label htmlFor="minutes">Minutes</Label>
          <Input
            name="minutes"
            id="minutes"
            type="number"
            placeholder="Minutes"
            min="0"
            max="59"
            required
          />
          <Label htmlFor="seconds">Seconds</Label>
          <Input
            name="seconds"
            id="seconds"
            type="number"
            placeholder="Seconds"
            min="0"
            max="59"
            required
          />
          <div className="flex items-center">
            <Button
              type="submit"
              name="action"
              value="add"
              className="text-white bg-emerald-500 mr-4"
            >
              Add time
            </Button>
            <Button type="submit" name="action" value="subtract" className="text-white bg-red-500">
              Subtract time
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
