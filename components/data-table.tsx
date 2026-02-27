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
  IconSearch,
  IconFilter,
  IconDownload,
  IconUpload,
  IconSettings,
  IconRefresh,
  IconEye,
  IconEyeOff,
  IconLock,
  IconLockOpen,
  IconAlertCircle,
  IconCheck,
  IconX,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Pencil, Star, Trash2, FileText, Calendar, Clock, User, Tag, Link2 } from "lucide-react";

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.string().optional(),
  tags: z.array(z.string()).optional(),
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
      className={`text-muted-foreground size-7 hover:bg-transparent hover:text-foreground transition-all duration-200 ${
        isDragging ? "cursor-grabbing text-primary scale-110" : "cursor-grab"
      }`}
    >
      <IconGripVertical className="size-3.5" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800";
    case "low":
      return "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
  }
};

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
    size: 40,
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
          className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-colors"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-colors"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "header",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-semibold"
        >
          Header
          <IconChevronDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />;
    },
    enableHiding: false,
    size: 300,
  },
  {
    accessorKey: "type",
    header: "Section Type",
    cell: ({ row }) => (
      <div className="w-44">
        <Badge
          variant="outline"
          className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 dark:from-blue-950/30 dark:to-indigo-950/30 dark:text-blue-400 dark:border-blue-800 px-3 py-1 text-xs font-medium rounded-full shadow-sm"
        >
          <Tag className="w-3 h-3 mr-1 inline-block" />
          {row.original.type}
        </Badge>
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.original.priority || "Medium";
      return (
        <Badge
          variant="outline"
          className={`${getPriorityColor(priority)} px-3 py-1 text-xs font-medium rounded-full`}
        >
          {priority}
        </Badge>
      );
    },
    size: 100,
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
            flex items-center gap-1.5 px-3 py-1 text-xs font-medium w-fit rounded-full shadow-sm
            ${
              isDone
                ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 dark:from-green-950/30 dark:to-emerald-950/30 dark:text-green-400 dark:border-green-800"
                : isInProgress
                  ? "bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-200 dark:from-yellow-950/30 dark:to-amber-950/30 dark:text-yellow-400 dark:border-yellow-800"
                  : "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200 dark:from-gray-800 dark:to-slate-800 dark:text-gray-400 dark:border-gray-700"
            }
          `}
        >
          {isDone ? (
            <IconCircleCheckFilled className="size-3.5 fill-green-500 dark:fill-green-400" />
          ) : isInProgress ? (
            <IconLoader className="size-3.5 animate-spin text-yellow-500 dark:text-yellow-400" />
          ) : (
            <IconX className="size-3.5 text-gray-400 dark:text-gray-600" />
          )}
          {status}
        </Badge>
      );
    },
    size: 120,
  },
  {
    accessorKey: "target",
    header: () => <div className="w-full text-right font-semibold">Target</div>,
    cell: ({ row }) => (
      <div className="relative group">
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
            className="h-8 w-20 text-right bg-transparent border-transparent hover:border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all rounded-md group-hover:border-primary/30"
            defaultValue={row.original.target}
            id={`target-${row.original.id}`}
            onBlur={(e) => e.currentTarget.form?.requestSubmit()}
            suppressHydrationWarning
          />
        </form>
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "limit",
    header: () => <div className="w-full text-right font-semibold">Limit</div>,
    cell: ({ row }) => (
      <div className="relative group">
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
            className="h-8 w-20 text-right bg-transparent border-transparent hover:border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all rounded-md group-hover:border-primary/30"
            defaultValue={row.original.limit}
            id={`limit-${row.original.id}`}
            onBlur={(e) => e.currentTarget.form?.requestSubmit()}
            suppressHydrationWarning
          />
        </form>
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "reviewer",
    header: () => <div className="font-semibold">Reviewer</div>,
    cell: ({ row }) => {
      const isAssigned = row.original.reviewer !== "Assign reviewer";

      if (isAssigned) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <Avatar className="size-6 border-2 border-primary/20">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                      {row.original.reviewer
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{row.original.reviewer}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Assigned reviewer</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return (
        <>
          <Label htmlFor={`reviewer-${row.original.id}`} className="sr-only">
            Reviewer
          </Label>
          <Select>
            <SelectTrigger
              className="w-40 h-8 text-sm border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-200"
              size="sm"
              id={`reviewer-${row.original.id}`}
              suppressHydrationWarning
            >
              <SelectValue placeholder="Assign reviewer" />
            </SelectTrigger>
            <SelectContent align="end" className="min-w-[200px]">
              <SelectItem value="Eddie Lake" className="cursor-pointer hover:bg-primary/5">
                <div className="flex items-center gap-2">
                  <Avatar className="size-5">
                    <AvatarFallback className="text-xs">EL</AvatarFallback>
                  </Avatar>
                  <span>Eddie Lake</span>
                </div>
              </SelectItem>
              <SelectItem value="Jamik Tashpulatov" className="cursor-pointer hover:bg-primary/5">
                <div className="flex items-center gap-2">
                  <Avatar className="size-5">
                    <AvatarFallback className="text-xs">JT</AvatarFallback>
                  </Avatar>
                  <span>Jamik Tashpulatov</span>
                </div>
              </SelectItem>
              <SelectItem value="Emily Whalen" className="cursor-pointer hover:bg-primary/5">
                <div className="flex items-center gap-2">
                  <Avatar className="size-5">
                    <AvatarFallback className="text-xs">EW</AvatarFallback>
                  </Avatar>
                  <span>Emily Whalen</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </>
      );
    },
    size: 180,
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;
      if (!dueDate) return <span className="text-muted-foreground text-sm">—</span>;
      
      const isOverdue = new Date(dueDate) < new Date();
      return (
        <div className="flex items-center gap-2">
          <Calendar className="size-3.5 text-muted-foreground" />
          <span className={`text-sm ${isOverdue ? "text-red-600 dark:text-red-400 font-medium" : ""}`}>
            {dueDate}
            {isOverdue && <span className="ml-2 text-xs">(Overdue)</span>}
          </span>
        </div>
      );
    },
    size: 130,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-primary/10 text-muted-foreground hover:text-foreground flex size-8 transition-all duration-200 hover:scale-110"
            size="icon"
            suppressHydrationWarning
          >
            <IconDotsVertical className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions for {row.original.header}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <Copy className="h-4 w-4" />
              <span>Make a copy</span>
              <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <Star className="h-4 w-4" />
              <span>Favorite</span>
              <DropdownMenuShortcut>⌘F</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the section
                  "{row.original.header}" and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    toast.success(`${row.original.header} deleted successfully`);
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    size: 50,
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
        relative z-0 transition-all duration-300 group
        data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 data-[dragging=true]:shadow-xl data-[dragging=true]:scale-[1.02] data-[dragging=true]:bg-white dark:data-[dragging=true]:bg-gray-900
        data-[state=selected]:bg-primary/5 dark:data-[state=selected]:bg-primary/10
        hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30 dark:hover:from-muted/20 dark:hover:to-muted/10
        ${row.index % 2 === 0 ? "bg-white dark:bg-gray-900/50" : "bg-gray-50/30 dark:bg-gray-800/30"}
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
  const [isLoading, setIsLoading] = React.useState(false);
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
      toast.success("Rows reordered successfully", {
        icon: <IconCheck className="h-4 w-4" />,
      });
    }
  }

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Data refreshed successfully");
    }, 1500);
  };

  // Don't render until after hydration to prevent mismatch
  if (!mounted) {
    return null;
  }

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;

  return (
    <TooltipProvider>
      <Tabs
        defaultValue="outline"
        className="w-full flex-col justify-start gap-6"
        suppressHydrationWarning
      >
        <div className="flex items-center justify-between px-4 lg:px-6 py-2 border-b">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sections..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="h-9 pl-9 pr-4 w-full bg-muted/50 border-muted focus:bg-background transition-all duration-200"
                suppressHydrationWarning
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2 border-muted hover:bg-muted/50"
                  suppressHydrationWarning
                >
                  <IconFilter className="size-3.5" />
                  <span className="hidden lg:inline">Filter</span>
                  {columnFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                      {columnFilters.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  Status
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Priority
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Type
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Reviewer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2 border-muted hover:bg-muted/50"
                  suppressHydrationWarning
                >
                  <IconLayoutColumns className="size-3.5" />
                  <span className="hidden lg:inline">Columns</span>
                  <IconChevronDown className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
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
                        {column.id === "drag" ? "Drag Handle" : column.id.replace(/([A-Z])/g, ' $1').trim()}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="default"
              size="sm"
              className="h-9 gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm"
              suppressHydrationWarning
            >
              <IconPlus className="size-3.5" />
              <span className="hidden lg:inline">Add Section</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <IconRefresh className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh data</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <IconDownload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <IconUpload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Import</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <IconSettings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Table settings</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <TabsContent
          value="outline"
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
          suppressHydrationWarning
        >
          {selectedCount > 0 && (
            <div className="flex items-center justify-between bg-primary/5 rounded-lg p-3 border border-primary/20">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  {selectedCount} selected
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedCount} of {totalCount} rows selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  Bulk Edit
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  Delete Selected
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => table.toggleAllPageRowsSelected(false)}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-xl border bg-card shadow-lg transition-all duration-200 hover:shadow-xl">
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
              <Table>
                <TableHeader className="bg-gradient-to-r from-muted/80 to-muted/40 sticky top-0 z-10 backdrop-blur-sm">
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
                            style={{ width: header.getSize() }}
                            className="h-11 font-semibold text-foreground/80"
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
                        className="h-32 text-center"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <IconAlertCircle className="h-8 w-8 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No results found.</p>
                          <Button variant="link" className="text-primary">
                            Clear filters
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>

          <div className="flex items-center justify-between px-4 py-2">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {selectedCount} of {totalCount} row(s) selected.
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
                    className="w-20 h-8 border-muted"
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
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Past Performance</CardTitle>
              <CardDescription>Historical performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="desktop" stroke="var(--color-desktop)" fillOpacity={1} fill="url(#colorDesktop)" />
                  <Area type="monotone" dataKey="mobile" stroke="var(--color-mobile)" fillOpacity={1} fill="url(#colorMobile)" />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="key-personnel"
          className="flex flex-col px-4 lg:px-6"
          suppressHydrationWarning
        >
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Key Personnel</CardTitle>
              <CardDescription>Team members and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {["Eddie Lake", "Jamik Tashpulatov", "Emily Whalen"].map((person, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {person.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{person}</p>
                      <p className="text-sm text-muted-foreground">Reviewer</p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="focus-documents"
          className="flex flex-col px-4 lg:px-6"
          suppressHydrationWarning
        >
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Focus Documents</CardTitle>
              <CardDescription>Important documents and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {["Technical Specifications", "Project Timeline", "Budget Overview", "Risk Assessment"].map((doc, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer">
                    <FileText className="size-5 text-primary" />
                    <span className="flex-1 font-medium">{doc}</span>
                    <Badge variant="secondary" className="text-xs">PDF</Badge>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Link2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsList className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background border shadow-lg rounded-full h-10 px-1">
          <TabsTrigger value="outline" className="rounded-full px-4">Outline</TabsTrigger>
          <TabsTrigger value="past-performance" className="rounded-full px-4">Performance</TabsTrigger>
          <TabsTrigger value="key-personnel" className="rounded-full px-4">Personnel</TabsTrigger>
          <TabsTrigger value="focus-documents" className="rounded-full px-4">Documents</TabsTrigger>
        </TabsList>
      </Tabs>
    </TooltipProvider>
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
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Changes saved successfully");
    }, 1500);
  };

  if (!mounted) {
    return (
      <Button
        variant="link"
        className="text-foreground w-fit px-0 text-left font-medium hover:no-underline"
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
          className="text-foreground hover:text-primary w-fit px-0 text-left font-medium transition-all duration-200 hover:scale-105 hover:no-underline"
          suppressHydrationWarning
        >
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-primary/70" />
            {item.header}
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-2xl mx-auto" suppressHydrationWarning>
        <DrawerHeader className="border-b bg-gradient-to-r from-background to-muted/30">
          <DrawerTitle className="text-2xl flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            {item.header}
          </DrawerTitle>
          <DrawerDescription className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="bg-primary/5">
              {item.type}
            </Badge>
            <Badge variant="outline" className="bg-primary/5">
              ID: {item.id}
            </Badge>
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-6 overflow-y-auto px-6 py-4 text-sm max-h-[70vh]">
          {!isMobile && (
            <>
              <Card className="border-none shadow-none bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <IconTrendingUp className="size-4 text-green-500" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={chartConfig}
                    className="h-[180px] w-full"
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
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex items-center gap-2 text-sm">
                    <IconTrendingUp className="size-4 text-green-500" />
                    <span className="font-medium">
                      Trending up by 5.2% this month
                    </span>
                  </div>
                </CardFooter>
              </Card>
              <Separator />
            </>
          )}
          
          <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="space-y-5">
              <div>
                <Label htmlFor={`drawer-header-${item.id}`} className="text-sm font-medium flex items-center gap-1">
                  <FileText className="size-3.5" />
                  Header
                </Label>
                <Input
                  id={`drawer-header-${item.id}`}
                  defaultValue={item.header}
                  className="mt-1.5 bg-muted/30 border-muted focus:bg-background transition-all"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <Label htmlFor={`drawer-description-${item.id}`} className="text-sm font-medium flex items-center gap-1">
                  <FileText className="size-3.5" />
                  Description
                </Label>
                <Textarea
                  id={`drawer-description-${item.id}`}
                  defaultValue={item.description || "Add a description..."}
                  className="mt-1.5 bg-muted/30 border-muted focus:bg-background transition-all min-h-[80px]"
                  suppressHydrationWarning
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`drawer-type-${item.id}`} className="text-sm font-medium flex items-center gap-1">
                    <Tag className="size-3.5" />
                    Type
                  </Label>
                  <Select defaultValue={item.type}>
                    <SelectTrigger
                      id={`drawer-type-${item.id}`}
                      className="w-full mt-1.5 bg-muted/30 border-muted"
                      suppressHydrationWarning
                    >
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Table of Contents">Table of Contents</SelectItem>
                      <SelectItem value="Executive Summary">Executive Summary</SelectItem>
                      <SelectItem value="Technical Approach">Technical Approach</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Capabilities">Capabilities</SelectItem>
                      <SelectItem value="Focus Documents">Focus Documents</SelectItem>
                      <SelectItem value="Narrative">Narrative</SelectItem>
                      <SelectItem value="Cover Page">Cover Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`drawer-status-${item.id}`} className="text-sm font-medium flex items-center gap-1">
                    <IconLoader className="size-3.5" />
                    Status
                  </Label>
                  <Select defaultValue={item.status}>
                    <SelectTrigger
                      id={`drawer-status-${item.id}`}
                      className="w-full mt-1.5 bg-muted/30 border-muted"
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
                  <Label htmlFor={`drawer-priority-${item.id}`} className="text-sm font-medium flex items-center gap-1">
                    <IconAlertCircle className="size-3.5" />
                    Priority
                  </Label>
                  <Select defaultValue={item.priority || "Medium"}>
                    <SelectTrigger
                      id={`drawer-priority-${item.id}`}
                      className="w-full mt-1.5 bg-muted/30 border-muted"
                      suppressHydrationWarning
                    >
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`drawer-duedate-${item.id}`} className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    Due Date
                  </Label>
                  <Input
                    id={`drawer-duedate-${item.id}`}
                    type="date"
                    defaultValue={item.dueDate || ""}
                    className="mt-1.5 bg-muted/30 border-muted focus:bg-background"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`drawer-target-${item.id}`} className="text-sm font-medium">
                    Target
                  </Label>
                  <Input
                    id={`drawer-target-${item.id}`}
                    defaultValue={item.target}
                    className="mt-1.5 bg-muted/30 border-muted focus:bg-background"
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <Label htmlFor={`drawer-limit-${item.id}`} className="text-sm font-medium">
                    Limit
                  </Label>
                  <Input
                    id={`drawer-limit-${item.id}`}
                    defaultValue={item.limit}
                    className="mt-1.5 bg-muted/30 border-muted focus:bg-background"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`drawer-reviewer-${item.id}`} className="text-sm font-medium flex items-center gap-1">
                  <User className="size-3.5" />
                  Reviewer
                </Label>
                <Select defaultValue={item.reviewer}>
                  <SelectTrigger
                    id={`drawer-reviewer-${item.id}`}
                    className="w-full mt-1.5 bg-muted/30 border-muted"
                    suppressHydrationWarning
                  >
                    <SelectValue placeholder="Select a reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Eddie Lake">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-5">
                          <AvatarFallback>EL</AvatarFallback>
                        </Avatar>
                        <span>Eddie Lake</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Jamik Tashpulatov">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-5">
                          <AvatarFallback>JT</AvatarFallback>
                        </Avatar>
                        <span>Jamik Tashpulatov</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Emily Whalen">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-5">
                          <AvatarFallback>EW</AvatarFallback>
                        </Avatar>
                        <span>Emily Whalen</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-1 mb-2">
                  <Tag className="size-3.5" />
                  Tags
                </Label>
                <div className="flex flex-wrap gap-2">
                  {["Important", "Review", "Draft"].map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="px-3 py-1 cursor-pointer hover:bg-primary/10 transition-colors"
                    >
                      {tag}
                      <IconX className="ml-1 size-3" />
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                    + Add tag
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Switch id={`drawer-private-${item.id}`} />
                  <Label htmlFor={`drawer-private-${item.id}`} className="text-sm">
                    Make private
                  </Label>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  Last updated: Today
                </div>
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter className="border-t bg-muted/20">
          <div className="flex gap-2 w-full">
            <Button 
              className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              onClick={handleSave}
              disabled={isSaving}
              suppressHydrationWarning
            >
              {isSaving ? (
                <>
                  <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="flex-1"
                suppressHydrationWarning
              >
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}