import { auth } from '@/src/auth';
import BreadCrumb from '@/src/lib/presenter/components/breadcrumb';
import { Canvas } from '@/src/lib/presenter/components/ui/diagram';
import { ScrollArea } from '@/src/lib/presenter/components/ui/scroll-area';
import NotFound from '@/src/app/[lng]/not-found';
import InformationApplicationForm from './(components)/information-application-form';
import { IApplication } from '@/src/lib/domain/entities/application.interface';
import { getAllApplications } from '@/src/lib/core/application/queries/get-all-applications';


const getApplications = async () : Promise<IApplication[]> => {
  const session = (await auth())!;
  return await getAllApplications(true, session.user!.id!);
}

export default async function page({
  params: { lng, applicationId }
}: {
  params: { lng: string; applicationId: string };
}) {
  
  if (typeof applicationId !== 'string') return <NotFound></NotFound>;

  const applications = JSON.parse(JSON.stringify(await getApplications())) as IApplication[];
  const app = applications.find((x) => x._id === applicationId);
  if (app == undefined) return <NotFound></NotFound>;

  const breadcrumbItems = [
    {
      title: app!.name,
      link: '/dashboard/' + app._id
    }
  ];
  return (
    <ScrollArea className="h-full">

      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {app?.name}
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <InformationApplicationForm
            app={app}
            lng={lng}
          ></InformationApplicationForm>
        </div>
          <Canvas></Canvas>
      </div>
    </ScrollArea>
  );
}
