import { auth } from '@/src/auth';
import { getAllApplications } from '@/src/lib/core/application/queries/get-all-applications';
import { ScrollArea } from '@/src/lib/presenter/components/ui/scroll-area';
import CreateApplicationForm from './(components)/create-application-form';

export default async function page() {
  const session = (await auth())!;
  const applications = await(getAllApplications(true, session.user!.id!));
  const apps = JSON.parse(JSON.stringify(applications))
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">              
              <CreateApplicationForm {...apps}></CreateApplicationForm>
            </div>
      </div>
    </ScrollArea>
  );
}
