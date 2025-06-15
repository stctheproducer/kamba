# Local-First Architecture

## LiveStore Implementation

- Chat history is primarily managed in the browser using LiveStore
- The server SQLite database serves as a backup and synchronization source
- Changes should be applied to LiveStore first for immediate UI responsiveness

## Synchronization

- WebSocket connections handle real-time synchronization between client and server
- Implement proper authentication and authorization for WebSocket connections
- Handle conflict resolution according to the defined strategy

## Offline Capability

- Support viewing and interaction with existing chats when offline
- Queue changes made offline for synchronization when connection is restored
