'use client'

import { FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

export const SprintBacklog: FC = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent className="">
        <Tabs defaultValue="unassigned">
          <TabsList className="w-full">
            <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
            <TabsTrigger value="assigned">Assigned</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="done">Done</TabsTrigger>
          </TabsList>
          <TabsContent value="unassigned"></TabsContent>
          <TabsContent value="assigned"></TabsContent>
          <TabsContent value="active"></TabsContent>
          <TabsContent value="done"></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
