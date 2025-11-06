"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { ref, onValue, set } from "firebase/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import TimetablePreview from "./timetable-preview"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default function TimetableForm() {
    const [timetable, setTimetable] = useState<any>({})

    useEffect(() => {
        const unsubscribe = onValue(ref(db, "timetable"), (snapshot) => {
            setTimetable(snapshot.val() || {})
        })
        return () => unsubscribe()
    }, [])

    const addPeriod = (day: string) => {
        setTimetable((prev: any) => ({
            ...prev,
            [day]: [...(prev[day] || []), { timeSlot: "", subject: "", faculty: "" }]
        }))
    }

    const updatePeriod = (day: string, index: number, field: string, value: string) => {
        const updated = [...(timetable[day] || [])]
        updated[index][field] = value
        setTimetable((prev: any) => ({ ...prev, [day]: updated }))
    }

    const removePeriod = (day: string, index: number) => {
        const updated = [...timetable[day]]
        updated.splice(index, 1)
        setTimetable((prev: any) => ({ ...prev, [day]: updated }))
    }

    const saveTimetable = async () => {
        await set(ref(db, "timetable"), timetable)
        toast.success("✅ Timetable saved successfully")
    }

    return (
        <div className="flex flex-col gap-4">

            <TimetablePreview timetable={timetable} />


            {days.map((day) => (
                <Card key={day} className="border border-zinc-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">{day}</CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-4">
                        {(timetable[day] || []).map((period: any, index: number) => (
                            <div key={index} className="flex flex-col gap-3 bg-muted/40 p-4 rounded-lg border">

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <Label>Time Slot</Label>
                                        <Input
                                            placeholder="8:45 - 9:45 AM"
                                            value={period.timeSlot}
                                            onChange={(e) => updatePeriod(day, index, "timeSlot", e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <Label>Subject</Label>
                                        <Input
                                            placeholder="Subject"
                                            value={period.subject}
                                            onChange={(e) => updatePeriod(day, index, "subject", e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <Label>Faculty</Label>
                                        <Input
                                            placeholder="Faculty Name"
                                            value={period.faculty}
                                            onChange={(e) => updatePeriod(day, index, "faculty", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="w-fit ml-auto"
                                    onClick={() => removePeriod(day, index)}
                                >
                                    <Trash2 className="size-4 mr-2" /> Remove Period
                                </Button>

                            </div>
                        ))}

                        <Button variant="ghost" onClick={() => addPeriod(day)} className="flex items-center gap-2">
                            <PlusCircle className="size-5" />
                            Add Period
                        </Button>

                    </CardContent>
                </Card>
            ))}

            <Separator />
            <Button onClick={saveTimetable} className="w-fit self-end">Save Timetable</Button>
        </div>
    )
}
