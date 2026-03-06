// src/utils/r2.ts
export async function uploadToR2(file: File, folder: string, bucket: any) {
  // Create a clean filename for Udaipur assets
  const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const arrayBuffer = await file.arrayBuffer();
  
  // Upload to R2
  await bucket.put(fileName, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  });

  // Return the proxy URL that works with your workers.dev domain
  return `/api/image/${fileName}`;
}