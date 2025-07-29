import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { genChats } from './chats.seed'
import { TASKS } from './tasks.seed'
import { genUsers } from './user.seed'

const prisma = new PrismaClient()

async function main() {
	console.log('🕒 Начало заполнения базы данных...')

	const userId = await genUsers(prisma)

	console.log('🕒 Создание чатов...')
	await genChats(prisma)

	console.log('🕒 Начало создание задач...')
	const tasksLength = await prisma.task.count()

	if (tasksLength < 10) {
		await prisma.task.createMany({
			data: TASKS(userId, faker)
		})
	} else console.warn('⚠️ Задачи уже созданы')

	console.log('✅ Задачи созданы')
}

main()
	.catch(e => {
		console.error('🛑 Ошибка при заполнении базы данных:', e)
		process.exit(1)
	})
	.then(() => {
		console.log('✅ Заполнение базы данных завершено успешно.')
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
