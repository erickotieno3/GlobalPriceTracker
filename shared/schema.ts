import { pgTable, text, serial, integer, boolean, varchar, timestamp, jsonb, real, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Countries schema
export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: varchar("code", { length: 2 }).notNull().unique(),
  flagUrl: text("flag_url").notNull(),
  continent: text("continent").notNull(),
  active: boolean("active").default(true).notNull(),
  comingSoon: boolean("coming_soon").default(false).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
});

export const insertCountrySchema = createInsertSchema(countries).omit({
  id: true,
});

// Stores schema
export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  websiteUrl: text("website_url"),
  countryId: integer("country_id").notNull(),
  active: boolean("active").default(true).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
});

export const insertStoreSchema = createInsertSchema(stores).omit({
  id: true,
});

// Categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  parentId: integer("parent_id"),
  displayOrder: integer("display_order").default(0).notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

// Products schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id").notNull(),
  barcode: text("barcode"),
  brand: text("brand"),
  active: boolean("active").default(true).notNull(),
  featured: boolean("featured").default(false).notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

// Product Prices schema
export const productPrices = pgTable("product_prices", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  storeId: integer("store_id").notNull(),
  price: real("price").notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  originalPrice: real("original_price"),
  discountPercentage: real("discount_percentage"),
  inStock: boolean("in_stock").default(true).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const productPricesPK = primaryKey(
  productPrices.productId,
  productPrices.storeId
);

export const insertProductPriceSchema = createInsertSchema(productPrices).omit({
  id: true,
  lastUpdated: true,
});

// Newsletter subscribers schema
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  subscribed: boolean("subscribed").default(true).notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  countryCode: varchar("country_code", { length: 2 }),
  language: varchar("language", { length: 5 }),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).pick({
  email: true,
  countryCode: true,
  language: true,
});

// Languages schema
export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 5 }).notNull().unique(),
  name: text("name").notNull(),
  nativeName: text("native_name").notNull(),
  active: boolean("active").default(true).notNull(),
});

export const insertLanguageSchema = createInsertSchema(languages).omit({
  id: true,
});

// Define types
export type Country = typeof countries.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;

export type Store = typeof stores.$inferSelect;
export type InsertStore = z.infer<typeof insertStoreSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type ProductPrice = typeof productPrices.$inferSelect;
export type InsertProductPrice = z.infer<typeof insertProductPriceSchema>;

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;

export type Language = typeof languages.$inferSelect;
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;

// Extended types for frontend use
export type ProductWithPrices = Product & {
  prices: (ProductPrice & { store: Store })[];
  category: Category;
};

export type StoreWithCountry = Store & {
  country: Country;
};

export type CountryWithStores = Country & {
  stores: Store[];
};
