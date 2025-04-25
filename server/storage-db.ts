import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";
import { IStorage } from "./storage";
import {
  countries,
  stores,
  categories,
  products,
  productPrices,
  newsletterSubscribers,
  languages,
  blogPosts,
  autoPilotConfig,
  autoPilotLogs,
  type Country,
  type InsertCountry,
  type Store,
  type InsertStore,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type ProductPrice,
  type InsertProductPrice,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  type Language,
  type InsertLanguage,
  type ProductWithPrices,
  type StoreWithCountry,
  type CountryWithStores,
  type BlogPost,
  type InsertBlogPost,
  type AutoPilotConfig,
  type InsertAutoPilotConfig,
  type AutoPilotLog,
  type InsertAutoPilotLog,
} from "@shared/schema";

export class DatabaseStorage implements IStorage {
  async getCountries(): Promise<Country[]> {
    return await db.select().from(countries);
  }
  
  async getCountry(id: number): Promise<Country | undefined> {
    const [country] = await db.select().from(countries).where(eq(countries.id, id));
    return country;
  }
  
  async getCountryByCode(code: string): Promise<Country | undefined> {
    const [country] = await db.select().from(countries).where(eq(countries.code, code));
    return country;
  }
  
  async createCountry(country: InsertCountry): Promise<Country> {
    const [newCountry] = await db.insert(countries).values(country).returning();
    return newCountry;
  }
  
  async getActiveCountries(): Promise<Country[]> {
    return await db
      .select()
      .from(countries)
      .where(eq(countries.active, true))
      .orderBy(countries.displayOrder);
  }
  
  async getComingSoonCountries(): Promise<Country[]> {
    return await db
      .select()
      .from(countries)
      .where(eq(countries.comingSoon, true))
      .orderBy(countries.displayOrder);
  }
  
  async getStores(): Promise<Store[]> {
    return await db.select().from(stores);
  }
  
  async getStore(id: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store;
  }
  
  async getStoresByCountry(countryId: number): Promise<Store[]> {
    return await db
      .select()
      .from(stores)
      .where(eq(stores.countryId, countryId))
      .orderBy(stores.displayOrder);
  }
  
  async createStore(store: InsertStore): Promise<Store> {
    const [newStore] = await db.insert(stores).values(store).returning();
    return newStore;
  }
  
