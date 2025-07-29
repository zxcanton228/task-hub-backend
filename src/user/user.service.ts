import { Injectable, NotFoundException } from '@nestjs/common'
import type { User } from '@prisma/client'
import { hash } from 'argon2'
import { AuthDto } from './../auth/dto/auth.dto'

import { PrismaService } from './../prisma.service'
import { UserWithoutPassword } from './user.types'

const userOmitPassword = {
	name: true,
	email: true,
	id: true,
	password: false
}

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	public async getUsers(): Promise<Pick<User, 'name' | 'email' | 'id'>[]> {
		return this.prisma.user.findMany({
			select: userOmitPassword
		})
	}

	public async getById(id: string): Promise<UserWithoutPassword> {
		const user = await this.prisma.user.findUnique({
			where: {
				id
			},
			select: {
				...userOmitPassword,
				avatarPath: true,
				verificationToken: true,
				rights: true
			}
		})

		if (!user) throw new NotFoundException('User not found')
		return user
	}

	public async getByEmail(email: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: {
				email
			}
		})
	}

	public async create(dto: AuthDto): Promise<User> {
		return this.prisma.user.create({
			data: {
				...dto,
				password: await hash(dto.password)
			}
		})
	}

	public async update(id: string, data: Partial<User>): Promise<User> {
		return this.prisma.user.update({
			where: {
				id
			},
			data
		})
	}
}
