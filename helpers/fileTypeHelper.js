export const mimeTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx':
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx':
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg'
}

export const getFileTypeFromUrl = (url) => {
  const decodedUrl = decodeURIComponent(url)
  // Extract the file extension from the URL
  const extension = decodedUrl
    .slice(Math.max(0, decodedUrl.lastIndexOf('.')) + 1, decodedUrl.length - 1)
    .toLowerCase()

  // Map the extension to a MIME type
  const mimeType = extension || 'application/octet-stream'
  return mimeType
}
