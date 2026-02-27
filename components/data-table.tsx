"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Pencil, Star, Trash2 } from "lucide-react";

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners, isDragging } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className={`text-muted-foreground size-7 hover:bg-transparent hover:text-foreground transition-colors ${
        isDragging ? "cursor-grabbing text-primary" : "cursor-grab"
      }`}
    >
      <IconGripVertical className="size-3.5" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: "Header",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Section Type",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800 px-2.5 py-0.5 text-xs font-medium"
        >
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const isDone = status === "Done";
      const isInProgress = status === "In Progress";

      return (
        <Badge
          variant="outline"
          className={`
            flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium w-fit
            ${
              isDone
                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800"
                : isInProgress
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800"
                  : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
            }
          `}
        >
          {isDone ? (
            <IconCircleCheckFilled className="size-3.5 fill-green-500 dark:fill-green-400" />
          ) : isInProgress ? (
            <IconLoader className="size-3.5 animate-spin text-yellow-500 dark:text-yellow-400" />
          ) : (
            <span className="size-3.5 rounded-full bg-gray-400 dark:bg-gray-600" />
          )}
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "target",
    header: () => <div className="w-full text-right font-semibold">Target</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const value = formData.get("target");
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Updating target for ${row.original.header}...`,
            success: `Target updated to ${value}`,
            error: "Failed to update target",
          });
        }}
      >
        <Label htmlFor={`target-${row.original.id}`} className="sr-only">
          Target
        </Label>
        <Input
          name="target"
          className="h-8 w-20 text-right bg-transparent border-transparent hover:border-input focus:border-input focus:ring-1 focus:ring-primary transition-all rounded-md"
          defaultValue={row.original.target}
          id={`target-${row.original.id}`}
          onBlur={(e) => e.currentTarget.form?.requestSubmit()}
          suppressHydrationWarning
        />
      </form>
    ),
  },
  {
    accessorKey: "limit",
    header: () => <div className="w-full text-right font-semibold">Limit</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const value = formData.get("limit");
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Updating limit for ${row.original.header}...`,
            success: `Limit updated to ${value}`,
            error: "Failed to update limit",
          });
        }}
      >
        <Label htmlFor={`limit-${row.original.id}`} className="sr-only">
          Limit
        </Label>
        <Input
          name="limit"
          className="h-8 w-20 text-right bg-transparent border-transparent hover:border-input focus:border-input focus:ring-1 focus:ring-primary transition-all rounded-md"
          defaultValue={row.original.limit}
          id={`limit-${row.original.id}`}
          onBlur={(e) => e.currentTarget.form?.requestSubmit()}
          suppressHydrationWarning
        />
      </form>
    ),
  },
  {
    accessorKey: "reviewer",
    header: () => <div className="font-semibold">Reviewer</div>,
    cell: ({ row }) => {
      const isAssigned = row.original.reviewer !== "Assign reviewer";

      if (isAssigned) {
        return (
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                {row.original.reviewer
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <span className="text-sm font-medium">{row.original.reviewer}</span>
          </div>
        );
      }

      return (
        <>
          <Label htmlFor={`reviewer-${row.original.id}`} className="sr-only">
            Reviewer
          </Label>
          <Select>
            <SelectTrigger
              className="w-40 h-8 text-sm border-dashed hover:border-primary transition-colors"
              size="sm"
              id={`reviewer-${row.original.id}`}
              suppressHydrationWarning
            >
              <SelectValue placeholder="Assign reviewer" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="Eddie Lake" className="cursor-pointer">
                Eddie Lake
              </SelectItem>
              <SelectItem value="Jamik Tashpulatov" className="cursor-pointer">
                Jamik Tashpulatov
              </SelectItem>
              <SelectItem value="Emily Whalen" className="cursor-pointer">
                Emily Whalen
              </SelectItem>
            </SelectContent>
          </Select>
        </>
      );
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground hover:text-foreground flex size-8 transition-colors"
            size="icon"
            suppressHydrationWarning
          >
            <IconDotsVertical className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem className="cursor-pointer gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer gap-2">
            <Copy className="h-4 w-4" />
            Make a copy
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer gap-2">
            <Star className="h-4 w-4" />
            Favorite
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className={`
        relative z-0 transition-all duration-200
        data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 data-[dragging=true]:shadow-lg data-[dragging=true]:scale-[1.02]
        data-[state=selected]:bg-primary/5 dark:data-[state=selected]:bg-primary/10
        hover:bg-muted/50 dark:hover:bg-muted/20
        ${row.index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/50 dark:bg-gray-800/50"}
      `}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className="py-3">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [mounted, setMounted] = React.useState(false);
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {}),
  );

  // Handle hydration
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
      toast.success("Rows reordered successfully");
    }
  }

  // Don't render until after hydration to prevent mismatch
  if (!mounted) {
    return null;
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
      suppressHydrationWarning
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-8 w-64 hidden lg:block"
            suppressHydrationWarning
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                suppressHydrationWarning
              >
                <IconLayoutColumns className="size-3.5" />
                <span className="hidden lg:inline">Columns</span>
                <IconChevronDown className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide(),
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize cursor-pointer"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === "drag" ? "Drag Handle" : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="default"
            size="sm"
            className="h-8 gap-1"
            suppressHydrationWarning
          >
            <IconPlus className="size-3.5" />
            <span className="hidden lg:inline">Add Section</span>
          </Button>
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        suppressHydrationWarning
      >
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className="h-10 font-semibold"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label
                htmlFor="rows-per-page"
                className="text-sm font-medium text-muted-foreground"
              >
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger
                  size="sm"
                  className="w-20 h-8"
                  id="rows-per-page"
                  suppressHydrationWarning
                >
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                suppressHydrationWarning
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                suppressHydrationWarning
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                suppressHydrationWarning
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                suppressHydrationWarning
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
        suppressHydrationWarning
      >
        <div className="flex-1 rounded-xl border border-dashed bg-muted/20 p-8 text-center text-muted-foreground">
          Past performance chart will be displayed here
        </div>
      </TabsContent>
      <TabsContent
        value="key-personnel"
        className="flex flex-col px-4 lg:px-6"
        suppressHydrationWarning
      >
        <div className="flex-1 rounded-xl border border-dashed bg-muted/20 p-8 text-center text-muted-foreground">
          Key personnel information will be displayed here
        </div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
        suppressHydrationWarning
      >
        <div className="flex-1 rounded-xl border border-dashed bg-muted/20 p-8 text-center text-muted-foreground">
          Focus documents will be displayed here
        </div>
      </TabsContent>
    </Tabs>
  );
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--primary))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--primary)/0.6)",
  },
} satisfies ChartConfig;

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="link"
        className="text-foreground w-fit px-0 text-left font-medium"
      >
        {item.header}
      </Button>
    );
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground hover:text-primary w-fit px-0 text-left font-medium transition-colors"
          suppressHydrationWarning
        >
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-2xl mx-auto" suppressHydrationWarning>
        <DrawerHeader className="border-b">
          <DrawerTitle className="text-xl">{item.header}</DrawerTitle>
          <DrawerDescription>View and edit section details</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-6 overflow-y-auto px-6 py-4 text-sm max-h-[70vh]">
          {!isMobile && (
            <>
              <div className="rounded-lg border bg-card p-4">
                <ChartContainer
                  config={chartConfig}
                  className="h-[200px] w-full"
                >
                  <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                      left: 0,
                      right: 10,
                    }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Area
                      dataKey="mobile"
                      type="natural"
                      fill="var(--color-mobile)"
                      fillOpacity={0.4}
                      stroke="var(--color-mobile)"
                      stackId="a"
                    />
                    <Area
                      dataKey="desktop"
                      type="natural"
                      fill="var(--color-desktop)"
                      fillOpacity={0.6}
                      stroke="var(--color-desktop)"
                      stackId="a"
                    />
                  </AreaChart>
                </ChartContainer>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <IconTrendingUp className="size-4 text-green-500" />
                  <span className="font-medium">
                    Trending up by 5.2% this month
                  </span>
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-6">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor={`drawer-header-${item.id}`}
                  className="text-sm font-medium"
                >
                  Header
                </Label>
                <Input
                  id={`drawer-header-${item.id}`}
                  defaultValue={item.header}
                  className="mt-1.5"
                  suppressHydrationWarning
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor={`drawer-type-${item.id}`}
                    className="text-sm font-medium"
                  >
                    Type
                  </Label>
                  <Select defaultValue={item.type}>
                    <SelectTrigger
                      id={`drawer-type-${item.id}`}
                      className="w-full mt-1.5"
                      suppressHydrationWarning
                    >
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Table of Contents">
                        Table of Contents
                      </SelectItem>
                      <SelectItem value="Executive Summary">
                        Executive Summary
                      </SelectItem>
                      <SelectItem value="Technical Approach">
                        Technical Approach
                      </SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Capabilities">Capabilities</SelectItem>
                      <SelectItem value="Focus Documents">
                        Focus Documents
                      </SelectItem>
                      <SelectItem value="Narrative">Narrative</SelectItem>
                      <SelectItem value="Cover Page">Cover Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor={`drawer-status-${item.id}`}
                    className="text-sm font-medium"
                  >
                    Status
                  </Label>
                  <Select defaultValue={item.status}>
                    <SelectTrigger
                      id={`drawer-status-${item.id}`}
                      className="w-full mt-1.5"
                      suppressHydrationWarning
                    >
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Done">Done</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor={`drawer-target-${item.id}`}
                    className="text-sm font-medium"
                  >
                    Target
                  </Label>
                  <Input
                    id={`drawer-target-${item.id}`}
                    defaultValue={item.target}
                    className="mt-1.5"
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <Label
                    htmlFor={`drawer-limit-${item.id}`}
                    className="text-sm font-medium"
                  >
                    Limit
                  </Label>
                  <Input
                    id={`drawer-limit-${item.id}`}
                    defaultValue={item.limit}
                    className="mt-1.5"
                    suppressHydrationWarning
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor={`drawer-reviewer-${item.id}`}
                  className="text-sm font-medium"
                >
                  Reviewer
                </Label>
                <Select defaultValue={item.reviewer}>
                  <SelectTrigger
                    id={`drawer-reviewer-${item.id}`}
                    className="w-full mt-1.5"
                    suppressHydrationWarning
                  >
                    <SelectValue placeholder="Select a reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                    <SelectItem value="Jamik Tashpulatov">
                      Jamik Tashpulatov
                    </SelectItem>
                    <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter className="border-t">
          <Button className="w-full" suppressHydrationWarning>
            Save Changes
          </Button>
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="w-full"
              suppressHydrationWarning
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
