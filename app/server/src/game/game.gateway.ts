import { 	SubscribeMessage,
			WebSocketGateway,
			WebSocketServer,
			OnGatewayConnection,
			OnGatewayDisconnect
								} from "@nestjs/websockets";
import { stringify } from "querystring";
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service'
import { ClientPayload, RoomInfo, GamePatron, gamePatron, Status, Player } from './game.types'
import { GameAlgo } from "./game.algo";
import { Injectable, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { jwtConstants } from "src/auth/constants";
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
@WebSocketGateway({ namespace: 'gameTransaction' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor (
		private readonly gameService: GameService,
		private jwtService: JwtService
	) {}

	@WebSocketServer()
	server: Server

	gameMap = new Map<string, GameAlgo>();

	@SubscribeMessage('automatikMatchMaking')
	async matchMaker(client: Socket, clientPayload: ClientPayload) {
		let gameToJoin: GameAlgo | undefined;

		this.gameMap.forEach((game) => {
			if (game.getStatus() === Status.ONE_PLAYER) {
				gameToJoin = game;
				return;
			}
		});

		if (gameToJoin) {
			// La première partie avec un statut 'ONE_PLAYER' a été trouvée et peut être utilisée ici
			client.join(gameToJoin.roomID);
			gameToJoin.initPlayer2({
				id: parseInt( clientPayload.id ),
				login: clientPayload.login,
				socketID: client.id,
				playerRole: "p2",
				playerSocket: client
			});
			this.server.to(client.id).emit('lockAndLoaded')
		} else {
		  // no waiting games with one player so we create one
		  	const newGameDB = await this.gameService.registerNewGame('WAIT');
			if (newGameDB) {
				client.join(newGameDB.game_id.toString());
				const newGameAlgo: GameAlgo = new GameAlgo(this.gameService, this.server, newGameDB.game_id.toString());
				this.gameMap.set( newGameDB.game_id.toString(), newGameAlgo);
				newGameAlgo.initPlayer1({
					id: parseInt( clientPayload.id ),
					login: clientPayload.login,
					socketID: client.id,
					playerRole: "p1",
					playerSocket: client
				});
				this.server.to(client.id).emit('lockAndLoaded')
			}
		}
		if (gameToJoin && gameToJoin.getStatus() === Status.TWO_PLAYER)
		{
			gameToJoin.startGame();
			this.runingGamesList();
		}
	}

	@SubscribeMessage('getRuningGames')
	async runingGamesList() {
		const keysTable: string[] = [];

		const assignKeysToTable = () => {
			// Parcours de chaque noeud de la Map
			for (let [key, value] of this.gameMap) {
				if (value.getStatus() === Status.RUNNING)
					keysTable.push(key);
			}
		}

		assignKeysToTable();
		this.server.emit('updateRuningGames', keysTable);
	}

	@SubscribeMessage('watchGame')
	async addWatcherToGame(client: Socket, gameId: string) {
		const temp = this.gameMap.get(gameId);

		if (temp && temp.getStatus() === Status.RUNNING)
			temp.addWatcherSocketID(client.id)
		/**
		 * here the client send the gameID (button on wich he clicked) we check if the game existe and is RUNNING
		 * if yes, we add the clientid to the watcher list so gameAlgo class will send him the gameData stuff too
		 */
	}






	async handleConnection(client: Socket, ...args: any[]) {
		if (client.handshake.auth.token && jwtConstants.jwt_secret) {
			try {
				const clientPayload = jwt.verify(client.handshake.auth.token, jwtConstants.jwt_secret);

				this.gameMap.forEach((game, roomID) => {

					if (game.getStatus() === Status.RUNNING) {
						if (clientPayload.sub && clientPayload.sub == game.getPlayerID(1)) { // player1
							client.join(roomID);
							game.playerChangeSocket(client, client.id, 1);
							this.server.to(client.id).emit('lockAndLoaded')
						}
						else if (clientPayload.sub && clientPayload.sub == game.getPlayerID(2)) { // player2
							client.join(roomID);
							game.playerChangeSocket(client, client.id, 2);
							this.server.to(client.id).emit('lockAndLoaded')
						}
						return;
						// console.log(`---> ICI: ${Status.RUNNING} = ${game.getStatus()} | ${clientPayload.sub} === ${game.getPlayerID(0)} | ${clientPayload.sub} === ${game.getPlayerID(1)}`);
					}
				})

			} catch (err) {
				console.error("IN HANDLE CONNECTION: token is broke ->" + err);
				console.log(`Client connected, token is : ${client.handshake.auth.token}`);
				client.disconnect(true);
			}
		}
	}



	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}
}
