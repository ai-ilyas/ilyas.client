'use client';
import { IApplication } from '@/convex/applications';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useTranslation } from '@/src/app/i18n/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { z } from 'zod';
import { Button } from '@/src/components/ui/button';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import { Separator } from '@/src/components/ui/separator';
import { useState } from 'react';
import { Icons } from '@/src/components/icons';
import { toast } from '@/src/components/ui/use-toast';
import { applicationDescriptionDefinition, applicationNameDefinition } from '@/src/lib/helpers/application-fields-definition';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { MultiSelect } from '@/src/components/multi-select';
import { Id } from '@/convex/_generated/dataModel';

interface ParentApplicationFormProps {
  app: IApplication;
  lng: string;  
  apps: IApplication[];
}

const childrenApplications: React.FC<ParentApplicationFormProps> = ({
  app,
  lng,
  apps
}) => {
  const { t } = useTranslation(lng);
  const [open, setOpen] = useState(false);
  const IconAdd = Icons['add'];
  const [loading, setLoading] = useState(false);
  const [isDescriptionDisabled, setIsDescriptionDisabled] = useState(true);
  const addChildrenApplications = useMutation(api.applications.addChildrenApplications);
  const removeParentApplication = useMutation(api.applications.removeParentApplication);
  const [openRemove, setOpenRemove] = useState(false);
  const [childAppToRemove, setChildAppToRemove] = useState<IApplication>();
  const IconClose = Icons['close'];
  const childApplications = apps.filter(x => x.parentApplicationId === app._id)
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

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
        const r = await addChildrenApplications({ 
          parentApplicationId: app._id, 
          childrenApplicationsIds: selectedChildren,
          name: data.name,
          description: data.description
        });
        form.reset();
        setSelectedChildren([]);
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
  
  const onRemoveChildApplication = async () => {
    setLoading(true);
    try{
        await removeParentApplication({ _id: childAppToRemove!._id });
        setOpenRemove(false);
        toast({
            title: t(`application_childrenApplication_childApplicationHasBeenRemoved`) ,
            variant: 'default'
        });  
    }
    catch(error)
    {
        console.log(error);
        toast({
            title: t(`application_childrenApplication_childApplicationHasNotBeenRemoved`) ,
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
              <CardTitle>{childApplications.length ?? '0' } {t('application_childrenApplication_childrenApplication')}</CardTitle>
          </div>
          </CardHeader>
          <CardContent>

          { 
            childApplications.map( childApp =>               
              <div key={childApp._id} className="db font-extrabold my-2 text-1xl">
                { childApp.name }
                <Dialog open={openRemove} onOpenChange={setOpenRemove}>
                    <DialogTrigger asChild>
                      <IconClose onClick={() => setChildAppToRemove(childApp)} className="inline-table align-text-top cursor-pointer ml-2 h-3 w-3" />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t(`application_childrenApplication_removeChildApplication`)}</DialogTitle>
                            <div className="text-sm text-muted-foreground">
                                {t(`application_childrenApplication_areYouSureYouWantToRemoveThisChildApplication`)}
                                <div className='db font-black text-center'>{childAppToRemove?.name}</div>                            
                            </div>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={() => setOpenRemove(false)} variant="secondary">{t('common_cancel')}</Button>
                            <Button onClick={() => onRemoveChildApplication()} variant="destructive">{t('common_remove')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
              </div>)
          }

          <div>
          <Dialog modal={true} open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            { 
              <Button className="block" variant="link"><IconAdd className="h-4 w-4 inline-block"></IconAdd>{t(`application_childrenApplication_addChildrenApplication`)}</Button>
            }                
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) =>onSubmit(data))}>
                        <DialogHeader>
                            <DialogTitle>{t(`application_childrenApplication_addChildrenApplication`)}</DialogTitle>
                        </DialogHeader>
                        <div className="gap-8 mt-3">
                            <DialogDescription className="mb-2">
                                {t(`application_childrenApplication_selectExistingChildrenApplication`)}
                            </DialogDescription>
                            <FormField
                              control={form.control}
                              name="parentApplicationId"
                              render={({ field }) => (
                              <FormItem className="flex flex-col">
                                  <FormLabel>{t(`application_childrenApplication_childrenApplication`)}</FormLabel>
                                  <MultiSelect
                                      lng={lng}
                                      // #080 CLIENT SERVER Application cannot be its own parent application
                                      options={apps.filter(x => x.parentApplicationId !== app._id && app._id !== x._id).map(x => ({ value: x._id, label: x.name }))}
                                      onValueChange={setSelectedChildren}
                                      defaultValue={selectedChildren}
                                      placeholder={t("application_childrenApplication_selectChildrenApplication")}
                                      variant="secondary"
                                      animation={2}
                                      maxCount={3}
                                    />
                                  <FormMessage />
                              </FormItem>
                              )}
                            />
                            <Separator className="my-3" />
                            <DialogDescription>
                                {t(`application_childrenApplication_createANewChildApplication`)}
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

export default childrenApplications;
