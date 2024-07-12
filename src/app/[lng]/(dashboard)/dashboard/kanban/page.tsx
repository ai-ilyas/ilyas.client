import BreadCrumb from '@/src/components/breadcrumb';
import { KanbanBoard } from '@/src/components/kanban/kanban-board';
import NewTaskDialog from '@/src/components/kanban/new-task-dialog';
import { Heading } from '@/src/components/ui/heading';

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
