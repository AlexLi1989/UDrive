function triggerCreateFolderModal() {
  const modal = document.getElementById("createFolderModal");
  if (modal) {
    modal.showModal();
  }
}

function triggerEditFolderModal(folderId, currentName) {
  const modal = document.getElementById("editFolderModal");
  const form = document.getElementById("editFolderForm");
  const input = document.getElementById("editFolderName");
  if (modal && form && input) {
    form.action = `/folders/${folderId}/update`;
    input.value = currentName;
    modal.showModal();
  }
}

function triggerDeleteFolderModal(folderId) {
  const modal = document.getElementById("deleteFolderModal");
  const form = document.getElementById("deleteFolderForm");
  if (modal && form) {
    form.action = `/folders/${folderId}/delete`;
    modal.showModal();
  }
}

async function triggerEditFileModal(fileId) {
  const modal = document.getElementById("editFileModal");
  const form = document.getElementById("editFileForm");
  if (modal && form) {
    form.action = `/files/${fileId}/update`;
    await fillFileUpdateModal(fileId);
    modal.showModal();
  }
}

//helper for file edit
async function fillFileUpdateModal(fileId) {
  const nameInput = document.getElementById("editFileName");
  const folderSelect = document.getElementById("editFileFolderId");
  try {
    const response = await fetch(`/files/${fileId}/update`);
    if (!response.ok) {
      throw new Error("Failed to fetch file update data");
    }
    const data = await response.json();
    if (nameInput) {
      nameInput.value = data.file.name;
    }
    if (folderSelect) {
      folderSelect.innerHTML = "<option value=''>My Drive(Root)</option>";
      data.allFolders.forEach((folder) => {
        const option = document.createElement("option");
        option.value = folder.id;
        option.innerText = `${folder.name}`;
        if (folder.id === data.file.folderId) {
          option.selected = true;
        }
        folderSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Failed to fill file update modal: ", error);
    throw error;
  }
}

function triggerDownloadFile(fileId) {
  const link = document.createElement("a");
  link.href = `/files/${fileId}/download`;
  link.setAttribute("download", "");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function triggerFileDetailModal(fileId) {
  const modal = document.getElementById("fileDetailModal");
  const nameSpan = document.getElementById("File-Name");
  const sizeSpan = document.getElementById("File-Size");
  const dateSpan = document.getElementById("File-Date");
  if (modal) {
    modal.showModal();
    try {
      const response = await fetch(`/files/${fileId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch file details");
      }
      const data = await response.json();
      if (nameSpan) nameSpan.textContent = data.name;
      if (sizeSpan) sizeSpan.textContent = data.size;
      if (dateSpan)
        dateSpan.textContent = new Date(data.createdAt).toLocaleString();
    } catch (error) {
      console.error("Failed to load file details: ", error);
      throw error;
    }
  }
}

function triggerDeleteFileModal(fileId) {
  const modal = document.getElementById("deleteFileModal");
  const form = document.getElementById("deleteFileForm");
  if (modal && form) {
    form.action = `/files/${fileId}/delete`;
    modal.showModal();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.close();
  }
}

//helper for file upload form
function handleAutoUpload() {
  const fileInput = document.getElementById("hiddenFileInput");
  const nameInput = document.getElementById("hiddenFileNameInput");
  const form = document.getElementById("autoUploadForm");
  if (fileInput.files && fileInput.files.length > 0) {
    nameInput.value = fileInput.files[0].name;
    form.submit();
  }
}
