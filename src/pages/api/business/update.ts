import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import * as s from "db/schema";
import { uploadToR2 } from "../../../utils/r2";

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return new Response("Unauthorized", { status: 401 });

  try {
    const formData = await request.formData();
    const { env } = locals.runtime;
    const db = drizzle(env.DB, { schema: s });

    const dbUser = await db.query.users.findFirst({
      where: eq(s.users.id, parseInt(user.id, 10)),
    });

    if (!dbUser?.businessId) return new Response("Not Found", { status: 404 });
    const bId = dbUser.businessId;

    // 1. Handle Profile Image Upload
    let profileImageUrl = formData.get("image") as string;
    const newProfileFile = formData.get("imageFile") as File;

    if (newProfileFile && newProfileFile.size > 0) {
      profileImageUrl = await uploadToR2(newProfileFile, 'profiles', env.MY_BUCKET);
    }

    // 2. Handle Shop Gallery Images
    const existingShopImages = formData.getAll("shopImages") as string[];
    const newGalleryFiles = formData.getAll("newGalleryFiles") as File[];
    
    const uploadedGalleryUrls: string[] = [];
    for (const file of newGalleryFiles) {
      if (file.size > 0) {
        const url = await uploadToR2(file, 'shops', env.MY_BUCKET);
        uploadedGalleryUrls.push(url);
      }
    }

    const finalShopImages = [...existingShopImages, ...uploadedGalleryUrls].join(",");

    // 3. Update Database
    const businessUpdate = {
      image: profileImageUrl,
      name: (formData.get("name") as string)?.slice(0, 25),
      shopName: (formData.get("shopName") as string)?.slice(0, 43),
      address: (formData.get("address") as string)?.slice(0, 130),
      location: formData.get("location") as string,
      shopImages: finalShopImages,
    };

    // Contacts logic (Phone/WhatsApp)
    const contactTypes = ["phone", "whatsapp", "email", "facebook", "instagram"] as const;
    const newContacts = contactTypes
      .filter(type => formData.get(type))
      .map(type => ({
        businessId: bId,
        type,
        value: formData.get(type) as string,
      }));

    await db.batch([
      db.update(s.businesses).set(businessUpdate).where(eq(s.businesses.id, bId)),
      db.delete(s.contacts).where(eq(s.contacts.businessId, bId)),
      ...(newContacts.length > 0 ? [db.insert(s.contacts).values(newContacts)] : []),
    ]);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response("Update Failed", { status: 500 });
  }
};