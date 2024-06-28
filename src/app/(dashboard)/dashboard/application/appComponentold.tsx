import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/src/components/ui/table';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Checkbox } from '@/src/components/ui/checkbox';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription
} from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import Tager from './appTager';

const ApplicationView = () => {
  return (
    <>
      <ScrollArea className="h-dvh">
        <div className="flex flex-col">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
                  <CardTitle>AC Production</CardTitle>
                  <Tager></Tager>
              <CardDescription>
                Manages order flows and test engine results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    className="w-full"
                    defaultValue="Gamer Gear Pro Controller"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                    className="min-h-32"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Landscape
            </legend>
            <div className=" center flex">
              <div className="grid gap-3">
                <Label htmlFor="role">Parents components</Label>
                <Select defaultValue="UDP">
                  <SelectTrigger>
                    <SelectValue placeholder="What is the hosting parents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">UDP</SelectItem>
                    <SelectItem value="user">Manufacturing360</SelectItem>
                    <SelectItem value="assistant">+ Create new</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="role">Parents components</Label>
                <Select defaultValue="UDP">
                  <SelectTrigger>
                    <SelectValue placeholder="What is the hosting parents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">UDP</SelectItem>
                    <SelectItem value="user">Manufacturing360</SelectItem>
                    <SelectItem value="assistant">+ Create new</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </fieldset>

          <Table>
            <TableCaption>A list of application interfaces.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">REST API</TableCell>
                <TableCell>Live</TableCell>
                <TableCell>Order material</TableCell>
                <TableCell className="text-right">350 GB</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Card className="w-full max-w-xl">
            <CardHeader className="p-4">
              <h2 className="text-lg font-semibold">Task List</h2>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Checkbox id="task-1" />
                  <label htmlFor="task-1" className="font-medium">
                    Collect requirements
                  </label>
                </li>
                <li className="flex items-center space-x-2">
                  <Checkbox id="task-2" />
                  <label htmlFor="task-2" className="font-medium">
                    Define SQL datamodel
                  </label>
                </li>
                <li className="flex items-center space-x-2">
                  <Checkbox id="task-3" />
                  <label htmlFor="task-3" className="font-medium">
                    Validate ingestion validation
                  </label>
                </li>
                <li className="flex items-center space-x-2">
                  <Checkbox id="task-4" />
                  <label htmlFor="task-4" className="font-medium">
                    Prepare integration request
                  </label>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="p-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="New task..."
                  className="flex-grow"
                />
                <Button className="w-auto">Add Task</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </ScrollArea>
    </>
  );
};

export default ApplicationView;
