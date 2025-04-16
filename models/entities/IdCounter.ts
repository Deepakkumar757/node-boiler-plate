import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("id_counter_context_key", ["context"], { unique: true })
@Index("id_counter_pkey", ["id"], { unique: true })
@Entity("id_counter", { schema: "dump" })
export class IdCounter {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "context", length: 50 })
  context: string;

  @Column("character varying", { name: "latestId", length: 20 })
  latestId: string;

  @Column("timestamp without time zone", {
    name: "lastUpdatedAt",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  lastUpdatedAt: Date | null;
}
