import * as React from 'react'
import {useState} from 'react'
import { Typography, Box, Paper } from '@mui/material'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Button from "@mui/material/Button";
import Tab from '@mui/material/Tab'
import Swipeable from '../component/Swipeable'
import Profile from '../Profile/Profile'
import PropTypes from 'prop-types';
import { useFetchAuth } from '../context/useAuth'
import { FetchApi, Api, responseApi } from '../component/FetchApi'
import useAuth from '../context/useAuth'
import io, {Socket} from "socket.io-client";
import { render } from 'react-dom'
import Canvas from '../component/gameCanva'
import { draw } from '../component/gameCanva'
import { GameSocketProvider, UserContext } from '../services/GameSocketProvider'
import { styled } from '@mui/system';
import {
	Dialog,
	DialogTitle,
	FormControl,
	DialogContent,
	TextField,
	Divider,
	InputAdornment,
} from '@mui/material'
import {
	PlayersListWrapper,
	PlayersListItemAvatar,
} from '../Profile/SearchPlayers'
import FetchAvatar from './FetchAvatar'

interface PlayersListItemProps {
	isActive: boolean;
}

const PlayersListItem = styled('div')<PlayersListItemProps>(({ isActive }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '56px',
	margin: '4px',
	padding: '0 16px',
	borderRadius: '8px',
	cursor: 'pointer',
	backgroundColor: isActive ? '#EDEDED' : 'transparent',
	'&:hover': {
		backgroundColor: '#EDEDED',
	},
}));

const PlayersListItemAvatarRight = styled('div')({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '40px',
	width: '40px',
	borderRadius: '50%',
	marginLeft: '16px',
	backgroundColor: '#ffffff',
	flexShrink: 0
});

const PlayersListItemAvatarLeft = styled('div')({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '40px',
	width: '40px',
	borderRadius: '50%',
	marginRight: '16px',
	backgroundColor: '#ffffff',
	flexShrink: 0
});

const PlayersListItemText = styled('div')({
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	fontSize: '16px',
	fontWeight: '600',
	textAlign: 'center',
	'@media (max-width: 500px)': {
		display: 'none'
	}
});

type WatchProps = {
	socket: Socket,
	thereIsMatch: boolean,
	openFriends: boolean,
	setOpenFriends: React.Dispatch<React.SetStateAction<boolean>>,
	handleThereIsMatch: () => void,
}

export const GameFriends = ({socket, thereIsMatch, handleThereIsMatch, openFriends, setOpenFriends}: WatchProps) => {
	const [friendList, setFriendList] = React.useState<{game_id: string, playerWhoCreateAGame: string}[]>([
		{
			game_id: "2",
			playerWhoCreateAGame: "John",
		}
	]);
	const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

	function handleJoinGame(gameId: string) {
		// Implémentez cette fonction selon ce que vous voulez faire lorsque l'utilisateur clique sur un bouton.
		/* socket.emit('watchGame', gameId); */
		if (!thereIsMatch)
			handleThereIsMatch()
	}

	/*	SET NEW FRIEND SOCKET EVENT
	socket.on('updateRuningGames', (runningGameList: any) => {
		console.log('jai du passer par la' + friendGameList);
		setFriendList(friendGameList);
	}) */

	React.useEffect(() => {
		//		setFriendList([])
	/* EMIT A NEW FRIEND SOCKET EVENT
		socket.emit("getRuningGames");
	*/
	}, [])

	const handleClose = () => {
		setOpenFriends(false)
	}

	return (
		<>
			<Dialog open={openFriends} onClose={handleClose}
				fullWidth
				maxWidth="md"
				PaperProps={{
					style: {
						borderRadius: '32px',
						height: '30rem',
					}
				}}
			>
				<DialogTitle>
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						sx={{mt: 4, mb: 1}}
					>
						<Typography
							component={'span'}
							variant='h6'
							align="center"
							style={{color: '#213547'}}
						>
							Friends Game
						</Typography>
					</Box>
				</DialogTitle>
				<DialogContent>
					<Divider variant="middle"/>
					{ !friendList?.length ?
						(<>
						<Grid container
							display="flex"
							direction="column"
							justifyContent="center"
							alignItems="center"
							sx={{ width: '100%', height: '95%' }}
						>
							<Typography
								align="center"
								style={{color: '#aab7b8'}}
							>
								No Match Found
							</Typography>
						</Grid>
						</>) :
						(<>
							<Grid container sx={{height: '100%'}} >
								<PlayersListWrapper>
									{friendList.map((gameId) => (
										<PlayersListItem
											key={+gameId.game_id}
											isActive={+gameId.game_id === selectedRowId}
										>
											<Grid container
												sx={{width: '100%'}}
											>
												<Grid item display="flex" xs={4}
													sx={{
														justifyContent: 'center',
														alignItems: 'center'
													}}
												>
													<PlayersListItemAvatarLeft>
														<FetchAvatar
															avatar=""
															sx={{
																height: '100%',
																width: '100%'
															}}
														/>
													</PlayersListItemAvatarLeft>
													<PlayersListItemText>
														{gameId.playerWhoCreateAGame}
													</PlayersListItemText>
												</Grid>
												<Grid item xs={5}
													sx={{
														justifyContent: 'center',
														alignItems: 'center'
													}}
												>
													<Typography variant='body1'
														textAlign="center"
														sx={{
															position: 'relative',
															top: 8,
														}}
													>
														invited you
													</Typography>
												</Grid>
												<Grid item display="flex" xs={3}
													sx={{
														justifyContent: 'center',
														alignItems: 'center'
													}}
												>
													<Button
														variant="contained"
													onClick={() => handleJoinGame(gameId.game_id)}
														sx={{
															'&:hover': {
																backgroundColor: '#427094',
															}
														}}
													>
														Join
													</Button>
												</Grid>
											</Grid>
										</PlayersListItem>
									))}
								</PlayersListWrapper>
							</Grid>
						</>)
					}
				</DialogContent>
			</Dialog>
		</>
	);
}
// export default Spectator;