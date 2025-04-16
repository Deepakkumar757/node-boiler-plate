import { MigrationInterface, QueryRunner } from 'typeorm';

export class Inventory1744286496961 implements MigrationInterface {
  private schema = process.env.DB_SCHEMA || 'public';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Storage Room table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS ${this.schema}.storage_room (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT storage_room_name_unique UNIQUE (name)
      );

      CREATE INDEX IF NOT EXISTS idx_storage_room_id ON ${this.schema}.storage_room(id);
      CREATE INDEX IF NOT EXISTS idx_storage_room_isdeleted ON ${this.schema}.storage_room("isDeleted");
    `);

    // Storage Room Layout table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS ${this.schema}.storage_room_layout (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "storageRoomId" UUID NOT NULL,
        "zoneStart" VARCHAR(10) NOT NULL,
        "zoneEnd" VARCHAR(10) NOT NULL,
        "aisleStart" INTEGER NOT NULL,
        "aisleEnd" INTEGER NOT NULL,
        "rackStart" INTEGER NOT NULL,
        "rackEnd" INTEGER NOT NULL,
        "binStart" INTEGER NOT NULL,
        "binEnd" INTEGER NOT NULL,
        "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_storage_room_layout_storage_room 
          FOREIGN KEY ("storageRoomId") REFERENCES ${this.schema}.storage_room(id) ON DELETE CASCADE,
        CONSTRAINT storage_room_layout_unique UNIQUE ("storageRoomId")
      );

      CREATE INDEX IF NOT EXISTS idx_storage_room_layout_id ON ${this.schema}.storage_room_layout(id);
      CREATE INDEX IF NOT EXISTS idx_storage_room_layout_storageroom ON ${this.schema}.storage_room_layout("storageRoomId");
      CREATE INDEX IF NOT EXISTS idx_storage_room_layout_isdeleted ON ${this.schema}.storage_room_layout("isDeleted");
    `);

    // Inventory Location table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS ${this.schema}.inventory_location (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "storageRoomId" UUID NOT NULL,
        name VARCHAR(100) NOT NULL,
        "isVirtual" BOOLEAN DEFAULT FALSE,
        zone VARCHAR(10),
        aisle VARCHAR(10),
        rack VARCHAR(10),
        bin VARCHAR(10),
        description TEXT,
        "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_inventory_location_storage_room 
          FOREIGN KEY ("storageRoomId") REFERENCES ${this.schema}.storage_room(id) ON DELETE CASCADE,
        CONSTRAINT inventory_location_unique UNIQUE ("storageRoomId", zone, aisle, rack, bin)
      );

      CREATE INDEX IF NOT EXISTS idx_inventory_location_id ON ${this.schema}.inventory_location(id);
      CREATE INDEX IF NOT EXISTS idx_inventory_location_storageroom ON ${this.schema}.inventory_location("storageRoomId");
      CREATE INDEX IF NOT EXISTS idx_inventory_location_zone ON ${this.schema}.inventory_location(zone);
      CREATE INDEX IF NOT EXISTS idx_inventory_location_rackbin ON ${this.schema}.inventory_location(rack, bin);
      CREATE INDEX IF NOT EXISTS idx_inventory_location_isdeleted ON ${this.schema}.inventory_location("isDeleted");
    `);

    // Inventory Item table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS ${this.schema}.inventory_item (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        sku VARCHAR(50) NOT NULL,
        "shortId" VARCHAR(50),
        description TEXT,
        unit VARCHAR(20) NOT NULL,
        "secondaryUnit" VARCHAR(20),
        "conversionRate" NUMERIC,
        category VARCHAR(50),
        "subCategory" VARCHAR(50),
        "minStockThreshold" NUMERIC DEFAULT 0,
        "maxStockLimit" NUMERIC DEFAULT 100000,
        "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT inventory_item_sku_unique UNIQUE (sku),
        CONSTRAINT inventory_item_shortid_unique UNIQUE ("shortId")
      );

      CREATE INDEX IF NOT EXISTS idx_inventory_item_id ON ${this.schema}.inventory_item(id);
      CREATE INDEX IF NOT EXISTS idx_inventory_item_shortid ON ${this.schema}.inventory_item("shortId");
      CREATE INDEX IF NOT EXISTS idx_inventory_item_isdeleted ON ${this.schema}.inventory_item("isDeleted");
    `);

    // Inventory Transaction table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS ${this.schema}.inventory_transaction (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "itemId" UUID NOT NULL,
        "locationId" UUID NOT NULL,
        type VARCHAR(10) NOT NULL,
        quantity NUMERIC NOT NULL,
        source VARCHAR(100),
        reference VARCHAR(100),
        remarks TEXT,
        "createdBy" UUID,
        "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_inventory_transaction_item 
          FOREIGN KEY ("itemId") REFERENCES ${this.schema}.inventory_item(id) ON DELETE CASCADE,
        CONSTRAINT fk_inventory_transaction_location 
          FOREIGN KEY ("locationId") REFERENCES ${this.schema}.inventory_location(id) ON DELETE CASCADE,
        CONSTRAINT inventory_transaction_type_check CHECK (type IN ('IN', 'OUT', 'ADJUST'))
      );

      CREATE INDEX IF NOT EXISTS idx_inventory_transaction_id ON ${this.schema}.inventory_transaction(id);
      CREATE INDEX IF NOT EXISTS idx_inventory_transaction_item ON ${this.schema}.inventory_transaction("itemId");
      CREATE INDEX IF NOT EXISTS idx_inventory_transaction_location ON ${this.schema}.inventory_transaction("locationId");
      CREATE INDEX IF NOT EXISTS idx_inventory_transaction_isdeleted ON ${this.schema}.inventory_transaction("isDeleted");
    `);

    // Inventory Stock table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS ${this.schema}.inventory_stock (
        "itemId" UUID NOT NULL,
        "locationId" UUID NOT NULL,
        "availableQuantity" NUMERIC DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("itemId", "locationId"),
        CONSTRAINT fk_inventory_stock_item 
          FOREIGN KEY ("itemId") REFERENCES ${this.schema}.inventory_item(id) ON DELETE CASCADE,
        CONSTRAINT fk_inventory_stock_location 
          FOREIGN KEY ("locationId") REFERENCES ${this.schema}.inventory_location(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_inventory_stock_itemlocation ON ${this.schema}.inventory_stock("itemId", "locationId");
    `);

    // Inventory Audit Log table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS ${this.schema}.inventory_audit_log (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "itemId" UUID NOT NULL,
        "locationId" UUID NOT NULL,
        reason TEXT NOT NULL,
        "beforeQuantity" NUMERIC,
        "afterQuantity" NUMERIC,
        "changedBy" UUID,
        "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_inventory_audit_log_item 
          FOREIGN KEY ("itemId") REFERENCES ${this.schema}.inventory_item(id) ON DELETE CASCADE,
        CONSTRAINT fk_inventory_audit_log_location 
          FOREIGN KEY ("locationId") REFERENCES ${this.schema}.inventory_location(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_inventory_audit_log_id ON ${this.schema}.inventory_audit_log(id);
      CREATE INDEX IF NOT EXISTS idx_inventory_audit_log_item ON ${this.schema}.inventory_audit_log("itemId");
      CREATE INDEX IF NOT EXISTS idx_inventory_audit_log_location ON ${this.schema}.inventory_audit_log("locationId");
      CREATE INDEX IF NOT EXISTS idx_inventory_audit_log_isdeleted ON ${this.schema}.inventory_audit_log("isDeleted");
    `);

    // Product Short ID Pool table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS ${this.schema}.product_short_id_pool (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "shortId" VARCHAR(50) NOT NULL,
        "isAssigned" BOOLEAN DEFAULT FALSE,
        "assignedTo" UUID,
        "assignedAt" TIMESTAMP,
        "isDeleted" BOOLEAN DEFAULT FALSE NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_product_short_id_pool_item 
          FOREIGN KEY ("assignedTo") REFERENCES ${this.schema}.inventory_item(id) ON DELETE SET NULL,
        CONSTRAINT product_short_id_pool_shortid_unique UNIQUE ("shortId")
      );

      CREATE INDEX IF NOT EXISTS idx_product_short_id_pool_id ON ${this.schema}.product_short_id_pool(id);
      CREATE INDEX IF NOT EXISTS idx_product_short_id_pool_shortid ON ${this.schema}.product_short_id_pool("shortId");
      CREATE INDEX IF NOT EXISTS idx_product_short_id_pool_isdeleted ON ${this.schema}.product_short_id_pool("isDeleted");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.product_short_id_pool CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.inventory_audit_log CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.inventory_stock CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.inventory_transaction CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.inventory_item CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.inventory_location CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.storage_room_layout CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.schema}.storage_room CASCADE;`);
  }
}
