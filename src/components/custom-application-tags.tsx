'use client'

import { useTranslation } from "@/src/app/i18n/client";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import Circle from '@uiw/react-color-circle';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Separator } from "./ui/separator";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { IApplication } from "@/convex/applications";
import { Icons } from "./icons";
import { toast } from "./ui/use-toast";
import { ITag } from "@/convex/tags";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { cn, isValidHtmlColor } from "../lib/utils";

interface customTagsProps {
  lng: string;
  application: IApplication;
}

export default function customApplicationTags ({ lng, application }: customTagsProps) {
    const { t } = useTranslation(lng);
    const [hex, setHex] = useState('#7C3AED');
    const [open, setOpen] = useState(false);
    const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
    const [openRemove, setOpenRemove] = useState(false);
    const [tagToRemove, setTagToRemove] = useState<ITag>();
    const [openPopover, setOpenPopover] = useState(false)
    const insertTag = useMutation(api.tags.insert);
    const removeTag = useMutation(api.tags.removeLindToApplication)
    const availableTags = useQuery(api.tags.list, { type: 0 });
    const linkTag = useMutation(api.tags.linkToApplication);
    const Icon = Icons['close'];
    const IconAdd = Icons['add'];

    const formSchema = z.object({
        tagId: z.string().optional(),
        color: z.string()
          .optional()
          .refine(val => !availableTags?.some((x) => x.value === val && x.color === hex), {
            message: t("customTags_labelAlreadyExistsWithThisColor"),
          })
          .refine(val => isValidHtmlColor(hex), {
            message: t("customTags_labelAlreadyExistsWithThisColor"),
          }),
        value: z
          .string()
          .max(15, { message: t("common_error_max", { length: "15" }) })
          .refine((val) => !availableTags?.some((x) => x.value === val && x.color === hex), {
            message: t("customTags_labelAlreadyExistsWithThisColor"),
          })
          .optional(),
        confirmTag: z.string().optional()
    }).refine(schema => schema.value !== '' || schema.value?.trim() !== '' || schema.tagId !== '', {
        message: t("customTags_selectAnExistingTagOrCreateANewOne"), 
        path: ["confirmTag"]
    });

    type formValues = z.infer<typeof formSchema>;
    const [loading, setLoading] = useState(false);
    const defaultValues = { value: '', color: '', tagId: '' };
    const form = useForm<formValues>({
      resolver: zodResolver(formSchema),
      defaultValues
    });

    useEffect(() => {
        application?.tags?.length && application?.tags?.length >= 10 ? setIsAddButtonDisabled(true): setIsAddButtonDisabled(false);
    }, [application.tags])

    const onSubmit = async (data: formValues) => {
        setLoading(true);
        try{
            if (data.tagId)
            {
                await linkTag({ tagId: data.tagId, applicationId: application._id });
            }
            else
            {
                await insertTag({ value: data.value!, type: 0, applicationId: application._id, color: hex });
            }

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

      const onRemoveTag = async (tag: ITag) => {
          setLoading(true);
          try{
              await removeTag({tagId: tag._id, applicationId: application._id});
              setOpenRemove(false);
              toast({
                  title: t("customTags_tagHasBeenRemoved") ,
                  variant: 'default'
              });  
          }
          catch(error)
          {
              console.log(error);
              toast({
                  title: t("customTags_tagHasntBeenRemoved") ,
                  variant: 'destructive'
              });  
              throw error;
          }
          finally{
            setLoading(false);
          }
        };

    const getBadge = (tag: ITag | undefined) => tag && <Badge style={{ background: tag.color }}>{tag.value}</Badge>;
    return (
      <div> 
        { 
            application.tags?.map(x => 
            <Badge key={x._id} style={{background: x.color }} className="m-0.5">
                { x.value }
                
                <Dialog open={openRemove} onOpenChange={setOpenRemove}>
                    <DialogTrigger asChild>
                        <Icon onClick={() => setTagToRemove(x)} className="cursor-pointer ml-2 h-3 w-3" />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('customTags_removeTag')}</DialogTitle>
                            <DialogDescription>
                                {t('customTags_areYouSureYouWantToRemoveThisTag')}
                                <Badge style={{background: tagToRemove?.color }} className="m-0.5">{ tagToRemove?.value }</Badge>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={() => setOpenRemove(false)} variant="secondary">{t('common_cancel')}</Button>
                            <Button onClick={() => onRemoveTag(tagToRemove!)} variant="destructive">{t('common_remove')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Badge>)
        }
        <Dialog modal={true} open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={isAddButtonDisabled} className="block" variant="link"><IconAdd className="h-4 w-4 inline-block"></IconAdd>{t("customTags_addATag")}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) =>onSubmit(data))}>
                        <DialogHeader>
                            <DialogTitle>{t("customTags_addATag")}</DialogTitle>
                        </DialogHeader>
                        <div className="gap-8 mt-3">
                            <DialogDescription>
                                {t("customTags_selectTag")}
                            </DialogDescription>
                            <FormField
                                control={form.control}
                                name="tagId"
                                render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>{t('common_tags')}</FormLabel>
                                    <Popover open={openPopover} onOpenChange={setOpenPopover} modal={true}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[200px] justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    >
                                                    {field.value
                                                        ? getBadge(availableTags?.find((tag: ITag) => tag._id === field.value))
                                                        : t('common_select', { value: 'tag' })}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder={t('common_search', { value: 'tag' })} />
                                                <CommandList >
                                                    <CommandEmpty>{t('common_noFound', { value: 'tag' })}</CommandEmpty>
                                                    <CommandGroup>
                                                        {availableTags?.filter(x => !application.tags?.some(y => x._id === y._id)).map((tag) => (
                                                        <CommandItem
                                                            value={tag.value}
                                                            key={tag._id}
                                                            onSelect={() => {
                                                                form.setValue("tagId", tag._id);
                                                                if (tag._id) {
                                                                    form.resetField("color");
                                                                    form.resetField("value");
                                                                }
                                                                setOpenPopover(false);
                                                            }}
                                                        >
                                                            <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                tag._id === field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                            )}
                                                            />
                                                            {getBadge(tag)}
                                                        </CommandItem>
                                                        ))}
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
                                {t("customTags_createTag")}
                            </DialogDescription>
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("customTags_labelNewTag")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder={t("customTags_labelNewTag")}
                                            {...field}
                                            onChange={e => {
                                                form.setValue("value", e.target.value)
                                                if (e.target.value) form.resetField("tagId");
                                                }
                                            }
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
                            <FormField
                                control={form.control}
                                name="confirmTag"
                                render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                        </div>

                        <DialogFooter>
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
    );  
}