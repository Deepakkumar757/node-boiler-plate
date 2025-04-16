import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_schedulers_id", ["id"], {})
@Index("schedulers_pkey", ["id"], { unique: true })
@Index("idx_schedulers_is_active", ["isActive"], {})
@Entity("schedulers", { schema: "dump" })
export class Schedulers {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "name" })
  name: string;

  @Column("enum", {
    name: "type",
    enum: ["create_request", "report_mail", "mail"],
  })
  type: "create_request" | "report_mail" | "mail";

  @Column("enum", { name: "schedule_type", enum: ["ONCE", "REPEAT"] })
  scheduleType: "ONCE" | "REPEAT";

  @Column("timestamp with time zone", { name: "run_at", nullable: true })
  runAt: Date | null;

  @Column("time without time zone", { name: "run_time", nullable: true })
  runTime: string | null;

  @Column("jsonb", { name: "payload" })
  payload: object;

  @Column("boolean", {
    name: "is_active",
    nullable: true,
    default: () => "true",
  })
  isActive: boolean | null;

  @Column("timestamp with time zone", {
    name: "last_triggered_at",
    nullable: true,
  })
  lastTriggeredAt: Date | null;

  @Column("timestamp with time zone", {
    name: "created_at",
    nullable: true,
    default: () => "now()",
  })
  createdAt: Date | null;

  @Column("timestamp with time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "now()",
  })
  updatedAt: Date | null;
}
