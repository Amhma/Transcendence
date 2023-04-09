export type JoinRoomData = {
    user_id: number;
    room_id: number;
    room_name: string;
};
export type LeaveRoomData = {
    user_id: number;
    user_login: string;
    room_id: number;
    room_name: string;
};
export type CreateRoomData = {
    name: string;
    password?: string;
    owner_id: number;
};
export type MessageData = {
    content: string;
    sender_id: number;
    time?: string;
    room?: {
        name: string;
        id: number;
    };
    recipient_id?: number;
};
export type AddFriendData = {
    user1_id: number;
    user2_id: number;
};
export type FriendRequestData = {
    user1_id: number;
    user2_id: number;
};