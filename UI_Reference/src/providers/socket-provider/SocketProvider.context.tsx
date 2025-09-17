import React from "react";
import { ISocketContextState } from "./SocketProvider.types";
import { defaultSocketContextState } from "./SocketProvider.state";

export const SocketContext = React.createContext<ISocketContextState>(defaultSocketContextState);