  async getFeaturedStores(): Promise<StoreWithCountry[]> {
    const featuredStores = await db.select().from(stores).limit(8);
    
    return await Promise.all(
      featuredStores.map(async (store) => {
        const country = await this.getCountry(store.countryId);
        return {
          ...store,
          country: country!
        };
      })
    );
  }
  
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }
  
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
  
  async getTrendingProducts(limit: number = 4): Promise<ProductWithPrices[]> {
    const featuredProducts = await db
      .select()
      .from(products)
      .where(eq(products.featured, true))
      .limit(limit);
    
    return await Promise.all(
      featuredProducts.map(async (product) => {
        const productPricesWithStores = await this.compareProductPrices(product.id);
        const category = await this.getCategory(product.categoryId);
        
        return {
          ...product,
          prices: productPricesWithStores,
          category: category!
        };
      })
    );
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return await db
      .select()
      .from(products)
      .where(
        sql`LOWER(${products.name}) LIKE ${`%${lowerQuery}%`} OR LOWER(${products.description}) LIKE ${`%${lowerQuery}%`}`
      );
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }
  
  async getProductPrices(productId: number): Promise<ProductPrice[]> {
    return await db.select().from(productPrices).where(eq(productPrices.productId, productId));
  }
  
  async getProductPrice(productId: number, storeId: number): Promise<ProductPrice | undefined> {
    const [price] = await db
      .select()
      .from(productPrices)
      .where(
        and(
          eq(productPrices.productId, productId),
          eq(productPrices.storeId, storeId)
        )
      );
    return price;
  }
  
  async createProductPrice(productPrice: InsertProductPrice): Promise<ProductPrice> {
    const [newProductPrice] = await db.insert(productPrices).values(productPrice).returning();
    return newProductPrice;
  }
  
  async compareProductPrices(productId: number): Promise<(ProductPrice & { store: Store })[]> {
    const prices = await this.getProductPrices(productId);
    
    return await Promise.all(
      prices.map(async (price) => {
        const store = await this.getStore(price.storeId);
        return { ...price, store: store! };
      })
    );
  }
  
  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [newSubscriber] = await db
      .insert(newsletterSubscribers)
      .values(subscriber)
      .returning();
    return newSubscriber;
  }
  
  async getLanguages(): Promise<Language[]> {
    return await db.select().from(languages);
  }
  
  async getActiveLanguages(): Promise<Language[]> {
    return await db.select().from(languages).where(eq(languages.active, true));
  }
  
  async getLanguage(id: number): Promise<Language | undefined> {
    const [language] = await db.select().from(languages).where(eq(languages.id, id));
    return language;
  }
  
  async getLanguageByCode(code: string): Promise<Language | undefined> {
    const [language] = await db.select().from(languages).where(eq(languages.code, code));
    return language;
  }
  
  async createLanguage(language: InsertLanguage): Promise<Language> {
    const [newLanguage] = await db.insert(languages).values(language).returning();
    return newLanguage;
  }

  // Blog post methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(blogPost).returning();
    return newPost;
  }

  async getBlogPostsByCategory(categoryId: number): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.categoryId, categoryId), 
          eq(blogPosts.isPublished, true)
        )
      )
      .orderBy(desc(blogPosts.publishedDate));
  }

  async getRecentBlogPosts(limit: number = 5): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedDate))
      .limit(limit);
  }

  // Auto-pilot configuration methods
  async getAutoPilotConfigs(): Promise<AutoPilotConfig[]> {
    return await db.select().from(autoPilotConfig);
  }

  async getAutoPilotConfig(id: number): Promise<AutoPilotConfig | undefined> {
    const [config] = await db.select().from(autoPilotConfig).where(eq(autoPilotConfig.id, id));
    return config;
  }

  async getAutoPilotConfigByFeature(feature: string): Promise<AutoPilotConfig | undefined> {
    const [config] = await db.select().from(autoPilotConfig).where(eq(autoPilotConfig.feature, feature));
    return config;
  }

  async createAutoPilotConfig(config: InsertAutoPilotConfig): Promise<AutoPilotConfig> {
    const [newConfig] = await db.insert(autoPilotConfig).values(config).returning();
    return newConfig;
  }

  async updateAutoPilotConfig(id: number, updates: Partial<AutoPilotConfig>): Promise<AutoPilotConfig> {
    const [updatedConfig] = await db
      .update(autoPilotConfig)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(autoPilotConfig.id, id))
      .returning();
    
    if (!updatedConfig) {
      throw new Error(`Auto-pilot config with ID ${id} not found`);
    }
    
    return updatedConfig;
  }

  async getEnabledAutoPilotConfigs(): Promise<AutoPilotConfig[]> {
    return await db
      .select()
      .from(autoPilotConfig)
      .where(eq(autoPilotConfig.isEnabled, true));
  }

  // Auto-pilot logs methods
  async getAutoPilotLogs(): Promise<AutoPilotLog[]> {
    return await db
      .select()
      .from(autoPilotLogs)
      .orderBy(desc(autoPilotLogs.startTime));
  }

  async getAutoPilotLog(id: number): Promise<AutoPilotLog | undefined> {
    const [log] = await db.select().from(autoPilotLogs).where(eq(autoPilotLogs.id, id));
    return log;
  }

  async createAutoPilotLog(log: InsertAutoPilotLog): Promise<AutoPilotLog> {
    const [newLog] = await db.insert(autoPilotLogs).values(log).returning();
    return newLog;
  }

  async updateAutoPilotLog(id: number, updates: Partial<AutoPilotLog>): Promise<AutoPilotLog> {
    const [updatedLog] = await db
      .update(autoPilotLogs)
      .set(updates)
      .where(eq(autoPilotLogs.id, id))
      .returning();
    
    if (!updatedLog) {
      throw new Error(`Auto-pilot log with ID ${id} not found`);
    }
    
    return updatedLog;
  }

  async getAutoPilotLogsByFeature(featureId: number): Promise<AutoPilotLog[]> {
    return await db
      .select()
      .from(autoPilotLogs)
      .where(eq(autoPilotLogs.featureId, featureId))
      .orderBy(desc(autoPilotLogs.startTime));
  }
}