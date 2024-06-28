import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import Image from "next/image"
import { z } from "zod"

import { columns } from "@/src/app/workspace/components/columns"
import { columnsapp } from "@/src/app/workspace/components/columnsapp"

import { DataTable } from "@/src/app/workspace/components/data-table"
import { UserNav } from "@/src/app/workspace/components/user-nav"
import { applicationSchema, taskSchema } from "./data/schema"
import { ScrollArea } from "@/src/components/ui/scroll-area"


export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "src/app/workspace/data/tasks.json")
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

async function getApplications() {
  const data = await fs.readFile(
    path.join(process.cwd(), "src/app/workspace/data/applications.json")
  )

  const apps = JSON.parse(data.toString())

  return z.array(applicationSchema).parse(apps)
}

export default async function TaskPage() {
  const applications = await getApplications()

  return (
    <>
     
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <DataTable data={applications} columns={columnsapp} />
      </div>
    </>
  )
}
