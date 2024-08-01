import { IInterface } from "@/convex/interfaces"
import { useTranslation } from "@/src/app/i18n/client";
import { DataTable } from "@/src/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react";
import ProvidedInterfaceForm from "./provided-interface-form";
import { IApplication } from "@/convex/applications";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { directionTranslator } from "@/src/lib/helpers/helpers";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { ArrowUpDown, Cable, MoreHorizontal, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";

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
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  {t("application_providedInterfaces_name")}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )
          },
          cell: ({ row }) => {       
            return <div className="cursor-pointer hover:black text-center" onClick={() => displayExistingInterfaceForm(row.getValue("name")) }>{row.getValue("name")}</div>
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
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  {t("application_providedInterfaces_direction")}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )
          },
          cell: ({ row }) => {       
            return <div className="text-center">{directionTranslator(row.getValue("direction"), t)}</div>
          }
        },
        {
          accessorKey: "dataObjectValue",          
          header: ({ column }) => {
            return (
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  {t("application_providedInterfaces_dataObject")}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )
          },
          cell: ({ row }) => {       
            return <div className="text-center">{row.getValue("dataObjectValue")}</div>
          }
        },
        {
          accessorKey: "itComponentValue",
          header: ({ column }) => {
            return (
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  {t("application_providedInterfaces_itComponent")}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )
          },
          cell: ({ row }) => {       
            return <div className="text-center">{row.getValue("itComponentValue")}</div>
          }
        },
        {
          accessorKey: "volumetry",
          header: ({ column }) => {
            return (
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  {t("application_providedInterfaces_volumetry")}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )
          },
          cell: ({ row }) => {       
            return <div className="text-center">{row.getValue("volumetry")}</div>
          }
        },
        {
          accessorKey: "frequence",
          header: ({ column }) => {
            return (
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  {t("application_providedInterfaces_frequence")}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )
          },
          cell: ({ row }) => {       
            return <div className="text-center">{row.getValue("frequence")}</div>
          }
        },
        {
          id: "actions",
          cell: ({ row }) => {
            const _interface = row.original
       
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(_interface._id)}
                  >
                    Copy interface ID
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                  <PlusCircledIcon className="mr-2 h-3 w-3" />{t("application_providedInterfaces_addConsumer")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Trash className="h-3 w-3 mr-2" />{t("common_remove")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                          <CardTitle><Cable className="w-4 h-4 inline-block" /> {t('application_providedInterfaces_providedInterfaces')}</CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent>
                      <DataTable lng={lng} columns={columns} data={interfaces} />
                  </CardContent>
                  <CardFooter>                    
                    <div className="flex md:flex md:flex-grow flex-row justify-start">
                      <Button onClick={() => { setInterfaceNameToUpdate(undefined); setIsAddingMode(!isAddingMode); }}>
                        <PlusCircledIcon className="mr-2 h-4 w-4" />
                        {t('application_providedInterfaces_addInterface')}
                      </Button>
                    </div>
                  </CardFooter>
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