import { useEffect, useState, createContext } from 'react'
import io from 'socket.io-client'
import useAuth from '../context/useAuth'
import { Chat } from './Chat'
import { Message, Room } from './Chat.types'

export const socket = io.connect(`http://${import.meta.env.VITE_SITE}/chat`)

const initialUpdatesContext = {
	newDirectMessage: {},
	setNewDirectMessage: null,
	newRoomMessage: {},
	setNewRoomMessage: null,
	newRoom: {},
	setNewRoom: null,
	leavedRoom: {},
	setLeavedRoom: null
}

export const UpdatesContext = createContext(initialUpdatesContext)

export function ChatSocketProvider() { //the role of this component is to add event Listener to the socket on event to send news to the other component for them to update the UI

	const { id } = useAuth()

	const [newRoom, setNewRoom] = useState<Room>()

	const [leavedRoom, setLeavedRoom] = useState<number>()

	const [newRoomMessage, setNewRoomMessage] = useState<Message>()

	const [newDirectMessage, setNewDirectMessage] = useState<Message>()

	const updatesContext = {
		newDirectMessage: newDirectMessage,
		setNewDirectMessage: setNewDirectMessage,
		newRoomMessage: newRoomMessage,
		setNewRoomMessage: setNewRoomMessage,
		newRoom: newRoom,
		setNewRoom: setNewRoom,
		leavedRoom: leavedRoom,
		setLeavedRoom: setLeavedRoom
	}

	useEffect(() => {		//---ROOMS & MESSAGES--//

		socket.emit('join', id)

		function onRoomCreatedEvent(payload) {
			setNewRoom(payload)
		}

		socket.on('roomCreated', onRoomCreatedEvent)

		function onRoomJoinedEvent(payload) {
			console.log(`room ${payload} joined`)
			setNewRoom({ id: payload.room_id, name: payload.name, messages: payload.messages })
		}

		socket.on('roomJoined', onRoomJoinedEvent)

		function onRoomLeavedEvent(payload) {
			console.log(`leaving room ${payload.room_id}`)
			setLeavedRoom(payload.room_id)
		}

		socket.on('roomLeaved', onRoomLeavedEvent)

		function onRoomMessageEvent(newMessage) {
			console.log(`receive message: "${newMessage.content}" send by n:${newMessage.sender_id}`)
			setNewRoomMessage(newMessage)
		}

		socket.on('roomMessage', onRoomMessageEvent)

		function onDirectMessageEvent(newMessage) {
			setNewDirectMessage(newMessage)
		}

		socket.on('directMessage', onDirectMessageEvent)

		return () => {
			socket.off('roomCreated', onRoomCreatedEvent)
			socket.off('roomJoined', onRoomJoinedEvent)
			socket.off('roomLeaved', onRoomLeavedEvent)
			socket.off('roomMessage', onRoomMessageEvent)
		}

	}, [socket])

	return (
		<UpdatesContext.Provider value={updatesContext}>
			<Chat/>
		</UpdatesContext.Provider>
	)

}