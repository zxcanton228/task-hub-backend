import { PrismaService } from '@/prisma.service'
import { Module } from '@nestjs/common'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

@Module({
	controllers: [StatisticsController],
	providers: [StatisticsService, PrismaService]
})
export class StatisticsModule {}
