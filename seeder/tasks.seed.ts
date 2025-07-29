import { getRandomNum } from '@/utils/get-random-num'
import { Faker } from '@faker-js/faker/.'
import { Icon } from '@prisma/client'
import { TASKS_COUNT } from './seeder.data'

export const randomElement = (arr: Array<unknown>) => arr[Math.floor(Math.random() * arr.length)]

function generateRandomDueDateCurrentYear() {
	const year = new Date().getFullYear()

	const month = Math.floor(Math.random() * 12)
	const daysInMonth = new Date(year, month + 1, 0).getDate()

	const day = Math.floor(Math.random() * daysInMonth) + 1
	const hour = Math.floor(Math.random() * 24)
	const minute = Math.floor(Math.random() * 60)

	return new Date(year, month, day, hour, minute)
}

const ICONS = Object.values(Icon)

export const TASKS = (userId: string, faker: Faker) => {
	const tasks = []

	for (const _ of Array.from({ length: TASKS_COUNT })) {
		tasks.push({
			title: faker.word.sample(),
			color: faker.color.rgb(),

			createdAt: generateRandomDueDateCurrentYear(),
			dueDate: faker.date.future(),
			status: getRandomNum(0, 100),

			userId: userId,
			icon: randomElement(ICONS)
		})
	}

	return tasks
}
