import {
	Grid,
	Switch,
	FormControlLabel,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	createTheme,
	ThemeProvider,
	Typography,
	FormControl,
	TextField,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState, useEffect, useRef } from 'react'
import { useFetchAuth } from '/src/pong/context/useAuth'
import { FetchApi, Api } from '/src/pong/component/FetchApi'

/*const theme = createTheme({
	typography: {
		fontFamily: ['system-ui', 'sans-serif'].join(','),
	},
	});*/


const TFAComponent = () => {

	const [check, setCheck] = useState(false)
	const [isActivate, setIsActivate] = useState('Disable')

	const auth = useFetchAuth()

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		await setCheck(e.target.checked)
		if (e.target.checked) {
			await FetchApi({
				api: {
					input: `http://${import.meta.env.VITE_SITE}/api/2fa/turn-on`
				},
					auth: auth
			})
		} else {
			await FetchApi({
				api: {
					input: `http://${import.meta.env.VITE_SITE}/api/2fa/turn-off`
				},
					auth: auth
			})
		}
		setIsActivate(!e.target.checked === true ? 'Disable' : 'Enable')
	}

	useEffect(() => {
		async function fetching() {
			try {
				const response: Api = await FetchApi({
					api: {
						input: `http://${import.meta.env.VITE_SITE}/api/2fa/activate`
					},
						auth: auth
				})
				setCheck(response.data['isTfaActivate'] ? true : false)
				setIsActivate(!response.data['isTfaActivate'] ? 'Disable' : 'Enable')
			} catch(err) {
				console.log(err)
			}
		}
		fetching()
	}, [])


	return <>
			<Accordion elevation={0}>
				 <AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography
						fontSize={{
							xl: '0.9rem',
							lg: '0.7rem',
							md: '0.6rem',
							mmd: '0.7rem',
							sm: '0.7rem',
							xs: '0.7rem'
						}}
					>
						Two-Factor Authentification
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<FormControlLabel
						sx={{
							mr: 0,
							ml: 0,
							display:'flex',
							alignText: 'left'
						}}
						control={<Switch checked={check} onChange={handleChange}/>}
						label={
							<Typography
								fontFamily={'"system-ui", sans-serif'}
								fontSize={{
									xl: '1rem',
									lg: '0.9rem',
									md: '0.8rem',
									mmd: '0.8rem',
									sm: '0.8rem',
									xs: '0.8rem'
								}}
							>
								{isActivate}
							</Typography>
						}
					/>
				</AccordionDetails>
			</Accordion>
	</>

}

const ChangeInfo = () => {

	const [error, setError] = useState('');

	const username = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	const password = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	return <>
		<FormControl>
			<TextField
				type="password"
				id="outlined-password-input"
				inputRef={password}
				variant="outlined"
				label="New Password"
				size="small"
				sx={{p: 1 }}
			></TextField>
			<TextField
				type="password"
				id="outlined-password-input"
				inputRef={password}
				variant="outlined"
				label="Confirm Password"
				size="small"
				sx={{p: 1 }}
			></TextField>

			{error === '' ? null : <Typography align="center" color="tomato">{error}</Typography> }
		</FormControl>
	</>

}



const UserPanelGrid = () => {


	return <>

		<Grid item xl={4} md={5} xs={12}
			sx={{
				mx: 0,
				border: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				'@media (max-width: 950px)': {
					display: 'block'
				}
			}}
		
		>
			<TFAComponent />
		</Grid>
		<Grid item xl={8} md={7} xs={12}
			sx={{
				p: '1vw;',
				border: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<ChangeInfo/>
		</Grid>
	</>

}

export default UserPanelGrid;
