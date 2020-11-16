
/**
 * 创建 app
 */
export function createApp(): Application;

/**
 * 被创建的app
 */
export let app: Application;

/**
 * mydog版本
 */
export let version: string;

/**
 * 自带两类connector
 */
export let connector: {
    connectorTcp: I_connectorConstructor,
    connectorWs: I_connectorConstructor,
}

/**
 * app 类
 */
export interface Application {

    /**
     * 应用名称
     */
    appName: string;

    /**
     * env
     */
    readonly env: string;

    /**
     * 服务器id
     */
    readonly serverId: string;

    /**
     * 服务器类型
     */
    readonly serverType: string;

    /**
     * 本服务器的配置
     */
    readonly serverInfo: ServerInfo;

    /**
     * 配置：route.ts
     */
    readonly routeConfig: string[];

    /**
     * 配置：master.ts
     */
    readonly masterConfig: ServerInfo;

    /**
     * 配置：servers.ts
     */
    readonly serversConfig: { [serverType: string]: ServerInfo[] };

    /**
     * 服务器启动时刻
     */
    readonly startTime: number;

    /**
     * 前端服务器，所有的socket连接数
     */
    readonly clientNum: number;

    /**
     * rpc
     */
    readonly rpc: (serverId: string) => Rpc;

    /**
     * 启动服务器
     */
    start(): void;

    /**
     * rpc配置
     */
    setConfig(key: "rpc", value: I_rpcConfig): void;
    /**
     * 前端connector配置
     */
    setConfig(key: "connector", value: I_connectorConfig): void;
    /**
     * 编码解码配置
     */
    setConfig(key: "encodeDecode", value: I_encodeDecodeConfig): void;
    /**
     * ssh配置
     */
    setConfig(key: "ssh", value: string[]): void;
    /**
     * 认证密钥配置
     */
    setConfig(key: "recognizeToken", value: I_recognizeTokenConfig): void;
    /**
     * 内部日志输出
     */
    setConfig(key: "logger", value: (level: "info" | "warn" | "error", msg: string) => void): void;
    /**
     * 自定义监控
     */
    setConfig(key: "mydogList", value: () => { "title": string, "value": string }[]): void;

    /**
     * 设置键值对
     * @param key 键
     * @param value 值
     */
    set<T = any>(key: string | number, value: T): T

    /**
     * 获取键值对
     * @param key 键
     */
    get<T = any>(key: string | number): T;

    /**
     * 删除键值对
     * @param key 键
     */
    delete(key: string | number): void;

    /**
     * 获取某一类服务器
     * @param serverType 服务器类型
     */
    getServersByType(serverType: string): ServerInfo[];

    /**
     * 获取某一个服务器
     * @param serverId 服务器id
     */
    getServerById(serverId: string): ServerInfo;

    /**
     * 路由配置    [注：前端服调用]
     * @param serverType 服务器类型
     * @param routeFunc 路由函数
     */
    route(serverType: string, routeFunc: (session: Session) => string): void;

    /**
     * 是否有该客户端    [注：前端服调用]
     * @param uid 标识uid
     */
    hasClient(uid: number): boolean;

    /**
     * 关闭绑定的客户端    [注：前端服调用]
     * @param uid 标识uid
     */
    closeClient(uid: number): void;

    /**
     * 配置部分session    [注：前端服调用]
     * @param uid 标识uid
     * @param settings session里的部分配置
     */
    applySession(uid: number, settings: { [key: string]: any }): void;

    /**
     * 向客户端发送消息    [注：前端服调用]
     * @param cmd 路由
     * @param msg 消息
     * @param uids uid数组
     */
    sendMsgByUid(cmd: number, msg: any, uids: number[]): void;

    /**
     * 向所有的客户端发送消息    [注：前端服调用]
     * @param cmd 路由
     * @param msg 消息
     */
    sendAll(cmd: number, msg: any): void;

    /**
     * 向客户端发送消息    [注：后端服调用]
     * @param cmd 路由
     * @param msg 消息
     * @param uidsid uidsid数组
     */
    sendMsgByUidSid(cmd: number, msg: any, uidsid: { "uid": number, "sid": string }[]): void;

    /**
     * 向客户端发送消息    [注：后端服调用]
     * @param cmd   路由
     * @param msg   消息
     * @param group   {sid:uid[]}
     */
    sendMsgByGroup(cmd: number, msg: any, group: { [sid: string]: number[] }): void;

    /**
     * 配置服务器执行函数
     * @param type 服务器类型   "all" 或者 "gate|connector"形式
     * @param cb 执行函数
     */
    configure(type: string, cb: () => void): void;


