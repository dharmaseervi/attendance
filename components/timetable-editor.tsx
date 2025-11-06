"use client"

import { useState } from "react"
import { db } from "@/lib/firebase"
import { ref, update } from "firebase/database"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function TimetableEditor({ timetable }: { timetable: any }) {
  const [local, setLocal] = useState(timetable)

  const handleChange = (day: string, period: string, field: string, value: string) => {
    setLocal((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [period]: { ...prev[day][period], [field]: value },
      },
    }))
  }

  const savePeriod = (day: string, period: string) => {
    update(ref(db, `timetable/${day}/${period}`), local[day][period])
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Weekly Timetable</h2>

      {Object.entries(local).map(([day, periods]: any) => (
        <div key={day} className="border p-4 rounded-lg">
          <h3 className="font-medium text-lg mb-3">{day}</h3>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">Period</th>
                <th className="p-2">Time Slot</th>
                <th className="p-2">Subject</th>
                <th className="p-2">Faculty</th>
                <th className="p-2 text-center">Save</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(periods).map(([period, info]: any) => (
                <tr key={period} className="border-b">
                  <td className="p-2">{period}</td>

                  <td className="p-2">
                    <Input
                      value={info.timeSlot || ""}
                      onChange={(e) => handleChange(day, period, "timeSlot", e.target.value)}
                    />
                  </td>

                  <td className="p-2">
                    <Input
                      value={info.subject || ""}
                      onChange={(e) => handleChange(day, period, "subject", e.target.value)}
                    />
                  </td>

                  <td className="p-2">
                    <Input
                      value={info.faculty || ""}
                      onChange={(e) => handleChange(day, period, "faculty", e.target.value)}
                    />
                  </td>

                  <td className="p-2 text-center">
                    <Button size="sm" onClick={() => savePeriod(day, period)}>
                      Save
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
