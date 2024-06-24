import { auth } from '@/src/auth';
import BreadCrumb from '@/src/components/breadcrumb';
import { Canvas } from '@/src/components/ui/diagram';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { getByApplicationId } from '@/src/lib/core/application/queries/get-by-application-id';

export default async function page() {
  const session = (await auth())!;
  const app = await(getByApplicationId("6677ec723936827fa4a865e3", "1")); //session.user!.id!

  const breadcrumbItems = [{ title: 'New Project', link: '/dashboard/project' }];
  return (
    <ScrollArea className="h-full">
      <h1>{JSON.stringify(app)} {JSON.stringify(session)}</h1>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 h-screen">
        <BreadCrumb items={breadcrumbItems} />
        <div className="border-solid border-2 h-4/5">
          <Canvas></Canvas>
        </div>
      </div>
    </ScrollArea>
  );
}

