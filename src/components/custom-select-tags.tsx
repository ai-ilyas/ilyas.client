'use client'

import { useTranslation } from "@/src/app/i18n/client";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import Circle from '@uiw/react-color-circle';
import { z } from "zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
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
import { classNames } from "uploadthing/client";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

interface customSelectTagsProps {
  lng: string;
  type: number;
  field: ControllerRenderProps<any, any>;
  className?: string;
}

export default function customSelectTags ({ lng, type, field, className }: customSelectTagsProps) {
    const { t } = useTranslation(lng);
    const tags = useQuery(api.tags.list, { type });

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
        case 2:
            labelType = "DataObjects";
            singleLabelType = "DataObject";
            break;
        case 3:
            labelType = "ItComponents";
            singleLabelType = "ItComponent";
            break;
        default:
            labelType = "Tags";
            singleLabelType = "Tag";
        }
    
    return <>
        <FormItem className={className}>
            <FormLabel>{t(`custom${labelType}`)}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
                <SelectTrigger>
                    <SelectValue placeholder={t(`custom${labelType}_select`)} />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{t(`custom${labelType}`)}</SelectLabel>
                    { 
                        tags?.map(x => <SelectItem key={x._id} value={x._id}>{x.value}</SelectItem>)
                    }
                </SelectGroup>
            </SelectContent>
            </Select>
            <FormMessage />
        </FormItem>
        </>
    ;  
}