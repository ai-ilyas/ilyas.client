import { IApplication } from "@/convex/applications"
import { useTranslation } from "@/src/app/i18n/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Separator } from "@/src/components/ui/separator"
import ParentApplication from "./parent-application"
import { Network, SquareArrowDown } from "lucide-react"
import ChildrenApplications from "./children-applications"

interface HierarchyProps {
  app: IApplication;
  lng: string;  
  apps: IApplication[];
}

const hierarchyComponent : React.FC<HierarchyProps> = ({
    app,
    lng,
    apps
  }) => {
    const { t } = useTranslation(lng);
    return (
    <Card>
    <CardHeader className="pb-3">
      <CardTitle><Network className="w-4 h-4 inline-block" /> {t("application_hierarchy_hierarchy")}</CardTitle>
      <CardDescription>
        {t("application_hierarchy_hierarchyDescription")}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <h4 className="text-sm mb-2 font-medium">{t("application_hierarchy_parentApplication")}</h4>
      <ParentApplication
        app={app}
        lng={lng}
        apps={apps}>
      </ParentApplication>
      <Separator className="my-4" />
      <div className="space-y-4">
        <h4 className="text-sm font-medium">{t("application_hierarchy_childrenApplication")}</h4>
          <ChildrenApplications
            app={app}
            lng={lng}
            apps={apps}></ChildrenApplications>
      </div>
    </CardContent>
  </Card>);
}

export default hierarchyComponent;