import favicon from '../support/library/favicon.png';
import logo_dark from '../support/library/logo_dark.png';
import logo_light from '../support/library/logo_light.png';
import Default from '../support/library/Default.jpg';

// 主题版本号，提升此版本号会使用户保留的旧主题失效，强制使用新主题
const themeVersion = import.meta.env.VITE_APP_VERSION;
// 默认主题名称
const theme = 'Default';
/**
 * 可用主题配置
 * ---
 * version 将标记为主题版本号，请不要使用此名称
 */
const themes = {
    "Default": {
        "icon": favicon,
        "logo": logo_dark,
        "img": Default,
        "style": "",
        "--r0": "237, 236, 231",
        "--r1": "70, 70, 70",
        "--r2": "65, 115, 179",
        "--r2c": "var( --r0 )",
        "--r3": "53, 75, 111",
        "--r3c": "var( --r0 )",
        "--r4": "52, 168, 83",
        "--r4c": "var( --r0 )",
        "--r5": "207, 99, 89",
        "--r5c": "var( --r0 )",
        "--r6": "249, 247, 244",
        "--font": "15px",
        "--radius": "4px"
    },
    "Dark": {
        "icon": favicon,
        "logo": logo_light,
        "img": Default,
        "style": "",
        "--r0": "11, 21, 25",
        "--r1": "193, 193, 193",
        "--r2": "65, 115, 179",
        "--r2c": "var( --r1 )",
        "--r3": "53, 75, 111",
        "--r3c": "var( --r1 )",
        "--r4": "44, 141, 69",
        "--r4c": "var( --r1 )",
        "--r5": "188, 76, 65",
        "--r5c": "var( --r1 )",
        "--r6": "1, 11, 16",
        "--font": "15px",
        "--radius": "4px"
    }
};

export { theme, themes, themeVersion };