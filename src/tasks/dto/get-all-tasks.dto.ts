import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/pagination/pagination.dto'

export const EnumActivitySort = {
	COMPLETED: 'COMPLETED',
	ACTIVE: 'ACTIVE',
	ALL: 'ALL'
} as const
export type EnumActivitySort = (typeof EnumActivitySort)[keyof typeof EnumActivitySort]

export const EnumDueDateSort = {
	OLDEST: 'OLDEST',
	NEWEST: 'NEWEST'
} as const
export type EnumDueDateSort = (typeof EnumDueDateSort)[keyof typeof EnumDueDateSort]

export class GetAllTasksDto extends PaginationDto {
	@IsOptional()
	@IsEnum(EnumActivitySort)
	sort?: EnumActivitySort

	@IsOptional()
	@IsString()
	searchTerm?: string

	@IsOptional()
	@IsEnum(EnumDueDateSort)
	dueDate?: EnumDueDateSort
}

/* const queryParameters = {
  sort: 'HIGH_PRICE',          // EnumActivitySort
  searchTerm: 'Witcher',       // Поиск по ключевому слову
  genres: ['RPG', 'Action'],   // Фильтрация по жанрам
  platforms: ['PC', 'PlayStation'],  // Фильтрация по платформам
  rating: '9',             // Фильтрация по рейтингу 9 или больше
  minPrice: '20',              // Минимальная цена
  maxPrice: '60',              // Максимальная цена
  isAdultOnly: true,           // Фильтрация по возрастному рейтингу 18+
  page: 1,                     // Пагинация: номер страницы
  perPage: 10                  // Пагинация: количество элементов на странице
}; */
