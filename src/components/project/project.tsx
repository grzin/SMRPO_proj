'use client'

import { Project, Sprint, User } from '@/payload-types'
import { FC } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { useUser } from '@/contexts/user-context'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table'
import { UserAvatar } from '../ui/avatar'
import { Stories } from '../stories/stories'
import Link from 'next/link'

const roleNames = {
    methodology_manager: 'Methodology Manager',
    product_manager: 'Product Manager',
    developer: 'Developer',
}

export const ProjectDashboard: FC<{ project: Project, sprints: Sprint[]; canAddStory: boolean }> = ({ project, sprints, canAddStory }) => {
    const { user } = useUser()

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Project details</CardTitle>
                        <CardDescription>Project details</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <Table>
                            <TableBody>
                                <TableRow key="name">
                                    <TableCell className="text-lg font-semibold">Name:</TableCell>
                                    <TableCell>
                                        <h3 className="text-lg font-semibold">{project.name}</h3>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Members</CardTitle>
                        <CardDescription>Project members and roles</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">User</TableHead>
                                    <TableHead className="text-right">Role</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {project?.members?.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-medium">
                                            <UserAvatar user={member.user as User} />
                                        </TableCell>
                                        <TableCell className="text-right">{roleNames[member.role]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={2}>
                                        <Button variant="default">Add member</Button>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <Stories project={project} canAddStory={canAddStory} />
            <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Sprints</CardTitle>
                        <CardDescription>Project sprints</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Name</TableHead>
                                    <TableHead className="text-right">Speed</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sprints.map((sprint) => (
                                    <TableRow key={sprint.id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/sprints/${sprint.id}`}>{sprint.name}</Link>
                                        </TableCell>
                                        <TableCell className="text-right">{sprint.speed}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={2}>
                                        <Button variant="default">
                                            <Link href="/sprints/-1">Add sprint</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Tasks</CardTitle>
                        <CardDescription>Define and assign project tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p>-- Task here --</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
