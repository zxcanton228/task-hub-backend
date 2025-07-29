import { IsOptional, IsString } from 'class-validator'

export class CreateMessageDto {
	@IsString()
	text: string
	@IsString()
	chatId: string
	@IsString()
	userId: string
}
export class UpdateChatDto {
	@IsString()
	@IsOptional()
	text?: string

	@IsString()
	chatId: string
}
