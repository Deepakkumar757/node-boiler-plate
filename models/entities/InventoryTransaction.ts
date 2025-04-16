import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { InventoryItem } from "./InventoryItem";
import { InventoryLocation } from "./InventoryLocation";

@Index("inventory_transaction_pkey", ["id"], { unique: true })
@Index("idx_inventory_transaction_id", ["id"], {})
@Index("idx_inventory_transaction_isdeleted", ["isDeleted"], {})
@Index("idx_inventory_transaction_item", ["itemId"], {})
@Index("idx_inventory_transaction_location", ["locationId"], {})
@Entity("inventory_transaction", { schema: "dump" })
export class InventoryTransaction {
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

  @Column("character varying", { name: "type", length: 10 })
  type: string;

  @Column("numeric", { name: "quantity" })
  quantity: string;

  @Column("character varying", { name: "source", nullable: true, length: 100 })
  source: string | null;

  @Column("character varying", {
    name: "reference",
    nullable: true,
    length: 100,
  })
  reference: string | null;

  @Column("text", { name: "remarks", nullable: true })
  remarks: string | null;

  @Column("uuid", { name: "createdBy", nullable: true })
  createdBy: string | null;

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
    (inventoryItem) => inventoryItem.inventoryTransactions,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "itemId", referencedColumnName: "id" }])
  item: InventoryItem;

  @ManyToOne(
    () => InventoryLocation,
    (inventoryLocation) => inventoryLocation.inventoryTransactions,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "locationId", referencedColumnName: "id" }])
  location: InventoryLocation;
}
