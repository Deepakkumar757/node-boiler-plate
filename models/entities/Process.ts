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
import { Request } from "./Request";
import { TemplateNode } from "./TemplateNode";

@Index("process_pkey", ["id"], { unique: true })
@Index("idx_process_id", ["id"], {})
@Index("idx_process_isdeleted", ["isDeleted"], {})
@Entity("process", { schema: "dump" })
export class Process {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("character varying", { name: "description", length: 255 })
  description: string;

  @Column("enum", {
    name: "processType",
    enum: ["batch", "fedBatch", "continues"],
  })
  processType: "batch" | "fedBatch" | "continues";

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

  @OneToMany(() => Node, (node) => node.process)
  nodes: Node[];

  @ManyToOne(() => Users, (users) => users.processes)
  @JoinColumn([{ name: "createdBy", referencedColumnName: "id" }])
  createdBy: Users;

  @ManyToOne(() => Users, (users) => users.processes2)
  @JoinColumn([{ name: "updatedBy", referencedColumnName: "id" }])
  updatedBy: Users;

  @OneToMany(() => Request, (request) => request.process)
  requests: Request[];

  @OneToMany(() => TemplateNode, (templateNode) => templateNode.process)
  templateNodes: TemplateNode[];
}
