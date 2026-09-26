# Vynq Frontend and Backend Integration Guide

This document describes the REST integration completed for Vynq, the files involved, the request and state flows, and the remaining steps for adding Socket.IO on the frontend later.

## 1. Architecture Overview

Vynq has two applications:

- `Discord/client`: React, Vite, React Router, Redux Toolkit, Axios.
- `Discord/server`: Node.js, Express, MongoDB/Mongoose, JWT cookies, Redis, and Socket.IO.

The implemented REST flow is:

```text
React component
    -> dispatch(asyncThunk())
    -> Redux Toolkit thunk
    -> service module
    -> shared Axios instance
    -> Express route
    -> authentication middleware
    -> controller
    -> Mongoose model / MongoDB
    -> ApiResponse or error response
    -> Redux fulfilled/rejected state
    -> React component
```

The future realtime flow is intentionally prepared but not implemented on the client:

```text
Socket.IO event
    -> dispatch(addMessage/updateMessage/removeMessage)
    -> messageSlice
    -> React message list
```

The client does not currently import `socket.io-client`, create a socket connection, register a listener, or emit an event.

## 2. Important Terms

### API

An API is the HTTP contract between the frontend and backend. The frontend sends an HTTP method, URL, cookies, and optional body. The backend validates the request, performs the operation, and returns JSON.

### Axios instance

The shared Axios instance is in `Discord/client/src/config/api.js`. It centralizes the backend URL, cookie behavior, and response interceptor.

```js
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});
```

`baseURL` means service functions can call `/auth/login` instead of repeating the complete server URL.

`withCredentials: true` tells the browser to send and accept HTTP-only cookies in cross-origin requests. This is required for `accessToken` and `refreshToken`.

### HTTP-only cookie

An HTTP-only cookie is a browser cookie that JavaScript cannot read through `document.cookie`. The browser sends it automatically to the backend. This keeps JWT values out of `localStorage` and `sessionStorage`.

### Access token

The short-lived JWT used to authenticate normal REST requests and future Socket.IO handshakes. It is stored by the browser as the HTTP-only `accessToken` cookie.

### Refresh token

The longer-lived JWT used only to create a new access token after expiration. It is stored as the HTTP-only `refreshToken` cookie.

### Axios response interceptor

The interceptor runs after an Axios response. When a REST request returns `401`, it calls `/auth/refresh` once and retries the original request. `_retry` prevents an infinite loop, and `/auth/refresh` itself is excluded from retry logic.

### Redux store

The Redux store is the frontend's central state container. It now contains:

```text
auth      current user and authentication status
servers   server list, selected server, members, loading, error
channels  channel list, selected channel, loading, error
messages  messages, loading, error
```

### Slice

A Redux slice groups state, synchronous reducers, and asynchronous thunk results for one domain. For example, `messageSlice.js` owns the message list and the reducers that future Socket.IO handlers will dispatch.

### createAsyncThunk

`createAsyncThunk` wraps an asynchronous operation such as an API request. It automatically creates `pending`, `fulfilled`, and `rejected` lifecycle actions.

Example:

```js
dispatch(fetchMessages(channelId));
```

The thunk calls the service, then the slice stores the result or error.

### Service module

A service module contains HTTP calls only. It does not render UI and does not update Redux directly. Examples:

- `auth.service.js`
- `server.service.js`
- `channel.service.js`
- `message.service.js`

This keeps Axios details out of React components.

### Controller

An Express controller contains backend request logic. It reads `req.params`, `req.body`, `req.cookies`, and `req.user`, talks to Mongoose models, and sends the response.

### Middleware

Middleware runs between the request and controller. `authMiddleware` checks the access token, Redis blacklist, JWT, and user record before setting `req.user`.

### Mongoose model

A Mongoose model maps JavaScript operations to MongoDB collections. The main relationship is:

```text
User
  -> ServerMember
      -> Server
          -> Role
```

`ServerMember` is the source of truth for membership. A user does not need a redundant `user.server` relationship for authorization.

### ApiResponse

