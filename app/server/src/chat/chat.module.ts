import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { RoomsController } from "./rooms/rooms.controller";
import { RoomsService } from "./rooms/rooms.service";
import { UsersService } from "src/users/users.service";
import { GameService } from "src/game/game.service";
import { ChatGateway } from "./chat.gateway";
import { MessageService } from "./messages/messages.service";
import { MessageController } from "./messages/messages.controller";
import { FriendsController } from "./friends/friends.controller";
import { FriendsService } from "./friends/friends.service";

@Module({
	imports: [PrismaModule],
	controllers: [RoomsController, MessageController, FriendsController],
	providers: [UsersService, RoomsService, GameService, MessageService, FriendsService]
})
export class ChatModule {}