    /**
     * 监听事件（添加服务器，移除服务器）
     * @param event 事件
     * @param cb 回调
     */
    on(event: "onAddServer" | "onRemoveServer", cb: (serverType: string, id: string) => void): void;

}

/**
 * Session 类
 */
export interface Session {
    /**
     * 绑定的uid
     */
    readonly uid: number;

    /**
     * 前端服务器id
     */
    readonly sid: string;

    /**
     * 设置键值对
     * @param value 键值对
     */
    set(value: { [key: string]: any }): void;

    /**
     * 获取键值对
     * @param key 键
     */
    get<T = any>(key: number | string): T;

    /**
     * 删除键值对
     * @param key 键
     */
    delete(keys: (number | string)[]): void;

    /**
     * 绑定uid    [注：前端服调用]
     * @param uid 标识uid
     */
    bind(uid: number): boolean;

    /**
     * 关闭连接    [注：前端服调用]
     */
    close(): void;

    /**
     * 将后端session同步到前端    [注：后端服调用]
     */
    apply(): void;

}

/**
 * 服务器信息
 */
export interface ServerInfo {
    /**
     * 服务器id
     */
    readonly id: string;
    /**
     * host
     */
    readonly host: string;
    /**
     * port
     */
    readonly port: number;
    /**
     * 是否是前端服务器
     */
    readonly frontend: boolean;
    /**
     * clientPort
     */
    readonly clientPort: number;
    /**
     * 服务器类型 [注：由框架内部赋值]
     */
    readonly serverType: string;

    [key: string]: any;
}

/**
 * rpc声明
 */
declare global {
    interface Rpc {
    }
}

/**
 * rpc调用，内部错误码
 */
export const enum rpcErr {
    /**
     * 没有错误
     */
    ok = 0,
    /**
     * 没有目标服务器
     */
    noServer = 1,
    /**
     * rpc超时
     */
    timeout = 2
}

/**
 * 编码解码
 */
interface I_encodeDecodeConfig {
    /**
     * 协议编码
     */
    "protoEncode"?: (cmd: number, msg: any) => Buffer,
    /**
     * 消息编码
     */
    "msgEncode"?: (cmd: number, msg: any) => Buffer,
    /**
     * 协议解码
     */
    "protoDecode"?: (data: Buffer) => { "cmd": number, "msg": Buffer },
    /**
     * 消息解码
     */
    "msgDecode"?: (cmd: number, msg: Buffer) => any,
}


/**
 * 前端connector配置
 */
interface I_connectorConfig {
    /**
     * 自定义connector类
     */
    "connector"?: I_connectorConstructor,
    /**
     * 心跳（秒）
     */
    "heartbeat"?: number,
    /**
     * 最大连接数
     */
    "maxConnectionNum"?: number,
    /**
     * 消息包最大长度
     */
    "maxLen"?: number
    /**
     * 是否开启Nagle算法（默认不开启）
     */
    "noDelay"?: boolean,
    /**
     * 消息发送频率（毫秒）
     */
    "interval"?: number,
    /**
     * 客户端连接通知
     */
    "clientOnCb"?: (session: Session) => void,
    /**
     * 客户端离开通知
     */
    "clientOffCb"?: (session: Session) => void,
}

/**
 * rpc配置
 */
interface I_rpcConfig {
    /**
     * 超时时间（秒）
     */
    "timeout"?: number,
    /**
     * 消息包最大长度
     */
    "maxLen"?: number,
    /**
     * 消息发送频率（毫秒）
     */
    "interval"?: number
    /**
     * 是否开启Nagle算法（默认不开启）
     */
    "noDelay"?: boolean,
    /**
     * 心跳（秒）
     */
    "heartbeat"?: number,
    /**
     * 重连间隔（秒）
     */
    "reconnectDelay"?: number,
}

/**
 * 认证密钥
 */
interface I_recognizeTokenConfig {
    /**
     * 服务器内部认证密钥
     */
    "serverToken"?: string,
    /**
     * master与cli的认证密钥
     */
    "cliToken"?: string,
}

/**
 * 自定义connector类
 */
export interface I_connectorConstructor {
    new(info: { app: Application, clientManager: I_clientManager, config: I_connectorConfig, startCb: () => void }): void;
}

/**
 * 用户socket管理
 */
export interface I_clientManager {
    addClient(client: I_clientSocket): void;
    handleMsg(client: I_clientSocket, msg: Buffer): void;
    removeClient(client: I_clientSocket): void;
}

/**
 * 用户socket
 */
export interface I_clientSocket {
    /**
     * session （注：框架内部赋值）
     */
    session: Session;

    /**
     * 发送消息
     */
    send(msg: Buffer): void;

    /**
     * 关闭
     */
    close(): void;
}
