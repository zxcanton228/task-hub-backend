import { FiltersService } from '@/filters/filters.service'
import { PaginationService } from '@/pagination/pagination.service'
import { Module } from '@nestjs/common'
import { PrismaService } from './../prisma.service'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'

@Module({
	controllers: [TasksController],
	providers: [TasksService, PrismaService, PaginationService, FiltersService]
})
export class TasksModule {}
