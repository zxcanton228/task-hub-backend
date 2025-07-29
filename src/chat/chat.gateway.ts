import { Logger } from '@nestjs/common'
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ChatService } from './chat.service'
import { CreateMessageDto } from './dto/create-chat.dto'

@WebSocketGateway({ namespace: '/api' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server

	private readonly logger = new Logger()

	constructor(private readonly chatService: ChatService) {}

	handleConnection(client: Socket) {
		this.logger.log(`Client connected: ${client.id}`)
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`)
	}

	@SubscribeMessage('sendMessage')
	async handleMessage(_: Socket, payload: CreateMessageDto) {
		const chat = await this.chatService.createMessage(payload)
		this.server.to(payload.chatId).emit('receiveMessage', chat)
	}

	@SubscribeMessage('joinChat')
	async handleJoinChat(client: Socket, chatId: string) {
		client.join(chatId)
	}
}
