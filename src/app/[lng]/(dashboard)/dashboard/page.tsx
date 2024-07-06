import { ScrollArea } from '@/src/lib/presenter/components/ui/scroll-area';
import { useTranslation } from '@/src/app/i18n/';
import DashboardContainer from './(components)/dashboard-container';

export default async function page({
  params: { lng },
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng);
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {t("dashboard_home_myApplications")}
          </h2>
        </div>         
        <DashboardContainer lng={lng}></DashboardContainer>
      </div>
    </ScrollArea>
  );
}
