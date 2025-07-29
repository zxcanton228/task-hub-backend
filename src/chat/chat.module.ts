import { PrismaService } from '@/prisma.service'
import { Module } from '@nestjs/common'
import { ChatController } from './chat.controller'
import { ChatGateway } from './chat.gateway'
import { ChatService } from './chat.service'

@Module({
	providers: [ChatGateway, ChatService, PrismaService],

	controllers: [ChatController]
})
export class ChatModule {}
