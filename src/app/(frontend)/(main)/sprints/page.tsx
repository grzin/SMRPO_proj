import Sprints from '@/components/sprints/sprints-table'
import { getPayload } from 'payload'
import config from '@/payload.config'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { getUser } from '@/actions/login-action'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import datetimeDifference from 'datetime-difference'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { TaskTime } from '@/payload-types'

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

export default async function Page() {
  const payload = await getPayload({ config })
  const user = await getUser(false)
  const sprints = await payload.find({
    collection: 'sprints',
    overrideAccess: false,
    user: user,
    limit: 10000,
  })

  const taskId = 1
  const taskTimes = await payload.find({
    collection: 'taskTimes',
    overrideAccess: false,
    user: user,
    limit: 10000,
    where: {
      user: { equals: user.id },
      task: { equals: taskId },
      or: [{ end: { less_than_equal: new Date().toISOString() } }, { end: { exists: false } }],
    },
  })

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Sprints</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Sprints sprints={sprints.docs} />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h2 className="font-bold text-2xl">Task {taskId}</h2>
        <h2 className="font-bold">Time tracking</h2>
        <form>
          {taskTimes.docs.find(
            (taskTime) => taskTime.end === null || taskTime.end === undefined,
          ) ? (
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
            {taskTimes.docs.map((taskTime) => (
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
              <TableCell>{sumTimes(taskTimes.docs)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <h2 className="font-bold mt-12">Add custom</h2>
        <form className="flex flex-col gap-4">
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
          <div className="flex items-center">
            <Button type="submit" value="add" className="text-white bg-emerald-500">
              Add time
            </Button>
            <Button type="submit" value="subtract" className="text-white bg-red-500">
              Subtract time
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
