import { memo, useEffect, useState } from "react";
import { Button, I, QRCode } from "../support/components/Base";
import useUnitContext from "../support/context/UnitContext";
import useAppContext from "../support/context/AppContext";
import styled from "styled-components";
import { storage } from "../support/helpers/common";
import { useLocation } from "react-router";
import Card from "../support/components/Cards";
import Loading from "../support/components/Loading";

const PreviewBox = styled.div`
    ul.info {
        padding: 0px;
        margin: 0px;
        margin-bottom: 16px;
        list-style: none;
    }
    ul.info li {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        gap: 8px;
    }
    ul.info li > p:first-of-type {
        width: 80px;
        text-align: right;
        font-weight: bold;
    }
    ul.info li > p:first-of-type::after {
        content: ":";
    }
    ul.info li > p:last-of-type {
        flex: 1;
    }
    ul.select {
        display: grid;
        padding: 0px;
        margin-left: 0px;
        grid-template-columns: repeat( auto-fill, minmax( 160px, 1fr ) );
        gap: 8px;
        list-style: none;
    }
    ul.select li {
        padding: 6px 8px;
        background: rgb( var( --r6 ), 0.5 );
        font-size: 14px;
        border: 1px solid rgb( var( --r3 ), 0.25 );
        border-radius: var( --radius );
        text-align: center;
        cursor: pointer;
    }
    ul.select li.active {
        background: rgb( var( --r3 ) );
        color: rgb( var( --r3c ) );
        border-color: rgb( var( --r3 ) );
    }
    div.list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    @media ( max-width: 580px ) {
        div.card { padding: 8px; }
    }
`;
const Preview = memo(() => {
    const { rid, app, locale, setLocale, theme, setTheme, themes, user } = useAppContext();
    const { t, datetime, toast, loader, copy, modal } = useUnitContext();
    const [ buttonSize, setButtonSize ] = useState( 'medium' );
    const [ cardLoading, setCardLoading ] = useState( false );
    const { pathname } = useLocation();
    return (
        <PreviewBox id="Preview">
            <ul className="info">
                <li><p>{t( 'name' )}</p><p className="click" onClick={() => { copy( app.name ); }}>{app.name}</p></li>
                <li><p>RID</p><p className="click" onClick={() => { copy( rid ); }}>{rid}</p></li>
                <li><p>{t( 'locale' )}</p><p>{app.lang.package[locale]} ( {locale} )</p></li>
                <li><p>{t( 'theme' )}</p><p>{theme}</p></li>
                <li><p>{t( 'debug' )}</p><p>{app.debug ? t( 'open' ) : t( 'close' )}</p></li>
                <li><p>{t( 'user' )}</p><p>{user ? user.uid : t( 'null' )}</p></li>
                <li><p>{t( 'time' )}</p><p>{datetime()}</p></li>
                <li><p>UA</p><p className="click" onClick={() => { copy( navigator.userAgent ); }}>{navigator.userAgent}</p></li>
            </ul>
            <Card title={(<><I name="bi-box right8" />系统切换</>)} open={true} footer={<div>在此调整当前语言的主题</div>}>
                <ul className="select bottom8">
                    {Object.keys( app.lang.package ).map( key => (
                        <li className={key === locale ? "active" : ""} key={key} onClick={() => { setLocale(key); }}>{app.lang.package[key]} ( {key} )</li>
                    ))}
                </ul>
                <hr style={{ '--gap': '16px' }} />
                <ul className="select">
                    {Object.keys( themes ).map( key => (
                        <li className={key === theme ? "active" : ""} key={key} onClick={() => { setTheme(key); }}>{key}</li>
                    ))}
                </ul>
            </Card>
            <Card>
                <Loading active={cardLoading}>
                    <ul className="select bottom8">
                        {Object.values([ 'small', 'medium', 'large' ]).map( value => (
                            <li className={value === buttonSize ? "active" : ""} key={value} onClick={() => { setButtonSize( value ); }}>{value}</li>
                        ))}
                    </ul>
                    <hr style={{ '--gap': '16px' }} />
                    <div className="list bottom8">
                        <Button color="r3" icon="bi-lightbulb" onClick={() => { toast( '这是一条 info 类型的通知', 'info' ); }} size={buttonSize}>信息通知</Button>
                        <Button color="r4" icon="bi-check-circle" onClick={() => { toast( '这是一条 success 类型的通知', 'success' ); }} size={buttonSize}>成功通知</Button>
                        <Button color="r5" icon="bi-x-circle" onClick={() => { toast( '这是一条 error 类型的通知', 'error' ); }} size={buttonSize}>错误通知</Button>
                        <Button color="r5" icon="bi-shield-slash" onClick={() => { toast( '这是一条 warning 类型的通知', 'warning' ); }} size={buttonSize}>警告通知</Button>
                    </div>
                    <div className="list bottom8">
                        <Button color="r5" icon="bi-bug" onClick={() => {
                            storage.remove( 'app' );
                            storage.remove( 'theme' );
                            storage.remove( 'themes' );
                            storage.remove( 'locale' );
                            storage.remove( 'user' );
                            location.reload();
                        }} size={buttonSize}>修复存储</Button>
                        <Button color="r2" icon="right-bi-link-45deg" href={pathname === '/preview' ? '/preview_bak' : '/preview'} size={buttonSize}>路由切换</Button>
                        <Button color="r2" icon="bi-copy" onClick={() => { copy( '点击复制' ); }} size={buttonSize}>点击复制</Button>
                        <Button color="r2" icon="bi-arrow-clockwise" onClick={() => { loader( true, 5000 ); toast( '5000 毫秒后自动关闭', 'info' ); }} size={buttonSize}>全屏加载</Button>
                        <Button color="r2" icon="bi-window" onClick={() => { modal({
                            title: '弹窗标题',
                            content: (<>
                                <div>弹出窗口弹出窗口弹出窗口弹出窗口弹出窗口弹出窗口弹出窗口弹出窗口弹出窗口弹出窗口弹出窗口弹出窗口弹出窗口弹出窗口</div>
                            </>),
                            icon: 'bi-star',
                            close: true,
                            buttons: [
                                <Button key='close' solid icon="bi-x-lg" onClick={() => {}}>关闭</Button>,
                                <Button key='submit' icon="bi-check-lg" onClick={() => {}}>提交</Button>
                            ]
                        }); }} size={buttonSize}>弹出窗口</Button>
                        <Button color="r2" icon="bi-arrow-clockwise" onClick={() => {
                            setCardLoading( true );
                            setTimeout( () => { setCardLoading( false ); }, 5000 );
                            toast( '5000 毫秒后自动关闭', 'info' );
                        }} size={buttonSize}>卡片加载</Button>
                    </div>
                    <div className="list">
                        <Button icon="bi-star" size={buttonSize}></Button>
                        <Button size={buttonSize}>文本按钮</Button>
                        <Button color="r1" size={buttonSize}>文本按钮</Button>
                        <Button icon="bi-star" disabled size={buttonSize}>禁用按钮</Button>
                        <Button icon="bi-star" loading size={buttonSize}>加载按钮</Button>
                        <Button icon="bi-star" solid size={buttonSize}>实线按钮</Button>
                        <Button icon="bi-star" dashed size={buttonSize}>虚线按钮</Button>
                    </div>
                </Loading>
            </Card>
            <Card title={(<><I name="bi-qr-code right8" />二维码展示</>)} open={false}>
                <div className="list">
                    <QRCode value={rid} size={128} />
                    <QRCode value={rid} size={128} imageSettings={null} />
                </div>
            </Card>
            <PreviewThemeDesign />
        </PreviewBox>
    );
});

