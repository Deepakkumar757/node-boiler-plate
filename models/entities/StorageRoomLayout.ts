import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { StorageRoom } from "./StorageRoom";

@Index("storage_room_layout_pkey", ["id"], { unique: true })
@Index("idx_storage_room_layout_id", ["id"], {})
@Index("idx_storage_room_layout_isdeleted", ["isDeleted"], {})
@Index("idx_storage_room_layout_storageroom", ["storageRoomId"], {})
@Index("storage_room_layout_unique", ["storageRoomId"], { unique: true })
@Entity("storage_room_layout", { schema: "dump" })
export class StorageRoomLayout {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("uuid", { name: "storageRoomId" })
  storageRoomId: string;

  @Column("character varying", { name: "zoneStart", length: 10 })
  zoneStart: string;

  @Column("character varying", { name: "zoneEnd", length: 10 })
  zoneEnd: string;

  @Column("integer", { name: "aisleStart" })
  aisleStart: number;

  @Column("integer", { name: "aisleEnd" })
  aisleEnd: number;

  @Column("integer", { name: "rackStart" })
  rackStart: number;

  @Column("integer", { name: "rackEnd" })
  rackEnd: number;

  @Column("integer", { name: "binStart" })
  binStart: number;

  @Column("integer", { name: "binEnd" })
  binEnd: number;

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

  @OneToOne(() => StorageRoom, (storageRoom) => storageRoom.storageRoomLayout, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "storageRoomId", referencedColumnName: "id" }])
  storageRoom: StorageRoom;
}
