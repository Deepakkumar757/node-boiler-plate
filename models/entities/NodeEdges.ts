import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Node } from "./Node";

@Index("idx_node_edges_fromnodeid", ["fromNodeId"], {})
@Index("idx_node_edges_id", ["id"], {})
@Index("node_edges_pkey", ["id"], { unique: true })
@Index("idx_node_edges_isdeleted", ["isDeleted"], {})
@Index("idx_node_edges_tonodeid", ["toNodeId"], {})
@Entity("node_edges", { schema: "dump" })
export class NodeEdges {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("uuid", { name: "fromNodeId" })
  fromNodeId: string;

  @Column("uuid", { name: "toNodeId" })
  toNodeId: string;

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

  @ManyToOne(() => Node, (node) => node.nodeEdges)
  @JoinColumn([{ name: "fromNodeId", referencedColumnName: "id" }])
  fromNode: Node;

  @ManyToOne(() => Node, (node) => node.nodeEdges2)
  @JoinColumn([{ name: "toNodeId", referencedColumnName: "id" }])
  toNode: Node;
}
