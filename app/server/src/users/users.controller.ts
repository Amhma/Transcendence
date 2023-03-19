import { Controller,
	Get,
	Post,
	Body,
	Request,
	Put,
	Delete,
	Patch,
	Param,
	Res,
	UseInterceptors,
	NestInterceptor,
	UploadedFile,
	Query,
	HttpException,
	StreamableFile,
	BadGatewayException,
	BadRequestException,
	Inject,
	Injectable,
	UseGuards,
	ConsoleLogger,
	Req,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { IsNumberString } from 'class-validator';
import { diskStorage } from  'multer';
import { join } from  'path';
import { createReadStream } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express'
import { CreateUserDto, UpdateUserDto, UpdateUserDtoPass } from './User.dto'
import { UsersService } from './users.service'
import { Response } from "express";
import { Request as ExpressRequest } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service'
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RefreshJwtAuthGuard } from 'src/auth/refresh-jwt-auth.guard'
import { Intra42AuthGuard } from 'src/auth/intra42.guard';
import { numberFormat } from './User.dto'


@Controller('users')
export class UsersController {

	constructor(private userService: UsersService,) {}

	@Get()
	async getUsers() { // return all users
		return await this.userService.findUsers();
	}

	@UseGuards(LocalAuthGuard)
	@Get('login')
	async handleLogin(@Query() query: {login: string, password: string}) {
		return await this.userService.findOneUser(query.login)
	}

	@Get('intra')
	async getIntraUser(@Query() query: {intraLogin : string}) {
		return this.userService.findOneIntraUser(query.intraLogin)
	}

	/*@UseGuards(JwtAuthGuard)
	@Get(':login')
	async getUsersbyId(
		@Param('login') login: string
	) {
		return await this.userService.findOneUser(login);
	}*/

//	====================== POST AND GET AVATAR ===================
	@UseGuards(JwtAuthGuard)
	@Post(':login/avatar')
	@UseInterceptors(FileInterceptor('file', {
	storage: diskStorage({
		destination: './src/avatar',
		filename: (req, file, cb) => {
			return cb(null, req.params.login + ".jpeg");
			},
		}),
	}))
	async checkAvatar(@Request() req: any, @UploadedFile() file: Express.Multer.File){
		return this.userService.updateAvatar(req.user.login , file.filename);
	}

	@UseGuards(JwtAuthGuard)
	@Get('avatar/:login')
	async getFile(@Param('login') login : string, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
		try {
			const user = await this.userService.findOneUser(login);
			if (!user) {
				throw new BadRequestException;
			}
			const file = createReadStream(join('./src/avatar/', user.avatar));
			return new StreamableFile(file);
		} catch (error){
			throw new BadRequestException;
		}
	}
//	====================== ^^^^^^^^^^^^^^^^^^^^^^^^^^^ ===================

//	======================= Profile  ================================

	@UseGuards(JwtAuthGuard)
	@Post('profile/pass')
	async changePassword(
		@Request() req: any,
		@Body() updateUserPass: UpdateUserDtoPass
	) {
		return this.userService.updatePass(req.user.login, updateUserPass);
	}



	@UseGuards(JwtAuthGuard)
	@Get('profile/auth')
	async getProfileAuth(@Request() req: any) {
		return this.userService.getProfileAuth(parseInt(req.user.sub))
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile/info')
	async getProfileInfo(@Request() req: any) {
		return this.userService.getProfileInfo(parseInt(req.user.sub))
	}

//	=========================^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^===============

//	=========================================OAuth2=======================


	@UseGuards(JwtAuthGuard)
	@Put(':login')
	async updateUserById(
		@Param('login') login: string,
		@Body() updateUserDto: UpdateUserDto
	) {
		await this.userService.updateUser(login, updateUserDto);
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':login')
	async updatePatchUserById(
		@Param('login') login: string,
		@Body() updateUserDto: UpdateUserDto
	) {
		await this.userService.updateUser(login, updateUserDto);
	}

/*	@UseGuards(JwtAuthGuard)
	@Delete(':login')
	async deleteByID(
		@Param('login') login: string
	) {
		await this.userService.deleteUser(login);
	}*/

	//================== ROOMS =================

	@Get('rooms/:login')
	async getRooms(
		@Param('login') login: string
	) {
		return this.userService.findAllUserRooms(login)
	}
}
