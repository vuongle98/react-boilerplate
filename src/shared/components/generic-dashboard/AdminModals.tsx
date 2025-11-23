import { ServiceConfig } from "@/shared/types/generic-dashboard";
import { Button } from "@/shared/ui/button";
import { DetailViewModal } from "@/shared/ui/detail-view-modal";
import { ServiceConfigForm } from "./ServiceConfigForm";
import { ServiceTestContent } from "./ServiceTestModal";

interface AdminModalsProps {
  // Create modal
  isCreateModalOpen: boolean;
  onCloseCreateModal: () => void;
  onCreateService: (serviceConfig: any) => void;
  createFormRef: React.RefObject<HTMLFormElement>;

  // Edit modal
  isEditModalOpen: boolean;
  editingService: ServiceConfig | null;
  editingServiceId: string | null;
  onCloseEditModal: () => void;
  onEditService: (serviceConfig: any) => void;
  editFormRef: React.RefObject<HTMLFormElement>;

  // Test modal
  isTestModalOpen: boolean;
  selectedService: ServiceConfig | null;
  onCloseTestModal: () => void;
}

export function AdminModals({
  isCreateModalOpen,
  onCloseCreateModal,
  onCreateService,
  createFormRef,
  isEditModalOpen,
  editingService,
  editingServiceId,
  onCloseEditModal,
  onEditService,
  editFormRef,
  isTestModalOpen,
  selectedService,
  onCloseTestModal,
}: AdminModalsProps) {
  return (
    <>
      {/* Create Service Modal */}
      <DetailViewModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreateModal}
        title="Create New Service"
        size="xl"
        showCloseButton={false}
        footerContent={
          <>
            <Button variant="outline" onClick={onCloseCreateModal}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                createFormRef.current?.requestSubmit();
              }}
            >
              Create Service
            </Button>
          </>
        }
      >
        <ServiceConfigForm
          ref={createFormRef}
          onSubmit={onCreateService}
          onCancel={onCloseCreateModal}
          showActions={false}
        />
      </DetailViewModal>

      {/* Edit Service Modal */}
      <DetailViewModal
        isOpen={isEditModalOpen}
        onClose={() => {
          onCloseEditModal();
          // Reset editing service ID
        }}
        title="Edit Service"
        size="md"
        showCloseButton={false}
        footerContent={
          <>
            <Button
              variant="outline"
              onClick={() => {
                onCloseEditModal();
                // Reset editing service ID
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                editFormRef.current?.requestSubmit();
              }}
            >
              Update Service
            </Button>
          </>
        }
      >
        {editingService && (
          <ServiceConfigForm
            ref={editFormRef}
            initialData={editingService}
            onSubmit={onEditService}
            onCancel={() => {
              onCloseEditModal();
              // Reset editing service ID
            }}
            showActions={false}
          />
        )}
      </DetailViewModal>

      {/* Test Service Modal */}
      <DetailViewModal
        isOpen={isTestModalOpen}
        onClose={onCloseTestModal}
        title={`Service Testing - ${selectedService?.displayName || ""}`}
        description="Test service connections and validate endpoints"
        size="md"
      >
        {selectedService && <ServiceTestContent service={selectedService} />}
      </DetailViewModal>
    </>
  );
}
