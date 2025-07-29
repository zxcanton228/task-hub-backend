import { Module } from '@nestjs/common'
import { UploadsController } from './media.controller'

@Module({
	controllers: [UploadsController]
})
export class MediaModule {}
