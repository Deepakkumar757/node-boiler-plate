import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { InventoryItem } from "./InventoryItem";

@Index("product_short_id_pool_pkey", ["id"], { unique: true })
@Index("idx_product_short_id_pool_id", ["id"], {})
@Index("idx_product_short_id_pool_isdeleted", ["isDeleted"], {})
@Index("product_short_id_pool_shortid_unique", ["shortId"], { unique: true })
@Index("idx_product_short_id_pool_shortid", ["shortId"], {})
@Entity("product_short_id_pool", { schema: "dump" })
export class ProductShortIdPool {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", { name: "shortId", length: 50 })
  shortId: string;

  @Column("boolean", {
    name: "isAssigned",
    nullable: true,
    default: () => "false",
  })
  isAssigned: boolean | null;

  @Column("timestamp without time zone", { name: "assignedAt", nullable: true })
  assignedAt: Date | null;

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
    (inventoryItem) => inventoryItem.productShortIdPools,
    { onDelete: "SET NULL" }
  )
  @JoinColumn([{ name: "assignedTo", referencedColumnName: "id" }])
  assignedTo: InventoryItem;
}
