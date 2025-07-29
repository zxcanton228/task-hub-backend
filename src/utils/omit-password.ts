import { User } from '@prisma/client'

export function omitPassword({ password, ...user }: User): Omit<User, 'password'> {
	return user
}
