ALTER TABLE "order_items" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;