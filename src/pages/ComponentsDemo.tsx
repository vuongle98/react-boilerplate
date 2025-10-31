import React, { useState } from "react";
import { Button } from "@/shared/ui/button";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
import { Checkbox } from "@/shared/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Progress } from "@/shared/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/shared/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/shared/ui/pagination";
import { Skeleton } from "@/shared/ui/skeleton";
import { Switch } from "@/shared/ui/switch";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { DataTable } from "@/shared/components/data-display/DataTable";
import { FadeUp, SlideUp, Scale } from "@/shared/ui/animate";
import { useToast } from "@/shared/ui/use-toast";
import { Toaster } from "@/shared/ui/toaster";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  User,
  Mail,
  Lock,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Settings,
  Bell,
  Calendar,
  Database,
  Home
} from "lucide-react";

export const ComponentsDemo = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState("option1");
  const [inputValue, setInputValue] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState("option1");
  const [switchValue, setSwitchValue] = useState(false);
  const [progressValue, setProgressValue] = useState(65);
  const [currentPage, setCurrentPage] = useState(1);

  const tableData = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User", status: "Inactive" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Editor", status: "Active" },
    { id: 4, name: "Diana Prince", email: "diana@example.com", role: "User", status: "Active" },
    { id: 5, name: "Eve Wilson", email: "eve@example.com", role: "Admin", status: "Pending" },
  ];

  return (
    <div className="page-container">
      <div className="container mx-auto px-4 section-spacing space-y-12">
        {/* Header */}
        <FadeUp delay={50}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
                iconLeft={<Home className="h-4 w-4" />}
              >
                Back to Home
              </Button>
            </div>
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                Design System Components
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                A comprehensive showcase of our enhanced UI components with consistent design language,
                accessibility, and modern interactions.
              </p>
            </div>
          </div>
        </FadeUp>

        {/* Buttons Section */}
        <SlideUp delay={100}>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Buttons
              </CardTitle>
              <CardDescription>
                Interactive buttons with multiple variants, sizes, and states
              </CardDescription>
            </CardHeader>
            <CardContent className="element-spacing space-y-6">
              {/* Variants */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="success">Success</Button>
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Sizes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="xs">Extra Small</Button>
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>

              {/* With Icons */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">With Icons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button iconLeft={<Plus className="h-4 w-4" />}>Add Item</Button>
                  <Button iconRight={<Download className="h-4 w-4" />}>Download</Button>
                  <Button variant="ghost" iconLeft={<Edit className="h-4 w-4" />}>Edit</Button>
                  <Button variant="danger" iconLeft={<Trash2 className="h-4 w-4" />}>Delete</Button>
                </div>
              </div>

              {/* States */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">States</h3>
                <div className="flex flex-wrap gap-3">
                  <Button loading loadingText="Saving...">Normal</Button>
                  <Button disabled>Disabled</Button>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        {/* Inputs Section */}
        <FadeUp delay={200}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Form Inputs
              </CardTitle>
              <CardDescription>
                Input fields with validation, icons, and accessibility features
              </CardDescription>
            </CardHeader>
            <CardContent className="element-spacing space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Basic Inputs */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Basic Inputs</h3>
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    startAdornment={<Mail className="h-4 w-4" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    startAdornment={<Lock className="h-4 w-4" />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Input Variants */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Input Variants</h3>
                  <Input
                    label="Search"
                    placeholder="Search for items..."
                    startAdornment={<Search className="h-4 w-4" />}
                    endAdornment={<Button variant="ghost" size="sm">Search</Button>}
                  />
                  <Input
                    label="Username"
                    placeholder="Choose a username"
                    helperText="This will be your public display name"
                  />
                  <Input
                    label="Error Example"
                    placeholder="This field has an error"
                    error="This field is required"
                    readOnly
                    value=""
                  />
                  <Input
                    label="Disabled Input"
                    placeholder="This field is disabled"
                    disabled
                    readOnly
                    value="Disabled content"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeUp>

        {/* Select & Badges Section */}
        <SlideUp delay={300}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Select Component */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Select Dropdown
                </CardTitle>
                <CardDescription>
                  Enhanced select component with better styling and accessibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedValue} onValueChange={setSelectedValue}>
                  <SelectTrigger placeholder="Choose an option">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Options</SelectLabel>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Advanced</SelectLabel>
                      <SelectItem value="option4">Advanced Option 1</SelectItem>
                      <SelectItem value="option5">Advanced Option 2</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger placeholder="Select role" size="lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Status Badges
                </CardTitle>
                <CardDescription>
                  Color-coded status indicators and labels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Error</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Task completed</span>
                    <Badge variant="success">Done</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Payment failed</span>
                    <Badge variant="destructive">Failed</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Update available</span>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SlideUp>

        {/* Table Section */}
        <FadeUp delay={400}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Data Table
              </CardTitle>
              <CardDescription>
                Sortable table with zebra rows, hover effects, and responsive design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table striped>
                <TableHeader>
                  <TableRow>
                    <TableHead sortable sortDirection="asc" onSort={() => {}}>
                      Name
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((user, index) => (
                    <TableRow key={user.id} index={index}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === 'Active' ? 'success' :
                            user.status === 'Inactive' ? 'secondary' :
                            'warning'
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" iconLeft={<Eye className="h-3 w-3" />}>
                            View
                          </Button>
                          <Button variant="ghost" size="sm" iconLeft={<Edit className="h-3 w-3" />}>
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </FadeUp>

        {/* DataTable Component Section */}
        <SlideUp delay={850}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Enhanced DataTable
              </CardTitle>
              <CardDescription>
                Advanced table component with built-in loading states, pagination, and actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Loading Modes Demo */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Loading Modes</h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedValue("skeleton")}
                  >
                    Skeleton Mode
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedValue("overlay")}
                  >
                    Overlay Mode
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedValue("spinner")}
                  >
                    Spinner Mode
                  </Button>
                </div>
              </div>

              {/* DataTable with different loading modes */}
              <DataTable
                data={tableData}
                columns={[
                  { key: 'name', label: 'Name', className: 'font-medium' },
                  { key: 'email', label: 'Email' },
                  {
                    key: 'role',
                    label: 'Role',
                    render: (value) => (
                      <Badge variant={value === 'Admin' ? 'default' : 'secondary'}>
                        {value}
                      </Badge>
                    )
                  },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (value) => (
                      <Badge
                        variant={
                          value === 'Active' ? 'success' :
                          value === 'Inactive' ? 'secondary' :
                          'warning'
                        }
                      >
                        {value}
                      </Badge>
                    )
                  }
                ]}
                actions={[
                  {
                    label: 'View',
                    icon: Eye,
                    onClick: (item) => console.log('View', item)
                  },
                  {
                    label: 'Edit',
                    icon: Edit,
                    onClick: (item) => console.log('Edit', item)
                  },
                  {
                    label: 'Delete',
                    icon: Trash2,
                    variant: 'destructive',
                    onClick: (item) => console.log('Delete', item)
                  }
                ]}
                isLoading={selectedValue === "skeleton" || selectedValue === "overlay" || selectedValue === "spinner"}
                loadingMode={selectedValue as "skeleton" | "overlay" | "spinner"}
                loadingText={
                  selectedValue === "skeleton" ? "Loading skeleton..." :
                  selectedValue === "overlay" ? "Loading with overlay..." :
                  "Loading with spinner..."
                }
                showPagination={true}
                page={0}
                pageSize={5}
                totalItems={tableData.length}
                totalPages={Math.ceil(tableData.length / 5)}
                onPageChange={(page) => console.log('Page change:', page)}
                onPageSizeChange={(size) => console.log('Page size change:', size)}
              />
            </CardContent>
          </Card>
        </SlideUp>

        {/* Modal/Dialog Section */}
        <SlideUp delay={500}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Modal Dialog
              </CardTitle>
              <CardDescription>
                Modal with backdrop blur, smooth animations, and accessibility features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" iconLeft={<Plus className="h-5 w-5" />}>
                    Open Modal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Item</DialogTitle>
                    <DialogDescription>
                      Add a new item to your collection. Fill in the details below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input label="Name" placeholder="Enter item name" />
                    <Input label="Description" placeholder="Enter description" />
                    <Select>
                      <SelectTrigger placeholder="Select category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="ghost">Cancel</Button>
                    <Button iconLeft={<CheckCircle className="h-4 w-4" />}>
                      Create Item
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </SlideUp>

        {/* Form Controls Section */}
        <FadeUp delay={550}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Form Controls
              </CardTitle>
              <CardDescription>
                Interactive form controls including checkboxes, radio buttons, and switches
              </CardDescription>
            </CardHeader>
            <CardContent className="element-spacing space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Checkboxes */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Checkboxes</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={checkboxValue}
                        onCheckedChange={(checked) => setCheckboxValue(checked === true)}
                      />
                      <label htmlFor="terms" className="text-sm font-medium">
                        Accept terms and conditions
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="newsletter" />
                      <label htmlFor="newsletter" className="text-sm font-medium">
                        Subscribe to newsletter
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="marketing" defaultChecked />
                      <label htmlFor="marketing" className="text-sm font-medium">
                        Receive marketing emails
                      </label>
                    </div>
                  </div>
                </div>

                {/* Radio Group */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Radio Buttons</h3>
                  <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option1" id="r1" />
                      <label htmlFor="r1" className="text-sm font-medium">Option 1</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option2" id="r2" />
                      <label htmlFor="r2" className="text-sm font-medium">Option 2</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option3" id="r3" />
                      <label htmlFor="r3" className="text-sm font-medium">Option 3</label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Switches */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Switches</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="notifications"
                      checked={switchValue}
                      onCheckedChange={(checked) => setSwitchValue(checked === true)}
                    />
                    <label htmlFor="notifications" className="text-sm font-medium">
                      Enable notifications
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="dark-mode" />
                    <label htmlFor="dark-mode" className="text-sm font-medium">
                      Dark mode
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-save" defaultChecked />
                    <label htmlFor="auto-save" className="text-sm font-medium">
                      Auto-save
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeUp>

        {/* Textarea & Progress Section */}
        <SlideUp delay={600}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Textarea */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Textarea
                </CardTitle>
                <CardDescription>
                  Multi-line text input with character counting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  label="Message"
                  placeholder="Write your message here..."
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  helperText={`${textareaValue.length}/500 characters`}
                />
                <Textarea
                  label="Comments"
                  placeholder="Add your comments..."
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Progress Indicators
                </CardTitle>
                <CardDescription>
                  Visual progress bars for loading states and completion tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Upload Progress</span>
                    <span>{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Loading...</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Complete</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </SlideUp>

        {/* Alerts Section */}
        <FadeUp delay={650}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alert Notifications
              </CardTitle>
              <CardDescription>
                Different types of alert messages for user feedback and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="element-spacing space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  This is an informational message that provides context or additional details.
                </AlertDescription>
              </Alert>

              <Alert variant="success">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Your changes have been saved successfully.
                </AlertDescription>
              </Alert>

              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Please review your input before proceeding.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Something went wrong. Please try again later.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </FadeUp>

        {/* Tabs & Accordions Section */}
        <SlideUp delay={700}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Tabs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Tabs
                </CardTitle>
                <CardDescription>
                  Tabbed interface for organizing content into separate sections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="account" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account" className="space-y-4 mt-4">
                    <Input label="Full Name" placeholder="John Doe" />
                    <Input label="Email" type="email" placeholder="john@example.com" />
                    <Button>Update Account</Button>
                  </TabsContent>
                  <TabsContent value="password" className="space-y-4 mt-4">
                    <Input label="Current Password" type="password" />
                    <Input label="New Password" type="password" />
                    <Input label="Confirm Password" type="password" />
                    <Button>Change Password</Button>
                  </TabsContent>
                  <TabsContent value="notifications" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Email notifications</label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Push notifications</label>
                      <Switch defaultChecked />
                    </div>
                    <Button>Save Preferences</Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Accordions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Accordions
                </CardTitle>
                <CardDescription>
                  Collapsible content sections for organizing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is this project about?</AccordionTrigger>
                    <AccordionContent>
                      This is a comprehensive React component library with a modern design system,
                      featuring accessibility, dark mode support, and consistent styling.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I get started?</AccordionTrigger>
                    <AccordionContent>
                      Simply import the components you need and start using them in your React application.
                      All components follow consistent APIs and include TypeScript support.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is dark mode supported?</AccordionTrigger>
                    <AccordionContent>
                      Yes! All components automatically support dark mode through Tailwind CSS classes
                      and can be customized through the theme provider.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </SlideUp>

        {/* Avatars & Navigation Section */}
        <FadeUp delay={750}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Avatars */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Avatars
                </CardTitle>
                <CardDescription>
                  User profile images and fallback initials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">shadcn</p>
                    <p className="text-xs text-muted-foreground">@shadcn</p>
                  </div>
                </div>

                <div className="flex -space-x-2">
                  <Avatar className="border-2 border-background">
                    <AvatarImage src="https://github.com/vercel.png" />
                    <AvatarFallback>VC</AvatarFallback>
                  </Avatar>
                  <Avatar className="border-2 border-background">
                    <AvatarImage src="https://github.com/nextjs.png" />
                    <AvatarFallback>NJ</AvatarFallback>
                  </Avatar>
                  <Avatar className="border-2 border-background">
                    <AvatarImage src="https://github.com/tailwindcss.png" />
                    <AvatarFallback>TW</AvatarFallback>
                  </Avatar>
                  <Avatar className="border-2 border-background">
                    <AvatarFallback>+3</AvatarFallback>
                  </Avatar>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <Avatar size="sm">
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <Avatar size="md">
                    <AvatarFallback>MD</AvatarFallback>
                  </Avatar>
                  <Avatar size="lg">
                    <AvatarFallback>LG</AvatarFallback>
                  </Avatar>
                  <Avatar size="xl">
                    <AvatarFallback>XL</AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>

            {/* Breadcrumbs & Pagination */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Navigation
                </CardTitle>
                <CardDescription>
                  Breadcrumbs and pagination for site navigation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Breadcrumbs */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Breadcrumbs</h4>
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Demo</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>

                {/* Pagination */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Pagination</h4>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive={currentPage === 1}>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive={currentPage === 2}>2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive={currentPage === 3}>3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </div>
        </FadeUp>

        {/* Loading & Command Section */}
        <SlideUp delay={800}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Loading States */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Loading States
                </CardTitle>
                <CardDescription>
                  Skeleton loaders and loading indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[300px]" />
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Command Palette */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Command Palette
                </CardTitle>
                <CardDescription>
                  Searchable command interface with keyboard navigation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="secondary"
                      className="w-full justify-start text-sm text-muted-foreground"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Search commands...
                      <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                      </kbd>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Type a command or search..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                          <CommandItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Calendar</span>
                          </CommandItem>
                          <CommandItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                          </CommandItem>
                          <CommandItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </CommandItem>
                        </CommandGroup>
                        <CommandGroup heading="Navigation">
                          <CommandItem>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>New Project</span>
                          </CommandItem>
                          <CommandItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Document</span>
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
          </div>
        </SlideUp>

        {/* Toast Notifications Section */}
        <FadeUp delay={850}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Toast Notifications
              </CardTitle>
              <CardDescription>
                Non-intrusive notifications that appear temporarily
              </CardDescription>
            </CardHeader>
            <CardContent className="element-spacing space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={() =>
                    toast({
                      title: "Success!",
                      description: "Your changes have been saved successfully.",
                    })
                  }
                >
                  Show Success Toast
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    toast({
                      title: "Error",
                      description: "Something went wrong. Please try again.",
                      variant: "destructive",
                    })
                  }
                >
                  Show Error Toast
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    toast({
                      title: "Information",
                      description: "Here's some important information for you.",
                    })
                  }
                >
                  Show Info Toast
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    toast({
                      title: "Warning",
                      description: "Please review your input before proceeding.",
                      variant: "default",
                    })
                  }
                >
                  Show Warning Toast
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Click any button above to see the toast notifications in action.
                They appear in the top-right corner and auto-dismiss after a few seconds.
              </p>
            </CardContent>
          </Card>
        </FadeUp>

        {/* Design System Info */}
        <FadeUp delay={950}>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Design System Features</CardTitle>
              <CardDescription>
                Our comprehensive design system ensures consistency and reusability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    🎨 Design Language
                  </h3>
                  <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                    <li>• Consistent color palette</li>
                    <li>• Typography scale</li>
                    <li>• Spacing system</li>
                    <li>• Shadow hierarchy</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    ⚡ Component Features
                  </h3>
                  <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                    <li>• Multiple variants & sizes</li>
                    <li>• Accessibility (ARIA)</li>
                    <li>• Dark mode support</li>
                    <li>• Smooth animations</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    🛠️ Developer Experience
                  </h3>
                  <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                    <li>• TypeScript support</li>
                    <li>• Consistent API</li>
                    <li>• CVA pattern</li>
                    <li>• Utility functions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      </div>
      <Toaster />
    </div>
  );
};
