import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href='/dashboard/project/new'
            >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-medium">
                      New Project
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-10 w-10 text-muted-foreground"
                    >
                      <path d="M4 12H20M12 4V20" />
                    </svg>
                  </CardHeader>
                  <CardContent>                  
                    <p className="text-xs text-muted-foreground">
                      Create an empty project
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
      </div>
    </ScrollArea>
  );
}
