export interface ISystemMetrics {
    cpu: number
    ram: number
    gpu: number | null
    temperature: number | null
    timestamp: number
}

export interface IProcessInfo {
    pid: number
    name: string
    memoryMb: number
}