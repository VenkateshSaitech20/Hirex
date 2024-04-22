const IMAGE_SIZE = process.env.REACT_APP_IMAGE_SIZE;

export const validateImage = (image, setImageValidationErr) => {
    
    setImageValidationErr();

    const allowedExtensions = ["jpg", "jpeg", "png"];
    const fileExtension = image?.name.split(".").pop().toLowerCase();

    // Check if the file type
    if (!allowedExtensions.includes(fileExtension)) {
        setImageValidationErr("Invalid file type. Please select a JPG or PNG image.");
        return false;
    }

    // Check if the file size is within the allowed limit
    if (image.size > IMAGE_SIZE) {
        setImageValidationErr("File size exceeds the limit. Please select an image within 2MB.");
        return false;
    }

    return true;
};