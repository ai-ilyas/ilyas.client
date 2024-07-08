'use client';
import { useTranslation } from '@/src/app/i18n/client';
import { IApplication } from '@/src/lib/domain/entities/application.interface';
import LoadingButton from '@/src/lib/presenter/components/buttons/loading-button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/src/lib/presenter/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/src/lib/presenter/components/ui/form';
import { Input } from '@/src/lib/presenter/components/ui/input';
import { Textarea } from '@/src/lib/presenter/components/ui/textarea';
import { toast } from '@/src/lib/presenter/components/ui/use-toast';
import { updateApplication } from '@/src/lib/store/features/application/application-slice';
import { useAppDispatch } from '@/src/lib/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface UpdateApplicationFormProps {
  app: IApplication;
  lng: string;
  apps: IApplication[];
}

const informationApplicationForm: React.FC<UpdateApplicationFormProps> = ({
  app,
  lng,
  apps
}) => {
  const { t } = useTranslation(lng);
  const dispatch = useAppDispatch();
  let [isNameAlreadyExists, setIsNameAlreadyExists] = useState(false);

  const formSchema = z.object({
    name: z
      .string()
      .min(3, { message: t('common_error_min', { length: '3' }) })
      .max(50, { message: t('common_error_max', { length: '50' }) })
      .refine((val) => !apps.some((x) => x.name === val && x._id !== app._id) && isNameAlreadyExists === false, {
        message: t("dashboard_home_applicationNameAlreadyExists"),
      }),
    description: z
      .string()
      .max(500, { message: t('common_error_max', { length: '500' }) })
  });

  type ApplicationFormValues = z.infer<typeof formSchema>;
  const [loading, setLoading] = useState(false);
  const [formHasChanged, setFormHasChanged] = useState(false);

  const defaultValues = app;

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  function handleFormChanged() {
    if (!formHasChanged) {
      setFormHasChanged(true);
    }
  }
  const onSubmit = async (data: ApplicationFormValues) => {
    setLoading(true);
    setIsNameAlreadyExists(false);
    try{
      await dispatch(updateApplication({ _id: app._id, ...data } as Partial<IApplication>)).unwrap();    
      toast({
        title: t("application_toast_applicationHasBeenUpdated") ,
        variant: 'default'
      });
      setLoading(false);
    }
    catch(error)
    {
      if (error instanceof Error && error.message.includes("Duplicate name")) setIsNameAlreadyExists(true);
      toast({
        variant: 'destructive',
        title: t("common_toast_error_title"),
        description:
          isNameAlreadyExists === true
          ? t("dashboard_home_toast_applicationNameAlreadyExists", { applicationName: data.name }) 
          : t("application_toast_errorOccuredDuringUpdatingProcess", { applicationName: data.name })
      });
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onChange={() => handleFormChanged()}
        className="space-y-8"
      >
        <Card>
          <CardHeader>
            <div className="flex items-start">
              <CardTitle>{t('application_informationApplicationForm_information')}</CardTitle>
              <div className="items-center max-h-0.5 gap-2 md:ml-auto md:flex">                
                <LoadingButton disabled={!formHasChanged} loading={loading} type="submit" text={t('common_save')}>
                </LoadingButton>                
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('application_informationApplicationForm_applicationName')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('application_informationApplicationForm_description')}</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-32" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default informationApplicationForm;
