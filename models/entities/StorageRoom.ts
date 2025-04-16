import { Column, Entity, Index, OneToMany, OneToOne } from "typeorm";
import { InventoryLocation } from "./InventoryLocation";
import { StorageRoomLayout } from "./StorageRoomLayout";

@Index("idx_storage_room_id", ["id"], {})
@Index("storage_room_pkey", ["id"], { unique: true })
@Index("idx_storage_room_isdeleted", ["isDeleted"], {})
@Index("storage_room_name_unique", ["name"], { unique: true })
@Entity("storage_room", { schema: "dump" })
export class StorageRoom {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

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
    () => InventoryLocation,
    (inventoryLocation) => inventoryLocation.storageRoom
  )
  inventoryLocations: InventoryLocation[];

  @OneToOne(
    () => StorageRoomLayout,
    (storageRoomLayout) => storageRoomLayout.storageRoom
  )
  storageRoomLayout: StorageRoomLayout;
}
