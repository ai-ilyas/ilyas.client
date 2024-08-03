'use client';

import { useTranslation } from '@/src/app/i18n/client';
import { ControllerRenderProps } from 'react-hook-form';
import { FormControl, FormItem, FormLabel, FormMessage } from './ui/form';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from './ui/select';

interface customSelectTagsProps {
  lng: string;
  type: number;
  field: ControllerRenderProps<any, any>;
  className?: string;
  onValueChange?: (value: any) => void;
  value: any;
}

export default function customSelectTags({
  lng,
  type,
  field,
  className,
  onValueChange,
  value
}: customSelectTagsProps) {
  const { t } = useTranslation(lng);
  const tags = useQuery(api.tags.list, { type });

  let labelType;
  let singleLabelType;
  switch (type) {
    case 0:
      labelType = 'Tags';
      singleLabelType = 'Tag';
      break;
    case 1:
      labelType = 'BusinessCapabilities';
      singleLabelType = 'BusinessCapability';
      break;
    case 2:
      labelType = 'DataObjects';
      singleLabelType = 'DataObject';
      break;
    case 3:
      labelType = 'ItComponents';
      singleLabelType = 'ItComponent';
      break;
    default:
      labelType = 'Tags';
      singleLabelType = 'Tag';
  }

  const onChange = (value: any) => {
    if (onValueChange) {
      onValueChange(value);
    } else {
      field.onChange(value);
    }
  };

  return (
    <>
      <FormItem className={className}>
        <FormLabel>{t(`custom${labelType}`)}</FormLabel>
        <Select
          onValueChange={onChange}
          value={value}
          defaultValue={field.value}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={t(`custom${labelType}_select`)} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t(`custom${labelType}`)}</SelectLabel>
              {tags?.map((x) => (
                <SelectItem key={x._id} value={x._id}>
                  {x.value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </>
  );
}
