import { PrismaClient } from '@prisma/client'

const uniquePairs = (array: Array<string>): Array<string[]> =>
	array.reduce(
		(acc, current, idx) => acc.concat(array.slice(idx + 1).map(other => [current, other])),
		[]
	)

export async function genChats(prisma: PrismaClient) {
	if (!!(await prisma.chat.count())) {
		console.warn('⚠️ Чаты уже созданы')
		return
	}

	const ids = []
	const users = await prisma.user.findMany({ select: { id: true } })

	for (const { id } of users) ids.push(id)

	const usersPairs = uniquePairs(ids)

	const promises = []

	for (const ids of usersPairs) {
		promises.push(
			prisma.chat.create({
				data: {
					users: { connect: ids.map(id => ({ id })) }
				}
			})
		)
	}

	await Promise.all(promises)
}