const PreviewThemeDesignBox = styled.div`
    color: rgb( var( --r1 ) );
    h3 { margin-bottom: 4px; }
    > p { color: rgba( var( --r1 ), 0.72 ); }
    div.themeEditor {
        display: grid;
        margin-bottom: 16px;
        grid-template-columns: repeat( auto-fit, minmax( 210px, 1fr ) );
        gap: 12px;
    }
    label.control {
        display: grid;
        gap: 6px;
    }
    label.control > span {
        font-size: 13px;
        font-weight: bold;
    }
    div.colorControl {
        display: grid;
        grid-template-columns: 42px 1fr;
        gap: 8px;
    }
    input, select {
        width: 100%;
        height: 34px;
        padding: 4px 8px;
        background: rgba( var( --r6 ), 0.75 );
        color: rgb( var( --r1 ) );
        box-sizing: border-box;
        border: 1px solid rgba( var( --r3 ), 0.3 );
        border-radius: var( --radius );
        outline: none;
    }
    input:focus, select:focus {
        border-color: rgb( var( --r3 ) );
        box-shadow: 0 0 0 2px rgba( var( --r3 ), 0.16 );
    }
    input[type="color"] {
        padding: 3px;
        cursor: pointer;
    }
    input[type="range"] {
        padding: 0px;
        accent-color: rgb( var( --r3 ) );
    }
    div.valueControl {
        display: grid;
        grid-template-columns: 1fr 58px;
        align-items: center;
        gap: 8px;
    }
    div.themeCard {
        margin-bottom: 16px;
        overflow: hidden;
        background: rgb( var( --r0 ) );
        font-size: var( --font );
        border: 1px solid rgba( var( --r3 ), 0.2 );
        box-shadow: 0 12px 28px rgba( var( --r1 ), 0.08 );
    }
    div.previewHeader {
        display: flex;
        padding: 12px 16px;
        align-items: center;
        justify-content: space-between;
        background: rgba( var( --r0 ), 0.58 );
        border-bottom: 1px solid rgba( var( --r3 ), 0.16 );
    }
    div.previewBrand {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: bold;
    }
    span.previewBrandMark {
        display: grid;
        width: 28px;
        height: 28px;
        place-items: center;
        background: rgb( var( --r3 ) );
        color: rgb( var( --r3c ) );
        border-radius: var( --radius );
    }
    nav.previewNav {
        display: flex;
        gap: 16px;
    }
    nav.previewNav a {
        color: rgb( var( --r2 ) );
        font-size: 0.86em;
        text-decoration: none;
    }
    nav.previewNav a:hover { text-decoration: underline; }
    div.previewBody { padding: clamp( 18px, 4vw, 36px ); }
    section.previewHero {
        max-width: 650px;
        margin-bottom: 24px;
    }
    span.previewEyebrow {
        display: inline-block;
        margin-bottom: 8px;
        padding: 3px 8px;
        background: rgba( var( --r3 ), 0.12 );
        color: rgb( var( --r3 ) );
        font-size: 0.78em;
        font-weight: bold;
        border-radius: 999px;
    }
    section.previewHero h4 {
        margin-bottom: 8px;
        font-size: clamp( 1.55em, 4vw, 2.2em );
        line-height: 1.15;
    }
    section.previewHero p {
        max-width: 620px;
        margin-bottom: 16px;
        color: rgba( var( --r1 ), 0.76 );
        line-height: 1.7;
    }
    section.previewHero a, article.previewArticle a {
        color: rgb( var( --r2 ) );
        font-weight: bold;
    }
    div.previewGrid {
        display: grid;
        margin-bottom: 16px;
        grid-template-columns: repeat( 3, 1fr );
        gap: 10px;
    }
    div.previewStat {
        padding: 14px;
        background: rgb( var( --r6 ) );
        border-radius: var( --radius );
    }
    div.previewStat strong {
        display: block;
        margin-bottom: 2px;
        color: rgb( var( --r3 ) );
        font-size: 1.35em;
    }
    div.previewStat span {
        color: rgba( var( --r1 ), 0.66 );
        font-size: 0.82em;
    }
    div.previewColumns {
        display: grid;
        grid-template-columns: minmax( 0, 1.5fr ) minmax( 190px, 1fr );
        gap: 10px;
    }
    article.previewArticle, aside.previewStatus {
        padding: 16px;
        background: rgb( var( --r6 ) );
        border-radius: var( --radius );
    }
    article.previewArticle h5, aside.previewStatus h5 {
        margin-bottom: 8px;
        font-size: 1em;
    }
    article.previewArticle p {
        color: rgba( var( --r1 ), 0.74 );
    }
    ul.previewStatusList {
        display: grid;
        padding: 0px;
        margin: 0px;
        gap: 8px;
        list-style: none;
    }
    ul.previewStatusList li {
        display: flex;
        padding: 8px 10px;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        background: rgba( var( --r6 ), 0.72 );
        border-radius: var( --radius );
    }
    ul.previewStatusList span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.84em;
    }
    i.statusDot {
        width: 8px;
        height: 8px;
        background: var( --status );
        border-radius: 50%;
    }
    small.statusSuccess { color: rgb( var( --r4 ) ); }
    small.statusDanger { color: rgb( var( --r5 ) ); }
    @media ( max-width: 700px ) {
        div.previewColumns { grid-template-columns: 1fr; }
    }
    @media ( max-width: 520px ) {
        nav.previewNav { display: none; }
        div.previewGrid { grid-template-columns: 1fr; }
    }
`;
const colorVariables = [ "--r0", "--r1", "--r2", "--r3", "--r4", "--r5", "--r6" ];
const contrastVariables = [ "--r2c", "--r3c", "--r4c", "--r5c" ];
const variableLabels = {
    "--r0": "页面背景色",
    "--r1": "正文颜色",
    "--r2": "链接颜色",
    "--r2c": "链接按钮文字",
    "--r3": "主题颜色",
    "--r3c": "主题按钮文字",
    "--r4": "成功状态色",
    "--r4c": "成功状态文字",
    "--r5": "危险状态色",
    "--r5c": "危险状态文字",
    "--r6": "卡片背景色"
};
/**
 * 提取主题中的 CSS 自定义属性
 * @param {object} themeConfig 主题配置
 * @returns {object} CSS 自定义属性对象
 */
