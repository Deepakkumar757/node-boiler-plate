import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Node } from "./Node";
import { NodeConfig } from "./NodeConfig";

@Index("idx_pre_build_nodes_configid", ["configId"], {})
@Index("pre_build_nodes_pkey", ["id"], { unique: true })
@Index("idx_pre_build_nodes_id", ["id"], {})
@Index("idx_pre_build_nodes_isdeleted", ["isDeleted"], {})
@Index("pre_build_nodes_slug_unique", ["slug"], { unique: true })
@Entity("pre_build_nodes", { schema: "dump" })
export class PreBuildNodes {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("character varying", { name: "name", length: 100 })
  name: string;

  @Column("character varying", { name: "slug", length: 50 })
  slug: string;

  @Column("character varying", { name: "description", length: 255 })
  description: string;

  @Column("uuid", { name: "configId" })
  configId: string;

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

  @OneToMany(() => Node, (node) => node.nodeSlug)
  nodes: Node[];

  @ManyToOne(() => NodeConfig, (nodeConfig) => nodeConfig.preBuildNodes)
  @JoinColumn([{ name: "configId", referencedColumnName: "id" }])
  config: NodeConfig;
}
