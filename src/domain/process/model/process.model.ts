import { Entity, Column, PrimaryGeneratedColumn, Index, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { processType } from '../process.types';
// import { Node } from '../../../../models/entities/Node';
import { Users } from '../../users/model/users.model';
// import { Request } from '../../../../models/entities/Request';
// import { TemplateNode } from '../../../../models/entities/TemplateNode';

@Index('process_pkey', ['id'], { unique: true })
@Index('idx_process_id', ['id'], {})
@Index('idx_process_isdeleted', ['isDeleted'], {})
@Entity('process')
export class Process extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'name', length: 100 })
  name!: string;

  @Column({ name: 'description', length: 255 })
  description!: string;

  @Column({
    name: 'processType',
    type: 'enum',
    enum: processType
  })
  processType!: processType;

  @Column({ name: 'isDeleted', default: false })
  isDeleted!: boolean;

  @Column({ type: 'timestamp', name: 'createdAt', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ type: 'timestamp', name: 'updatedAt', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  // @OneToMany(() => Node, (node: Node) => node.process)
  // nodes: Node[] = [];

  @ManyToOne(() => Users, (users: Users) => users.processes)
  @JoinColumn([{ name: 'createdBy', referencedColumnName: 'id' }])
  createdBy!: Users | string;

  @ManyToOne(() => Users, (users: Users) => users.processes2)
  @JoinColumn([{ name: 'updatedBy', referencedColumnName: 'id' }])
  updatedBy!: Users | string;

  // @OneToMany(() => Request, (request: Request) => request.process)
  // requests: Request[] = [];

  // @OneToMany(() => TemplateNode, (templateNode: TemplateNode) => templateNode.process)
  // templateNodes: TemplateNode[] = [];
}
