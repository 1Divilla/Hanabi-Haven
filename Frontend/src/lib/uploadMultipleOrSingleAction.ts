import { $ } from "@builder.io/qwik";

export interface UploadResult {
  uploadError: string | null;
  uploadSuccess?: string | null;
  data: any[] | null;
}

interface FileQueueItem {
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  result?: any;
  error?: string;
  hash?: string; 
}

export const uploadMultipleOrSingleAction = $(async (formData: FormData, fileName?: string): Promise<UploadResult> => {
  try {
    const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_HOST || "";
    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
    
    if (!token) {
      return {
        uploadError: "No estás autenticado",
        uploadSuccess: null,
        data: null,
      };
    }

    let fileQueue: FileQueueItem[] = [];
    const fileNameMap = new Map<string, boolean>();
    
    if (fileName && formData.has('files')) {
      const files = formData.getAll('files');
      formData.delete('files');
      
      files.forEach((file: any, index) => {
        if (!(file instanceof File)) {
          console.warn("El elemento no es un archivo válido:", file);
          return;
        }
        
        const fileExtension = file.name.split('.').pop() || '';
        const newFileName = files.length > 1 
          ? `${fileName}_${index + 1}.${fileExtension}`
          : `${fileName}.${fileExtension}`;
        
        if (fileNameMap.has(newFileName)) {
          console.warn(`Archivo duplicado detectado: ${newFileName}. Omitiendo...`);
          return;
        }
        
        // Marcar este nombre de archivo como procesado
        fileNameMap.set(newFileName, true);

        try {
          const renamedFile = new File(
            [file], 
            newFileName,
            { type: file.type }
          );
          
          const fileHash = `${newFileName}_${file.size}`;
          
          fileQueue.push({
            file: renamedFile,
            status: 'pending',
            retryCount: 0,
            hash: fileHash
          });
        } catch (error) {
          // Error al renombrar el archivo
        }
      });
    } else {
      const filesFromForm = formData.getAll('files');
      const validFiles = filesFromForm.filter(file => file instanceof File) as File[];
      
      const uniqueFiles: File[] = [];
      validFiles.forEach(file => {
        if (!fileNameMap.has(file.name)) {
          fileNameMap.set(file.name, true);
          uniqueFiles.push(file);
        }
      });
      
      fileQueue = uniqueFiles.map(file => ({
        file,
        status: 'pending',
        retryCount: 0,
        hash: `${file.name}_${file.size}`
      }));
    }
    
    if (fileQueue.length === 0) {
      return {
        uploadError: "No se encontraron archivos válidos para subir",
        uploadSuccess: null,
        data: null,
      };
    }
    
    try {
      const mediaResponse = await fetch(`${STRAPI_URL}/api/upload/files?sort=createdAt:DESC&pagination[pageSize]=100`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (mediaResponse.ok) {
        const mediaFiles = await mediaResponse.json();
        
        const existingFileNames = new Set(mediaFiles.map((media: any) => media.name));
        
        fileQueue.forEach(item => {
          const itemName = item.file.name;
          if (existingFileNames.has(itemName)) {
            item.status = 'completed';
            const existingFile = mediaFiles.find((media: any) => media.name === itemName);
            if (existingFile) {
              item.result = existingFile;
            }
          }
        });
      }
    } catch (error) {
      // Continuamos con la subida normal si no podemos verificar
    }
    
    const MAX_RETRIES = 2;
    const DELAY_BETWEEN_FILES = 3000;
    let allResults: any[] = [];
    const resultIdMap = new Map<number, boolean>();
    
    const pendingFiles = fileQueue.filter(item => item.status === 'pending');
    
    fileQueue.filter(item => item.status === 'completed' && item.result)
      .forEach(item => {
        if (item.result) {
          if (Array.isArray(item.result)) {
            item.result.forEach(res => {
              if (res && res.id && !resultIdMap.has(res.id)) {
                resultIdMap.set(res.id, true);
                allResults.push(res);
              }
            });
          } else if (item.result.id && !resultIdMap.has(item.result.id)) {
            resultIdMap.set(item.result.id, true);
            allResults.push(item.result);
          }
        }
      });
    
    for (let i = 0; i < pendingFiles.length; i++) {
      const queueItem = pendingFiles[i];
      queueItem.status = 'processing';
      
      const singleFileFormData = new FormData();
      singleFileFormData.append('files', queueItem.file);
      
      console.log(`Procesando archivo ${i+1}/${pendingFiles.length}: ${queueItem.file.name}`);
      
      // Esperar antes de procesar el siguiente archivo (excepto el primero)
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_FILES));
      }
      
      let uploadSuccess = false;
      
      while (queueItem.retryCount <= MAX_RETRIES && queueItem.status !== 'completed') {
        try {
          if (queueItem.retryCount > 0) {
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_FILES));
          }
          
          const response = await fetch(`${STRAPI_URL}/api/upload`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: singleFileFormData,
          });

          let result;
          try {
            result = await response.json();
            if (result && (Array.isArray(result) || result.id)) {
              uploadSuccess = true;
            }
          } catch (jsonError) {
            try {
              const checkResponse = await fetch(`${STRAPI_URL}/api/upload/files?filters[name][$eq]=${encodeURIComponent(queueItem.file.name)}`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              
              if (checkResponse.ok) {
                const checkResult = await checkResponse.json();
                if (checkResult && checkResult.length > 0) {
                  result = checkResult;
                  uploadSuccess = true;
                }
              }
            } catch (checkError) {
              // Error al verificar si el archivo se subió
            }
            
            if (!uploadSuccess) {
              throw new Error(`Error al procesar respuesta del archivo ${i+1}`);
            }
          }

          if (!uploadSuccess && (!response.ok || result.error)) {
            try {
              const checkResponse = await fetch(`${STRAPI_URL}/api/upload/files?filters[name][$eq]=${encodeURIComponent(queueItem.file.name)}`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              
              if (checkResponse.ok) {
                const checkResult = await checkResponse.json();
                if (checkResult && checkResult.length > 0) {
                  result = checkResult;
                  uploadSuccess = true;
                }
              }
            } catch (checkError) {
              // Error al verificar si el archivo se subió
            }
            
            if (!uploadSuccess) {
              throw new Error(result.error?.message || `Error ${response.status} en archivo ${i+1}`);
            }
          }
          
          queueItem.status = 'completed';
          queueItem.result = result;
          
          if (Array.isArray(result)) {
            result.forEach(item => {
              if (item && item.id && !resultIdMap.has(item.id)) {
                resultIdMap.set(item.id, true);
                allResults.push(item);
              }
            });
          } else if (result && result.id && !resultIdMap.has(result.id)) {
            resultIdMap.set(result.id, true);
            allResults.push(result);
          }
          
        } catch (error: any) {
          console.error(`Error al procesar el archivo ${i+1} (intento ${queueItem.retryCount + 1}/${MAX_RETRIES + 1}):`, error);
          queueItem.retryCount++;
          
          if (queueItem.retryCount > MAX_RETRIES) {
            try {
              const checkResponse = await fetch(`${STRAPI_URL}/api/upload/files?filters[name][$eq]=${encodeURIComponent(queueItem.file.name)}`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              
              if (checkResponse.ok) {
                const checkResult = await checkResponse.json();
                if (checkResult && checkResult.length > 0) {
                  queueItem.status = 'completed';
                  queueItem.result = checkResult;
                  
                  checkResult.forEach((item: any) => {
                    if (item && item.id && !resultIdMap.has(item.id)) {
                      resultIdMap.set(item.id, true);
                      allResults.push(item);
                    }
                  });
                  continue;
                }
              }
            } catch (checkError) {
              // Error al verificar si el archivo se subió
            }
            
            queueItem.status = 'failed';
            queueItem.error = error.message || `Error desconocido en archivo ${i+1}`;
            console.warn(`Agotados los reintentos para el archivo ${i+1}, continuando con el siguiente...`);
          }
        }
      }
    }

    const completedItems = fileQueue.filter(item => item.status === 'completed');
    const failedItems = fileQueue.filter(item => item.status === 'failed');
    
    if (completedItems.length === 0) {
      const errorMessages = failedItems.map(item => item.error).filter(Boolean);
      return {
        uploadError: errorMessages.length > 0 
          ? `Errores: ${errorMessages.join(', ')}` 
          : "No se pudo completar la subida de archivos",
        uploadSuccess: null,
        data: null,
      };
    }

    if (failedItems.length > 0) {
      const errorMessages = failedItems.map(item => item.error).filter(Boolean);
      
      return {
        uploadError: `Se subieron ${completedItems.length} de ${fileQueue.length} archivos. Errores: ${errorMessages.join(', ')}`,
        uploadSuccess: `Se subieron ${completedItems.length} archivos correctamente`,
        data: allResults,
      };
    }

    return {
      uploadError: null,
      uploadSuccess: `Se subieron ${completedItems.length} archivos correctamente`,
      data: allResults,
    };
  } catch (error: any) {
    console.error("Error inesperado en uploadMultipleOrSingleAction:", error);
    return {
      uploadError: error.message || "Error desconocido",
      uploadSuccess: null,
      data: null,
    };
  }
});