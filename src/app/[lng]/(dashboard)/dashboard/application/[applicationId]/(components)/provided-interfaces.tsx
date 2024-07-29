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
          header: t("application_providedInterfaces_name"),
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
          header: t("application_providedInterfaces_direction"),
          cell: ({ row }) => {       
            return directionTranslator(row.getValue("direction"), t)
          }
        },
        {
          accessorKey: "volumetry",
          header: t("application_providedInterfaces_volumetry"),
        },
        {
          accessorKey: "frequence",
          header: t("application_providedInterfaces_frequence"),
        },
      ]
    return <>
            { !isAddingMode && <Card>
                <CardHeader>
                    <div className="flex items-start">
                        <CardTitle>{t('application_providedInterfaces_providedInterfaces')}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                      <div className="flex md:flex md:flex-grow flex-row justify-end m-4">
                        <Button onClick={() => { setInterfaceNameToUpdate(undefined); setIsAddingMode(!isAddingMode); }}>
                          <PlusCircledIcon className="mr-2 h-4 w-4" />
                          {t('application_providedInterfaces_addInterface')}
                        </Button>
                      </div>
                    <DataTable columns={columns} data={interfaces} />
                </CardContent>
            </Card>
            }
            { 
                isAddingMode && <ProvidedInterfaceForm interfaceNameToUpdate={interfaceNameToUpdate} app={app} lng={lng} interfaces={interfaces} close={() => setIsAddingMode(false)} />
            }

    </>
}

export default providedInterfaces;