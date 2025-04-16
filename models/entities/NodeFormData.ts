import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Lookup } from "./Lookup";
import { Node } from "./Node";

@Index("idx_node_form_data_id", ["id"], {})
@Index("node_form_data_pkey", ["id"], { unique: true })
@Index("idx_node_form_data_isdeleted", ["isDeleted"], {})
@Index("idx_node_form_data_lookupid", ["lookupId"], {})
@Index("idx_node_form_data_nodeid", ["nodeId"], {})
@Entity("node_form_data", { schema: "dump" })
export class NodeFormData {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("uuid", { name: "nodeId" })
  nodeId: string;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("enum", {
    name: "dataType",
    enum: ["text", "number", "date", "upload", "dropdown", "object", "scan"],
  })
  dataType:
    | "text"
    | "number"
    | "date"
    | "upload"
    | "dropdown"
    | "object"
    | "scan";

  @Column("enum", {
    name: "formType",
    enum: ["dataInput", "inchargeInput", "output"],
  })
  formType: "dataInput" | "inchargeInput" | "output";

  @Column("enum", {
    name: "dropDownType",
    nullable: true,
    enum: ["inventory", "lookup", "nextNodes"],
  })
  dropDownType: "inventory" | "lookup" | "nextNodes" | null;

  @Column("uuid", { name: "lookupId", nullable: true })
  lookupId: string | null;

  @Column("boolean", {
    name: "isRequired",
    nullable: true,
    default: () => "false",
  })
  isRequired: boolean | null;

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

  @ManyToOne(() => Lookup, (lookup) => lookup.nodeFormData)
  @JoinColumn([{ name: "lookupId", referencedColumnName: "id" }])
  lookup: Lookup;

  @ManyToOne(() => Node, (node) => node.nodeFormData)
  @JoinColumn([{ name: "nodeId", referencedColumnName: "id" }])
  node: Node;
}
