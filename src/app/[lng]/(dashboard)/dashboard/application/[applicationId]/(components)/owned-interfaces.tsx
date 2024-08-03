import { IInterface } from "@/convex/interfaces"
import { useTranslation } from "@/src/app/i18n/client";
import { ColumnDef, } from "@tanstack/react-table"
import { useState } from "react";
import ProvidedInterfaceForm from "./owned-interface-form";
import { IApplication } from "@/convex/applications";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { directionTranslator } from "@/src/lib/helpers/helpers";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { ArrowRightFromLine, ArrowRightLeft, ArrowRightToLine, Cable, MoreHorizontal, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/src/components/data-table/data-table-column-header";
import { DataTable } from "@/src/components/data-table/data-table";
import { FilterableColumnConfiguration } from "@/src/components/data-table/data-table-toolbar";
import { distinctFilter } from "@/src/lib/utils";

interface OwnedInterfacesProps {
    interfaces: IInterface[];
    app: IApplication;
    lng: string;  
  }
  
const ownedInterfaces: React.FC<OwnedInterfacesProps> = ({ interfaces, app, lng }) => {
    const { t } = useTranslation(lng);
    const columns: ColumnDef<IInterface>[] = [
      {
        accessorKey: "name",
        meta: { columnLabel: t("application_ownedInterfaces_name") },
        header: ({ column }) => <DataTableColumnHeader t={t} column={column} title={t("application_ownedInterfaces_name")} />,
        cell: ({ row }) => <div className="cursor-pointer" onClick={() => displayExistingInterfaceForm(row.getValue("name")) }>{row.getValue("name")}</div>
      },
      {
        accessorKey: "description",
        meta: { columnLabel: t("application_ownedInterfaces_description") },
        header: ({ column }) => <DataTableColumnHeader t={t} column={column} title={t("application_ownedInterfaces_description")} />,
        cell: ({ row }) => {
          const description = (row.getValue("description") as string);
          const displayDescription = description.substring(1, 30) + (description?.length > 30 ? "..." : "")
          return <div className="cursor-pointer" onClick={() => displayExistingInterfaceForm(row.getValue("name")) }>{displayDescription}</div>
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: "direction",
        meta: { columnLabel: t("application_ownedInterfaces_direction") },
        header: ({ column }) => <DataTableColumnHeader t={t} column={column} title={t("application_ownedInterfaces_direction")} />,
        cell: ({ row }) => directionTranslator(row.getValue("direction"), t),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: "dataObjectValue",
        meta: { columnLabel: t("application_ownedInterfaces_dataObject") },
        header: ({ column }) => <DataTableColumnHeader t={t} column={column} title={t("application_ownedInterfaces_dataObject")} />,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
      },
      },
      {
        accessorKey: "itComponentValue",
        meta: { columnLabel: t("application_ownedInterfaces_itComponent") },
        header: ({ column }) => <DataTableColumnHeader t={t} column={column} title={t("application_ownedInterfaces_itComponent")} />,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: "volumetry",
        meta: { columnLabel: t("application_ownedInterfaces_volumetry") },
        header: ({ column }) => <DataTableColumnHeader t={t} column={column} title={t("application_ownedInterfaces_volumetry")} />
      },
      {
        accessorKey: "frequence",
        meta: { columnLabel: t("application_ownedInterfaces_frequence") },
        header: ({ column }) => <DataTableColumnHeader t={t} column={column} title={t("application_ownedInterfaces_frequence")} />
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
                <PlusCircledIcon className="mr-2 h-3 w-3" />{t("application_ownedInterfaces_addConsumer")}
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

    const [isAddingMode, setIsAddingMode] = useState(false);
    const [interfaceNameToUpdate, setInterfaceNameToUpdate] = useState<string>();

    const displayExistingInterfaceForm = (name: string) => {
      setInterfaceNameToUpdate(name);
      setIsAddingMode(true);
    }
    const filterableColumnConfigurations = [
      {
        columnName: "direction",
        columnLabel: t("application_ownedInterfaces_direction"),
        values: [
          { value: "incoming", label: t("application_ownedInterfaces_incoming"), icon: ArrowRightToLine } ,
          { value: "outgoing", label: t("application_ownedInterfaces_outgoing"), icon: ArrowRightFromLine },
          { value: "bi-directional", label: t("application_ownedInterfaces_biDirectional"), icon: ArrowRightLeft }
        ]
      } as FilterableColumnConfiguration,
      {
        columnName: "dataObjectValue",
        columnLabel: t("application_ownedInterfaces_dataObject"),
        values: interfaces.map(x => x.dataObjectValue ?? "").filter(distinctFilter).map(x => ({ value: x, label: x === "" ? "(empty)": x }))
      } as FilterableColumnConfiguration,
      {
        columnName: "itComponentValue",
        columnLabel: t("application_ownedInterfaces_itComponent"),
        values: interfaces.map(x => x.itComponentValue ?? "").filter(distinctFilter).map(x => ({ value: x, label: x === "" ? "(empty)": x }))
      } as FilterableColumnConfiguration,
    ]
    return <>
            { !isAddingMode && 
            <div className="grid gap-4 grid-cols-1">
              <Card>
                  <CardHeader>
                      <div className="flex items-start">
                          <CardTitle><Cable className="w-4 h-4 inline-block" /> {t('application_ownedInterfaces_providedInterfaces')}</CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent>
                      <DataTable t={t} filterPlaceholder={t("application_ownedInterfaces_placeholderNameFilter")} filteredColumn="name" columns={columns} data={interfaces} filterableColumnConfigurations={filterableColumnConfigurations} />
                  </CardContent>
                  <CardFooter>                    
                    <div className="flex md:flex md:flex-grow flex-row justify-start">
                      <Button onClick={() => { setInterfaceNameToUpdate(undefined); setIsAddingMode(!isAddingMode); }}>
                        <PlusCircledIcon className="mr-2 h-4 w-4" />
                        {t('application_ownedInterfaces_addInterface')}
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

export default ownedInterfaces;