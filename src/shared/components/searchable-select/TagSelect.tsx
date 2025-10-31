import { Option, Tag } from "@/shared/types";
import { SearchableSelect, createSearchableSelectConfig } from "@/shared/ui/searchable-select";
import React from "react";

interface TagSelectProps {
  value: Tag[];
  onChange: (rawValue: Tag[], value: number[]) => void;
  disabled?: boolean;
  /**
   * Optional field name for form submission.
   * If provided, onChange will return an object with this field as key and the selected IDs as value.
   * If not provided, onChange will return just the array of IDs.
   * Example: { tagIds: [1, 2, 3] } vs [1, 2, 3]
   */
  formField?: string;
}

const TagSelect: React.FC<TagSelectProps> = ({
  value,
  onChange,
  disabled,
  formField, // No default - only structure as object if explicitly requested
}) => {
  // Convert current value to options format - Ensure all values are non-empty strings
  const selectedOptions: Option<Tag>[] = value.map((tag) => {
    // Generate a safe value - ensure it's never empty
    const optionValue = tag.id
      ? tag.id.toString()
      : `tag-${tag.name || "unnamed"}-${Date.now()}`;

    return {
      value: optionValue,
      label: (
        <div>
          <div className="font-semibold">{tag.name || "Unnamed Tag"}</div>
        </div>
      ),
      original: tag,
    };
  });

  // Handle selection change
  const handleSelectChange = (selected: Option<Tag>[] | null) => {
    if (!selected) return;

    // Convert selected options back to Tag objects
    const selectedTags = selected.map((option) => option.original);

    // Convert to numbers if they're not already
    const numericValues = selectedTags.map((v) =>
      typeof v.id === "string" ? parseInt(v.id, 10) : (v.id as number)
    );
    onChange(selectedTags, numericValues);
  };

  const config = createSearchableSelectConfig({
    dataSource: {
      type: 'api',
      endpoint: "/api/tags",
      queryKey: ["tag-select"],
      transformData: (data: Tag[]) => data.map((tag) => ({
        value: tag.id.toString(),
        label: (
          <div>
            <div className="font-semibold">{tag.name || "Unnamed Tag"}</div>
          </div>
        ),
        original: tag,
      })),
    },
    ui: {
      placeholder: "Select tags...",
      searchPlaceholder: "Search tags...",
      emptyMessage: "No tags found",
      maxHeight: 400,
      showSelectedTags: true,
      disabled,
    },
    behavior: {
      multiple: true,
    },
  });

  return (
    <div className="tag-select-wrapper mb-4">
      <SearchableSelect.Root
        config={config}
        value={selectedOptions}
        onChange={handleSelectChange}
      >
        <SearchableSelect.Trigger value={selectedOptions} />
        <SearchableSelect.Content />
        <SearchableSelect.SelectedTags />
      </SearchableSelect.Root>
    </div>
  );
};

export default TagSelect;
