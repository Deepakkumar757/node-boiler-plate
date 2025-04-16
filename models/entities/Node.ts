import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { NodeConfig } from "./NodeConfig";
import { Users } from "./Users";
import { Process } from "./Process";
import { TemplateNode } from "./TemplateNode";
import { PreBuildNodes } from "./PreBuildNodes";
import { NodeEdges } from "./NodeEdges";
import { NodeFormData } from "./NodeFormData";
import { Request } from "./Request";
import { Task } from "./Task";

@Index("idx_node_configid", ["configId"], {})
@Index("idx_node_createdby", ["createdBy"], {})
@Index("node_pkey", ["id"], { unique: true })
@Index("idx_node_inchargeid", ["inchargeId"], {})
@Index("idx_node_isdeleted", ["isDeleted"], {})
@Index("idx_node_processid", ["processId"], {})
@Index("idx_node_templatenodeid", ["templateNodeId"], {})
@Index("idx_node_updatedby", ["updatedBy"], {})
@Entity("node", { schema: "dump" })
export class Node {
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

  @Column("double precision", {
    name: "x",
    nullable: true,
    precision: 53,
    default: () => "0",
  })
  x: number | null;

  @Column("double precision", {
    name: "y",
    nullable: true,
    precision: 53,
    default: () => "0",
  })
  y: number | null;

  @Column("uuid", { name: "configId", nullable: true })
  configId: string | null;

  @Column("uuid", { name: "templateNodeId", nullable: true })
  templateNodeId: string | null;

  @Column("uuid", { name: "inchargeId", nullable: true })
  inchargeId: string | null;

  @Column("uuid", { name: "wareHouseId", nullable: true })
  wareHouseId: string | null;

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

  @Column("uuid", { name: "processId" })
  processId: string;

  @Column("boolean", {
    name: "isRejectable",
    nullable: true,
    default: () => "false",
  })
  isRejectable: boolean | null;

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

  @ManyToOne(() => NodeConfig, (nodeConfig) => nodeConfig.nodes)
  @JoinColumn([{ name: "configId", referencedColumnName: "id" }])
  config: NodeConfig;

  @ManyToOne(() => Users, (users) => users.nodes)
  @JoinColumn([{ name: "createdBy", referencedColumnName: "id" }])
  createdBy2: Users;

  @ManyToOne(() => Users, (users) => users.nodes2)
  @JoinColumn([{ name: "inchargeId", referencedColumnName: "id" }])
  incharge: Users;

  @ManyToOne(() => Process, (process) => process.nodes)
  @JoinColumn([{ name: "processId", referencedColumnName: "id" }])
  process: Process;

  @ManyToOne(() => TemplateNode, (templateNode) => templateNode.nodes)
  @JoinColumn([{ name: "templateNodeId", referencedColumnName: "id" }])
  templateNode: TemplateNode;

  @ManyToOne(() => Users, (users) => users.nodes3)
  @JoinColumn([{ name: "updatedBy", referencedColumnName: "id" }])
  updatedBy2: Users;

  @ManyToOne(() => PreBuildNodes, (preBuildNodes) => preBuildNodes.nodes)
  @JoinColumn([{ name: "nodeSlug", referencedColumnName: "slug" }])
  nodeSlug: PreBuildNodes;

  @OneToMany(() => NodeEdges, (nodeEdges) => nodeEdges.fromNode)
  nodeEdges: NodeEdges[];

  @OneToMany(() => NodeEdges, (nodeEdges) => nodeEdges.toNode)
  nodeEdges2: NodeEdges[];

  @OneToMany(() => NodeFormData, (nodeFormData) => nodeFormData.node)
  nodeFormData: NodeFormData[];

  @OneToMany(() => Request, (request) => request.node)
  requests: Request[];

  @OneToMany(() => Task, (task) => task.node)
  tasks: Task[];
}
