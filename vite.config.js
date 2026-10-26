import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { msw } from 'msw/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv( mode, process.cwd(), 'VITE_' )

    return {
        // 运行时基础路径
        base: `${env.VITE_APP_BASE_URL}/`,
        plugins: [ react(), msw() ],
        server: {
            // 运行时主机和端口
            host: env.VITE_DEV_HOST,
            port: Number( env.VITE_DEV_PORT ),
            // 接口代理配置
            proxy: {
                '^/(api|storage)': {
                    target: env.VITE_DEV_API_TARGET,
                    changeOrigin: true
                }
            }
        }
    }
})