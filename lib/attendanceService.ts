"use client"
import { db } from "./firebase"
import { ref, get, set, push, update, remove, onValue } from "firebase/database"

const attendanceRef = ref(db, "attendance")

// Fetch all attendance records (real-time listener)
export function listenToAttendance(callback: (records: any[]) => void) {
  onValue(attendanceRef, (snapshot) => {
    const raw = snapshot.val() || {};

    // Normalize into an array of day entries
    const days = Object.entries(raw).map(([date, students]: any) => ({
      date,
      students,
    }));

    // Flatten into your final table data
    const formatted = days.flatMap(({ date, students }: any) =>
      Object.entries(students).map(([student, info]: any) => ({
        id: `${date}_${student}`,
        name: student.replace(/_/g, " "),
        status: info.status,
        time: info.time,
        identifier: info.identifier,
        date,
      }))
    );

    callback(formatted);
  });
}


// Add new record
export async function addAttendance(record: any) {
  const newRef = push(attendanceRef)
  await set(newRef, record)
}

// Update record
export async function updateAttendance(id: string, updates: any) {
  const recordRef = ref(db, `attendance/${id}`)
  await update(recordRef, updates)
}

// Delete record
export async function deleteAttendance(id: string) {
  const recordRef = ref(db, `attendance/${id}`)
  await remove(recordRef)
}
