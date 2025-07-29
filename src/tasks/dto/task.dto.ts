import { IsHexColor, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateTaskDto {
	@IsString()
	title: string

	@IsNumber()
	@IsOptional()
	status: number

	@IsHexColor()
	@IsOptional()
	color: string
}
export class UpdateTaskDto {
	@IsString()
	@IsOptional()
	title: string

	@IsNumber()
	@IsOptional()
	status: number

	@IsString()
	@IsOptional()
	dueDate: string

	@IsHexColor()
	@IsOptional()
	color: string
}
