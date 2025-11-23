import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Database, Plus, Settings, Trash2, Zap } from "lucide-react";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Simplified validation schema
const serviceConfigSchema = z.object({
  code: z.string().min(1, "Service code is required"),
  displayName: z.string().min(1, "Display name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  api: z.object({
    baseUrl: z.string().url("Must be a valid URL"),
    endpoints: z.object({
      list: z.string().min(1, "List endpoint required"),
      create: z.string().min(1, "Create endpoint required"),
      update: z.string().min(1, "Update endpoint required"),
      delete: z.string().min(1, "Delete endpoint required"),
    }),
  }),
  fields: z
    .array(
      z.object({
        key: z.string().min(1, "Field key required"),
        label: z.string().min(1, "Field label required"),
        type: z.enum([
          "text",
          "number",
          "boolean",
          "select",
          "date",
          "textarea",
          "email",
          "url",
          "json",
          "file",
          "tel",
          "datetime",
          "time",
        ]),
        required: z.boolean().optional(),
        table: z
          .object({
            visible: z.boolean().optional(),
            sortable: z.boolean().optional(),
            searchable: z.boolean().optional(),
            filterable: z.boolean().optional(),
            width: z.number().optional(),
          })
          .optional(),
      })
    )
    .min(1, "At least one field is required"),
  features: z.object({
    create: z.boolean(),
    update: z.boolean(),
    delete: z.boolean(),
    pagination: z.boolean(),
    search: z.boolean(),
    filters: z.boolean(),
    bulkActions: z.boolean(),
  }),
});

type ServiceConfigFormData = z.infer<typeof serviceConfigSchema>;

interface ServiceConfigFormProps {
  initialData?: Partial<any>;
  onSubmit: (data: any) => void | Promise<void>;
  onCancel: () => void;
  showActions?: boolean;
}

type FeatureFieldName =
  | "features.create"
  | "features.update"
  | "features.delete"
  | "features.pagination"
  | "features.search"
  | "features.filters"
  | "features.bulkActions";

export const ServiceConfigForm = forwardRef<
  HTMLFormElement,
  ServiceConfigFormProps
