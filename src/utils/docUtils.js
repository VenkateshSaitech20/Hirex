const DOC_SIZE = process.env.REACT_APP_DOC_SIZE;

export const validateDoc = (file, setDocValidationErr) => {
    
    setDocValidationErr();

    const allowedExtensions = ["doc", "docx", "pdf"];
    const fileExtension = file?.name.split(".").pop().toLowerCase();

    // Check if the file type
    if (!allowedExtensions.includes(fileExtension)) {
        setDocValidationErr("Invalid file type. Please select a DOC or PDF file.");
        return false;
    }

    // Check if the file size is within the allowed limit
    if (file.size > DOC_SIZE) {
        setDocValidationErr("File size exceeds the limit. Please select an file within 2MB.");
        return false;
    }

    return true;
};