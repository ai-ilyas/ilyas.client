'use client';
import { api } from '@/convex/_generated/api';
import { IApplication } from '@/convex/applications';
import { useTranslation } from '@/src/app/i18n/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import useConvexAutoSave from '@/src/hooks/useAutosave';
import { useEffect } from 'react';
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

  const formSchema = z.object({
    name: z
      .string()
      .min(3, { message: t('common_error_min', { length: '3' }) })
      .max(50, { message: t('common_error_max', { length: '50' }) })
      .refine((val) => !apps.some((x) => x.name === val && x._id !== app._id), {
        message: t("dashboard_home_applicationNameAlreadyExists"),
      }),
    description: z
      .string()
      .max(500, { message: t('common_error_max', { length: '500' }) })
      .optional()
  });

  const { form, isSaving }= useConvexAutoSave({ _id: app._id, name: app?.name, description: app?.description }, formSchema, api.applications.patch, lng, 1000);

  useEffect(()=> {
    const values = form.getValues();
    if (form && !form.formState.isDirty && app && (app.name !== values.name || app.description !== values.description))
      {
        form.reset({ _id: app._id, name: app?.name, description: app?.description });
      } 
  }, [app])

  return (
    form && <Form {...form}>
      <form
        className="space-y-8"
      >
        <Card>
          <CardHeader>
            <div className="flex items-start">
              <CardTitle>{t('application_informationApplicationForm_information')} {app.name}</CardTitle>
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
                  control={form!.control}
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
