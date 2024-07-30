import { IInterface } from "@/convex/interfaces"
import { useTranslation } from "@/src/app/i18n/client";
import { DataTable } from "@/src/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react";
import ProvidedInterfaceForm from "./provided-interface-form";
import { IApplication } from "@/convex/applications";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { directionTranslator } from "@/src/lib/helpers/helpers";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { ArrowUpDown } from "lucide-react";

interface ProvidedInterfacesProps {
    interfaces: IInterface[];
    app: IApplication;
    lng: string;  
  }
  
const providedInterfaces: React.FC<ProvidedInterfacesProps> = ({ interfaces, app, lng }) => {
    const { t } = useTranslation(lng);
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [interfaceNameToUpdate, setInterfaceNameToUpdate] = useState<string>();

    const displayExistingInterfaceForm = (name: string) => {
      setInterfaceNameToUpdate(name);
      setIsAddingMode(true);
    }
    const columns: ColumnDef<IInterface>[] = [
        {
          accessorKey: "name",
          enableHiding: false,
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                {t("application_providedInterfaces_name")}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: ({ row }) => {       
            return <div className="cursor-pointer" onClick={() => displayExistingInterfaceForm(row.getValue("name")) }>{row.getValue("name")}</div>
          },
        },
        {
          accessorKey: "description",
          header: t("application_providedInterfaces_description"),
          cell: ({ row }) => {
            const description = (row.getValue("description") as string);
            const displayDescription = description.substring(1, 30) + (description?.length > 30 ? "..." : "")
            return <div className="cursor-pointer" onClick={() => displayExistingInterfaceForm(row.getValue("name")) }>{displayDescription}</div>
          },
        },
        {
          accessorKey: "direction",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                {t("application_providedInterfaces_direction")}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
          cell: ({ row }) => {       
            return directionTranslator(row.getValue("direction"), t)
          }
        },
        {
          accessorKey: "dataObjectValue",          
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                {t("application_providedInterfaces_dataObject")}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
        },
        {
          accessorKey: "itComponentValue",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                {t("application_providedInterfaces_itComponent")}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
        },
        {
          accessorKey: "volumetry",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                {t("application_providedInterfaces_volumetry")}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
        },
        {
          accessorKey: "frequence",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                {t("application_providedInterfaces_frequence")}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
        },
      ]
    return <>
            { !isAddingMode && 
            <div className="grid gap-4 grid-cols-1">
              <Card>
                  <CardHeader>
                      <div className="flex items-start">
                          <CardTitle>{t('application_providedInterfaces_providedInterfaces')}</CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent>
                        <div className="flex md:flex md:flex-grow flex-row justify-end">
                          <Button onClick={() => { setInterfaceNameToUpdate(undefined); setIsAddingMode(!isAddingMode); }}>
                            <PlusCircledIcon className="mr-2 h-4 w-4" />
                            {t('application_providedInterfaces_addInterface')}
                          </Button>
                        </div>
                      <DataTable lng={lng} columns={columns} data={interfaces} />
                  </CardContent>
              </Card>
            </div>
            }
            { 
              isAddingMode &&               
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                <ProvidedInterfaceForm 
                  interfaceNameToUpdate={interfaceNameToUpdate} 
                  app={app} 
                  lng={lng} 
                  interfaces={interfaces} 
                  close={() => setIsAddingMode(false)} />
              </div>
            }

    </>
}

export default providedInterfaces;