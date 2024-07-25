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
import { Icons } from "./icons";
import { toast } from "./ui/use-toast";
import { ITag } from "@/convex/tags";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { cn, isValidHtmlColor } from "../lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { Textarea } from "./ui/textarea";

interface customTagsProps {
  lng: string;
  tags: ITag[];
  applicationId: Id<"applications">;
  type: number;
  maxNumber?: number;
}

export default function customApplicationTags ({ lng, tags, applicationId, type, maxNumber }: customTagsProps) {
    const { t } = useTranslation(lng);
    const [hex, setHex] = useState('#7C3AED');
    const [open, setOpen] = useState(false);
    const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
    const [openRemove, setOpenRemove] = useState(false);
    const [tagToRemove, setTagToRemove] = useState<ITag>();
    const [openPopover, setOpenPopover] = useState(false);
    const [isDescriptionDisabled, setIsDescriptionDisabled] = useState(true);
    const insertTag = useMutation(api.tags.insert);
    const removeTag = useMutation(api.tags.removeLindToApplication)
    const availableTags = useQuery(api.tags.list, { type });
    const linkTag = useMutation(api.tags.linkToApplication);
    const IconClose = Icons['close'];
    const IconAdd = Icons['add'];
    const linkedTags = tags.filter(x => x.type === type);

    let labelType;
    let singleLabelType;
    switch(type) {
        case 0:
            labelType = "Tags";
            singleLabelType = "Tag";
            break;
        case 1:
            labelType = "BusinessCapabilities";
            singleLabelType = "BusinessCapability";
            break;
        default:
            labelType = "Tags";
            singleLabelType = "Tag";
        }
    

    const formSchema = z.object({
        tagId: z.string().optional(),
        color: z.string()
          .optional()
          // #090 CLIENT SERVER The combination Tag Name/Tag color should be unique per application
          .refine(val => !availableTags?.some((x) => x.value === val && x.color === hex), {
            message: t(`custom${labelType}_labelAlreadyExistsWithThisColor`),
          })
          // #080 CLIENT SERVER Tag color should be a valid HTML hexadecimal color
          .refine(val => isValidHtmlColor(hex), {
            message: t(`custom${labelType}_labelAlreadyExistsWithThisColor`),
          }),
        description: z
          .string()
          // #0110 CLIENT SERVER Tag description length should be 500 characters maximum
          .max(500, { message: t('common_error_max', { length: '500' }) })
          .optional(),
        value: z
          .string()
          // #060 CLIENT SERVER Tag name length should be 50 characters maximum
          .max(50, { message: t("common_error_max", { length: "15" }) })
          .refine((val) => !availableTags?.some((x) => x.value === val && x.color === hex), {
            message: t(`custom${labelType}_labelAlreadyExistsWithThisColor`),
          })
          .optional(),
        confirmTag: z.string().optional()
    })
    // #070 CLIENT SERVER Tag name should not be empty
    .refine(schema => schema.value !== '' || schema.value?.trim() !== '' || schema.tagId !== '', {
        message: t(`custom${labelType}_selectAnExistingOneOrCreateANewOne`), 
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
        maxNumber && linkedTags?.length && linkedTags?.length >= maxNumber ? setIsAddButtonDisabled(true): setIsAddButtonDisabled(false);
    }, [tags])

    const onSubmit = async (data: formValues) => {
        setLoading(true);
        try{
            if (data.tagId)
            {
                await linkTag({ tagId: data.tagId, applicationId });
            }
            else
            {
                await insertTag({ value: data.value!, type, applicationId, color: hex, description: data.description });
            }

            form.reset();
            setHex("#7C3AED")
            setOpen(false);
            toast({
                title: t(`custom${labelType}_hasBeenAdded`) ,
                variant: 'default'
            });  
        }
        catch(error)
        {
            console.log(error);
            toast({
                title: t(`custom${labelType}_hasntBeenAdded`) ,
                variant: 'destructive'
            });  
            throw error;
        }
        finally{
          setLoading(false);
        }
      };

      const onRemoveTag = async () => {
          setLoading(true);
          try{
              await removeTag({tagId: tagToRemove!._id, applicationId });
              setOpenRemove(false);
              toast({
                  title: t(`custom${labelType}_hasBeenRemoved`) ,
                  variant: 'default'
              });  
          }
          catch(error)
          {
              console.log(error);
              toast({
                  title: t(`custom${labelType}_hasntBeenRemoved`) ,
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
            linkedTags?.map(x => 
            <Badge key={x._id} style={{background: x.color }} className="m-0.5">
                { x.value }
                
                <Dialog open={openRemove} onOpenChange={setOpenRemove}>
                    <DialogTrigger asChild>
                        <IconClose onClick={() => setTagToRemove(x)} className="cursor-pointer ml-2 h-3 w-3" />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t(`custom${labelType}_remove`)}</DialogTitle>
                            <div className="text-sm text-muted-foreground">
                                {t(`custom${labelType}_areYouSureYouWantToRemove`)}
                                <Badge style={{background: tagToRemove?.color }} className="m-0.5">{ tagToRemove?.value }</Badge>
                            </div>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={() => setOpenRemove(false)} variant="secondary">{t('common_cancel')}</Button>
                            <Button onClick={() => onRemoveTag()} variant="destructive">{t('common_remove')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Badge>)
        }
        <Dialog modal={true} open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={isAddButtonDisabled} className="block" variant="link"><IconAdd className="h-4 w-4 inline-block"></IconAdd>{t(`custom${labelType}_add`)}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) =>onSubmit(data))}>
                        <DialogHeader>
                            <DialogTitle>{t(`custom${labelType}_add`)}</DialogTitle>
                        </DialogHeader>
                        <div className="gap-8 mt-3">
                            <DialogDescription className="mb-2">
                                {t(`custom${labelType}_select`)}
                            </DialogDescription>
                            <FormField
                                control={form.control}
                                name="tagId"
                                render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>{t(`custom${labelType}`)}</FormLabel>
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
                                                        ? getBadge(availableTags?.find((tag: ITag) => tag._id === field.value))
                                                        : t('common_select', { value: t(`custom${singleLabelType}`) })}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[300px] p-0">
                                            <Command>
                                                <CommandInput placeholder={t('common_search', { value: t(`custom${singleLabelType}`) })} />
                                                <CommandList >
                                                    <CommandEmpty>{t('common_noFound', { value: t(`custom${singleLabelType}`) })}</CommandEmpty>
                                                    <CommandGroup>
                                                        {availableTags?.filter(x => !linkedTags?.some(y => x._id === y._id)).map((tag) => (
                                                        <CommandItem
                                                            value={tag.value}
                                                            key={tag._id}
                                                            onSelect={() => {
                                                                form.setValue("tagId", tag._id);
                                                                if (tag._id) {
                                                                    form.resetField("color");
                                                                    form.resetField("value");
                                                                    form.resetField("description");
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
                                {t(`custom${labelType}_create`)}
                            </DialogDescription>
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t(`custom${labelType}_labelNew`)}</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder={t(`custom${labelType}_labelNew`)}
                                            {...field}
                                            onChange={e => {
                                                    form.setValue("value", e.target.value);
                                                    setIsDescriptionDisabled(e.target.value === '' ? true : false);
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
                                    <FormLabel>{t(`custom${labelType}_color`)}</FormLabel>
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
                        <div className="mt-2">
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
    );  
}