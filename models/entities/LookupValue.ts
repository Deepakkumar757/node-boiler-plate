import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Lookup } from "./Lookup";

@Index("idx_lookup_value_id", ["id"], {})
@Index("lookup_value_pkey", ["id"], { unique: true })
@Index("idx_lookup_value_isdeleted", ["isDeleted"], {})
@Index("idx_lookup_value_lookupid", ["lookupId"], {})
@Entity("lookup_value", { schema: "dump" })
export class LookupValue {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("uuid", { name: "lookupId" })
  lookupId: string;

  @Column("character varying", { name: "value", length: 100 })
  value: string;

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

  @ManyToOne(() => Lookup, (lookup) => lookup.lookupValues)
  @JoinColumn([{ name: "lookupId", referencedColumnName: "id" }])
  lookup: Lookup;
}
