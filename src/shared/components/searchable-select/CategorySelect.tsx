import { SearchableSelect } from "@/shared/ui/searchable-select";
import { Option, Category } from "@/shared/types";
import React from "react";

interface CategorySelectProps {
  value: Category[];
  onChange: (rawValue: Category[], value: number[]) => void;
  disabled?: boolean;
  /**
   * Optional field name for form submission.
   * If provided, onChange will return an object with this field as key and the selected IDs as value.
   * If not provided, onChange will return just the array of IDs.
   * Example: { permissionIds: [1, 2, 3] } vs [1, 2, 3]
   */
  formField?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  disabled,
  formField, // No default - only structure as object if explicitly requested
}) => {
  // Convert current value to options format - Ensure all values are non-empty strings
  const selectedOptions = value.map((category) => {
    // Generate a safe value - ensure it's never empty
    const value = category.id
      ? category.id.toString()
      : `category-${category.name || "unnamed"}-${Date.now()}`;

    return {
      value,
      label: (
        <div>
          <div className="font-semibold">
            {category.name || "Unnamed Category"}
          </div>
        </div>
      ),
      original: category,
    };
  });

  // Handle selection change
  const handleSelectChange = (selected: Option<Category>[] | null) => {
    if (!selected) return;

    // Convert selected options back to Category objects
    const selectedPermissions = selected.map((option) => option.original);

    // Convert to numbers if they're not already
    const numericValues = selectedPermissions.map((v) =>
      typeof v.id === "string" ? parseInt(v.id, 10) : (v.id as number)
    );
    onChange(selectedPermissions, numericValues);
  };

  const transformedOptions = (permissions: Category[]) => {
    return permissions.map((category) => ({
      value: category.id.toString(),
      label: (
        <div>
          <div className="font-semibold">
            {category.name || "Unnamed Category"}
          </div>
        </div>
      ),
      original: category,
    }));
  };

  return (
    <div className="category-select-wrapper mb-4">
      <SearchableSelect
        endpoint="/api/categories"
        queryKey={["category-select"]}
        value={selectedOptions}
        onChange={handleSelectChange}
        placeholder={"Select categories..."}
        searchPlaceholder="Search categories..."
        multiple={true}
        disabled={disabled}
        maxHeight={400}
        showSelectedTags={true}
        emptyMessage="No categories found"
        transformData={transformedOptions}
      />
    </div>
  );
};

export default CategorySelect;
