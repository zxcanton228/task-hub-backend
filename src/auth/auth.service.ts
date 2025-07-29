import { UserWithoutPassword } from '@/user/user.types'
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Role, type User } from '@prisma/client'
import { verify } from 'argon2'
import { EmailService } from './../email/email.service'
import { PrismaService } from './../prisma.service'
import { UserService } from './../user/user.service'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService,
		private readonly emailService: EmailService,
		private readonly userService: UserService,
		private readonly prisma: PrismaService,
		private readonly jwt: JwtService
	) {}

	private SERVER_URL = () => this.configService.get<string>('SERVER_URL')

	private readonly TOKEN_EXPIRATION_ACCESS = '1h'
	private readonly TOKEN_EXPIRATION_REFRESH = '7d'

	public async login(dto: AuthDto) {
		const user = await this._validateUser(dto)
		return await this.buildResponseObject(user)
	}

	public async register(dto: AuthDto) {
		const userExists = await this.userService.getByEmail(dto.email)

		if (userExists) throw new BadRequestException('User already exists')

		const user = await this.userService.create(dto)

		await this.emailService.sendVerification(
			user.email,
			`${this.SERVER_URL}/verify-email?token=${user.verificationToken}`
		)

		return this.buildResponseObject(user)
	}

	public async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const user = await this.userService.getById(result.id)

		return await this.buildResponseObject(user)
	}

	public async verifyEmail(token: string): Promise<string> {
		const user = await this.prisma.user.findFirst({
			where: {
				verificationToken: token
			}
		})

		if (!user) throw new NotFoundException('Token not exists!')

		await this.userService.update(user.id, {
			verificationToken: null
		})

		return 'Email verified!'
	}

	public async buildResponseObject(user: UserWithoutPassword) {
		const tokens = await this._issueTokens(user.id, user.rights)
		return { user, ...tokens }
	}

	private async _issueTokens(userId: string, rights: Role[]) {
		const payload = { id: userId, rights }
		const accessToken = this.jwt.sign(payload, {
			expiresIn: this.TOKEN_EXPIRATION_ACCESS
		})
		const refreshToken = this.jwt.sign(payload, {
			expiresIn: this.TOKEN_EXPIRATION_REFRESH
		})
		return { accessToken, refreshToken }
	}

	private async _validateUser(dto: AuthDto): Promise<User> {
		const user = await this.userService.getByEmail(dto.email)
		if (!user) throw new UnauthorizedException('Email or password invalid')

		const isValid = await verify(user.password, dto.password)
		if (!isValid) throw new UnauthorizedException('Email or password invalid')

		return user
	}
}
