import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Request } from "./Request";

@Index("request_versioning_pkey", ["id"], { unique: true })
@Index("idx_request_versioning_id", ["id"], {})
@Index("idx_request_versioning_requestid", ["requestId"], {})
@Index("request_versioning_requestId_version_key", ["requestId", "version"], {
  unique: true,
})
@Entity("request_versioning", { schema: "dump" })
export class RequestVersioning {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("uuid", { name: "requestId" })
  requestId: string;

  @Column("integer", { name: "version" })
  version: number;

  @Column("jsonb", { name: "state" })
  state: object;

  @Column("timestamp without time zone", {
    name: "createdAt",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @ManyToOne(() => Users, (users) => users.requestVersionings)
  @JoinColumn([{ name: "createdBy", referencedColumnName: "id" }])
  createdBy: Users;

  @ManyToOne(() => Request, (request) => request.requestVersionings)
  @JoinColumn([{ name: "requestId", referencedColumnName: "id" }])
  request: Request;
}
