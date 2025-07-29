import { Auth } from '@/auth/decorators/auth.decorator'
import { CurrentUser } from '@/auth/decorators/user.decorator'
import { Controller, Get, Query } from '@nestjs/common'
import { StatisticsService } from './statistics.service'

@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Auth()
	@Get()
	public async getStatistic(@CurrentUser('id') id: string) {
		return this.statisticsService.getStatistic(id)
	}
	@Auth()
	@Get('chart')
	public async getChartStatistic(
		@CurrentUser('id') id: string,
		@Query() params: { type: 'weekly' | 'yearly' }
	) {
		return this.statisticsService.getChartStatistic(id, params.type)
	}
}
