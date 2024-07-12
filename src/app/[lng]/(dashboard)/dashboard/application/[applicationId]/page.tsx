'use client'
import BreadCrumb from '@/src/lib/presenter/components/breadcrumb';
import { Canvas } from '@/src/lib/presenter/components/ui/diagram';
import { ScrollArea } from '@/src/lib/presenter/components/ui/scroll-area';
import NotFound from '@/src/app/[lng]/not-found';
import InformationApplicationForm from './(components)/information-application-form';
import SpinnerLoading from '@/src/lib/presenter/components/spinner-loading';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';


export default function page({
  params: { lng, applicationId }
}: {
  params: { lng: string; applicationId: string };
}) {
  if (typeof applicationId !== 'string') return <NotFound></NotFound>;
  const applications = useQuery(api.applications.list);
  const app = applications?.find(x => x._id == applicationId);

  const breadcrumbItems = [
    {
      title: app?.name ?? '',
      link: '/dashboard/' + app?._id
    }
  ];

  if (app == undefined)
  {
    return (
      <div className="top-2/4">
        <SpinnerLoading lng={lng}></SpinnerLoading>
      </div>
    );  
  }

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
            app={app!}
            lng={lng}
            apps={applications!}
          ></InformationApplicationForm>
        </div>
          <Canvas></Canvas>
      </div>
    </ScrollArea>
  );
}
