import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { InventoryItem } from "./InventoryItem";
import { InventoryLocation } from "./InventoryLocation";

@Index("idx_inventory_stock_itemlocation", ["itemId", "locationId"], {})
@Index("inventory_stock_pkey", ["itemId", "locationId"], { unique: true })
@Entity("inventory_stock", { schema: "dump" })
export class InventoryStock {
  @Column("uuid", { primary: true, name: "itemId" })
  itemId: string;

  @Column("uuid", { primary: true, name: "locationId" })
  locationId: string;

  @Column("numeric", {
    name: "availableQuantity",
    nullable: true,
    default: () => "0",
  })
  availableQuantity: string | null;

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
    (inventoryItem) => inventoryItem.inventoryStocks,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "itemId", referencedColumnName: "id" }])
  item: InventoryItem;

  @ManyToOne(
    () => InventoryLocation,
    (inventoryLocation) => inventoryLocation.inventoryStocks,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "locationId", referencedColumnName: "id" }])
  location: InventoryLocation;
}