const getThemeStyle = ( themeConfig ) => {
    return Object.fromEntries(
        Object.entries( themeConfig ).filter(
            ([ name ]) => name.startsWith( "--" )
        )
    );
};
/**
 * 将 RGB 通道转换为十六进制颜色
 * @param {string} value RGB 通道值
 * @returns {string} 十六进制颜色
 */
const rgbToHex = ( value ) => {
    const channels = String( value ).match( /\d+(?:\.\d+)?/g );
    if ( !channels || channels.length < 3 ) { return "#000000"; }
    return `#${channels.slice( 0, 3 ).map( channel => {
        const number = Math.min( 255, Math.max( 0, Math.round( Number( channel ) ) ) );
        return number.toString( 16 ).padStart( 2, "0" );
    } ).join( "" )}`;
};
/**
 * 将十六进制颜色转换为 RGB 通道
 * @param {string} value 十六进制颜色
 * @returns {string} RGB 通道值
 */
const hexToRgb = ( value ) => {
    const hex = value.replace( "#", "" );
    return [ 0, 2, 4 ].map(
        index => Number.parseInt( hex.slice( index, index + 2 ), 16 )
    ).join( ", " );
};

const PreviewThemeDesign = memo(() => {
    const { th } = useAppContext();
    const { toast } = useUnitContext();
    const [ themeStyle, setThemeStyle ] = useState( () => getThemeStyle( th ) );

    useEffect( () => {
        setThemeStyle( getThemeStyle( th ) );
    }, [ th ] );

    /**
     * 更新一个主题变量
     * @param {string} name 变量名称
     * @param {string} value 变量值
     */
    const updateVariable = ( name, value ) => {
        setThemeStyle( previous => ({
            ...previous,
            [name]: value
        }) );
    };

    /**
     * 重置主题编辑内容
     */
    const resetTheme = () => {
        setThemeStyle( getThemeStyle( th ) );
        toast( "主题预览已重置", "success" );
    };

    return (<>
        <PreviewThemeDesignBox>
            <Card title={(<><I name="bi-brush right8" />设计您的新主题</>)} open={true} right={<Button size="small" noBorder animation="reversion" icon="bi-arrow-counterclockwise" onClick={resetTheme}>重置</Button>}>
                <h3>设计您的新主题</h3>
                <p>调整主题变量并实时查看组件效果，所有修改仅在当前预览区域生效。</p>
                <hr style={{ '--gap': '16px' }} />
                <div className="themeEditor">
                    {colorVariables.map( name => (
                        <label className="control" key={name}>
                            <span>{variableLabels[name]}</span>
                            <div className="colorControl">
                                <input
                                    type="color"
                                    value={rgbToHex( themeStyle[name] )}
                                    aria-label={`选择 ${name} 的颜色`}
                                    onChange={event => { updateVariable( name, hexToRgb( event.target.value ) ); }}
                                />
                                <input
                                    type="text"
                                    value={themeStyle[name] || ""}
                                    aria-label={`输入 ${name} 的 RGB 通道值`}
                                    onChange={event => { updateVariable( name, event.target.value ); }}
                                />
                            </div>
                        </label>
                    ))}
                    {contrastVariables.map( name => (
                        <label className="control" key={name}>
                            <span>{variableLabels[name]}</span>
                            <select
                                value={themeStyle[name] || "var( --r0 )"}
                                onChange={event => { updateVariable( name, event.target.value ); }}
                            >
                                <option value="var( --r0 )">背景颜色（--r0）</option>
                                <option value="var( --r1 )">文字颜色（--r1）</option>
                                <option value="var( --r2 )">链接颜色（--r2）</option>
                                <option value="var( --r3 )">主题颜色（--r3）</option>
                                <option value="var( --r4 )">成功状态色（--r4）</option>
                                <option value="var( --r5 )">危险状态色（--r5）</option>
                                <option value="var( --r6 )">卡片颜色（--r6）</option>
                            </select>
                        </label>
                    ))}
                    <label className="control">
                        <span>基础字号</span>
                        <div className="valueControl">
                            <input
                                type="range"
                                min="12"
                                max="24"
                                step="1"
                                value={Number.parseFloat( themeStyle["--font"] ) || 15}
                                onChange={event => { updateVariable( "--font", `${event.target.value}px` ); }}
                            />
                            <input
                                type="text"
                                value={themeStyle["--font"] || ""}
                                onChange={event => { updateVariable( "--font", event.target.value ); }}
                            />
                        </div>
                    </label>
                    <label className="control">
                        <span>圆角大小</span>
                        <div className="valueControl">
                            <input
                                type="range"
                                min="0"
                                max="40"
                                step="1"
                                value={Number.parseFloat( themeStyle["--radius"] ) || 0}
                                onChange={event => { updateVariable( "--radius", `${event.target.value}px` ); }}
                            />
                            <input
                                type="text"
                                value={themeStyle["--radius"] || ""}
                                onChange={event => { updateVariable( "--radius", event.target.value ); }}
                            />
                        </div>
                    </label>
                </div>
            </Card>
            <div className="themeCard" style={themeStyle}>
                <div className="previewHeader">
                    <div className="previewBrand">
                        <span className="previewBrandMark">T</span>
                        <span>ToReact</span>
                    </div>
                    <nav className="previewNav">
                        <a href="#preview-home" onClick={event => { event.preventDefault(); }}>首页</a>
                        <a href="#preview-features" onClick={event => { event.preventDefault(); }}>功能</a>
                        <a href="#preview-docs" onClick={event => { event.preventDefault(); }}>文档</a>
                    </nav>
                </div>
                <div className="previewBody">
                    <section className="previewHero">
                        <span className="previewEyebrow">快速构建 React 项目</span>
                        <h4>让基础框架保持简单而强大</h4>
                        <p>
                            使用统一的组件、主题与路由能力，把更多时间留给真正重要的产品功能。{" "}
                            <a href="#preview-details" onClick={event => { event.preventDefault(); }}>了解设计系统</a>
                        </p>
                        <div className="list">
                            <Button color="r3" icon="bi-rocket-takeoff">开始使用</Button>
                            <Button color="r2" icon="bi-book" solid>阅读文档</Button>
                        </div>
                    </section>
                    <div className="previewGrid">
                        <div className="previewStat">
                            <strong>12</strong>
                            <span>可复用组件</span>
                        </div>
                        <div className="previewStat">
                            <strong>2</strong>
                            <span>内置主题</span>
                        </div>
                        <div className="previewStat">
                            <strong>100%</strong>
                            <span>响应式布局</span>
                        </div>
                    </div>
                    <div className="previewColumns">
                        <article className="previewArticle">
                            <h5>面向实际项目设计</h5>
                            <p>
                                主题变量会自动传递给页面与组件，同时保持业务代码和模板能力之间的边界。{" "}
                                <a href="#preview-api" onClick={event => { event.preventDefault(); }}>查看主题 API</a>
                            </p>
                        </article>
                        <aside className="previewStatus">
                            <h5>服务状态</h5>
                            <ul className="previewStatusList">
                                <li>
                                    <span><i className="statusDot" style={{ '--status': 'rgb( var( --r4 ) )' }} />接口服务</span>
                                    <small className="statusSuccess">正常</small>
                                </li>
                                <li>
                                    <span><i className="statusDot" style={{ '--status': 'rgb( var( --r5 ) )' }} />本地存储</span>
                                    <small className="statusDanger">需关注</small>
                                </li>
                            </ul>
                        </aside>
                    </div>
                    <article className="previewArticle" style={{ marginTop: '16px' }}>
                        <p className="bottom8">清晨，<a href="#">智能城市</a> 在第一束光中苏醒。无人驾驶汽车沿着磁悬浮道路安静穿行，机器人开始配送物资，巨型数据中心高速运转。人工智能连接每一座建筑，让能源更高效、生活更便捷，也为人类 <a href="#">探索未来</a> 开启无限可能。</p>
                        <p style={{ marginBottom: '16px' }}>At dawn, the <a href="#">smart city</a> awakens in the first light. Autonomous vehicles glide silently along magnetic roads, robots begin delivering supplies, and massive data centers operate at high speed. Artificial intelligence connects every building, making energy use more efficient and life more convenient, while opening up endless possibilities for humanity to <a href="#">explore the future</a>.</p>
                        <div className="list">
                            <Button color="r4" icon="bi-share">分享内容</Button>
                            <Button color="r5" icon="bi-trash">删除内容</Button>
                        </div>
                    </article>
                </div>
            </div>
        </PreviewThemeDesignBox>
    </>);
});

export default Preview;
