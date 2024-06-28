import { auth } from '@/src/auth';
import BreadCrumb from '@/src/lib/presenter/components/breadcrumb';
import { Canvas } from '@/src/lib/presenter/components/ui/diagram';
import { ScrollArea } from '@/src/lib/presenter/components/ui/scroll-area';
import { getByApplicationId } from '@/src/lib/core/application/queries/get-by-application-id';
import NotFound from '@/src/app/[lng]/not-found';
import { useTranslation } from '@/src/app/i18n';

export default async function page({
  params: { lng, applicationId },
}: {
  params: { lng: string, applicationId: string }
}) {
  const { t } = await useTranslation(lng)
  if (typeof applicationId !== 'string') return (<NotFound></NotFound>);

  let app;
  if (applicationId !== "new"){
    try {
      const session = (await auth())!;
      app = await(getByApplicationId(applicationId as string, session.user!.id!));    
      if (app === null) return (<NotFound></NotFound>);
    }
    catch(e)
    {
        if (process.env.NODE_ENV === "production") return (<NotFound></NotFound>);
        throw e;      
    }
  }

  const breadcrumbItems = [{ title: (applicationId === "new" ? 'New Project' : app!.name), link: '/dashboard/project' }];
  return (
    <ScrollArea className="h-full">
      <h1>{JSON.stringify(app)}</h1>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 h-screen">
        <BreadCrumb items={breadcrumbItems} />
        <div className="border-solid border-2 h-4/5">
          <Canvas></Canvas>
        </div>
      </div>
    </ScrollArea>
  );
}

