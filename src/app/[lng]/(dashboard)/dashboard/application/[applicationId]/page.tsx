import { auth } from '@/src/auth';
import BreadCrumb from '@/src/lib/presenter/components/breadcrumb';
import { Canvas } from '@/src/lib/presenter/components/ui/diagram';
import { ScrollArea } from '@/src/lib/presenter/components/ui/scroll-area';
import { getByApplicationId } from '@/src/lib/core/application/queries/get-by-application-id';
import NotFound from '@/src/app/[lng]/not-found';
import { useTranslation } from '@/src/app/i18n';
import { Button } from '@/src/lib/presenter/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/src/lib/presenter/components/ui/badge';
import InformationApplicationForm from './(components)/information-application-form';
import { IApplication } from '@/src/lib/domain/entities/application.interface';

export default async function page({
  params: { lng, applicationId }
}: {
  params: { lng: string; applicationId: string };
}) {
  const { t } = await useTranslation(lng);
  if (typeof applicationId !== 'string') return <NotFound></NotFound>;

  let app: IApplication | null;

  try {
    const session = (await auth())!;
    app = await getByApplicationId(
      applicationId as string,
      session.user!.id!
    );
    if (app === null) return <NotFound></NotFound>;
  } catch (e) {
    if (process.env.NODE_ENV === 'production') return <NotFound></NotFound>;
    throw e;
  }

  const breadcrumbItems = [
    {
      title:
        applicationId === 'new' ? t('application_page_newProject') : app!.name,
      link: '/dashboard/project'
    }
  ];
  return (
    <ScrollArea className="h-full">
      <h1>{JSON.stringify(app)}</h1>
      <BreadCrumb items={breadcrumbItems} />

      <div className="mx-auto grid flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {app?.name}
          </h1>
          <Badge variant="outline" className="ml-auto sm:ml-0">
            Decom
          </Badge>
          <Badge variant="outline" className="ml-auto sm:ml-0">
            Gold
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-5 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8">
            <InformationApplicationForm
              app={app}
              lng={lng}
            ></InformationApplicationForm>
          </div>
          <div>
            <Canvas></Canvas>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
