import BreadCrumb from '@/src/lib/presenter/components/breadcrumb';
import { CreateProfileOne } from '@/src/lib/presenter/components/forms/user-profile-stepper/create-profile';
import { ScrollArea } from '@/src/lib/presenter/components/ui/scroll-area';

const breadcrumbItems = [{ title: 'Profile', link: '/dashboard/profile' }];
export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <CreateProfileOne categories={[]} initialData={null} />
      </div>
    </ScrollArea>
  );
}
