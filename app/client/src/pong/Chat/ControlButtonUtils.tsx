import { Button, IconButton, Box } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CopyrightIcon from '@mui/icons-material/Copyright';
import { styled } from '@mui/system'
import { useEffect, useState } from 'react';
import { User } from './Chat.types';
import useAuth, { useFetchAuth } from '../context/useAuth';
import { FetchApi } from '../component/FetchApi';
import FetchAvatar from '../component/FetchAvatar';
import { socket } from './Socket';

export enum UserListType {
	MEMBERS = 'members',
	BANNED = 'banned',
}

export const SettingsButtonWrapper = styled('div')({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '40px',
	width: '40px',
	borderRadius: '50%',
	marginRight: '2rem',
	backgroundColor: '#ffffff',
	flexShrink: 0,
	'&:hover': {
		backgroundColor: '#EDEDED',
	},
});

//--------------------members

export const UserListWrapper = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	backgroundColor: '#f2f2f2',
	boxSizing: 'border-box',
	height: '400px',
	overflowY: 'auto',
});

const UserListItemWrapper = styled('div')({
	padding: '8px 1rem',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	height: '56px',
	borderRadius: '8px',
	cursor: 'pointer',

	'&:hover': {
		backgroundColor: '#EDEDED',
	},
});

const UserListItemAvatar = styled('div')({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '40px',
	width: '40px',
	borderRadius: '50%',
	marginRight: '1rem',
	backgroundColor: '#ffffff',
	flexShrink: 0
});

const UserListItemText = styled('div')({
	flexGrow: 1,
	width: '100%',
});

const IconButtonWrapper = styled(IconButton)({
	marginLeft: '1rem'
})

export const UserListItem = ({ user, id, currentRoom, setMembers, members, setBannedUsers, bannedUsers, setAdminMembers, adminMembers }:
	{
		user: User,
		id: number,
		currentRoom: { id: number, name: string, ownerId: number },
		setMembers: (users: User[]) => void,
		members: User[],
		setBannedUsers: (users: User[]) => void,
		bannedUsers: User[],
		setAdminMembers: (users: User[]) => void,
		adminMembers: User[],

	}) => {

	if (id === user.id)
		return null

	const [isAdmin, setIsAdmin] = useState()

	const [isSendingRequest, setIsSendingRequest] = useState(false);
	const handleBanMemberClick = (member: User) => {
		setIsSendingRequest(true);

		const banData = {
			room_id: currentRoom.id,
			room_name: currentRoom.name,
			user_id: member.id
		}

		socket.emit('banMember', banData)

		setMembers(members.filter(user => user.id !== member.id))

		setIsSendingRequest(false);
	};

	const handleUpgradeMember = (member: User) => {
		setIsSendingRequest(true)

		const upgradeMemberData = {
			room_id: currentRoom.id,
			user_id: member.id
		}

		socket.emit('upgradeMember', upgradeMemberData, ((response: any) => console.log('upgradeMember response: ', response)))

		setAdminMembers([...adminMembers, member])

		setIsSendingRequest(false);
	}

	const handleDowngradeMember = (member: User) => {
		setIsSendingRequest(true)

		const upgradeMemberData = {
			room_id: currentRoom.id,
			user_id: member.id
		}

		socket.emit('downgradeMember', upgradeMemberData, ((response: any) => console.log('downgradeMember response: ', response)))

		setAdminMembers(adminMembers.filter(admin => admin.id !== member.id))

		setIsSendingRequest(false);
	}

	const handleKickMember = (member: User) => {
		const kickMemberData = {
			room_id: currentRoom.id,
			user_id: member.id
		}

		socket.emit('kickMember', kickMemberData, ((response: any) => console.log('kickMember response: ', response)))

		setMembers(members.filter(user => user.id !== member.id))
	}

	return (
		<UserListItemWrapper>
			<UserListItemAvatar>
				<FetchAvatar avatar={user.avatar} sx={{ height: '100%', width: '100%' }} />
				{/*{user.id} {currentRoom.id}*/}
			</UserListItemAvatar>
			<UserListItemText>{user.login}</UserListItemText>
			{
				id === currentRoom.ownerId ?

					(
						user.id !== currentRoom.ownerId ? (

							<Box sx={{ display: 'flex' }}>
								{adminMembers.find(admin => admin.id === user.id) ?
									<IconButtonWrapper onClick={() => handleDowngradeMember(user)} disabled={isSendingRequest}>

										<StarBorderIcon />
									</IconButtonWrapper>
									:
									<IconButtonWrapper onClick={() => handleUpgradeMember(user)} disabled={isSendingRequest}>

										<StarIcon />
									</IconButtonWrapper>
								}
								<IconButtonWrapper onClick={() => console.log('Mute')} disabled={isSendingRequest}>
									{/*<VolumeUpIcon />*/}
									<VolumeOffIcon />
								</IconButtonWrapper>

								<IconButtonWrapper onClick={() => handleBanMemberClick(user)} disabled={isSendingRequest}>
									{/*<CheckCircleOutlineIcon/>*/}
									<BlockIcon />

								</IconButtonWrapper>

								<IconButtonWrapper onClick={() => handleKickMember(user)} disabled={isSendingRequest}>
									<ExitToAppIcon />

								</IconButtonWrapper>
							</Box>
						)
							:
							<Box sx={{ display: 'flex' }}>
								<IconButtonWrapper onClick={() => console.log('Kick')} disabled={isSendingRequest}>
									<CopyrightIcon />
								</IconButtonWrapper>
							</Box>


					)

					:
					<Box sx={{ display: 'flex' }}>
						<IconButtonWrapper onClick={() => console.log('Kick')} disabled={isSendingRequest}>
							<CopyrightIcon />
						</IconButtonWrapper>
					</Box>

			}
		</UserListItemWrapper>
	);
};

export const BannedUserListItem = ({ user, id, currentRoom, onClick }: { user: User, id: number, currentRoom: { id: number, name: string, ownerId: number }, onClick: (id: number) => void }) => {

	if (id === user.id)
		return null

	const [isSendingRequest, setIsSendingRequest] = useState(false);
	const handleBanMemberClick = (member: User) => {
		setIsSendingRequest(true);

		const banData = {
			room_id: currentRoom.id,
			room_name: currentRoom.name,
			user_id: user.id
		}

		socket.emit('unbanMember', banData, (response: any) => {
			console.log('response unban: ', response)
		})

		onClick(user.id)

		setIsSendingRequest(false);
	};

	return (
		<UserListItemWrapper>
			<UserListItemAvatar>
				<FetchAvatar avatar={user.avatar} sx={{ height: '100%', width: '100%' }} />
			</UserListItemAvatar>
			<UserListItemText>{user.login}</UserListItemText>
			{
				<Box sx={{ display: 'flex' }}>
					<IconButtonWrapper onClick={() => handleBanMemberClick(user)} disabled={isSendingRequest}>
						<CheckCircleOutlineIcon />
					</IconButtonWrapper>
				</Box>

			}
		</UserListItemWrapper>
	);
};