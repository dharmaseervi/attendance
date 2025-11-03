"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconDotsVertical,
  IconGripVertical,
  IconTrendingUp,
  IconUser,
} from "@tabler/icons-react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type Row,
} from "@tanstack/react-table"
import { z } from "zod"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useIsMobile } from "@/hooks/use-mobile"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// ✅ Attendance schema
export const attendanceSchema = z.object({
  id: z.number(),
  name: z.string(),
  class: z.string(),
  section: z.string(),
  status: z.enum(["Present", "Absent"]),
  date: z.string(),
  remarks: z.string(),
})

// ✅ Drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id })
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="size-3" />
    </Button>
  )
}

// ✅ Table columns
const columns: ColumnDef<z.infer<typeof attendanceSchema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Student Name",
    cell: ({ row }) => <StudentDrawer student={row.original} />,
  },
  {
    accessorKey: "class",
    header: "Class",
  },
  {
    accessorKey: "section",
    header: "Section",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      row.original.status === "Present" ? (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400 gap-1">
          <IconCircleCheckFilled className="size-3" /> Present
        </Badge>
      ) : (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400 gap-1">
          <IconCircleXFilled className="size-3" /> Absent
        </Badge>
      ),
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(new Promise((r) => setTimeout(r, 800)), {
            loading: "Saving...",
            success: "Updated",
            error: "Error updating",
          })
        }}
      >
        <Input
          className="h-8 w-32 border-transparent bg-transparent text-sm"
          defaultValue={row.original.remarks}
        />
      </form>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <IconDotsVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Mark Absent</DropdownMenuItem>
          <DropdownMenuItem>Mark Present</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// ✅ Student row (draggable)
function DraggableRow({ row }: { row: Row<z.infer<typeof attendanceSchema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      ref={setNodeRef}
      data-dragging={isDragging}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="relative data-[dragging=true]:opacity-75"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

// ✅ Main Attendance Table
export function AttendanceTable({
  data: initialData,
}: {
  data: z.infer<typeof attendanceSchema>[]
}) {
  const [data, setData] = React.useState(initialData)
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )
  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data.map(({ id }) => id),
    [data]
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <Tabs defaultValue="attendance" className="w-full flex flex-col gap-6">
      <TabsContent value="attendance" className="px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                      <TableHead key={h.id}>
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </TabsContent>
    </Tabs>
  )
}

// ✅ Student Drawer (attendance details)
function StudentDrawer({
  student,
}: {
  student: z.infer<typeof attendanceSchema>
}) {
  const isMobile = useIsMobile()

  const chartData = [
    { month: "Jan", present: 20, absent: 2 },
    { month: "Feb", present: 18, absent: 3 },
    { month: "Mar", present: 22, absent: 1 },
    { month: "Apr", present: 19, absent: 2 },
  ]

  const chartConfig: ChartConfig = {
    present: { label: "Present", color: "hsl(var(--chart-1))" },
    absent: { label: "Absent", color: "hsl(var(--chart-2))" },
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="px-0 text-left text-foreground">
          <IconUser className="mr-1 size-4" /> {student.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{student.name}</DrawerTitle>
          <DrawerDescription>
            Attendance trend and details for this student
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 flex flex-col gap-4">
          <ChartContainer config={chartConfig}>
            <AreaChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <ChartTooltip
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="present"
                type="natural"
                fill="var(--color-present)"
                stroke="var(--color-present)"
                fillOpacity={0.4}
              />
              <Area
                dataKey="absent"
                type="natural"
                fill="var(--color-absent)"
                stroke="var(--color-absent)"
                fillOpacity={0.4}
              />
            </AreaChart>
          </ChartContainer>

          <div className="space-y-2">
            <Label>Status</Label>
            <Badge
              className={
                student.status === "Present"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            >
              {student.status}
            </Badge>
          </div>

          <div className="space-y-2">
            <Label>Remarks</Label>
            <Input defaultValue={student.remarks} />
          </div>
        </div>

        <DrawerFooter>
          <Button>Save</Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