The backend success wrapper is:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success",
  "success": true
}
```

Client services unwrap `response.data.data` so Redux receives the useful data directly.

### ApiError

`ApiError` carries an HTTP status and message to the error middleware. The backend returns a consistent error shape:

```json
{
  "success": false,
  "message": "Readable error message",
  "errors": []
}
```

The client stores the backend message in Redux error state instead of exposing a raw Axios error object.

## 3. Authentication Implementation

### Frontend files

- `Discord/client/src/config/api.js`
- `Discord/client/src/services/auth.service.js`
- `Discord/client/src/features/authSlice.js`
- `Discord/client/src/pages/Login.jsx`
- `Discord/client/src/pages/Register.jsx`
- `Discord/client/src/routes/PrivateRoutes.jsx`
- `Discord/client/src/App.jsx`

### Authentication requests

| Purpose | Method | URL |
|---|---:|---|
| Register | `POST` | `/api/auth/register` |
| Login | `POST` | `/api/auth/login` |
| Current user | `GET` | `/api/auth/me` |
| Logout | `POST` | `/api/auth/logout` |
| Refresh access token | `POST` | `/api/auth/refresh` |
| Google login start | `GET` | `/api/auth/google` |

The frontend never stores either JWT in Web Storage.

### Login flow

```text
Login form
  -> dispatch(loginUserAsync(formData))
  -> auth.service.loginUser()
  -> POST /api/auth/login
  -> backend sets accessToken and refreshToken cookies
  -> thunk resolves with user
  -> auth.user and auth.isAuthenticated update
  -> navigate to /
```

The login page waits for `dispatch(...).unwrap()` before navigating. This avoids navigating before authentication has completed.

### Registration flow

The registration form creates `FormData` because an optional profile image can be uploaded:

```text
username
fullname
email
password
image (optional file)
```

The backend route uses `upload.single("image")`, so the frontend uses the same field name.

Successful registration also sets cookies. The frontend stores the returned user in `auth` and navigates to the workspace.

### Session restore

`App.jsx` dispatches `getMeAsync()` on startup. The backend reads the access cookie and returns the current user. While this request is pending, `PrivateRoutes` does not redirect prematurely.

### Logout flow

`logoutUserAsync()` calls `/api/auth/logout`. The backend places the current token values in Redis blacklist keys and clears both cookies. The Redux auth state is then cleared.

### Refresh flow

When a normal request returns `401`:

```text
REST request
  -> 401 response
  -> interceptor checks _retry
  -> POST /api/auth/refresh
  -> backend validates refreshToken cookie and Redis blacklist
  -> backend sets a new accessToken cookie
  -> original request is retried once
```

The refresh endpoint uses the same `JWT_SECRET_KEY` and Redis key convention as the active REST authentication middleware.

## 4. Server Integration

### Frontend files

- `Discord/client/src/services/server.service.js`
- `Discord/client/src/features/serverSlice.js`
- `Discord/client/src/components/layout/ServerRail.jsx`
- `Discord/client/src/components/creation/CreateModal.jsx`
- `Discord/client/src/components/layout/ChatLayout.jsx`

### Server state

```js
{
  servers: [],
  selectedServer: null,
  members: [],
  loading: false,
  error: null
}
```

`selectServer(serverId)` is the single selection action. The selected server remains available to every component through Redux.

### Server requests

| Purpose | Method | URL |
|---|---:|---|
| List current user's servers | `GET` | `/api/servers` |
| Create server | `POST` | `/api/servers` |
| Get server | `GET` | `/api/servers/:serverId` |
| Update server | `PATCH` | `/api/servers/:serverId` |
| Delete server | `DELETE` | `/api/servers/:serverId` |
| Get invite | `POST` | `/api/servers/:serverId/invite` |
| Join server | `POST` | `/api/servers/join/:inviteCode` |
| Leave server | `DELETE` | `/api/servers/:serverId/leave` |
| List members | `GET` | `/api/servers/:serverId/members` |
| Remove member | `DELETE` | `/api/servers/:serverId/members/:userId` |
| Update member roles | `PATCH` | `/api/servers/:serverId/members/:userId/roles` |

### Creating a server

The green plus button in `ServerRail` opens `CreateModal` with `kind="server"`. The form sends JSON through `createServerAsync`:

```json
{
  "name": "Design Club",
  "description": "A community for sharing design work"
}
```

The request uses the authenticated browser cookies. The server controller creates the server, owner and member roles, default channels, and the current user's `ServerMember` record. Only an authenticated user can create a server. On success, the new server is appended to `servers` and becomes `selectedServer`, which triggers the normal channel and member fetches.

The optional `icon` and `banner` upload fields remain supported by the backend route, but the current creation form sends name and description only.

The join route is declared before dynamic server routes and uses the explicit `/join/:inviteCode` pattern. It will not be treated as a server ID route.

### Server selection flow

```text
ServerRail click
  -> dispatch(selectServer(serverId))
  -> selectedServer changes
  -> ChatLayout effect runs
  -> fetchChannels(serverId)
  -> fetchServerMembers(serverId)
