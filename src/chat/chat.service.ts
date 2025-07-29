import { PrismaService } from '@/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateMessageDto, UpdateChatDto } from './dto/create-chat.dto'

@Injectable()
export class ChatService {
	constructor(private readonly prismaService: PrismaService) {}

	public async createMessage({ chatId, text, userId }: CreateMessageDto) {
		await this.prismaService.message.create({
			data: {
				chat: { connect: { id: chatId } },
				user: { connect: { id: userId } },
				text
			}
		})

		const chat = await this.findOneChat(chatId)
		return chat
	}

	public async createChat(userId: string, companionId: string) {
		const chatOne = await this.prismaService.chat.findFirst({
			where: {
				users: { some: { id: companionId } },
				AND: {
					users: { some: { id: userId } }
				}
			}
		})
		if (chatOne) return chatOne

		await this.prismaService.chat.create({
			data: { users: { connect: [{ id: userId }, { id: companionId }] } }
		})
	}

	public async findAllChats(userId: string) {
		const chats = (
			await this.prismaService.chat.findMany({
				where: { users: { some: { id: userId } } },
				select: {
					id: true,
					users: { select: { avatarPath: true, name: true, email: true, id: true } }
				},
				orderBy: { createdAt: 'desc' }
			})
		).map(({ users, id }) => ({ chatId: id, ...users.filter(({ id }) => id !== userId)[0] }))

		return chats
	}
	public async findOneChat(chatId: string) {
		const chat = await this.prismaService.chat.findUnique({
			where: { id: chatId },
			include: {
				users: {
					select: {
						avatarPath: true,
						name: true,
						email: true,
						id: true
					}
				},
				messages: {
					include: {
						user: {
							select: {
								avatarPath: true,
								name: true
							}
						}
					}
				}
			}
		})
		if (!chat) throw new NotFoundException('Chat not found!')
		return chat
	}

	public async findAllMessages(userId: string) {
		const messages = await this.prismaService.message.findMany({
			where: { userId }
		})
		return messages
	}

	public async findOne(id: number) {
		return `This action returns a #${id} chat`
	}

	public async update({ chatId, ...data }: UpdateChatDto, messageId: string) {
		await this.prismaService.message.update({
			data,
			where: { id: messageId }
		})
	}

	public remove = async (id: string) => this.prismaService.message.delete({ where: { id } })
}
