import { IProcessInfo, ISystemMetrics } from "./domain";

export type ClientMessageType = 
  | { type: "auth"; token: string }
  | { type: "get_metrics" }
  | { type: "get_processes" }
  | { type: "kill_process"; pid: number };

export type ServerMessageType = 
  | { type: "auth_ok" }
  | { type: "auth_failed" }
  | { type: "metrics_update"; payload: ISystemMetrics }
  | { type: "processes_list"; payload: IProcessInfo[] }
  | { type: "error"; message: string };