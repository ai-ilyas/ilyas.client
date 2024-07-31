'use client';
import { IApplication } from '@/convex/applications';
import { useTranslation } from '@/src/app/i18n/client';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { z } from 'zod';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import { Button } from '@/src/components/ui/button';
import { Check, ChevronsUpDown, Loader2, Trash } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/src/components/ui/command';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { cn } from '@/src/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import { Separator } from '@/src/components/ui/separator';
import { useState } from 'react';
import { toast } from '@/src/components/ui/use-toast';
import { applicationDescriptionDefinition, applicationNameDefinition } from '@/src/lib/helpers/application-fields-definition';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

interface ParentApplicationFormProps {
  app: IApplication;
  lng: string;  
  apps: IApplication[];
}

const parentApplication: React.FC<ParentApplicationFormProps> = ({
  app,
  lng,
  apps
}) => {
  const { t } = useTranslation(lng);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [isDescriptionDisabled, setIsDescriptionDisabled] = useState(true);
  const updateParentApplication = useMutation(api.applications.updateParentApplication);
  const removeParentApplication = useMutation(api.applications.removeParentApplication);
  const [openRemove, setOpenRemove] = useState(false);
  const formSchema = z.object({
    parentApplicationId: z.string().optional(),
    name: applicationNameDefinition(t, apps).optional().or(z.literal('')),
    description: applicationDescriptionDefinition(t)
  });
  type formValues = z.infer<typeof formSchema>;
  const defaultValues = { parentApplicationId: '', name: '', description: '' };
  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: formValues) => {
    setLoading(true);
    try{
        const r = await updateParentApplication({ 
          _id: app._id, 
          parentApplicationId: data.parentApplicationId,
          ...data });
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
  
  const onRemoveParentApplication = async () => {
    setLoading(true);
    try{
        await removeParentApplication({ _id: app._id });
        setOpenRemove(false);
        toast({
            title: t(`application_parentApplication_parentApplicationHasBeenRemoved`) ,
            variant: 'default'
        });  
    }
    catch(error)
    {
        console.log(error);
        toast({
            title: t(`application_parentApplication_parentApplicationHasNotBeenRemoved`) ,
            variant: 'destructive'
        });  
        throw error;
    }
    finally{
      setLoading(false);
    }
  };

  return (
    form && <>
          { 
            app.parentApplicationId && 
              <div className="font-extrabold flex justify-between">
                <div><Link href={"/dashboard/application/" + app.parentApplicationId}>{ apps.find(x => x._id === app.parentApplicationId)?.name }</Link></div>
                <div>
                <Dialog open={openRemove} onOpenChange={setOpenRemove}>
                    <DialogTrigger asChild>
                      <Button variant={'destructive'} className="shrink-0"><Trash className='w-4 h-4' /></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t(`application_parentApplication_removeTheParentApplication`)}</DialogTitle>
                            <div className="text-sm text-muted-foreground">
                                {t(`application_parentApplication_areYouSureYouWantToRemoveTheParentApplication`)}                                
                            </div>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={() => setOpenRemove(false)} variant="secondary">{t('common_cancel')}</Button>
                            <Button onClick={() => onRemoveParentApplication()} variant="destructive">{t('common_remove')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                </div>
              </div>
          }
          <Dialog modal={true} open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            { 
              !app.parentApplicationId && <div className="ml-auto mr-4">
                                            <Button>
                                              <PlusCircledIcon className="mr-2 h-4 w-4" />
                                              {t('common_add')}
                                            </Button>
                                          </div>
            }                
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) =>onSubmit(data))}>
                        <DialogHeader>
                            <DialogTitle>{t(`application_parentApplication_addParentApplication`)}</DialogTitle>
                        </DialogHeader>
                        <div className="gap-8 mt-3">
                            <DialogDescription className="mb-2">
                                {t(`application_parentApplication_selectExistingParentApplication`)}
                            </DialogDescription>
                            <FormField
                              control={form.control}
                              name="parentApplicationId"
                              render={({ field }) => (
                              <FormItem className="flex flex-col">
                                  <FormLabel>{t(`application_parentApplication_parentApplication`)}</FormLabel>
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
                                                        // #080 CLIENT SERVER Application cannot be its own parent application
                                                          // #090 CLIENT SERVER Application cannot be parent and child for another application
                                                        apps.filter(x => x._id !== app.parentApplicationId && x._id !== app._id && x.parentApplicationId !== app._id)
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
                                {t(`application_parentApplication_createANewParentApplication`)}
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
                                        <FormDescription className="float-right">
                                            {/* #050 CLIENT SERVER Application description length should be lower than 500 characters */}
                                            {(form.getValues().description?.length ?? 0) + "/500"}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                /> 
                        </div>
                        <DialogFooter className="mt-8">                            
                            <Button variant="secondary" type="button" onClick={() => { setOpen(false); form.reset();}}>
                                {t("common_cancel")}
                            </Button>
                            <Button disabled={loading} type="submit">
                                { loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t("common_add")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
          </Dialog>
    </>
  );
};

export default parentApplication;