```

No socket room is joined by this flow.

## 5. Channel Integration

### Frontend files

- `Discord/client/src/services/channel.service.js`
- `Discord/client/src/features/channelSlice.js`
- `Discord/client/src/components/layout/ChannelSidebar.jsx`
- `Discord/client/src/components/creation/CreateModal.jsx`
- `Discord/client/src/components/layout/ChatLayout.jsx`

### Channel state

```js
{
  channels: [],
  selectedChannel: null,
  loading: false,
  error: null
}
```

`selectedChannel` is the single source of truth for the active channel. The channel ID is available as:

```js
const channelId = selectedChannel?._id || selectedChannel?.id;
```

### Channel requests

| Purpose | Method | URL |
|---|---:|---|
| List channels | `GET` | `/api/servers/:serverId/channels` |
| Create channel | `POST` | `/api/servers/:serverId/channels` |
| Get channel | `GET` | `/api/servers/:serverId/channels/:channelId` |
| Update channel | `PATCH` | `/api/servers/:serverId/channels/:channelId` |
| Delete channel | `DELETE` | `/api/servers/:serverId/channels/:channelId` |

### Creating a channel

The plus button beside `TEXT CHANNELS` or `VOICE CHANNELS` opens the same creation modal with the matching type preselected. The form sends:

```json
{
  "serverId": "<selected server id>",
  "name": "ideas",
  "type": "text"
}
```

The client service removes `serverId` from the JSON body and places it in the URL, so the backend receives `POST /api/servers/<serverId>/channels` with `{ "name": "ideas", "type": "text" }`. Valid channel types are `text` and `voice`.

The backend requires the user to be a member of the server and currently restricts channel creation to the server owner. On success, the new channel is appended to `channels` and becomes `selectedChannel`, so it appears immediately and the chat area switches to it. Failed requests remain in the channel slice error state and are shown in the modal.

When a server changes, the channel list is fetched. When a channel button is clicked, `selectChannel(channelId)` updates Redux. The chat area then fetches messages for that channel.

## 6. Message Integration

### Frontend files

- `Discord/client/src/services/message.service.js`
- `Discord/client/src/features/messageSlice.js`
- `Discord/client/src/components/layout/ChatArea.jsx`
- `Discord/client/src/components/chat/Message.jsx`

### Message state

```js
{
  messages: [],
  loading: false,
  error: null
}
```

### Message requests

| Purpose | Method | URL |
|---|---:|---|
| Create message | `POST` | `/api/channels/:channelId/messages` |
| List messages | `GET` | `/api/channels/:channelId/messages` |
| Get message | `GET` | `/api/channels/:channelId/messages/:messageId` |
| Update message | `PATCH` | `/api/channels/:channelId/messages/:messageId` |
| Delete message | `DELETE` | `/api/channels/:channelId/messages/:messageId` |

### Loading messages

```text
selectedChannel changes
  -> ChatArea effect reads channel ID
  -> dispatch(fetchMessages(channelId))
  -> GET /api/channels/:channelId/messages
  -> messageSlice replaces messages
  -> Message components render the list
```

### Sending messages

```text
Composer submit
  -> dispatch(sendMessage({ channelId, content }))
  -> POST /api/channels/:channelId/messages
  -> backend validates channel membership
  -> message saved in MongoDB
  -> populated message returned
  -> Redux adds the returned message
```

REST remains the database-writing source of truth. The frontend does not send messages through Socket.IO.

### Socket-ready reducers

The message slice exposes:

```js
addMessage(message)
updateMessage(message)
removeMessage(messageOrId)
```

Later, a Socket.IO adapter can translate events into these Redux actions:

```text
message:new      -> dispatch(addMessage(payload))
message:updated  -> dispatch(updateMessage(payload))
message:deleted  -> dispatch(removeMessage(payload))
```

That adapter should be added separately. It should not duplicate message persistence through the socket.

## 7. Backend Socket.IO Audit

The backend implementation is in:

- `Discord/server/src/socket/socket.js`
- `Discord/server/src/middlewares/soketAuth.middleware.js`
- `Discord/server/src/controllers/message.controller.js`

The current backend flow is:

```text
Socket.IO connection
  -> socket authentication middleware
  -> read accessToken from handshake cookie
  -> Redis blacklist check
  -> JWT verification
  -> user lookup
  -> socket.user assignment
  -> connection accepted
```

Channel authorization is performed when the client eventually emits `join-channel`:

```text
channel ID
  -> find channel
  -> read channel.server
  -> find ServerMember with server and socket.user._id
  -> socket joins channel:<channelId>
```

The room format is:

```text
channel:<channelId>
```

Message broadcasting already follows this backend flow:

```text
REST POST message
  -> save message in MongoDB
  -> populate author
  -> get Socket.IO instance
  -> emit message:new to channel:<channelId>
