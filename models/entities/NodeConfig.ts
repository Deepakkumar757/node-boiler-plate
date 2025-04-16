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
import { PreBuildNodes } from "./PreBuildNodes";

@Index("idx_node_config_id", ["id"], {})
@Index("node_config_pkey", ["id"], { unique: true })
@Index("idx_node_config_isdeleted", ["isDeleted"], {})
@Entity("node_config", { schema: "dump" })
export class NodeConfig {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("integer", { name: "version", default: () => "1" })
  version: number;

  @Column("boolean", { name: "isshared", default: () => "false" })
  isshared: boolean;

  @Column("json", { name: "config" })
  config: object;

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

  @OneToMany(() => Node, (node) => node.config)
  nodes: Node[];

  @ManyToOne(() => Users, (users) => users.nodeConfigs)
  @JoinColumn([{ name: "createdBy", referencedColumnName: "id" }])
  createdBy: Users;

  @ManyToOne(() => Users, (users) => users.nodeConfigs2)
  @JoinColumn([{ name: "updatedBy", referencedColumnName: "id" }])
  updatedBy: Users;

  @OneToMany(() => PreBuildNodes, (preBuildNodes) => preBuildNodes.config)
  preBuildNodes: PreBuildNodes[];
}
