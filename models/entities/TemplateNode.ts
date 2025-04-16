import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Node } from "./Node";
import { Users } from "./Users";
import { Process } from "./Process";

@Index("idx_template_node_createdby", ["createdBy"], {})
@Index("idx_template_node_id", ["id"], {})
@Index("template_node_pkey", ["id"], { unique: true })
@Index("idx_template_node_isdeleted", ["isDeleted"], {})
@Index("idx_template_node_processid", ["processId"], {})
@Index("idx_template_node_updatedby", ["updatedBy"], {})
@Entity("template_node", { schema: "dump" })
export class TemplateNode {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 255,
  })
  description: string | null;

  @Column("text", { name: "reqValidationScript", nullable: true })
  reqValidationScript: string | null;

  @Column("text", { name: "nodeScript", nullable: true })
  nodeScript: string | null;

  @Column("boolean", {
    name: "initial",
    nullable: true,
    default: () => "false",
  })
  initial: boolean | null;

  @Column("boolean", {
    name: "isSynchronous",
    nullable: true,
    default: () => "false",
  })
  isSynchronous: boolean | null;

  @Column("boolean", {
    name: "isAsynchronous",
    nullable: true,
    default: () => "false",
  })
  isAsynchronous: boolean | null;

  @Column("boolean", {
    name: "isRejectable",
    nullable: true,
    default: () => "false",
  })
  isRejectable: boolean | null;

  @Column("uuid", { name: "processId", nullable: true })
  processId: string | null;

  @Column("uuid", { name: "createdBy" })
  createdBy: string;

  @Column("uuid", { name: "updatedBy" })
  updatedBy: string;

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

  @OneToMany(() => Node, (node) => node.templateNode)
  nodes: Node[];

  @ManyToOne(() => Users, (users) => users.templateNodes)
  @JoinColumn([{ name: "createdBy", referencedColumnName: "id" }])
  createdBy2: Users;

  @ManyToOne(() => Process, (process) => process.templateNodes)
  @JoinColumn([{ name: "processId", referencedColumnName: "id" }])
  process: Process;

  @ManyToOne(() => Users, (users) => users.templateNodes2)
  @JoinColumn([{ name: "updatedBy", referencedColumnName: "id" }])
  updatedBy2: Users;
}
