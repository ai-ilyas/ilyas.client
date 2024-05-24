import BreadCrumb from '@/components/breadcrumb';
import { Diagram } from '@/components/ui/diagram';
import { ScrollArea } from '@/components/ui/scroll-area';

const breadcrumbItems = [{ title: 'New Project', link: '/dashboard/project' }];
export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 h-screen">
        <BreadCrumb items={breadcrumbItems} />
        <div className="border-solid border-2 h-4/5">
          <Diagram></Diagram>
        </div>
      </div>
    </ScrollArea>
  );
}
