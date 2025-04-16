import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { InventoryAuditLog } from "./InventoryAuditLog";
import { StorageRoom } from "./StorageRoom";
import { InventoryStock } from "./InventoryStock";
import { InventoryTransaction } from "./InventoryTransaction";

@Index(
  "inventory_location_unique",
  ["aisle", "bin", "rack", "storageRoomId", "zone"],
  { unique: true }
)
@Index("idx_inventory_location_rackbin", ["bin", "rack"], {})
@Index("idx_inventory_location_id", ["id"], {})
@Index("inventory_location_pkey", ["id"], { unique: true })
@Index("idx_inventory_location_isdeleted", ["isDeleted"], {})
@Index("idx_inventory_location_storageroom", ["storageRoomId"], {})
@Index("idx_inventory_location_zone", ["zone"], {})
@Entity("inventory_location", { schema: "dump" })
export class InventoryLocation {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("uuid", { name: "storageRoomId" })
  storageRoomId: string;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("boolean", {
    name: "isVirtual",
    nullable: true,
    default: () => "false",
  })
  isVirtual: boolean | null;

  @Column("character varying", { name: "zone", nullable: true, length: 10 })
  zone: string | null;

  @Column("character varying", { name: "aisle", nullable: true, length: 10 })
  aisle: string | null;

  @Column("character varying", { name: "rack", nullable: true, length: 10 })
  rack: string | null;

  @Column("character varying", { name: "bin", nullable: true, length: 10 })
  bin: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

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
    (inventoryAuditLog) => inventoryAuditLog.location
  )
  inventoryAuditLogs: InventoryAuditLog[];

  @ManyToOne(
    () => StorageRoom,
    (storageRoom) => storageRoom.inventoryLocations,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "storageRoomId", referencedColumnName: "id" }])
  storageRoom: StorageRoom;

  @OneToMany(() => InventoryStock, (inventoryStock) => inventoryStock.location)
  inventoryStocks: InventoryStock[];

  @OneToMany(
    () => InventoryTransaction,
    (inventoryTransaction) => inventoryTransaction.location
  )
  inventoryTransactions: InventoryTransaction[];
}
