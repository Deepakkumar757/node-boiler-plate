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
import { Request } from "./Request";
import { TaskData } from "./TaskData";

@Index("idx_task_assignee", ["assignee"], {})
@Index("task_pkey", ["id"], { unique: true })
@Index("idx_task_isdeleted", ["isDeleted"], {})
@Index("idx_task_nodeid", ["nodeId"], {})
@Index("idx_task_requestid", ["requestId"], {})
@Index("idx_task_status", ["status"], {})
@Index("idx_task_taskid", ["taskId"], {})
@Entity("task", { schema: "dump" })
export class Task {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("character varying", { name: "taskId", length: 50 })
  taskId: string;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["pending", "inProgress", "completed", "onHold"],
    default: () => "'pending'.task_status",
  })
  status: "pending" | "inProgress" | "completed" | "onHold" | null;

  @Column("uuid", { name: "nodeId" })
  nodeId: string;

  @Column("uuid", { name: "requestId" })
  requestId: string;

  @Column("uuid", { name: "assignee" })
  assignee: string;

  @Column("timestamp without time zone", { name: "startTime", nullable: true })
  startTime: Date | null;

  @Column("timestamp without time zone", {
    name: "completedTime",
    nullable: true,
  })
  completedTime: Date | null;

  @Column("timestamp without time zone", {
    name: "draftedTime",
    nullable: true,
  })
  draftedTime: Date | null;

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

  @Column("jsonb", { name: "dataInput", nullable: true, default: {} })
  dataInput: object | null;

  @Column("boolean", {
    name: "isSynchronous",
    nullable: true,
    default: () => "true",
  })
  isSynchronous: boolean | null;

  @ManyToOne(() => Users, (users) => users.tasks, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "assignee", referencedColumnName: "id" }])
  assignee2: Users;

  @ManyToOne(() => Node, (node) => node.tasks, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "nodeId", referencedColumnName: "id" }])
  node: Node;

  @ManyToOne(() => Request, (request) => request.tasks, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "requestId", referencedColumnName: "id" }])
  request: Request;

  @OneToMany(() => TaskData, (taskData) => taskData.previousTask)
  taskData: TaskData[];

  @OneToMany(() => TaskData, (taskData) => taskData.task)
  taskData2: TaskData[];
}
