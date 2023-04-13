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
	openWatch: boolean,
	setOpenWatch: React.Dispatch<React.SetStateAction<boolean>>,
	handleThereIsMatch: () => void,
}

export const Spectator = ({socket, thereIsMatch, handleThereIsMatch, openWatch, setOpenWatch}: WatchProps) => {
	const [gameList, setGameList] = React.useState<{game_id: string, p1:string, p2: string}[]>([]);
	const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

	function handleJoinGame(gameId: string) {
		// Implémentez cette fonction selon ce que vous voulez faire lorsque l'utilisateur clique sur un bouton.
		socket.emit('watchGame', gameId);
		if (!thereIsMatch)
			handleThereIsMatch()
	}

	socket.on('updateRuningGames', (runningGameList: any) => {
		console.log('jai du passer par la' + runningGameList);
		setGameList(runningGameList);
	})

	React.useEffect(() => {
		setGameList([])
		socket.emit("getRuningGames");
	}, [])

	const handleClose = () => {
		setOpenWatch(false)
	}

	return (
		<>
			<Dialog open={openWatch} onClose={handleClose}
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
							Watch Game
						</Typography>
					</Box>
				</DialogTitle>
				<DialogContent>
					<Divider variant="middle"/>
					{ !gameList?.length ?
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
									{gameList.map((gameId) => (
										<PlayersListItem
											key={+gameId.game_id}
											isActive={+gameId.game_id === selectedRowId}
											onClick={() => handleJoinGame(gameId.game_id)}
										>
											<Grid container
												sx={{width: '100%'}}
											>
												<Grid item display="flex" xs={5}
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
														{gameId.p1}
													</PlayersListItemText>
												</Grid>
												<Grid item xs={2}
													sx={{
														justifyContent: 'center',
														alignItems: 'center'
													}}
												>
													<Typography variant='h6'
														textAlign="center"
														sx={{
															position: 'relative',
															top: 5,
														}}
													>
														VS
													</Typography>
												</Grid>
												<Grid item display="flex" xs={5}
													sx={{
														justifyContent: 'center',
														alignItems: 'center'
													}}
												>
													<PlayersListItemText>
														{gameId.p2}
													</PlayersListItemText>
													<PlayersListItemAvatarRight>
														<FetchAvatar
															avatar=""
															sx={{
																height: '100%',
																width: '100%'
															}}
														/>
													</PlayersListItemAvatarRight>
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
