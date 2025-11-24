import { Column, Entity, ManyToOne } from 'typeorm';
import BaseEntity from '../../shared/interfaces/base.entity';
import { Application } from './application.entity';

@Entity('application_snapshots')
export class ApplicationSnapshot extends BaseEntity {
    @ManyToOne(() => Application, { onDelete: 'CASCADE' })
    application: Application;

    @Column({ type: 'jsonb' })
    payload: Record<string, any>;
}

