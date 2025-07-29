import { Logger, RequestMethod } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as compression from 'compression'
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { PrismaService } from './prisma.service'
import { corsConfig } from './utils/cors-config'
import { EmojiLogger, listenerColorize } from './utils/logger-emoj.logger'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: new EmojiLogger()
	})

	const prismaService = app.get(PrismaService)
	await prismaService.enableShutdownHooks(app)

	const logger = new Logger(),
		config = app.get(ConfigService),
		port = config.get<number>('PORT') ?? 4200,
		client = config.get<string>('CLIENT_URL') || 'http://localhost:3000'

	app.setGlobalPrefix('api', {
		exclude: [{ path: 'verify-email', method: RequestMethod.GET }]
	})

	app.use(cookieParser())
	app.use(helmet())
	app.use(compression())

	app.enableCors(corsConfig(client))

	await app.listen(port, () => {
		logger.log(listenerColorize(`🚀 Server running on port ${port}`))
	})
}

bootstrap()
