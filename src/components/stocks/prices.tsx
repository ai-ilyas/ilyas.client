'use client';

import { useActions, useUIState } from 'ai/rsc';

import type { AI } from '@/src/lib/chat/actions';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/src/components/ui/table';

interface Price {
  service_name: string;
  service_type: string;
  description: string;
  price_per_unit: string;
  unit: number;
  quantity: number;
  monthly_cost: number;
}

export function Prices({ props: prices }: { props: Price[] }) {
  const sumPrices = prices.reduce(
    (total, item) => total + item.monthly_cost,
    0
  );

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 overflow-y-scroll pb-4 text-sm sm:flex-row">
        <Table>
          <TableCaption>Cost Estimate Sheet.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Service Name</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Price per Unit</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Monthly cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prices.map((price) => (
              <TableRow key={price.service_name}>
                <TableCell className="font-medium">
                  {price.service_name}
                </TableCell>
                <TableCell>{price.service_type}</TableCell>
                <TableCell>{price.description}</TableCell>
                <TableCell className="text-right">
                  {price.price_per_unit}
                </TableCell>
                <TableCell>{price.unit}</TableCell>
                <TableCell>{price.quantity}</TableCell>
                <TableCell className="text-right">
                  {price.monthly_cost} $
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">${sumPrices}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
