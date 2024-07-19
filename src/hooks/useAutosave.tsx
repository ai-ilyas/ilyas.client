
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from '../components/ui/use-toast';
import { useTranslation } from '../app/i18n/client';
import { FunctionReference } from 'convex/server';

function useConvexAutoSave(
        defaultValues: any, 
        formSchema: any,
        saveFunction: FunctionReference<"mutation">,
        lng: string,
        delay = 1000) {
    const { t } = useTranslation(lng);
    type ApplicationFormValues = z.infer<typeof formSchema>;
    const form = useForm<ApplicationFormValues>({
        mode: "onChange",
        resolver: zodResolver(formSchema),
        defaultValues
        });
    const [isSaving, setIsSaving] = useState(false);
    const save = useMutation(saveFunction);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (isSaving || !form.formState.isDirty || !form.formState.isValid) return;
                setIsSaving(true);
                const valuesToSave = form.getValues();
                form.reset({}, { keepValues: true })   
                save(valuesToSave).then(() => {
                    toast({
                        title: t("application_toast_applicationHasBeenUpdated") ,
                        variant: 'default'
                    });        
                    })
                    .finally(() => setIsSaving(false));
        }, delay);

        // Cleanup function to clear the timeout if values change before the delay
        return () => clearTimeout(handler);
    }, [saveFunction, delay]);

  return { form, isSaving };
}

export default useConvexAutoSave;
