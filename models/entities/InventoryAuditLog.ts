import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { InventoryItem } from "./InventoryItem";
import { InventoryLocation } from "./InventoryLocation";

@Index("idx_inventory_audit_log_id", ["id"], {})
@Index("inventory_audit_log_pkey", ["id"], { unique: true })
@Index("idx_inventory_audit_log_isdeleted", ["isDeleted"], {})
@Index("idx_inventory_audit_log_item", ["itemId"], {})
@Index("idx_inventory_audit_log_location", ["locationId"], {})
@Entity("inventory_audit_log", { schema: "dump" })
export class InventoryAuditLog {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("uuid", { name: "itemId" })
  itemId: string;

  @Column("uuid", { name: "locationId" })
  locationId: string;

  @Column("text", { name: "reason" })
  reason: string;

  @Column("numeric", { name: "beforeQuantity", nullable: true })
  beforeQuantity: string | null;

  @Column("numeric", { name: "afterQuantity", nullable: true })
  afterQuantity: string | null;

  @Column("uuid", { name: "changedBy", nullable: true })
  changedBy: string | null;

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

  @ManyToOne(
    () => InventoryItem,
    (inventoryItem) => inventoryItem.inventoryAuditLogs,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "itemId", referencedColumnName: "id" }])
  item: InventoryItem;

  @ManyToOne(
    () => InventoryLocation,
    (inventoryLocation) => inventoryLocation.inventoryAuditLogs,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "locationId", referencedColumnName: "id" }])
  location: InventoryLocation;
}
