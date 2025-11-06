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
import { useEffect, useState } from "react"
import { onValue, ref } from "firebase/database"
import { db } from "@/lib/firebase"

export function SectionCards() {

  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    attendanceRate: 0,
  })

  useEffect(() => {
    const attendanceRef = ref(db, "attendance")
    onValue(attendanceRef, (snapshot) => {
      const data = snapshot.val() || {}
      const allStudents = Object.values(data).flatMap((day: any) =>
        Object.entries(day).filter(([key]) => key !== "id")
      )

      const total = allStudents.length
      const present = allStudents.filter(([_, s]: any) => s.status === "Present").length
      const absent = total - present
      const rate = total ? ((present / total) * 100).toFixed(1) : 0

      setStats({
        total,
        present,
        absent,
        attendanceRate: Number(rate),
      })
    })
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Students */}
      <Card className="@container/card border-zinc-200">
        <CardHeader>
          <CardDescription>Total Students</CardDescription>
          <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
            {stats.total}
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
            {stats.present}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1 text-green-600">
              <IconCheck className="size-4" />
              {((stats.present / stats.total) * 100).toFixed(1)}%
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
            {stats.absent}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1 text-red-600">
              <IconX className="size-4" />
              {((stats.absent / stats.total) * 100).toFixed(1)}%
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
            {stats.attendanceRate.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={`gap-1 ${stats.attendanceRate >= 90
                  ? "text-green-600"
                  : stats.attendanceRate >= 75
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
            >
              <IconPercentage className="size-4" />
              {stats.attendanceRate >= 90
                ? "Excellent"
                : stats.attendanceRate >= 75
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
