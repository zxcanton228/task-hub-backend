import { Controller, Get, Param } from '@nestjs/common'
import { Auth } from './../auth/decorators/auth.decorator'
import { CurrentUser } from './../auth/decorators/user.decorator'
import { ChatService } from './chat.service'

@Controller('chats')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Auth()
	@Get()
	public async getAllChats(@CurrentUser('id') id: string) {
		return this.chatService.findAllChats(id)
	}

	@Auth()
	@Get('/:chatId')
	public async getChat(@Param('chatId') chatId: string) {
		return this.chatService.findOneChat(chatId)
	}
}
