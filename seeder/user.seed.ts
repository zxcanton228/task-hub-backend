import { faker } from '@faker-js/faker'
import { Prisma, PrismaClient } from '@prisma/client'
import { hash } from 'argon2'
import { NEED_WARNING, USERS_COUNT } from './seeder.data'
import { randomElement } from './tasks.seed'

const AVATARS = ['alya1', 'alya2', 'alya3']

const findTestUser = async (prisma: PrismaClient): Promise<string | null> => {
	try {
		const user = await prisma.user.findFirst({
			where: {
				email: 'test@test.ru'
			}
		})
		return user.id
	} catch {
		return null
	}
}

export async function genUsers(prisma: PrismaClient): Promise<string> {
	const usersCount = await prisma.user.count()
	if (usersCount < 1 && NEED_WARNING) {
		console.warn('⚠️ Пользователи уже созданы!')
		return
	}

	const userId = await findTestUser(prisma)
	const USERS: Prisma.UserCreateInput[] = []

	if (!userId) {
		USERS.push({
			password: await hash('123456'),
			email: 'test@test.ru',
			name: 'Test user'
		})
	}

	for (let i: number = 0; i < USERS_COUNT; i++) {
		USERS.push({
			avatarPath: `/uploads/avatars/${randomElement(AVATARS)}.jpg`,
			password: await hash('123456'),
			email: faker.internet.email(),
			name: faker.person.fullName()
		})
	}

	await prisma.user.createMany({ data: USERS })

	return await findTestUser(prisma)
}
