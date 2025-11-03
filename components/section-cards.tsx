"use client"

import {
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconCheck,
  IconX,
  IconPercentage,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards({
  stats = {
    totalStudents: 1200,
    presentToday: 1100,
    absentToday: 100,
    attendanceRate: 91.7,
  },
}: {
  stats?: {
    totalStudents: number
    presentToday: number
    absentToday: number
    attendanceRate: number
  }
}) {
  const { totalStudents, presentToday, absentToday, attendanceRate } = stats

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Students */}
      <Card className="@container/card border-zinc-200">
        <CardHeader>
          <CardDescription>Total Students</CardDescription>
          <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
            {totalStudents}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <IconUsers className="size-4" />
              All Enrolled
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Total registered students
          </div>
          <div className="text-muted-foreground">
            Includes all active and inactive students
          </div>
        </CardFooter>
      </Card>

      {/* Present Today */}
      <Card className="@container/card border-zinc-200">
        <CardHeader>
          <CardDescription>Present Today</CardDescription>
          <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
            {presentToday}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1 text-green-600">
              <IconCheck className="size-4" />
              {((presentToday / totalStudents) * 100).toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium text-green-600">
            Attendance improving <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Compared to last week</div>
        </CardFooter>
      </Card>

      {/* Absent Today */}
      <Card className="@container/card border-zinc-200">
        <CardHeader>
          <CardDescription>Absent Today</CardDescription>
          <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
            {absentToday}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1 text-red-600">
              <IconX className="size-4" />
              {((absentToday / totalStudents) * 100).toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium text-red-600">
            Slight increase <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Compared to last attendance report
          </div>
        </CardFooter>
      </Card>

      {/* Attendance Rate */}
      <Card className="@container/card border-zinc-200">
        <CardHeader>
          <CardDescription>Attendance Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
            {attendanceRate.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={`gap-1 ${
                attendanceRate >= 90
                  ? "text-green-600"
                  : attendanceRate >= 75
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              <IconPercentage className="size-4" />
              {attendanceRate >= 90
                ? "Excellent"
                : attendanceRate >= 75
                ? "Average"
                : "Low"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Overall student participation
          </div>
          <div className="text-muted-foreground">
            Based on today’s attendance data
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
