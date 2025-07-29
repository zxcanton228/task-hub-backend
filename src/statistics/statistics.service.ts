import { PrismaService } from '@/prisma.service'
import { getRandomNum } from '@/utils/get-random-num'
import { Injectable } from '@nestjs/common'
import { Task } from '@prisma/client'
import type { IChartDataPoint } from './statistics.types'

@Injectable()
export class StatisticsService {
	constructor(private readonly prismaService: PrismaService) {}

	private readonly MONTHS = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	]

	public async getStatistic(userId: string) {
		const activeProjects = await this.prismaService.task.count({
			where: {
				userId,
				status: {
					not: 100
				}
			}
		})
		const onGoingProjects = await this.prismaService.task.count({
			where: {
				userId,
				status: 100
			}
		})
		return {
			activeProjects,
			onGoingProjects,
			workingHours: `${getRandomNum(0, 24)}h ${getRandomNum(0, 60)}m`
		}
	}
	public async getChartStatistic(
		userId: string,
		type: 'weekly' | 'yearly' = 'yearly'
	): Promise<IChartDataPoint[]> {
		const tasks = await this.prismaService.task.findMany({
			select: { createdAt: true },
			where: { userId }
		})

		return type === 'weekly' ? this._groupWeekly(tasks) : this._groupYearly(tasks)
	}

	private _groupYearly(tasks: Pick<Task, 'createdAt'>[]): IChartDataPoint[] {
		const counts = new Array(12).fill(0)
		for (const task of tasks) {
			console.log(task.createdAt.getMonth())
			counts[task.createdAt.getMonth()]++
		}
		return counts.map((count, i) => ({
			period: this.MONTHS[i],
			value: count
		}))
	}

	private _groupWeekly(tasks: Pick<Task, 'createdAt'>[]): IChartDataPoint[] {
		const weekCounts: Record<number, number> = {}

		for (const { createdAt } of tasks) {
			const week = this._getWeekNumber(createdAt)
			weekCounts[week] = (weekCounts[week] ?? 0) + 1
		}

		const weekKeys = Object.keys(weekCounts).map(Number)

		// If there's only one week, add 5 weeks before and after
		if (weekKeys.length === 1) {
			const baseWeek = weekKeys[0]
			for (let i = -5; i <= 5; i++) {
				const w = baseWeek + i
				if (!(w in weekCounts)) weekCounts[w] = 0
			}
		}

		return Object.entries(weekCounts)
			.sort(([a], [b]) => +a - +b)
			.map(([week, count]) => ({
				period: `Week ${week}`,
				value: count
			}))
	}

	private _getWeekNumber(date: Date): number {
		const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
		const dayNum = d.getUTCDay() || 7
		d.setUTCDate(d.getUTCDate() + 4 - dayNum)
		const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
		return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
	}
}
