import { auth } from '@/src/auth';
import { getAllApplications } from '@/src/lib/core/application/queries/get-all-applications';
import { ScrollArea } from '@/src/lib/presenter/components/ui/scroll-area';
import { useTranslation } from '@/src/app/i18n/';
import ApplicationListWrapper from './(components)/application-list-wrapper';

export const dynamic = 'force'
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const preferredRegion = 'auto'
export const maxDuration = 5

export default async function page({
  params: { lng },
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng);
  const session = (await auth())!;
  const applications = await(getAllApplications(true, session.user!.id!));
  const apps = JSON.parse(JSON.stringify(applications))
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {t("dashboard_home_myApplications")}
          </h2>
        </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">              
              <ApplicationListWrapper lng={lng} apps={ {...apps} }></ApplicationListWrapper>
            </div>
      </div>
    </ScrollArea>
  );
}
