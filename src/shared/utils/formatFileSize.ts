export const formatFileSize = (bytes: number | undefined): string => {
  if (bytes && bytes >= 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  } else if (bytes) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else {
    return '';
  }
};
