"use client"

import * as React from "react"
import { z } from "zod"
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { IconCircleCheckFilled, IconCircleXFilled, IconUser } from "@tabler/icons-react"
import { useIsMobile } from "@/hooks/use-mobile"

// ✅ Matches your Firebase data
export const attendanceSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["Present", "Absent"]),
  date: z.string(),
  time: z.string().optional(),
  identifier: z.string().optional(),
})

// ✅ Student Details Drawer
function StudentDrawer({ student }: { student: z.infer<typeof attendanceSchema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <button className="text-left font-medium hover:underline">
          <IconUser className="inline-block mr-1 size-4" />
          {student.name}
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{student.name}</DrawerTitle>
          <DrawerDescription>Attendance details</DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-3">
          <p><strong>Status:</strong> {student.status}</p>
          <p><strong>Date:</strong> {student.date}</p>
          <p><strong>Marked At:</strong> {student.time ?? "-"}</p>
          <p><strong>Device:</strong> {student.identifier ?? "-"}</p>
          <p><strong>Record ID:</strong> {student.id}</p>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

// ✅ Table Columns (clean + matches schema)
const columns: ColumnDef<z.infer<typeof attendanceSchema>>[] = [
  {
    accessorKey: "name",
    header: "Student Name",
    cell: ({ row }) => <StudentDrawer student={row.original} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      row.original.status === "Present" ? (
        <Badge className="bg-green-100 text-green-700 gap-1">
          <IconCircleCheckFilled className="size-3" /> Present
        </Badge>
      ) : (
        <Badge className="bg-red-100 text-red-700 gap-1">
          <IconCircleXFilled className="size-3" /> Absent
        </Badge>
      ),
  },
  {
    accessorKey: "time",
    header: "Marked At",
    cell: ({ row }) => row.original.time ?? "—",
  },
  {
    accessorKey: "identifier",
    header: "Device",
    cell: ({ row }) => row.original.identifier ?? "—",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
]

// ✅ Main Table (uses data directly; no stale local state)
export function AttendanceTable({
  data,
}: {
  data: z.infer<typeof attendanceSchema>[]
}) {
  const table = useReactTable({
    data,               // 👈 use prop directly so updates always render
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const rows = table.getRowModel().rows

  return (
    <div className="border-red-900 rounded-lg border mx-4">
      <Table className="mx-4">
        <TableHeader className="bg-muted/60">
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                No attendance records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