>(function ServiceConfigForm(
  { initialData, onSubmit, onCancel, showActions = true },
  ref
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate initial data
  if (initialData && initialData.fields && !Array.isArray(initialData.fields)) {
    console.error("initialData.fields is not an array:", initialData.fields);
    toast.error("Invalid service configuration: fields must be an array");
    // Return a fallback UI instead of crashing
    return (
      <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5">
        <h3 className="text-lg font-semibold text-destructive mb-2">
          Configuration Error
        </h3>
        <p className="text-sm text-muted-foreground">
          The service configuration data is invalid. Fields must be an array.
        </p>
      </div>
    );
  }

  const form = useForm<ServiceConfigFormData>({
    resolver: zodResolver(serviceConfigSchema),
    defaultValues: {
      code: initialData?.code || "",
      displayName: initialData?.displayName || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      api: {
        baseUrl: initialData?.api?.baseUrl || "",
        endpoints: {
          list: initialData?.api?.endpoints?.list || "",
          create: initialData?.api?.endpoints?.create || "",
          update: initialData?.api?.endpoints?.update || "",
          delete: initialData?.api?.endpoints?.delete || "",
        },
      },
      fields: (() => {
        if (initialData?.fields) {
          if (typeof initialData.fields === "string") {
            try {
              const parsed = JSON.parse(initialData.fields);
              if (!Array.isArray(parsed)) {
                console.error("Parsed fields is not an array:", parsed);
                toast.error(
                  "Invalid service configuration: parsed fields must be an array"
                );
                return [
                  {
                    key: "",
                    label: "",
                    type: "text",
                    required: false,
                    table: {
                      visible: true,
                      sortable: false,
                      searchable: false,
                      filterable: false,
                    },
                  },
                ];
              }
              return parsed.map((field: any) => ({
                ...field,
                table: {
                  visible: field.table?.visible ?? true,
                  sortable: field.table?.sortable ?? false,
                  searchable: field.table?.searchable ?? false,
                  filterable: field.table?.filterable ?? false,
                  width: field.table?.width,
                },
              }));
            } catch (e) {
              console.warn("Failed to parse fields JSON:", e);
              toast.error("Failed to parse service fields configuration");
              return [
                {
                  key: "",
                  label: "",
                  type: "text",
                  required: false,
                  table: {
                    visible: true,
                    sortable: false,
                    searchable: false,
                    filterable: false,
                  },
                },
              ];
            }
          }

          // Ensure each field has table configuration with defaults
          if (Array.isArray(initialData.fields)) {
            if (initialData.fields.length === 0) {
              console.warn("Fields array is empty, providing default field");
              toast.warning("No fields configured for this service");
            }
            return initialData.fields.map((field: any) => ({
              ...field,
              table: {
                visible: field.table?.visible ?? true,
                sortable: field.table?.sortable ?? false,
                searchable: field.table?.searchable ?? false,
                filterable: field.table?.filterable ?? false,
                width: field.table?.width,
              },
            }));
          } else {
            console.error(
              "initialData.fields is not an array or string:",
              initialData.fields
            );
            toast.error(
              "Invalid service configuration: fields must be an array"
            );
            return [
              {
                key: "",
                label: "",
                type: "text",
                required: false,
                table: {
                  visible: true,
                  sortable: false,
                  searchable: false,
                  filterable: false,
                },
              },
            ];
          }
        }
        return [
          {
            key: "",
            label: "",
            type: "text",
            required: false,
            table: {
              visible: true,
              sortable: false,
              searchable: false,
              filterable: false,
            },
          },
        ];
      })(),
      features: {
        create: initialData?.features?.create ?? true,
        update: initialData?.features?.update ?? true,
        delete: initialData?.features?.delete ?? true,
        pagination: initialData?.features?.pagination ?? true,
        search: initialData?.features?.search ?? true,
        filters: initialData?.features?.filters ?? true,
        bulkActions: initialData?.features?.bulkActions ?? false,
      },
    },
  });

  const handleSubmit = async (data: ServiceConfigFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addField = () => {
    const currentFields = form.getValues("fields");
    form.setValue("fields", [
      ...currentFields,
      {
        key: "",
        label: "",
        type: "text",
        required: false,
        table: {
          visible: true,
          sortable: false,
          searchable: false,
          filterable: false,
        },
      },
    ]);
  };

  const removeField = (index: number) => {
    const currentFields = form.getValues("fields");
    form.setValue(
      "fields",
      currentFields.filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form
        ref={ref}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Code *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., users, products" />
                    </FormControl>
                    <FormDescription>
                      Machine-readable identifier
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Users" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe what this service does..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="administration">
                        Administration
                      </SelectItem>
                      <SelectItem value="communication">
                        Communication
                      </SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              API Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="api.baseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base URL *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://api.example.com/v1"
                    />
                  </FormControl>
                  <FormDescription>
                    Base URL for all API endpoints
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="api.endpoints.list"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>List Endpoint *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="/users" />
                    </FormControl>
                    <FormDescription>
                      GET endpoint for listing items
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="api.endpoints.create"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Create Endpoint *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="/users" />
                    </FormControl>
                    <FormDescription>
                      POST endpoint for creating items
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="api.endpoints.update"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Update Endpoint *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="/users" />
                    </FormControl>
                    <FormDescription>
                      PUT/PATCH endpoint for updating items
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="api.endpoints.delete"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delete Endpoint *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="/users" />
                    </FormControl>
                    <FormDescription>
                      DELETE endpoint for removing items
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Fields Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Fields Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold">Service Fields</h3>
            </div>
            {(() => {
              const fieldsValue = form.watch("fields");
              const safeFields = Array.isArray(fieldsValue) ? fieldsValue : [];
              return safeFields.map((field, index) => (
                <Card key={index} className="border-dashed">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        Field #{index + 1}
                      </CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeField(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`fields.${index}.key`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Field Key *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., name, email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`fields.${index}.label`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Label *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Full Name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`fields.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Field Type *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="boolean">Boolean</SelectItem>
                                <SelectItem value="select">Select</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="textarea">
                                  Textarea
                                </SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="url">URL</SelectItem>
                                <SelectItem value="json">JSON</SelectItem>
                                <SelectItem value="file">File</SelectItem>
                                <SelectItem value="tel">Phone</SelectItem>
                                <SelectItem value="datetime">
                                  Datetime
                                </SelectItem>
                                <SelectItem value="time">Time</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`fields.${index}.required`}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Required Field</FormLabel>
                        </FormItem>
                      )}
                    />

                    {/* Table Configuration */}
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium mb-3">
                        Table Configuration
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`fields.${index}.table.visible`}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value ?? true}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm">
                                Visible in Table
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`fields.${index}.table.sortable`}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value ?? false}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm">
                                Sortable
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`fields.${index}.table.searchable`}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value ?? false}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm">
                                Searchable
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`fields.${index}.table.filterable`}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value ?? false}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm">
                                Filterable
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="mt-3">
                        <FormField
                          control={form.control}
                          name={`fields.${index}.table.width`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">
                                Column Width (px)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder="Auto"
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(
                                      value ? Number(value) : undefined
                                    );
                                  }}
                                  className="w-full sm:w-32"
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Optional column width in pixels
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ));
            })()}
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={addField}
                size="sm"
                className="gap-2"
                iconLeft={<Plus className="h-4 w-4" />}
              >
                Add Field
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">CRUD Operations</h3>
                {[
                  { key: "create", label: "Create" },
                  { key: "update", label: "Update" },
                  { key: "delete", label: "Delete" },
                ].map(({ key, label }) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`features.${key}` as FeatureFieldName}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>{label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data Features</h3>
                {[
                  { key: "pagination", label: "Pagination" },
                  { key: "search", label: "Search" },
                  { key: "filters", label: "Filters" },
                  { key: "bulkActions", label: "Bulk Actions" },
                ].map(({ key, label }) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`features.${key}` as FeatureFieldName}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>{label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {showActions && (
          <div className="flex flex-col gap-3 pt-6 border-t sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting
                ? "Saving..."
                : initialData
                ? "Update Service"
                : "Create Service"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
});
