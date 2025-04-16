import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Users } from "./Users";
import { Node } from "./Node";
import { Process } from "./Process";
import { RequestVersioning } from "./RequestVersioning";
import { Task } from "./Task";

@Index("idx_request_createdby", ["createdBy"], {})
@Index("request_pkey", ["id"], { unique: true })
@Index("idx_request_id", ["id"], {})
@Index("idx_request_isdeleted", ["isDeleted"], {})
@Index("idx_request_nodeid", ["nodeId"], {})
@Index("idx_request_processid", ["processId"], {})
@Index("idx_request_updatedby", ["updatedBy"], {})
@Entity("request", { schema: "dump" })
export class Request {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("uuid", { name: "nodeId" })
  nodeId: string;

  @Column("uuid", { name: "processId" })
  processId: string;

  @Column("enum", {
    name: "status",
    enum: [
      "pending",
      "inProgress",
      "completed",
      "failed",
      "overdue",
      "onHold",
      "lateCompleted",
    ],
    default: () => "'pending'.request_status",
  })
  status:
    | "pending"
    | "inProgress"
    | "completed"
    | "failed"
    | "overdue"
    | "onHold"
    | "lateCompleted";

  @Column("jsonb", { name: "state", nullable: true })
  state: object | null;

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

  @ManyToOne(() => Users, (users) => users.requests)
  @JoinColumn([{ name: "createdBy", referencedColumnName: "id" }])
  createdBy2: Users;

  @ManyToOne(() => Node, (node) => node.requests)
  @JoinColumn([{ name: "nodeId", referencedColumnName: "id" }])
  node: Node;

  @ManyToOne(() => Process, (process) => process.requests)
  @JoinColumn([{ name: "processId", referencedColumnName: "id" }])
  process: Process;

  @ManyToOne(() => Users, (users) => users.requests2)
  @JoinColumn([{ name: "updatedBy", referencedColumnName: "id" }])
  updatedBy2: Users;

  @OneToMany(
    () => RequestVersioning,
    (requestVersioning) => requestVersioning.request
  )
  requestVersionings: RequestVersioning[];

  @OneToMany(() => Task, (task) => task.request)
  tasks: Task[];
}
