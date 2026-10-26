# ToReact

> Vite + React 快速开发模板

---

### 占用的本地存储
- rid: [UUID] 唯一标识
- app: [object] 应用核心配置
- theme: [string] 当前选中主题名称
- themes: [object] 主题配置包
- locale: [string] 当前语言键
- user: [object|null] 当前用户实例

### 配置文件说明
- 应用核心配置 [src/config/app.jsx]
  - 导出: app, { allowUpdateAppKey, mustUserKeys }
- 主题配置 [src/config/theme.jsx]
  - 导出: { theme, themes, themeVersion }
- 如果上下文中存在，您应当在程序中使用上下文的值来获取对应配置。以上配置主要用于初始化应用。

### 应用核心上下文
- 应用核心上下文 [src/support/context/AppContext.jsx]
  - 导出: AppContext, { AppContextProvider }
  - rid: [string][state] 唯一标识
  - app: [object][state] 应用核心配置
  - setApp: [function][state] 设置应用核心配置
  - locale: [string][state] 当前语言键
  - setLocale: [function][state] 设置当前语言键
  - theme: [string][state] 当前主题配置
  - setTheme: [function][state] 设置当前主题配置
  - themes: [object][state] 主题配置列表
  - user: [object|null][state] 当前用户实例
  - setUser: [function][state] 设置当前用户实例
  - th: [object][state] 当前主题配置
  - setThemes: [function][state] 设置主题配置列表
  - setTitle( [string|array|null]标题 ): [function] 设置页面标题
  - debug( [any]调试内容 ): [function] 调试内容
  - ready( [function]调用函数 ): [function] 仅在 init 完成后调用的内容
  - share( [string]共享对象键名 ): [function] 获取对应共享数据对象
  - setShare( [string]共享对象键名, [any]值 ): [function] 设置共享数据对象的值

### 应用组件上下文
- 应用组件上下文 [src/support/context/UnitContext.jsx]
  - 导出: UnitContext, { UnitContextProvider }
  - t: [function] 国际化翻译函数
  - loader( [boolean]是否显示, [number]超时时间 = 0 ): [function] 控制全屏加载组件的显示与隐藏，超时时间到达后自动隐藏
  - toast( [string]内容, [string]类型 = 'info', [number]超时时间 = 6000 ): [function] 显示通知消息，类型可选 'info', 'success', 'warning', 'error'
  - modal( [object]配置 ): [function] 显示弹窗组件，配置项包括 id, title, content, icon, close, mask, width, buttons
  - removeModal( [string]弹窗 ID ): [function] 关闭指定的弹窗
  - datetime( [string|null]时间 = null, [string]格式 = 'YYYY.MM.DD HH:mm:ss' ): [function] 返回指定格式的本地时间字符串
  - request: [object] 网络请求工具实例
  - copy( [string]内容 ): [function] 复制内容到剪贴板，成功返回 true，失败返回 false

### 常用辅助函数 [src/support/helpers/common.jsx]
- 常用工具对象 `common`
  - 判断字符串是否为 JSON
    - `common.is_json( [any]判断值 )`
    - return [boolean] 是否为合法 JSON 字符串
  - 判断值是否为空
    - `common.empty( [any]判断值 )`
    - return [boolean] 是否为空，支持空字符串、0、false、空数组、空对象、Map、Set 等
  - 生成 UUID
    - `common.uuid()`
    - return [string] UUID v4 字符串
  - 判断字符串是否为 UUID
    - `common.is_uuid( [any]判断值 )`
    - return [boolean] 是否符合标准 UUID 格式
  - 是否允许更新变量
    - `common.allowUpdate( [mixed]旧值, [mixed]新值, [boolean]是否严格比较类型 = true )`
    - return [boolean] 是否允许更新
  - 深度比较两个值是否相同
    - `common.isEqual( [any]第一个值, [any]第二个值 )`
    - return [boolean] 是否完全相同；对象键顺序不影响结果，不支持循环引用
  - 转换并格式化时间
    - `common.datetime( [string|number|null]时间 = null, [string]格式 = 'YYYY.MM.DD HH:mm:ss', [string]时区 = 'Asia/Singapore' )`
    - return [string|null] 格式化时间，输入或时区无效时返回 null
- 本地存储对象 `storage`
  - 获取本地存储数据
    - `storage.get( [string]key, [any]defaultValue = null )`
    - return [any] 读取到的值，若不存在则返回默认值；如果保存时为对象/数组会自动 JSON 解析
  - 保存本地存储数据
    - `storage.set( [string]key, [any]value )`
    - return [boolean] 是否写入成功
  - 删除本地存储数据
    - `storage.remove( [string]key )`
    - return [boolean] 是否删除成功

