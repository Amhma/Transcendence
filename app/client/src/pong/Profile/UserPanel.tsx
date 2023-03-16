import {
	Box,
	Grid,
	Typography,
	FormControl,
	TextField,
} from '@mui/material'


import { useState, useRef } from 'react'
import * as React from 'react';

import TFAComponent from '/src/pong/Profile/TFAComponent'

type InfoProps = {
	isAccordion: boolean,
	setIsAccordion: React.Dispatch<React.SetStateAction<boolean>>,
}

const ChangeInfo = (props: InfoProps) => {

	const [error, setError] = useState('');

	const username = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	const password = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	return <>
		<Box display={props.isAccordion ? 'flex' : 'block'}>
			<TextField
				type='text'
				id="outlined-password-input"
				inputRef={password}
				variant="outlined"
				label="New Password"
				size="small"
				sx={{p: 1 }}
			></TextField>
			<TextField
				type='text'
				id="outlined-password-input"
				inputRef={password}
				variant="outlined"
				label="Confirm Password"
				size="small"
				sx={{p: 1 }}
			></TextField>
			{error === '' ? null : <Typography align="center" color="tomato">{error}</Typography> }
		</Box>
	</>
}



const UserPanelGrid = () => {

	const [isAccordion, setIsAccordion] = useState<boolean>(false)

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
			<TFAComponent isAccordion={isAccordion} setIsAccordion={setIsAccordion}/>
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
			<ChangeInfo isAccordion={isAccordion} setIsAccordion={setIsAccordion}/>
		</Grid>
	</>
}

export default UserPanelGrid;
