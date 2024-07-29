import { IInterface } from "@/convex/interfaces"
import { useTranslation } from "@/src/app/i18n/client";
import { DataTable } from "@/src/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react";
import ProvidedInterfaceForm from "./provided-interface-form";
import { IApplication } from "@/convex/applications";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";

interface ProvidedInterfacesProps {
    interfaces: IInterface[];
    app: IApplication;
    lng: string;  
  }
  
const providedInterfaces: React.FC<ProvidedInterfacesProps> = ({ interfaces, app, lng }) => {
    const { t } = useTranslation(lng);
    const [isAddingMode, setIsAddingMode] = useState(false);
    const columns: ColumnDef<IInterface>[] = [
        {
          accessorKey: "name",
          header: t("application_providedInterfaces_name"),
        },
        {
          accessorKey: "description",
          header: t("application_providedInterfaces_description"),
        },
        {
          accessorKey: "direction",
          header: t("application_providedInterfaces_direction"),
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
                    <DataTable columns={columns} data={interfaces} /> 
                    <Button className="db" onClick={() => setIsAddingMode(!isAddingMode) }>Button</Button>
                </CardContent>
            </Card>
            }
            { 
                isAddingMode && <ProvidedInterfaceForm app={app} lng={lng} interfaces={interfaces} close={() => setIsAddingMode(false)} />
            }

    </>
}

export default providedInterfaces;