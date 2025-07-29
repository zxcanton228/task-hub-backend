import { Controller, Get } from '@nestjs/common'
import { Role } from '@prisma/client'
import { Auth } from './../auth/decorators/auth.decorator'
import { CurrentUser } from './../auth/decorators/user.decorator'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Auth()
	@Get('profile')
	public async getProfile(@CurrentUser('id') id: string) {
		return this.userService.getById(id)
	}

	@Auth(Role.PREMIUM)
	@Get('premium')
	public async getPremium() {
		return { text: 'Premium content' }
	}
}
