import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { path } from 'app-root-path'
import { AuthModule } from './auth/auth.module'
import { ChatModule } from './chat/chat.module'
import { getGoogleRecaptchaConfig } from './config/google-recaptcha.config'
import { FiltersModule } from './filters/filters.module'
import { MediaModule } from './media/media.module'
import { TasksModule } from './tasks/tasks.module'
import { UserModule } from './user/user.module'
import { StatisticsModule } from './statistics/statistics.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getGoogleRecaptchaConfig,
			inject: [ConfigService]
		}),
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads'
		}),
		AuthModule,
		UserModule,
		TasksModule,
		FiltersModule,
		ChatModule,
		MediaModule,
		StatisticsModule
	]
})
export class AppModule {}
