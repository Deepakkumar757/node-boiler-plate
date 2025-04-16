import { Column, Entity, Index, OneToMany } from "typeorm";
import { InventoryAuditLog } from "./InventoryAuditLog";
import { InventoryStock } from "./InventoryStock";
import { InventoryTransaction } from "./InventoryTransaction";
import { ProductShortIdPool } from "./ProductShortIdPool";

@Index("idx_inventory_item_id", ["id"], {})
@Index("inventory_item_pkey", ["id"], { unique: true })
@Index("idx_inventory_item_isdeleted", ["isDeleted"], {})
@Index("idx_inventory_item_shortid", ["shortId"], {})
@Index("inventory_item_shortid_unique", ["shortId"], { unique: true })
@Index("inventory_item_sku_unique", ["sku"], { unique: true })
@Entity("inventory_item", { schema: "dump" })
export class InventoryItem {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("character varying", { name: "sku", length: 50 })
  sku: string;

  @Column("character varying", { name: "shortId", nullable: true, length: 50 })
  shortId: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("character varying", { name: "unit", length: 20 })
  unit: string;

  @Column("character varying", {
    name: "secondaryUnit",
    nullable: true,
    length: 20,
  })
  secondaryUnit: string | null;

  @Column("numeric", { name: "conversionRate", nullable: true })
  conversionRate: string | null;

  @Column("character varying", { name: "category", nullable: true, length: 50 })
  category: string | null;

  @Column("character varying", {
    name: "subCategory",
    nullable: true,
    length: 50,
  })
  subCategory: string | null;

  @Column("numeric", {
    name: "minStockThreshold",
    nullable: true,
    default: () => "0",
  })
  minStockThreshold: string | null;

  @Column("numeric", {
    name: "maxStockLimit",
    nullable: true,
    default: () => "100000",
  })
  maxStockLimit: string | null;

  @Column("boolean", { name: "isDeleted", default: () => "false" })
  isDeleted: boolean;

  @Column("timestamp without time zone", {
    name: "createdAt",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", {
    name: "updatedAt",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @OneToMany(
    () => InventoryAuditLog,
    (inventoryAuditLog) => inventoryAuditLog.item
  )
  inventoryAuditLogs: InventoryAuditLog[];

  @OneToMany(() => InventoryStock, (inventoryStock) => inventoryStock.item)
  inventoryStocks: InventoryStock[];

  @OneToMany(
    () => InventoryTransaction,
    (inventoryTransaction) => inventoryTransaction.item
  )
  inventoryTransactions: InventoryTransaction[];

  @OneToMany(
    () => ProductShortIdPool,
    (productShortIdPool) => productShortIdPool.assignedTo
  )
  productShortIdPools: ProductShortIdPool[];
}
