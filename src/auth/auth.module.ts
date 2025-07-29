import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { getJwtConfig } from './../config/jwt.config'
import { EmailModule } from './../email/email.module'
import { PrismaService } from './../prisma.service'
import { UserModule } from './../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RefreshTokenService } from './refresh-token.service'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		}),
		UserModule,
		EmailModule
	],
	controllers: [AuthController],
	providers: [RefreshTokenService, PrismaService, JwtStrategy, AuthService]
})
export class AuthModule {}
