import {
	Box,
	Grid,
	Typography,
	Button,
} from '@mui/material'
import useMediaQuery from "/src/pong/hooks/useMediaQuery"
import { useState } from 'react'
import * as React from 'react';
import { FetchApi, Api } from '/src/pong/component/FetchApi'
import useAuth, { useFetchAuth } from '/src/pong/context/useAuth'
import GppGoodIcon from '@mui/icons-material/GppGood'
import GppBadIcon from '@mui/icons-material/GppBad';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import TFAComponent from '/src/pong/Profile/TFAComponent'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import MatchHistory from '/src/pong/Profile/MatchHistory'


export type Level = {
	level: number,
	xp: number,
}

type MatchInfoProps = {
	defeat: number,
	victory: number,
	level: Level,
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 10,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: theme.palette.mode === 'light' ?  '#fef6dd' : 800,
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
		backgroundColor: theme.palette.mode === 'light' ? '#f7d46f' : '#308fe8',
		},
	})
);

const MatchInfo = (props: MatchInfoProps) => {

	const auth = useFetchAuth();
	const isQuery950 = useMediaQuery('(max-width: 950px) and (min-width: 550px)')
	const [open, setOpen] = useState(false)

	const handleClick = () => {
		setOpen(true)
	}

	return <>
		<Grid item display="grid" justifyContent="center" sm={4} xs={6}
			order={{sm: 1, xs: 2}}
			sx={{
				position: 'relative',
				height: '20rem',
				py: '1vw;',
				px: '2vw;',
//				border: 1
			}
		}>

			<Grid item xs={12}>
				<GppGoodIcon style={{color: '#293241'}} sx={{height: '10rem', width: '10rem'}}/>
			</Grid>

			<Grid item xs={12}>
				<Typography align="center" variant='h2'>
					{props.victory}
				</Typography>
			</Grid>
			
		</Grid>

		<Grid item sm={4} xs={12} order={{sm: 2, xs: 1}}
			sx={{
				position: 'relative',
				height: '20rem',
				py: '1vw;',
				px: '2vw;',
//				border: 1,
				'@media (max-width: 550px)': {
					top: '1rem',
				}
			}
		}>

			<Grid item xs={12} sx={{height: "50%"}}>

				<Grid item display="flex"
					justifyContent="center"
					alignItems="center"
					xs={12}
					sx={{height: "80%"}}
				>
					
					<Typography align="center"
						variant='h2'
						style={{color: '#213547'}}
					>
						{isQuery950 ? props.level.level : `lvl ${props.level.level}`}
					</Typography>
				</Grid>

				<Grid item xs={12}>
					<BorderLinearProgress variant="determinate" value={props.level.xp} />
				</Grid>

			</Grid>

			<Grid item display="flex"
				xs={12}
				justifyContent="center"
				alignItems="center"
				sx={{height: "50%"}}
			>
				<Button
					variant="contained"
					color="primary"
					onClick={handleClick}
					className="loginButton"
					style={{background: '#213547'}}
					sx={{
						fontSize: '2vw;',
						borderRadius: 14,
						pb: 0.2,
						px: 'center',
						'@media (max-width: 550px)': {
							fontSize: '1rem',
						},
						'@media (min-width: 1200px)': {
							fontSize: '1.7rem',
						}
					}}
				>
					Match History
				</Button> 
			</Grid>
		</Grid>
		<Grid item display="grid" justifyContent="center" sm={4} xs={6}
			order={{sm: 3, xs: 3}}
			sx={{
				position: 'relative',
				height: '20rem',
				py: '1vw;',
				px: '2vw;',
//				border: 1
			}
		}>
			<Grid item xs={12}>
				<GppBadIcon style={{color: '#cd384a'}} sx={{height: '10rem', width: '10rem'}}/>
			</Grid>
			<Grid item xs={12}>
				<Typography align="center" variant='h2'>
					{props.defeat}
				</Typography>
			</Grid>
			<MatchHistory open={open} setOpen={setOpen}/>
		</Grid>
	</>

}
export default MatchInfo
