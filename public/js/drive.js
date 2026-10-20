function triggerCreateFolderModal() {
  const modal = document.getElementById("createFolderModal");
  if (modal) {
    modal.showModal();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.close();
  }
}
