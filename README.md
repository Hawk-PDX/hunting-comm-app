# PDXplore
**Stay Safe, Stay Connected. Never Stop Exploring.**

Under construction:
Open to collaboration opportunities... Designer, DevOps, etc. 
Hoping to ship a final product by September, 2026.
Contact me with any questions/concerns, [garrett@rosecitydev.tech](garrett@rosecitydev.tech).

## Overview

A React Native mobile application built with Expo, this tool is designed for hunters to share GPS locations and communicate in remote areas where network coverage is unreliable. The app emphasizes user safety through real-time coordination and an offline-first design, directly addressing the critical challenges of communication and safety in remote hunting environments by leveraging modern mobile and web technologies for seamless interaction.

### Key Features

Real-time GPS Location Sharing: Hunters can share their positions live for group coordination.
Emergency Alerts: Send alerts with location data for quick response in critical situations.
Group Messaging: In-app messaging for communication within hunting groups.
Offline-First Design: Core functionality works without internet, syncing when connected.

### Tech Stack

- Frontend: React Native + Expo for cross-platform mobile development.

- Backend: Node.js + Express server handling API routes (auth, emergency, location, messages).

- Real-Time Communication: Socket.IO for live updates and messaging.

- Database: PostgreSQL for data persistence, with schema and initialization scripts.

**Services**: Dedicated socket services for emergency, location, and message handling.

### Project Structure

- Backend (/backend): Server setup, database config, API routes, and socket services.
- Mobile App (/mobile-app): App entry point, screens (Auth, Emergency, Group, Map, Messages), contexts (Auth, Location, Socket), and API config.

### Setup Instructions

- Backend: Navigate to /backend, run npm install, then npm run dev.
- Mobile App: Navigate to /mobile-app, run npm install, then npx expo start.

### Screenshots

Here are some screenshots of the mobile application:

<p align="center">
  <img src="assets/screenshots/image0.jpeg" width="300" />
  <img src="assets/screenshots/image1.jpeg" width="300" />
  <img src="assets/screenshots/image2.jpeg" width="300" />
  <img src="assets/screenshots/image3.jpeg" width="300" />
</p>