```

The frontend should later listen for `message:new` and dispatch `addMessage`, but that client code has intentionally not been added yet.

## 8. Backend Route Mounts

The main Express application is `Discord/server/src/app/app.js`.

| Mount | Responsibility |
|---|---|
| `/api/auth` | Authentication and session endpoints |
| `/api/servers` | Server, channel, and member endpoints |
| `/api/server` | Legacy singular server compatibility mount |
| `/api/serverMembers` | Legacy member compatibility mount |
| `/api/roles` | Role endpoints |
| `/api/user` | User profile endpoints |
| `/api/messages` | Legacy message compatibility mount |
| `/api/channels` | Frontend message endpoints |

## 9. Error Handling

The backend status codes have these meanings:

- `400`: invalid request data or invalid operation.
- `401`: no valid access token or expired authentication.
- `403`: authenticated but not authorized for the resource.
- `404`: resource does not exist.
- `409`: conflict, such as a duplicate unique value.
- `500`: unexpected backend failure.

The Axios interceptor handles `401` by attempting refresh. Other statuses are passed to the thunk, where the backend message is stored in Redux `error` state.

The UI can display a friendly message using state such as:

```js
const error = useSelector((state) => state.messages.error);
```

Raw server error objects should not be rendered directly.

## 10. How To Run

### Backend

```powershell
cd Discord/server
npm install
node server.js
```

The server listens on port `3000` by default.

Required runtime dependencies/configuration include:

- MongoDB connection settings.
- Redis connection settings.
- `JWT_SECRET_KEY`.
- ImageKit settings for uploaded files.
- Google OAuth settings if Google login is used.

### Frontend

```powershell
cd Discord/client
npm install
npm run dev
```

The Vite development server normally runs on `http://localhost:5173`.

The backend CORS configuration must allow that origin with credentials enabled.

## 11. Files Changed

### Frontend changed files

- `Discord/client/src/App.jsx`
- `Discord/client/src/app/store.js`
- `Discord/client/src/config/api.js`
- `Discord/client/src/features/authSlice.js`
- `Discord/client/src/features/serverSlice.js`
- `Discord/client/src/features/channelSlice.js`
- `Discord/client/src/features/messageSlice.js`
- `Discord/client/src/services/auth.service.js`
- `Discord/client/src/services/server.service.js`
- `Discord/client/src/services/channel.service.js`
- `Discord/client/src/services/message.service.js`
- `Discord/client/src/pages/Login.jsx`
- `Discord/client/src/pages/Register.jsx`
- `Discord/client/src/routes/PrivateRoutes.jsx`
- `Discord/client/src/components/layout/ChatLayout.jsx`
- `Discord/client/src/components/layout/ServerRail.jsx`
- `Discord/client/src/components/layout/ChannelSidebar.jsx`
- `Discord/client/src/components/creation/CreateModal.jsx`
- `Discord/client/src/components/layout/ChatArea.jsx`
- `Discord/client/src/components/chat/ChatHeader.jsx`
- `Discord/client/src/components/member/MemberSidebar.jsx`

### Backend changed files

- `Discord/server/src/app/app.js`
- `Discord/server/src/controllers/auth.controller.js`
- `Discord/server/src/controllers/server.controller.js`
- `Discord/server/src/controllers/channel.controller.js`
- `Discord/server/src/controllers/message.controller.js`
- `Discord/server/src/controllers/serverMember.controller.js`
- `Discord/server/src/middlewares/auth.middleware.js`
- `Discord/server/src/middlewares/soketAuth.middleware.js`
- `Discord/server/src/routes/auth.routes.js`
- `Discord/server/src/routes/server.route.js`
- `Discord/server/src/routes/channel.routes.js`
- `Discord/server/src/routes/message.routes.js`
- `Discord/server/src/routes/serverMember.routes.js`
- `Discord/server/src/socket/socket.js`

## 12. Verification Completed

- Client production build passes with `npm run build` from `Discord/client`.
- Backend source JavaScript passes `node --check`.
- Workspace static error check reports no errors.
- No `socket.io-client` import exists in frontend source.
- No frontend socket connection, listener, emitter, or room join exists.

## 13. Remaining Work Before Frontend Socket.IO Integration

1. Confirm MongoDB and Redis are running.
2. Confirm all backend environment variables are populated.
3. Start the backend and test authentication with real cookies.
4. Test server, channel, member, and message APIs with a real account.
5. Add a frontend Socket.IO adapter that uses the existing `auth.user`, `servers.selectedServer`, `channels.selectedChannel`, and message actions.
6. On channel selection, have that adapter join `channel:<channelId>` only after the existing REST selection flow is working.
7. On `message:new`, dispatch `addMessage` and avoid inserting the same message twice if REST and Socket.IO both deliver it.
