import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        historyChatData: [],
        activeChat: {},
        currentChatModal: "",
        chatRegenerate: {
            canRegenerate: false,
            isRegenerating: false
        },
        activeChatModel: {},
        last_unread_msg_index: {},
        current_chat_last_msg_index: null,
    },
    reducers: {
        setHistoryChatData: (state, action) => {
            state.historyChatData = action.payload;
        },
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
        },
        setCurrentChatModal: (state, action) => {
            state.currentChatModal = action.payload;
        },
        setChatRegenerate: (state, action) => {
            state.chatRegenerate = { ...action.payload };
        },
        setActiveChatModel: (state, action) => {
            state.activeChatModel = { ...action.payload };
        },
        setLastUnreadMsgIndex: (state, action) => {
            state.last_unread_msg_index = action.payload;
        },
        setCurrentChatLastMsgIndex: (state, action) => {
            state.current_chat_last_msg_index = action.payload;
        }
    }
});

export const { setHistoryChatData, unpinChat, setActiveChat, setCurrentChatModal, setChatRegenerate, setActivePlugin, setActiveChatModel, setLastUnreadMsgIndex, setCurrentChatLastMsgIndex } = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
