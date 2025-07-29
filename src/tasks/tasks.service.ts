import { FiltersService } from '@/filters/filters.service'
import { PaginationService } from '@/pagination/pagination.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Task } from '@prisma/client'
import { PrismaService } from './../prisma.service'
import { GetAllTasksDto } from './dto/get-all-tasks.dto'
import { CreateTaskDto } from './dto/task.dto'

type TGetAll = {
	tasks: Task[]
	length: number
}

@Injectable()
export class TasksService {
	constructor(
		private readonly paginationService: PaginationService,
		private readonly filtersService: FiltersService,
		private readonly prismaService: PrismaService
	) {}

	public async create(data: CreateTaskDto, userId: string): Promise<Task> {
		const task = await this.prismaService.task.create({
			data: {
				userId,
				...data
			}
		})
		return task
	}

	public async getAll(dto: GetAllTasksDto = {}): Promise<TGetAll> {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.filtersService.createFilter(dto)

		const tasks = await this.prismaService.task.findMany({
			where: filters,
			orderBy: this.filtersService.getDueDateSortOption(dto.dueDate),
			skip,
			take: perPage
		})

		return {
			tasks,
			length: await this.prismaService.task.count({
				where: filters
			})
		}
	}

	public async getOne(id: string): Promise<Task> {
		const task = this.prismaService.task.findUnique({
			where: {
				id
			}
		})

		if (!task) throw new NotFoundException('Task not found')
		return task
	}

	public async update(id: string, data: CreateTaskDto, userId: string) {
		const task = await this.prismaService.task.update({
			where: {
				id
			},
			data: {
				userId,
				...data
			}
		})
		return task
	}

	public async remove(taskId: string) {
		const task = await this.getOne(taskId)
		if (!task) throw new NotFoundException('Task not found')

		await this.prismaService.task.delete({
			where: {
				id: task.id
			}
		})
	}

	// public async getAllForStatistic(userId: string) {

	// }
}
