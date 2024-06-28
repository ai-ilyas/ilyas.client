import BreadCrumb from '@/src/lib/presenter/components/breadcrumb';
import { KanbanBoard } from '@/src/lib/presenter/components/kanban/kanban-board';
import NewTaskDialog from '@/src/lib/presenter/components/kanban/new-task-dialog';
import { Heading } from '@/src/lib/presenter/components/ui/heading';

const breadcrumbItems = [{ title: 'Kanban', link: '/dashboard/kanban' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Kanban`} description="Manage tasks by dnd" />
          <NewTaskDialog />
        </div>
        <KanbanBoard />
      </div>
    </>
  );
}
