import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { IApplication } from "@/convex/applications";
import { IInterface } from "@/convex/interfaces"
import { useTranslation } from "@/src/app/i18n/client";
import CustomSelectTags from "@/src/components/custom-select-tags";
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
import { ArrowRightFromLine, ArrowRightLeft, ArrowRightToLine, CalendarClock, Loader2, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ProvidedInterfaceFormProps {
    interfaces: IInterface[];
    app: IApplication;
    lng: string;
    close: () => void;
    interfaceNameToUpdate?: string | undefined;
  }
  
const providedInterfaceForm: React.FC<ProvidedInterfaceFormProps> = ({ interfaces, app, lng, close, interfaceNameToUpdate }) => {
    const { t } = useTranslation(lng);
    const insertInterface = useMutation(api.interfaces.insert);
    const patchInterface = useMutation(api.interfaces.patch);
    const [selectValue, setSelectValue] = useState('');
    const [interfaceToUpdate, setInterfaceToUpdate] = useState<IInterface | undefined>();
    useEffect(() => {
      const i = interfaces.find(x => x.name == interfaceNameToUpdate);
      setInterfaceToUpdate(i);
      if (i) {
        form.reset({ ...defaultValues, ...i});
        setSelectValue(i.direction);
      }
    }, [interfaceNameToUpdate]) 
    const formSchema = z.object({
      name: interfaceNameDefinition(t, interfaces.filter(x => x._id !== interfaceToUpdate?._id)),
      description: interfaceDescriptionDefinition(t),
      direction: interfaceDirectionDefinition(t),
      itComponent: interfaceItComponentDefinition,
      dataObject: interfaceDataObjectDefinition,
      volumetry: interfaceVolumetryDefinition,
      frequence: interfaceFrequenceDefinition,
  });
  const closeForm = () => {
    form.reset(defaultValues); 
    close();
  }
  type formValues = z.infer<typeof formSchema>;
  const [loading, setLoading] = useState(false);
  const defaultValues = { name: '', description: '', direction: '', itComponent: undefined, dataObject: undefined, volumetry: undefined, frequence: undefined };
  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: interfaceToUpdate ? { ...defaultValues, ...interfaceToUpdate} : defaultValues
  });

  const onSubmit = async (data: formValues) => {
    setLoading(true);
    try{
        if (interfaceToUpdate)
        {
          await patchInterface({ 
            _id: interfaceToUpdate._id,
            // #060 CLIENT When interface name is null interface name is interface_[increment]
            name: (data.name ?? '') === '' ? "interface_" + (interfaces.length + 1) : data.name!, 
            description: data.description, 
            direction: data.direction as 'incoming' | 'outgoing' | 'bi-directional',
            itComponentId: data.itComponent, 
            dataObjectId: data.dataObject, 
            volumetry: data.volumetry, 
            frequence: data.frequence });  
        }
        else
        {
          await insertInterface({ 
            applicationId: app._id,
            // #060 CLIENT When interface name is null interface name is interface_[increment]
            name: (data.name ?? '') === '' ? "interface_" + (interfaces.length + 1) : data.name!, 
            description: data.description, 
            direction: data.direction as 'incoming' | 'outgoing' | 'bi-directional',
            itComponentId: data.itComponent, 
            dataObjectId: data.dataObject, 
            volumetry: data.volumetry, 
            frequence: data.frequence });          
        }

        closeForm();
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
                {
                  !interfaceToUpdate && <>
                    <CardTitle>{t('application_providedInterfaces_provideANewInterface')}</CardTitle>
                    <CardDescription>{t('application_providedInterfaces_provideANewInterfaceDescription', { name: app.name })}</CardDescription>
                  </>
                }
                {
                  interfaceToUpdate && <>
                    <CardTitle>{t('application_providedInterfaces_updateInterface', {name: interfaceToUpdate.name})}</CardTitle>
                    <CardDescription>{t('application_providedInterfaces_updateInterfaceDescription', { interfaceName: interfaceToUpdate.name, name: app.name })}</CardDescription>
                  </>
                }                  
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
                  name="direction"
                  render={({ field }) => (
                    <FormItem className="my-3">
                      <FormLabel><ArrowRightLeft strokeWidth={1} size={15} className="inline-block" /> {t('application_providedInterfaces_direction')}</FormLabel>
                      <Select onValueChange={(value: string) => {
                        if (value) {
                          setSelectValue(value); 
                          field.onChange(value)
                        }}} 
                        value={selectValue} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("application_providedInterfaces_directionPlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{t("application_providedInterfaces_direction")}</SelectLabel>
                            <SelectItem value="incoming"><ArrowRightToLine strokeWidth={1} size={15} className="inline-block" /> {t("application_providedInterfaces_incoming")}</SelectItem>
                            <SelectItem value="outgoing"><ArrowRightFromLine strokeWidth={1} size={15} className="inline-block" /> {t("application_providedInterfaces_outgoing")}</SelectItem>
                            <SelectItem value="bi-directional"><ArrowRightLeft strokeWidth={1} size={15} className="inline-block" /> {t("application_providedInterfaces_biDirectional")}</SelectItem>                        
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      <FormDescription>
                        <span><ArrowRightToLine strokeWidth={1} size={15} className="inline-block" /> <strong>{t("application_providedInterfaces_incoming")}</strong>: {t("application_providedInterfaces_directionIncomingDescription", { name: app.name })}</span><br />
                        <span><ArrowRightFromLine strokeWidth={1} size={15} className="inline-block" /> <strong>{t("application_providedInterfaces_outgoing")}</strong>: {t("application_providedInterfaces_directionOutgoingDescription", { name: app.name })}</span><br />
                        <span><ArrowRightLeft strokeWidth={1} size={15} className="inline-block" /> <strong>{t("application_providedInterfaces_biDirectional")}</strong>: {t("application_providedInterfaces_directionBiDirectionalDescription")}</span>
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  disabled={loading}
                  control={form.control}
                  name="dataObject"
                  render={({ field }) => (
                    <CustomSelectTags className="my-3" lng={lng} type={2} field={field}></CustomSelectTags>
                  )}
                />
                <FormField
                  disabled={loading}
                  control={form.control}
                  name="itComponent"
                  render={({ field }) => (
                    <CustomSelectTags className="my-3" lng={lng} type={3} field={field}></CustomSelectTags>
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
                <Button className="mr-2" onClick={() => closeForm()} variant="outline">{t("common_cancel")}</Button>
                <Button disabled={loading} type="submit">
                  { loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  { !loading && <Rocket className="mr-2 h-4 w-4" />}
                  { interfaceToUpdate ? t("common_save") : t("common_create")}</Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
}

export default providedInterfaceForm;