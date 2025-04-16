import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Task } from "./Task";

@Index("task_data_pkey", ["id"], { unique: true })
@Index("idx_task_data_isprimary", ["isPrimary"], {})
@Index("idx_task_data_previoustaskid", ["previousTaskId"], {})
@Index("idx_task_data_status", ["status"], {})
@Index("idx_task_data_taskid", ["taskId"], {})
@Index("idx_task_data_timestamp", ["timestamp"], {})
@Entity("task_data", { schema: "dump" })
export class TaskData {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("uuid", { name: "taskId" })
  taskId: string;

  @Column("uuid", { name: "previousTaskId", nullable: true })
  previousTaskId: string | null;

  @Column("timestamp without time zone", {
    name: "timestamp",
    default: () => "now()",
  })
  timestamp: Date;

  @Column("enum", {
    name: "status",
    enum: ["pending", "inProgress", "completed", "onHold"],
    default: () => "'pending'.task_status",
  })
  status: "pending" | "inProgress" | "completed" | "onHold";

  @Column("boolean", { name: "isPrimary", default: () => "false" })
  isPrimary: boolean;

  @Column("jsonb", { name: "draft", nullable: true, default: {} })
  draft: object | null;

  @Column("jsonb", { name: "dataInput", nullable: true, default: {} })
  dataInput: object | null;

  @Column("jsonb", { name: "nodeInput", nullable: true, default: {} })
  nodeInput: object | null;

  @Column("jsonb", { name: "output", nullable: true, default: {} })
  output: object | null;

  @Column("jsonb", { name: "consumed", nullable: true, default: {} })
  consumed: object | null;

  @Column("jsonb", { name: "dispatched", nullable: true, default: {} })
  dispatched: object | null;

  @Column("jsonb", { name: "produced", nullable: true, default: {} })
  produced: object | null;

  @Column("timestamp without time zone", {
    name: "startedTime",
    nullable: true,
    default: () => "now()",
  })
  startedTime: Date | null;

  @Column("timestamp without time zone", {
    name: "completedTime",
    nullable: true,
  })
  completedTime: Date | null;

  @Column("timestamp without time zone", {
    name: "createdAt",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("timestamp without time zone", {
    name: "updatedAt",
    default: () => "now()",
  })
  updatedAt: Date;

  @ManyToOne(() => Task, (task) => task.taskData, { onDelete: "SET NULL" })
  @JoinColumn([{ name: "previousTaskId", referencedColumnName: "id" }])
  previousTask: Task;

  @ManyToOne(() => Task, (task) => task.taskData2, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "taskId", referencedColumnName: "id" }])
  task: Task;
}
