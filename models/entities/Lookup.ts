import { Column, Entity, Index, OneToMany } from "typeorm";
import { LookupValue } from "./LookupValue";
import { NodeFormData } from "./NodeFormData";

@Index("lookup_pkey", ["id"], { unique: true })
@Index("idx_lookup_id", ["id"], {})
@Index("idx_lookup_isdeleted", ["isDeleted"], {})
@Index("idx_lookup_type", ["type"], {})
@Entity("lookup", { schema: "dump" })
export class Lookup {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("enum", { name: "type", enum: ["category", "unit", "manual"] })
  type: "category" | "unit" | "manual";

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

  @OneToMany(() => LookupValue, (lookupValue) => lookupValue.lookup)
  lookupValues: LookupValue[];

  @OneToMany(() => NodeFormData, (nodeFormData) => nodeFormData.lookup)
  nodeFormData: NodeFormData[];
}
