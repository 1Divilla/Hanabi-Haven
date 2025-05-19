import { $ } from "@builder.io/qwik";

export const uploadMultipleOrSingleAction = $(async (formData: FormData, fileName?: string) => {
  try {
    const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_HOST || "";
    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
    
    if (!token) {
      return {
        uploadError: "No estás autenticado",
        uploadSuccess: null,
      };
    }

    // Si se proporciona un nombre de archivo, renombrar el archivo antes de subirlo
    if (fileName && formData.has('files')) {
      const originalFile = formData.get('files') as File;
      if (originalFile) {
        const fileExtension = originalFile.name.split('.').pop();
        const renamedFile = new File(
          [originalFile], 
          `${fileName}.${fileExtension}`, 
          { type: originalFile.type }
        );
        
        // Reemplazar el archivo original con el renombrado
        formData.delete('files');
        formData.append('files', renamedFile);
      }
    }

    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      return {
        uploadError: result.error?.message || `Error ${response.status}`,
        uploadSuccess: null,
        data: null,
      };
    }

    return {
      uploadError: null,
      data: result,
    };
  } catch (error: any) {
    return {
      uploadError: error.message,
      uploadSuccess: null,
      data: null,
    };
  }
});