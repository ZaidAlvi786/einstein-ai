import { configureStore } from "@reduxjs/toolkit";
import { chatApi } from "./features/chat/chatApi";
import { workspaceApi } from "./features/workspace/workspaceApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { workspaceReducer } from "./features/workspace/workspaceSlice";
import { chatReducer } from "./features/chat/chatSlice";
import { paymentApi } from './features/payment/paymentApi';
import { groupReducer } from "./features/chat/groupSlice";
import webSocketReducer from "./features/socket/socketSlice";
import { sharedChatsReducer } from "./features/sharedChats/sharedChatsSlice";
import { sidebarResizeReducer } from "./features/SidebarResize/ResizeSlice";
import { AdminApi } from "./features/admin/adminApi";

export const store = configureStore({
  reducer: {
    [chatApi.reducerPath]: chatApi.reducer,
    [workspaceApi.reducerPath]: workspaceApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [AdminApi.reducerPath]: AdminApi.reducer,
    workspace: workspaceReducer,
    chat: chatReducer,
    group: groupReducer,
    webSocket: webSocketReducer,
    sheredChats: sharedChatsReducer,
    sidebarResize: sidebarResizeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      chatApi.middleware,
      workspaceApi.middleware,
      paymentApi.middleware,
      AdminApi.middleware
    ),
});

setupListeners(store.dispatch);
