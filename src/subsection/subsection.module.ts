import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Subsection } from './entities/subsection.entity';
import { SubsectionController } from './subsection.controller';
import { SubsectionService } from './subsection.service';

@Module({
    imports: [TypeOrmModule.forFeature([Subsection])],
    controllers: [SubsectionController],
    providers: [SubsectionService],
})
export class SubsectionModule {}
