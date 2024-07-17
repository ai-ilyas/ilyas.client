'use client'

import { useTranslation } from "@/src/app/i18n/client";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import Circle from '@uiw/react-color-circle';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Separator } from "./ui/separator";
import { Loader2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { IApplication } from "@/convex/applications";
import { Icons } from "./icons";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { toast } from "./ui/use-toast";

interface customTagsProps {
  lng: string;
  application: IApplication;
}

export default function customTags ({ lng, application }: customTagsProps) {
    const { t } = useTranslation(lng);
    const [hex, setHex] = useState('#7C3AED');
    const [open, setOpen] = useState(false);
    const insertTag = useMutation(api.tags.insert);
    const availableTags = useQuery(api.tags.list, { type: 0 });
    const linkTag = useMutation(api.tags.linkToApplication);
    const Icon = Icons['close'];

    const formSchema = z.object({
        color: z.string()
          .optional()
          .refine((val) => !availableTags?.some((x) => x.value === val && x.color === hex), {
            message: t("customTags_labelAlreadyExistsWithThisColor"),
          }),
        value: z
          .string()
          .min(1, { message: t("common_error_min", { length: "1" }) })
          .max(15, { message: t("common_error_max", { length: "15" }) })
          .refine((val) => !availableTags?.some((x) => x.value === val && x.color === hex), {
            message: t("customTags_labelAlreadyExistsWithThisColor"),
          })
      });

    type formValues = z.infer<typeof formSchema>;
    const [loading, setLoading] = useState(false);
    const defaultValues = { value: '' };
    const form = useForm<formValues>({
      resolver: zodResolver(formSchema),
      defaultValues
    });

    const onSubmit = async (data: formValues) => {
        setLoading(true);
        try{
            await insertTag({ value: data.value, type: 0, applicationId: application._id, color: hex });
            form.reset();
            setHex("#7C3AED")
            setOpen(false);
            toast({
                title: t("customTags_tagHasBeenAdded") ,
                variant: 'default'
            });  
        }
        catch(error)
        {
            console.log(error);
            toast({
                title: t("customTags_tagHasntBeenAdded") ,
                variant: 'destructive'
            });  
            throw error;
        }
        finally{
          setLoading(false);
        }
      };

    return (
      <div> 
        { 
            application.tags?.map(x => 
            <Badge key={x._id} style={{background: x.color }} className="m-0.5">
                { x.value }
                
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Icon className="cursor-pointer ml-2 h-3 w-3" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('customTags_removeTag')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('customTags_areYouSureYouWantToRemoveThisTag')}
                                <Badge key={x._id} style={{background: x.color }} className="m-0.5">{ x.value }</Badge>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('common_cancel')}</AlertDialogCancel>
                            <AlertDialogAction>{t('common_remove')}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
            </Badge>)
        }
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="link">{t("customTags_addATag")}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) =>onSubmit(data))}>
                        <DialogHeader>
                            <DialogTitle>{t("customTags_addATag")}</DialogTitle>
                            <DialogDescription>
                                {t("customTags_selectOrCreateTag")}
                            </DialogDescription>
                        </DialogHeader>
                        <Separator />
                        <div className="gap-8">
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("customTags_label")}</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={loading}
                                            placeholder={t("customTags_label")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <div className="gap-8 mt-2">
                            <FormField
                                control={form.control}
                                name="color"
                                render={() => (
                                <FormItem>
                                    <FormLabel>{t("customTags_color")}</FormLabel>
                                    <FormControl>
                                        <Circle
                                            colors={[ 
                                                "#f44336",
                                                "#e91e63",
                                                "#7C3AED",
                                                "#3f51b5",
                                                "#2196f3",
                                                "#03a9f4",
                                                "#00bcd4",
                                                "#009688",
                                                "#4caf50",
                                                "#8bc34a",
                                                "#cddc39",
                                                "#ffeb3b",
                                                "#ffc107",
                                                "#ff9800",
                                                "#ff5722",
                                                "#795548",
                                                "#607d8b" ]}
                                            color={hex}
                                            onChange={(color) => {
                                                setHex(color.hex);
                                                form.setValue("color", hex);
                                            }}
                                            />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                                />


                        </div>

                        <DialogFooter>
                            <Button disabled={loading} type="submit">
                                { loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t("common_add")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>        
      </div>
    );  
}