### 路由辅助函数 [src/support/helpers/router.jsx]
- 等待加载
  - `waitForLoad()`
  - return [Promise] 延迟加载完成的 Promise
- 懒加载路由页面
  - `load( [string]路由文件名 )`
  - return [object] React lazy 组件
- 获取当前匹配的路由配置
  - `useCurrentRoute()`
  - return { route: object|null, params: object } 当前路由信息

### 初始化支持服务 [src/support/providers/InitProvider.jsx]
- 获取用户唯一标识
  - `InitProvider.initRid()`
  - return [UUID] 唯一标识
- 获取设置的语言
  - `InitProvider.getSetLang()`
  - return [string] 语言键名
- 获取设置的应用核心配置
  - `InitProvider.getSetApp()`
  - return [object] 应用核心配置
- 获取设置的主题包
  - `InitProvider.getSetThemes()`
  - return [object] 主题包数据
- 获取设置的主题
  - `InitProvider.getSetTheme()`
  - return [string] 主题名称
- 设置网站主题信息
  - `InitProvider.setWebsiteTheme({ theme, themes })`
  - @param {void}
- 刷新首页数据
  - `InitProvider.refreshIndex({ request })`
  - return [void]

### 请求提供者 [src/support/providers/RequestProvider.jsx]
- 导出: RequestProvider
- 用于构建和发送网络请求，支持请求头、请求体、请求参数、超时时间等配置
- 使用示例:
  - ```javascript
    const request = new RequestProvider({
        list: {},
        getHeader: () => ({}),
        getMiddleware: () => null
    });
    request.build('/api/example')
        .header({ Authorization: 'Bearer token' })
        .data({ key: 'value' })
        .join({ param: 'value' })
        .timeout(10000)
        .middleware(({ ref, response, resource }) => {
            // 处理响应
            return resource;
        })
        .success((resource) => {
            console.log('请求成功', resource);
        })
        .error((error) => {
            console.error('请求失败', error);
        })
        .loading((isLoading) => {
            console.log('加载状态', isLoading);
        })
        .post();
    ```

### 基础预设组件 [src/support/components/Base.jsx]
- 导出: { A, I, QRCode, Button }
- A 标签工具
  - `<A href="/">链接</A>`
- 图标工具
  - `<I name="bi-star" size="24px" block />`
- 二维码工具
  - `<QRCode value="https://example.com" size="128" level="H" marginSize="0" bgColor="rgb( var( --r0 ), 0 )" fgColor="rgb( var( --r1 ) )" />`
- 按钮工具
  - 使用示例:
    ```
    <Button
        icon="bi-star" // 图标名称, 允许以 right- 前缀表示图标在按钮右侧
        color="r2" // 可选值: r0, r1, r2, r3, r4, r5, r6
        size="medium" // 可选值: small, medium, large
        onClick={}
        href="/aaa" target="_blank"
        animation="reversion" // 可选值: left 左移, right 右移, shake 抖动, rotate 旋转, reversion 反转
    disabled loading solid dashed noBorder>按钮文本</Button>
    ```
### 卡片类型组件 [src/support/components/Cards.jsx]
- 导出: Card
- 使用示例:
  - ```javascript
    <Card
        title="卡片标题"
        footer="卡片底部" // 卡片底部内容
        open={false} // 卡片是否展开
        right={<Button noBorder size="small" icon="bi-star">提交内容</Button>} // 卡片右侧内容
        padding="24px">
        卡片内容
    </Card>
    ```

### 加载组件 [src/support/components/Loading.jsx]
- 导出: Loading
- 使用示例:
  - ```javascript
    <Loading
        active={true} // 是否显示加载状态
        type="default" // 可选值: default 圆形动画, text 文本骨架动画, ai 图形动画
        mask="r0" // 遮罩颜色, 可选值: r0, r1, r2, r3, r4, r5, r6; false 不显示遮罩
        height="120px" // 内容区域最小高度
        style={{}}>
        内容
    </Loading>
    ```

### 全屏框架组件 [src/support/components/FullScreen.jsx]
- 导出: FullScreen
- 使用示例:
  - `<FullScreen>内容</FullScreen>`

### 路由加载器组件 [src/support/components/RouterLoader.jsx]
- 导出: RouterLoader
- 用于在路由切换时显示加载状态
- 使用示例:
  - `<RouterLoader delay={200} />`
