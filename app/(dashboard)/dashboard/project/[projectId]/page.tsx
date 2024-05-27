import BreadCrumb from '@/components/breadcrumb';
import { Canvas } from '@/components/ui/diagram';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function page() {
  const breadcrumbItems = [{ title: 'New Project', link: '/dashboard/project' }];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 h-screen">
        <BreadCrumb items={breadcrumbItems} />
        <div className="border-solid border-2 h-4/5">
          <Canvas></Canvas>
        </div>
      </div>
    </ScrollArea>
  );
}
