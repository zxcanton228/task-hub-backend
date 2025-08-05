import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto'

import { Auth } from './../auth/decorators/auth.decorator'
import { CurrentUser } from './../auth/decorators/user.decorator'
import { GetAllTasksDto } from './dto/get-all-tasks.dto'
import { TasksService } from './tasks.service'

@Controller('tasks')
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post('create')
	create(@Body() data: CreateTaskDto, @CurrentUser('id') id: string) {
		return this.tasksService.create(data, id)
	}

	@Auth()
	@Get()
	async getAll(@Query() query: GetAllTasksDto) {
		const data = await this.tasksService.getAll(query)
		return data
	}
	@Auth()
	@Get('today')
	async getToday() {
		const data = await this.tasksService.getToday()
		return data
	}

	@Get(':id')
	@Auth()
	getOne(@Param('id') id: string) {
		return this.tasksService.getOne(id)
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@Put('edit/:id')
	update(@Param('id') id: string, @Body() data: UpdateTaskDto, @CurrentUser('id') userId: string) {
		return this.tasksService.update(id, data, userId)
	}

	@Auth()
	@Delete('delete/:id')
	remove(@Param('id') id: string) {
		return this.tasksService.remove(id)
	}
}
