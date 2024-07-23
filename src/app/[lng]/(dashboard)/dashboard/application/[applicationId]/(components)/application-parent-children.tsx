'use client';
import { IApplication } from '@/convex/applications';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useTranslation } from '@/src/app/i18n/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { z } from 'zod';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import { Button } from '@/src/components/ui/button';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/src/components/ui/command';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { cn } from '@/src/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import { Separator } from '@/src/components/ui/separator';
import { useState } from 'react';
import { Icons } from '@/src/components/icons';
import { toast } from '@/src/components/ui/use-toast';
import { applicationDescriptionDefinition, applicationNameDefinition } from '@/src/lib/helpers/application-fields-definition';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';

interface ApplicationParentChildrenFormProps {
  app: IApplication;
  lng: string;  
  apps: IApplication[];
}

const applicationParentChildren: React.FC<ApplicationParentChildrenFormProps> = ({
  app,
  lng,
  apps
}) => {
  const { t } = useTranslation(lng);
  const [open, setOpen] = useState(false);
  const IconAdd = Icons['add'];
  const [loading, setLoading] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [isDescriptionDisabled, setIsDescriptionDisabled] = useState(true);

  const formSchema = z.object({
    parentApplicationId: z.string().optional(),
    name: applicationNameDefinition(t, apps).optional(),
    description: applicationDescriptionDefinition(t)
  });
  type formValues = z.infer<typeof formSchema>;
  const defaultValues = { parentApplicationId: app.parentApplicationId };
  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: formValues) => {
    setLoading(true);
    try{
        form.reset();
        setOpen(false);
        toast({
            title: t(`application_toast_applicationHasBeenUpdated`) ,
            variant: 'default'
        });  
    }
    catch(error)
    {
        console.log(error);
        toast({
            title: t(`application_toast_errorOccuredDuringUpdatingProcess`) ,
            variant: 'destructive'
        });  
        throw error;
    }
    finally{
      setLoading(false);
    }
  };
  
  return (
    form && <Form {...form}>
    <form
      className="space-y-8"
    >
      <Card>
          <CardHeader>
          <div className="flex items-start">
              <CardTitle>{t('application_parentChildren_hierarchy')}</CardTitle>
          </div>
          </CardHeader>
          <CardContent>
          <div>
          <Dialog modal={true} open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="block" variant="link"><IconAdd className="h-4 w-4 inline-block"></IconAdd>{t(`common_add`)}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) =>onSubmit(data))}>
                        <DialogHeader>
                            <DialogTitle>{t(`application_parentChildren_addParentApplication`)}</DialogTitle>
                        </DialogHeader>
                        <div className="gap-8 mt-3">
                            <DialogDescription className="mb-2">
                                {t(`application_parentChildren_selectExistingParentApplication`)}
                            </DialogDescription>
                            <FormField
                              control={form.control}
                              name="parentApplicationId"
                              render={({ field }) => (
                              <FormItem className="flex flex-col">
                                  <FormLabel>{t(`application_parentChildren_parentApplication`)}</FormLabel>
                                  <Popover open={openPopover} onOpenChange={setOpenPopover} modal={true}>
                                      <PopoverTrigger asChild>
                                          <FormControl>
                                              <Button
                                                  variant="outline"
                                                  role="combobox"
                                                  className={cn(
                                                      "justify-between",
                                                      !field.value && "text-muted-foreground"
                                                  )}
                                                  >
                                                  {field.value
                                                    ? apps.find(
                                                        (x) => x._id === field.value
                                                      )?.name
                                                    : t('common_select', { value: t(`common_application`) })}
                                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                              </Button>
                                          </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-[300px] p-0">
                                          <Command>
                                              <CommandInput placeholder={t('common_search', { value: t(`common_application`) })} />
                                              <CommandList >
                                                  <CommandEmpty>{t('common_noFound', { value: t(`common_application`) })}</CommandEmpty>
                                                  <CommandGroup>
                                                      {
                                                        apps.filter(x => x._id !== app.parentApplicationId && x._id !== app._id)
                                                          .map((popoverApp) => (
                                                        <CommandItem
                                                          value={popoverApp.name}
                                                          key={popoverApp._id}
                                                          onSelect={() => {
                                                            form.setValue("parentApplicationId", popoverApp._id);
                                                            if (popoverApp._id) {
                                                              form.resetField("name");
                                                              form.resetField("description");
                                                            }                                                           
                                                            setOpenPopover(false);
                                                          }}
                                                        >
                                                          <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                popoverApp._id === field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                            )}
                                                          />
                                                          { popoverApp.name }
                                                        </CommandItem>
                                                        ))
                                                      }
                                                  </CommandGroup>
                                              </CommandList>
                                          </Command>
                                      </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                              </FormItem>
                              )}
                            />
                            <Separator className="my-3" />
                            <DialogDescription>
                                {t(`application_parentChildren_createANewParentApplication`)}
                            </DialogDescription>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t(`application_informationApplicationForm_applicationName`)}</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder={t(`application_informationApplicationForm_applicationName`)}
                                            {...field}
                                            onChange={e => {
                                                    form.setValue("name", e.target.value);
                                                    setIsDescriptionDisabled(e.target.value === '' ? true : false);
                                                    if (e.target.value) form.resetField("parentApplicationId");
                                                }
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                              <FormField
                                disabled={isDescriptionDisabled}
                                control={form!.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('common_description')}</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} className="min-h-32" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                /> 
                        </div>
                        <DialogFooter>                            
                            <Button variant="secondary" type="button" className="mt-4" onClick={() => { setOpen(false); form.reset();}}>
                                {t("common_cancel")}
                            </Button>
                            <Button className="mt-4" disabled={loading} type="submit">
                                { loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t("common_add")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>        
          
          </div>
          </CardContent>
      </Card>
      </form>
    </Form>
  );
};

export default applicationParentChildren;
