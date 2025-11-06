"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function TimetablePreview({ timetable }: { timetable: any }) {
  if (!timetable) return null

  return (
    <Card className="border border-border/50 shadow-sm rounded-xl p-6 space-y-8 mt-10">
      <CardHeader className="p-0">
        <CardTitle className="text-xl font-semibold tracking-tight">
          Weekly Timetable Overview
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-10 p-0">
        {Object.entries(timetable).map(([day, periods]: any) => (
          <div key={day} className="space-y-4">
            {/* Day Label */}
            <h3 className="text-lg font-medium text-foreground">{day}</h3>

            {/* Period Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(periods || []).map((p: any, index: number) => (
                <div
                  key={index}
                  className="rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/30 transition shadow-sm p-4 flex flex-col gap-2"
                >
                  <Badge variant="outline" className="w-fit text-xs tracking-wide">
                    Period {index + 1}
                  </Badge>

                  <div className="text-base font-semibold text-foreground">
                    {p.subject || "—"}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {p.timeSlot || "Time not set"}
                  </div>

                  <div className="text-sm italic text-foreground/80">
                    {p.faculty || "Faculty not assigned"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
