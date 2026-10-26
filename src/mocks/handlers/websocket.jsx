import { ws } from 'msw';

const socketUrl = new URL( '/ws/broadcast', window.location.origin );
socketUrl.protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const broadcastSocket = ws.link( socketUrl.toString() );

const handlers = [
    broadcastSocket.addEventListener( 'connection', ({ client }) => {
        // 模拟连接成功后的首次推送
        client.send(JSON.stringify({
            type: 'connected',
            data: {
                message: 'WebSocket 连接成功'
            }
        }));
        // 模拟服务端定时推送
        const timer = setInterval(() => {
            client.send(JSON.stringify({
                type: 'broadcast',
                data: {
                    title: '测试广播',
                    content: '这是一条由 Mock WebSocket 推送的消息。',
                    created_at: new Date().toISOString()
                }
            }));
        }, 5000);
        // 接收客户端发来的消息
        client.addEventListener( 'message', ( event ) => {
            client.send(JSON.stringify({
                type: 'echo',
                data: event.data
            }));
        });
        // 连接关闭时清理定时器
        client.addEventListener( 'close', () => {
            clearInterval( timer );
        });
    })
];

export { broadcastSocket };
export default handlers;