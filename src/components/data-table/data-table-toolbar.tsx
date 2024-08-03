"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { DataTableViewOptions } from "@/src/components/data-table/data-table-view-options"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"

export interface FilterableColumnConfiguration{
  columnName: string,
  columnLabel: string,
  values: {
    label: any;
    value: string;
    icon?: any | undefined;
  }[]
}


interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterableColumnConfigurations?: FilterableColumnConfiguration[],
  filterPlaceholder: string,
  filteredColumn: string
  t: any
}

export function DataTableToolbar<TData>({
  table,
  filterableColumnConfigurations,
  filterPlaceholder,
  filteredColumn,
  t
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={filterPlaceholder}
          value={(table.getColumn(filteredColumn)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filteredColumn)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {
          filterableColumnConfigurations?.map(x => table.getColumn(x.columnName) && (
            <DataTableFacetedFilter
              key={x.columnName}
              column={table.getColumn(x.columnName)}
              title={x.columnLabel}
              options={x.values}
            />
          ))
        }
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            {t("common_reset")}
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions t={t} table={table} />
    </div>
  )
}
