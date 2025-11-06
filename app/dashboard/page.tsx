"use client"
import { AttendanceTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { listenToAttendance } from "@/lib/attendanceService"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const [attendanceData, setAttendanceData] = useState<any[]>([])

  useEffect(() => {
    const unsubscribe = listenToAttendance(setAttendanceData);
    return unsubscribe;
  }, []);

  console.log("attendanceData in dashboard:", attendanceData);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 mx-4">
          <SectionCards />
          <div className="p-4 rounded-xl  bg-card shadow-sm">
            <AttendanceTable data={attendanceData} />
          </div>
        </div>
      </div>
    </div>
  )
}


