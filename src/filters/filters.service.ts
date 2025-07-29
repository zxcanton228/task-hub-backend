import { EnumActivitySort, EnumDueDateSort, GetAllTasksDto } from '@/tasks/dto/get-all-tasks.dto'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

@Injectable()
export class FiltersService {
	public createFilter(dto: GetAllTasksDto): Prisma.TaskWhereInput {
		const filters: Prisma.TaskWhereInput[] = []

		if (dto.searchTerm) filters.push(this._getSearchTermFilter(dto.searchTerm))

		if (dto.sort) filters.push(this._getActivityFilter(dto.sort))

		return filters.length ? { AND: filters } : {}
	}
	public getDueDateSortOption(sort?: EnumDueDateSort): Prisma.TaskOrderByWithRelationInput[] {
		switch (sort) {
			case EnumDueDateSort.NEWEST:
				return [{ dueDate: 'desc' }]
			case EnumDueDateSort.OLDEST:
				return [{ dueDate: 'asc' }]
			default:
				return [{ updatedAt: 'desc' }]
		}
	}

	private _getActivityFilter(activity: EnumActivitySort): Prisma.TaskWhereInput {
		switch (activity) {
			case EnumActivitySort.COMPLETED:
				return { status: 100 }
			case EnumActivitySort.ACTIVE:
				return {
					status: {
						not: 100
					}
				}
			default:
				return {}
		}
	}

	private _getSearchTermFilter(searchTerm: string): Prisma.TaskWhereInput {
		return {
			OR: [
				{
					title: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				}
			]
		}
	}
}
