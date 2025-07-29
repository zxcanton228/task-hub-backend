import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { CookieOptions, Response } from 'express'
import { isDev } from './../utils/is-dev.util'

@Injectable()
export class RefreshTokenService {
	constructor(private readonly configService: ConfigService) {}
	readonly EXPIRE_DAY_REFRESH_TOKEN = 1
	readonly REFRESH_TOKEN_NAME = 'refreshToken'

	private readonly DOMAIN = () => this.configService.get<string>('DOMAIN')
	private readonly _TOKEN_SETTINGS = (expires = new Date(0)): CookieOptions => ({
		sameSite: isDev(this.configService) ? 'none' : 'lax',
		domain: this.DOMAIN(),
		httpOnly: true,
		secure: true,
		expires
	})
	public addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expires = new Date()
		expires.setDate(expires.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, this._TOKEN_SETTINGS(expires))
	}

	public removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', this._TOKEN_SETTINGS())
	}
}
