import { GenericDataItem } from "@/shared/types/admin-dashboard";
import { Button } from "@/shared/ui/button";
import { ConfirmationDialog } from "@/shared/components/dialogs";
import { DetailViewModal } from "@/shared/ui/detail-view-modal";
import { FormRenderer } from "./FormRenderer";
import { ItemDetailView } from "./ItemDetailView";

interface DashboardModalsProps {
  displayName: string;
  fields: any[];
  // Create modal
  showCreateForm: boolean;
  onCloseCreateForm: () => void;
  onCreateSubmit: (data: Record<string, any>) => Promise<void>;
  createFormRef: React.RefObject<HTMLFormElement>;
  // Edit modal
  showEditForm: boolean;
  editingItem: GenericDataItem | null;
  onCloseEditForm: () => void;
  onEditSubmit: (data: Record<string, any>) => Promise<void>;
  editFormRef: React.RefObject<HTMLFormElement>;
  // View modal
  showViewModal: boolean;
  viewingItem: GenericDataItem | null;
  onCloseViewModal: () => void;
  // Delete dialog
  showDeleteDialog: boolean;
  deletingItem: GenericDataItem | null;
  onCloseDeleteDialog: () => void;
  onConfirmDelete: () => void;
}

export function DashboardModals({
  displayName,
  fields,
  showCreateForm,
  onCloseCreateForm,
  onCreateSubmit,
  createFormRef,
  showEditForm,
  editingItem,
  onCloseEditForm,
  onEditSubmit,
  editFormRef,
  showViewModal,
  viewingItem,
  onCloseViewModal,
  showDeleteDialog,
  deletingItem,
  onCloseDeleteDialog,
  onConfirmDelete,
}: DashboardModalsProps) {
  return (
    <>
      {/* Create Form Modal */}
      <DetailViewModal
        isOpen={showCreateForm}
        onClose={onCloseCreateForm}
        title={`Create New ${displayName.slice(0, -1)}`}
        description={`Add a new ${displayName
          .slice(0, -1)
          .toLowerCase()} to the system`}
        size="xl"
        footerContent={
          <>
            <Button variant="outline" onClick={onCloseCreateForm}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                createFormRef.current?.requestSubmit();
              }}
            >
              Create
            </Button>
          </>
        }
      >
        <FormRenderer
          ref={createFormRef}
          fields={fields}
          onSubmit={onCreateSubmit}
          onCancel={onCloseCreateForm}
          submitLabel="Create"
          title={`Create ${displayName.slice(0, -1)}`}
          showActions={false}
        />
      </DetailViewModal>

      {/* Edit Form Modal */}
      <DetailViewModal
        isOpen={showEditForm}
        onClose={onCloseEditForm}
        title={`Edit ${displayName.slice(0, -1)}`}
        size="xl"
        footerContent={
          <>
            <Button variant="outline" onClick={onCloseEditForm}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                editFormRef.current?.requestSubmit();
              }}
            >
              Update
            </Button>
          </>
        }
      >
        {editingItem && (
          <FormRenderer
            ref={editFormRef}
            fields={fields}
            initialData={editingItem}
            onSubmit={onEditSubmit}
            onCancel={onCloseEditForm}
            submitLabel="Update"
            title={`Edit ${displayName.slice(0, -1)}`}
            showActions={false}
          />
        )}
      </DetailViewModal>

      {/* View Detail Modal */}
      <DetailViewModal
        isOpen={showViewModal}
        onClose={onCloseViewModal}
        title={`View ${displayName.slice(0, -1)}`}
        description={`Details for this ${displayName
          .slice(0, -1)
          .toLowerCase()}`}
        size="lg"
        footerContent={
          <Button variant="outline" onClick={onCloseViewModal}>
            Close
          </Button>
        }
      >
        {viewingItem && <ItemDetailView item={viewingItem} fields={fields} />}
      </DetailViewModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          onCloseDeleteDialog();
          if (!open) {
            // Reset deletingItem when dialog closes
          }
        }}
        title={`Delete ${displayName.slice(0, -1)}`}
        description={`Are you sure you want to delete this ${displayName
          .slice(0, -1)
          .toLowerCase()}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={onConfirmDelete}
        variant="danger"
      />
    </>
  );
}
