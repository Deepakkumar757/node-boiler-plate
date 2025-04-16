import { Column, Entity, Index, OneToMany } from 'typeorm';
// import { Node } from "./Node";
// import { NodeConfig } from "./NodeConfig";
import { Process } from '../../process/model/process.model';
// import { Request } from "./Request";
// import { RequestVersioning } from "./RequestVersioning";
// import { Task } from "./Task";
// import { TemplateNode } from "./TemplateNode";

@Index('users_email_key', ['email'], { unique: true })
@Index('idx_users_id', ['id'], {})
@Index('users_pkey', ['id'], { unique: true })
@Index('idx_users_isdeleted', ['isDeleted'], {})
@Index('idx_users_username', ['userName'], {})
@Entity('users', { schema: 'dump' })
export class Users {
  @Column('uuid', { primary: true, name: 'id' })
  id!: string;

  @Column('character varying', { name: 'userName', length: 100 })
  userName!: string;

  @Column('character varying', { name: 'name', length: 100 })
  name!: string;

  @Column('character varying', { name: 'email', length: 100 })
  email!: string;

  @Column('character varying', { name: 'password', length: 255 })
  password!: string;

  @Column('enum', { name: 'userRole', enum: ['admin', 'incharge'] })
  userRole!: 'admin' | 'incharge';

  @Column('uuid', { name: 'createdBy', nullable: true })
  createdBy!: string | null;

  @Column('uuid', { name: 'updatedBy', nullable: true })
  updatedBy!: string | null;

  @Column('boolean', { name: 'isDeleted', default: () => 'false' })
  isDeleted!: boolean;

  @Column('timestamp without time zone', {
    name: 'createdAt',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt!: Date | null;

  @Column('timestamp without time zone', {
    name: 'updatedAt',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt!: Date | null;

  // @OneToMany(() => Node, (node) => node.createdBy2)
  // nodes!: Node[];

  // @OneToMany(() => Node, (node) => node.incharge)
  // nodes2!: Node[];

  // @OneToMany(() => Node, (node) => node.updatedBy2)
  // nodes3!: Node[];

  // @OneToMany(() => NodeConfig, (nodeConfig) => nodeConfig.createdBy)
  // nodeConfigs!: NodeConfig[];

  // @OneToMany(() => NodeConfig, (nodeConfig) => nodeConfig.updatedBy)
  // nodeConfigs2!: NodeConfig[];

  @OneToMany(() => Process, (process) => process.createdBy)
  processes!: Process[];

  @OneToMany(() => Process, (process) => process.updatedBy)
  processes2!: Process[];

  // @OneToMany(() => Request, (request) => request.createdBy2)
  // requests!: Request[];

  // @OneToMany(() => Request, (request) => request.updatedBy2)
  // requests2!: Request[];

  // @OneToMany(() => RequestVersioning, (requestVersioning) => requestVersioning.createdBy)
  // requestVersionings!: RequestVersioning[];

  // @OneToMany(() => Task, (task) => task.assignee2)
  // tasks!: Task[];

  // @OneToMany(() => TemplateNode, (templateNode) => templateNode.createdBy2)
  // templateNodes!: TemplateNode[];

  // @OneToMany(() => TemplateNode, (templateNode) => templateNode.updatedBy2)
  // templateNodes2!: TemplateNode[];
}
