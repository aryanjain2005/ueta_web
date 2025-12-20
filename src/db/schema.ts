import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image").notNull(),
  slug: text("slug").notNull().unique(),
});

export const brands = sqliteTable("brands", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image").notNull(),
  slug: text("slug").notNull().unique(),
});

export const businesses = sqliteTable("businesses", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  type: text("type", {
    enum: ["dealer", "distributor"],
  }).notNull(),
  name: text("name").notNull(),
  shopName: text("shop_name").notNull(),
  location: text("location"),
  address: text("address"),
  slug: text("slug").notNull().unique(),
  image: text("image"),
  shopImages: text("shop_images"),
});

// Contacts Table
export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({
    autoIncrement: true,
  }),
  businessId: integer("business_id")
    .notNull()
    .references(() => businesses.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  type: text("type", {
    enum: ["phone", "email", "whatsapp", "facebook", "instagram"],
  }).notNull(), // "phone" | "email" | "whatsapp" | "facebook" | "instagram"
  value: text("value").notNull(),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  // ✅ new fields
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  img: text("img"), // can be null
  role: text("role").default("user"), // "user" | "dealer" | "distributor"
  type: text("type").default("standard"), // "standard" | "admin"

  createdAt: integer("created_at", { mode: "timestamp" }).default(
    new Date()
  ),
});

export const productBrand = sqliteTable(
  "product_brand",
  {
    id: integer("id").primaryKey({
      autoIncrement: true,
    }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    brandId: integer("brand_id")
      .notNull()
      .references(() => brands.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    productBrandUnique: uniqueIndex("product_brand_unique").on(
      table.productId,
      table.brandId
    ),
  })
);

export const businessBrandProduct = sqliteTable(
  "business_brand_product",
  {
    id: integer("id").primaryKey({
      autoIncrement: true,
    }),
    businessId: integer("business_id")
      .notNull()
      .references(() => businesses.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    brandId: integer("brand_id")
      .notNull()
      .references(() => brands.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    businessProductUnique: uniqueIndex("business_brand_product_unique").on(
      table.businessId,
      table.productId,
      table.brandId
    ),
  })
);

export const productsRelations = relations(products, ({ many }) => ({
  productBrands: many(productBrand),
  businessBrandProducts: many(businessBrandProduct),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  productBrands: many(productBrand),
  businessBrandProducts: many(businessBrandProduct),
}));

export const businessesRelations = relations(businesses, ({ many }) => ({
  contacts: many(contacts),
  businessBrandProducts: many(businessBrandProduct),
}));

export const contactsRelations = relations(contacts, ({ one }) => ({
  business: one(businesses, {
    fields: [contacts.businessId],
    references: [businesses.id],
  }),
}));

export const productBrandRelations = relations(productBrand, ({ one }) => ({
  product: one(products, {
    fields: [productBrand.productId],
    references: [products.id],
  }),
  brand: one(brands, {
    fields: [productBrand.brandId],
    references: [brands.id],
  }),
}));

export const businessBrandProductRelations = relations(
  businessBrandProduct,
  ({ one }) => ({
    business: one(businesses, {
      fields: [businessBrandProduct.businessId],
      references: [businesses.id],
    }),
    product: one(products, {
      fields: [businessBrandProduct.productId],
      references: [products.id],
    }),
    brand: one(brands, {
      fields: [businessBrandProduct.brandId],
      references: [brands.id],
    }),
  })
);
