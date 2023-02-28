import * as React from 'react'
import Swipeable from '/src/pong/component/Swipeable'
import { Typography, Button, Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Link } from "react-router-dom"
import './MainPage.css'

const titleStyle = {
	'@media (max-width:200px)': {
		mt: '6px',
		fontSize: '16vw;',
	},
	'@media (min-width:200px) and (max-width:600px)': {
		fontSize: '19vw;',
	},
	fontSize: '18vw;',
	fontWeight: '700',
	textAlign: 'left',
}

const buttonContactStyle = {
	'@media (max-width:600px)': {
		display: 'none',
	},
	fontSize: '1.2vw;',
	borderRadius: 14,
	flexWrap: 'wrap',
	px: 0,

}

const gridButton = {
	justifyContent: 'center',
	pt: 1
}

const MainPage = () => {

	return <>
		<Grid container display='flex' spacing={0}>
			<Grid item xs={8}>
				<Typography variant='h1' sx={titleStyle}>Pong</Typography>
			</Grid>
			<Grid item xs={4}>
				<Grid container display='flex'>
					<Grid item xs={4} sx={gridButton}>
						<Button
							color='primary'
							sx={buttonContactStyle}
							className="contactButton"
							size='small'
							variant="text"
							fullWidth
						>
							<Typography
								variant='button'
								sx={{fontSize: '1.5vw;', ml: 0}}
							>
							About us
							</Typography>
						</Button>
					</Grid>
					<Grid item xs={4} sx={gridButton}>
						<Button
							color='primary'
							sx={buttonContactStyle}
							size='small'
							className="contactButton"
							variant="text"
							fullWidth
						>
							<Typography
								variant='button'
								sx={{fontSize: '1.5vw;', ml: 0}}
							>
							Contact
							</Typography>
						</Button>
					</Grid>
					<Grid item xs={4}>
						<Swipeable
							login={false}
							sx={{justifyContent: 'center', pl: '4vw;'}}/>
					</Grid>
				</Grid> 
			</Grid>
		</Grid>
		<Box sx={{position: 'absolute', bottom: '4rem', right: '5rem'}}>
			<Button
				component={Link}
				to="/login"
				variant='contained'
				color='primary'
				className='loginButton'
				sx={{
					'@media (max-height:215px)': {
						display: 'none',
					},
					fontSize: '2vw;',
					borderRadius: 14,
					pt: 0.4,
					pb: 0.2,
					px: 'center',
				}}
			>
				LOGIN / SIGNUP
			</Button>
		</Box>
	</>
}
export default MainPage;
