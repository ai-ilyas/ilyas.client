import { api } from "@/convex/_generated/api";
import { IApplication } from "@/convex/applications";
import { IInterface } from "@/convex/interfaces"
import { useTranslation } from "@/src/app/i18n/client";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { toast } from "@/src/components/ui/use-toast";
import { interfaceDataObjectDefinition, interfaceDescriptionDefinition, interfaceDirectionDefinition, interfaceFrequenceDefinition, interfaceItComponentDefinition, interfaceNameDefinition, interfaceVolumetryDefinition } from "@/src/lib/helpers/interface-fields-definition";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ArrowLeftToLine, ArrowRightFromLine, ArrowRightLeft, CalendarClock, Loader2, Rocket } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ProvidedInterfaceFormProps {
    interfaces: IInterface[];
    app: IApplication;
    lng: string;
    close: () => void;
  }
  
const providedInterfaceForm: React.FC<ProvidedInterfaceFormProps> = ({ interfaces, app, lng, close }) => {
    const { t } = useTranslation(lng);
    const insertInterface = useMutation(api.interfaces.insert);
    const formSchema = z.object({
      name: interfaceNameDefinition(t, interfaces),
      description: interfaceDescriptionDefinition(t),
      direction: interfaceDirectionDefinition,
      itComponent: interfaceItComponentDefinition,
      dataObject: interfaceDataObjectDefinition,
      volumetry: interfaceVolumetryDefinition,
      frequence: interfaceFrequenceDefinition,
  });

  type formValues = z.infer<typeof formSchema>;
  const [loading, setLoading] = useState(false);
  const defaultValues = { name: '', description: '', direction: undefined, itComponent: undefined, dataObject: undefined, volumetry: undefined, frequence: undefined };
  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: formValues) => {
    setLoading(true);
    try{
        await insertInterface({ 
          applicationId: app._id,
          // #060 CLIENT When interface name is null interface name is interface_[increment]
          name: data.name ?? "interface_" + interfaces.length + 1 , 
          description: data.description, 
          direction: data.direction,
          itComponentId: data.itComponent, 
          dataObjectId: data.dataObject, 
          volumetry: data.volumetry, 
          frequence: data.frequence });
        form.reset();
        close();
        toast({
            title: t(`application_providedInterfaces_interfaceHasBeenAdded`) ,
            variant: 'default'
        });  
    }
    catch(error)
    {
        console.log(error);
        toast({
            title: t(`application_providedInterfaces_interfaceHasNotBeenAdded`) ,
            variant: 'destructive'
        });  
        throw error;
    }
    finally{
      setLoading(false);
    }
  };

  return  <Form {...form}>
            <form onSubmit={form.handleSubmit((data) =>onSubmit(data))}>
            <Card>
              <CardHeader>
                  <CardTitle>{t('application_providedInterfaces_provideANewInterface')}</CardTitle>
                  <CardDescription>{t('application_providedInterfaces_provideANewInterfaceDescription', { name: app.name })}</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  disabled={loading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="my-3">
                        <FormLabel>{t(`application_providedInterfaces_name`)}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(`application_providedInterfaces_name`)}
                            {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={loading}
                  control={form!.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="my-3">
                      <FormLabel>{t('application_providedInterfaces_description')}</FormLabel>
                      <FormControl>
                          <Textarea {...field} />
                      </FormControl>
                      <FormDescription className="float-right">
                        {/* #100 CLIENT SERVER Interface description length should be lower than 1000 characters */}
                        {(form.getValues().description?.length ?? 0) + "/1000"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                  />

                <FormField
                  disabled={loading}
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="my-3">
                      <FormLabel><ArrowRightLeft strokeWidth={1} size={15} className="inline-block" /> {t('application_providedInterfaces_direction')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("application_providedInterfaces_directionPlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{t("application_providedInterfaces_direction")}</SelectLabel>
                            <SelectItem value="incoming"><ArrowLeftToLine strokeWidth={1} size={15} className="inline-block" /> {t("application_providedInterfaces_incoming")}</SelectItem>
                            <SelectItem value="outgoing"><ArrowRightFromLine strokeWidth={1} size={15} className="inline-block" /> {t("application_providedInterfaces_outgoing")}</SelectItem>
                            <SelectItem value="bi-directional"><ArrowRightLeft strokeWidth={1} size={15} className="inline-block" /> {t("application_providedInterfaces_biDirectional")}</SelectItem>                        
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                      <p><ArrowLeftToLine strokeWidth={1} size={15} className="inline-block" /> <strong>{t("application_providedInterfaces_incoming")}</strong>: {t("application_providedInterfaces_directionIncomingDescription", { name: app.name })}</p>
                      <p><ArrowRightFromLine strokeWidth={1} size={15} className="inline-block" /> <strong>{t("application_providedInterfaces_outgoing")}</strong>: {t("application_providedInterfaces_directionOutgoingDescription", { name: app.name })}</p>
                      <p><ArrowRightLeft strokeWidth={1} size={15} className="inline-block" /> <strong>{t("application_providedInterfaces_biDirectional")}</strong>: {t("application_providedInterfaces_directionBiDirectionalDescription")}</p>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={loading}
                  control={form.control}
                  name="volumetry"
                  render={({ field }) => (
                    <FormItem className="my-3">
                        <FormLabel>{t(`application_providedInterfaces_volumetry`)}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(`application_providedInterfaces_volumetry`)}
                            {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={loading}
                  control={form.control}
                  name="frequence"
                  render={({ field }) => (
                    <FormItem className="my-3">
                      <FormLabel><CalendarClock strokeWidth={1} size={15} className="inline-block" /> {t('application_providedInterfaces_frequence')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("application_providedInterfaces_frequencePlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{t("application_providedInterfaces_frequence")}</SelectLabel>
                            <SelectItem value="hourly">{t("application_providedInterfaces_hourly")}</SelectItem>
                            <SelectItem value="daily">{t("application_providedInterfaces_daily")}</SelectItem>
                            <SelectItem value="weekly">{t("application_providedInterfaces_weekly")}</SelectItem>
                            <SelectItem value="monthly">{t("application_providedInterfaces_monthly")}</SelectItem>
                            <SelectItem value="yearly">{t("application_providedInterfaces_yearly")}</SelectItem>
                            <SelectItem value="on demand">{t("application_providedInterfaces_onDemand")}</SelectItem>
                            <SelectItem value="real-time">{t("application_providedInterfaces_realTime")}</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="place-content-end">
                <Button className="mr-2" onClick={() => close()} variant="outline">{t("common_cancel")}</Button>
                <Button disabled={loading} type="submit">
                  { loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  { !loading && <Rocket className="mr-2 h-4 w-4" />}
                  {t("common_create")}</Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
}

export default providedInterfaceForm;