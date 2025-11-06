"use client"
import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "@/lib/firebase"
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"

export function SectionCardss() {
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
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Total Students</CardDescription>
          <CardTitle>{stats.total}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Present</CardDescription>
          <CardTitle>{stats.present}</CardTitle>
          <Badge variant="outline">
            <IconTrendingUp /> {stats.attendanceRate}%
          </Badge>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Absent</CardDescription>
          <CardTitle>{stats.absent}</CardTitle>
          <Badge variant="outline">
            <IconTrendingDown /> {100 - stats.attendanceRate}%
          </Badge>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Attendance Rate</CardDescription>
          <CardTitle>{stats.attendanceRate}%</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
