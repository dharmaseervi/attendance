import { AppSidebar } from "@/components/app-sidebar"
import { AttendanceTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"

export default function Dashboard() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <AttendanceTable
                data={[
                  { id: 1, name: "Aarav Mehta", class: "10", section: "A", status: "Present", date: "2025-11-03", remarks: "On time" },
                  { id: 2, name: "Diya Sharma", class: "10", section: "A", status: "Absent", date: "2025-11-03", remarks: "Sick" },
                  { id: 3, name: "Rohan Patel", class: "9", section: "B", status: "Present", date: "2025-11-03", remarks: "Good" },
                ]}
              />

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
