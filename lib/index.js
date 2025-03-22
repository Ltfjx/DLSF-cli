#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.printDebug = printDebug;
const minimist_1 = __importDefault(require("minimist"));
const blessed_1 = __importDefault(require("blessed"));
const api_1 = require("./api");
const help = `
██████╗ ██╗     ███████╗    ███████╗██╗   ██╗ ██████╗██╗  ██╗███████╗██████╗ 
██╔══██╗██║     ██╔════╝    ██╔════╝██║   ██║██╔════╝██║ ██╔╝██╔════╝██╔══██╗
██║  ██║██║     ███████╗    █████╗  ██║   ██║██║     █████╔╝ █████╗  ██████╔╝
██║  ██║██║     ╚════██║    ██╔══╝  ██║   ██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
██████╔╝███████╗███████║    ██║     ╚██████╔╝╚██████╗██║  ██╗███████╗██║  ██║
╚═════╝ ╚══════╝╚══════╝    ╚═╝      ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
DLSF-cli @ PotatoD3v

Usage: dlsf-cli --target <value> --username <value> --password <value> [--interval <value>] [--api <value>] [--hideSensitive] [--noCheck]

参数说明:
  --target, -t <value>       必选参数，目标课程，格式为：课程编号:选课序号（中间使用英文冒号分隔，支持多项）
  --username, -u <value>     必选参数，用户名（学号）。
  --password, -p <value>     必选参数，密码。
  --interval, -i <value>     可选参数，间隔时间，以秒为单位（默认为 3 秒）。
  --api, -a <value>          可选参数，DLSF API 地址（默认为 http://localhost:3000)。
  --hideSensitive, --hs      可选参数，隐藏敏感信息（如学号、姓名等）。
  --noCheck, --nc            可选参数，同 WEB 面板的 “不校验模式”。
  
默认值：
  --interval 3
  --api "http://localhost:3000/api"

示例:
  dlsf-cli -t 114514:100001 -t 1919810:100002 --username 114514 --password 123456 --interval 5 --nc
`;
const version = "1.1.0";
const args = (0, minimist_1.default)(process.argv.slice(2), {
    alias: {
        t: "target",
        u: "username",
        p: "password",
        i: "interval",
        a: "api",
        hs: "hideSensitive",
        nc: "noCheck"
    },
    default: {
        interval: 3,
        api: "http://localhost:3000/api",
        hideSensitive: false,
        noCheck: false
    },
    string: ["target", "api", "username", "password"],
    unknown: (arg) => {
        console.error(`Unknown argument: ${arg}`);
        console.log(help);
        process.exit(1);
    }
});
const cliParams = {
    targets: Array.isArray(args.target) ? args.target : [args.target],
    username: args.username,
    password: args.password,
    interval: args.interval,
    api: args.api,
    hideSensitive: args.hideSensitive,
    noCheck: args.noCheck
};
if (!cliParams.targets || !cliParams.username || !cliParams.password) {
    console.error("缺少必要的命令行参数。");
    console.log(help);
    process.exit(1);
}
const screen = blessed_1.default.screen({
    smartCSR: true,
    title: "DLSF-cli"
});
// printDebug(cliParams)
screen.fullUnicode = true;
const boxOverview = blessed_1.default.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%-1'
});
const overviewWorker = blessed_1.default.box({
    parent: boxOverview,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%-10',
    name: 'overviewBox',
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: 'white'
        }
    }
});
const overviewWorkerTitle = blessed_1.default.text({
    parent: overviewWorker,
    top: -1,
    left: 1,
    width: 8,
    height: 1,
    content: ' Worker ',
    tags: true,
    style: {
        fg: 'white',
        bg: 'black'
    }
});
const overviewInfo = blessed_1.default.box({
    parent: boxOverview,
    top: "100%-10",
    left: 0,
    width: '100%',
    height: 10,
    name: 'overviewBox',
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: 'white',
            bg: 'black'
        }
    }
});
const overviewInfoTitle = blessed_1.default.text({
    parent: overviewInfo,
    top: -1,
    left: 1,
    width: 6,
    height: 1,
    content: ' Info ',
    tags: true,
    style: {
        fg: 'white',
        bg: 'black'
    }
});
const overViewInfoText1 = blessed_1.default.text({
    parent: overviewInfo,
    top: 1,
    left: 2,
    width: "100%-4",
    height: "100%-5",
    content: "",
    tags: true,
    style: {
        fg: 'white',
        bg: 'black'
    }
});
const overViewInfoText2 = blessed_1.default.text({
    parent: overviewInfo,
    top: "100%-6",
    left: 2,
    width: "100%-4",
    height: 4,
    content: "",
    tags: true,
    style: {
        fg: 'cyan',
        bg: 'black'
    }
});
let workerList = [];
const targetIdPercentages = 9;
const namePercentage = 20;
const infoPercentage = 15;
const teacherPercentage = 10;
const responsePercentage = 25;
const progressPercentage = 15;
const statusPercentage = 6;
const boxOverviewWidth = Number(boxOverview.width) - 2;
const targetIdWidth = Math.floor(targetIdPercentages * boxOverviewWidth / 100);
const nameWidth = Math.floor(namePercentage * boxOverviewWidth / 100);
const infoWidth = Math.floor(infoPercentage * boxOverviewWidth / 100);
const teacherWidth = Math.floor(teacherPercentage * boxOverviewWidth / 100);
const responseWidth = Math.floor(responsePercentage * boxOverviewWidth / 100);
const progressWidth = Math.floor(progressPercentage * boxOverviewWidth / 100);
const statusWidth = Math.floor(statusPercentage * boxOverviewWidth / 100);
function buildWorkerTableTitle() {
    const workerBox = blessed_1.default.box({
        parent: overviewWorker,
        top: 0,
        left: 1,
        width: '100%-6',
        height: 1,
        content: ``,
        style: {
            bg: 'white',
            fg: 'black'
        }
    });
    const targetIdText = blessed_1.default.text({
        parent: workerBox,
        top: 0,
        left: 0,
        width: nameWidth,
        height: 1,
        content: "选课序号",
        style: {
            bg: 'white',
            fg: 'black'
        }
    });
    const nameText = blessed_1.default.text({
        parent: workerBox,
        top: 0,
        left: targetIdWidth,
        width: nameWidth,
        height: 1,
        content: "课程名称",
        style: {
            bg: 'white',
            fg: 'black'
        }
    });
    const infoText = blessed_1.default.text({
        parent: workerBox,
        top: 0,
        left: targetIdWidth + nameWidth,
        width: infoWidth,
        height: 1,
        content: "最大/申请/已录",
        style: {
            bg: 'white',
            fg: 'black'
        }
    });
    const teacherText = blessed_1.default.text({
        parent: workerBox,
        top: 0,
        left: targetIdWidth + nameWidth + infoWidth,
        width: teacherWidth,
        height: 1,
        content: "授课教师",
        style: {
            bg: 'white',
            fg: 'black'
        }
    });
    const responseText = blessed_1.default.text({
        parent: workerBox,
        top: 0,
        left: targetIdWidth + nameWidth + infoWidth + teacherWidth,
        width: responseWidth,
        height: 1,
        content: "响应信息",
        style: {
            bg: 'white',
            fg: 'black'
        }
    });
    const statusText = blessed_1.default.text({
        parent: workerBox,
        top: 0,
        left: targetIdWidth + nameWidth + infoWidth + teacherWidth + responseWidth,
        width: statusWidth,
        height: 1,
        content: "状态",
        style: {
            bg: 'white',
            fg: 'black'
        }
    });
    const ProgressText = blessed_1.default.text({
        parent: workerBox,
        top: 0,
        left: statusWidth + targetIdWidth + nameWidth + infoWidth + teacherWidth + responseWidth + 1,
        width: progressWidth,
        height: 1,
        content: "请求冷却",
        style: {
            bg: 'white',
            fg: 'black'
        }
    });
}
buildWorkerTableTitle();
let activeWorker = -1;
let workers = [];
function startWorker() {
    workerList.forEach((target, workerIndex) => {
        const workerBox = blessed_1.default.box({
            parent: overviewWorker,
            top: 1 + workerIndex,
            left: 1,
            width: '100%-6',
            height: 1,
            content: ``,
            style: {
                bg: 'black',
                fg: 'white'
            }
        });
        const targetIdText = blessed_1.default.text({
            parent: workerBox,
            top: 0,
            left: 0,
            width: targetIdWidth,
            tags: true,
            height: 1,
            content: `{cyan-fg}${String(target.targetId)}{/cyan-fg}`
        });
        const nameText = blessed_1.default.text({
            parent: workerBox,
            top: 0,
            left: targetIdWidth,
            width: nameWidth,
            height: 1,
            content: target.name
        });
        const infoText = blessed_1.default.text({
            parent: workerBox,
            top: 0,
            left: targetIdWidth + nameWidth,
            width: infoWidth,
            height: 1,
            content: target.info,
            tags: true
        });
        const teacherText = blessed_1.default.text({
            parent: workerBox,
            top: 0,
            left: targetIdWidth + nameWidth + infoWidth,
            width: teacherWidth,
            height: 1,
            content: target.teacher
        });
        const responseText = blessed_1.default.text({
            parent: workerBox,
            top: 0,
            left: targetIdWidth + nameWidth + infoWidth + teacherWidth,
            width: responseWidth,
            height: 1,
            content: target.response
        });
        let statusTextString;
        switch (target.status) {
            case -1:
                statusTextString = ' 等待 ';
                break;
            case 0:
                statusTextString = '{yellow-bg} 处理 {/yellow-bg}';
                break;
            case 1:
                statusTextString = '{red-bg} 失败 {/red-bg}';
                break;
            case 2:
                statusTextString = '{green-bg} 成功 {/green-bg}';
                break;
            case 3:
                statusTextString = '{red-fg} 错误 {/red-fg}';
                break;
            default:
                statusTextString = '{red-fg} 未知 {/red-fg}';
                break;
        }
        const statusText = blessed_1.default.text({
            parent: workerBox,
            top: 0,
            left: targetIdWidth + nameWidth + infoWidth + teacherWidth + responseWidth,
            width: statusWidth,
            height: 1,
            content: statusTextString,
            tags: true
        });
        const progressLength = Number(workerBox.width) - statusWidth - targetIdWidth - nameWidth - infoWidth - teacherWidth - responseWidth;
        const content = Array(progressLength).fill('=').join('');
        const progressText = blessed_1.default.text({
            parent: workerBox,
            top: 0,
            right: -1,
            width: progressLength,
            height: 1,
            content: content,
            style: {
                fg: 'white',
                bg: 'black'
            }
        });
        let cooldownProgress = 1;
        setTimeout(() => {
            let firstTry = true;
            let worker = setInterval(() => {
                if (cooldownProgress >= 1) {
                    work().catch((error) => {
                        exports.logger.errorRaw("Error in worker: ", error);
                    });
                    function work() {
                        return __awaiter(this, void 0, void 0, function* () {
                            let isFull = false;
                            let countString = "";
                            responseText.setContent(`正在发送请求...`);
                            statusText.setContent("{yellow-bg} 处理 {/yellow-bg}");
                            screen.render();
                            if (!cliParams.noCheck) {
                                const result = yield (0, api_1.api)("/selectcourse/initACC", { courseCode: target.courseCode });
                                const lessonData = result.aaData.filter((course) => course.cttId == target.targetId)[0];
                                if (lessonData.maxCnt > lessonData.enrollCnt) {
                                    isFull = false;
                                }
                                else {
                                    isFull = true;
                                    responseText.setContent(`选课人数已满，即将重试...`);
                                    statusText.setContent("{red-bg} 失败 {/red-bg}");
                                }
                                countString = `${lessonData.maxCnt}/${lessonData.applyCnt}/${lessonData.enrollCnt}`;
                                infoText.setContent(countString);
                            }
                            else {
                                infoText.setContent("{yellow-fg}[noCheck]{/yellow-fg}");
                            }
                            if (firstTry || !isFull) {
                                const result = yield (0, api_1.api)("/selectcourse/scSubmit", { cttId: target.targetId });
                                if (result.msg == "F") {
                                    responseText.setContent(`出现验证码，请降低请求速度，本线程已停止！`);
                                    statusText.setContent("{red-fg} 错误 {/red-fg}");
                                    clearInterval(workers.filter((worker) => worker.target == target)[0].worker);
                                    activeWorker--;
                                    bottomStatus.setContent(` ${activeWorker}/${cliParams.targets.length} Working `);
                                }
                                else if (result.msg == "你这门课已经选了,不允许再次选择了！" || result.success == true) {
                                    responseText.setContent(`选课成功！`);
                                    statusText.setContent("{green-bg} 成功 {/green-bg}");
                                    clearInterval(workers.filter((worker) => worker.target == target)[0].worker);
                                    activeWorker--;
                                    bottomStatus.setContent(` ${activeWorker}/${cliParams.targets.length} Working `);
                                }
                                else {
                                    responseText.setContent(result.msg[0]);
                                    statusText.setContent("{red-bg} 失败 {/red-bg}");
                                }
                            }
                            else {
                                statusText.setContent("{red-bg} 失败 {/red-bg}");
                            }
                        });
                    }
                    firstTry = false;
                    cooldownProgress = 0;
                }
                progressText.setContent(Array(Math.floor((1 - cooldownProgress) * progressLength)).fill('=').join('') + Array(Math.ceil(cooldownProgress * progressLength)).fill(' ').join(''));
                cooldownProgress += (1 / (cliParams.interval * 1000 / 100));
                screen.render();
            }, 100);
            workers.push({ "target": target, "worker": worker });
            // logger.debugRaw("Workers: ", workers)
        }, workerIndex * 100);
    });
    activeWorker = cliParams.targets.length;
    bottomStatus.setContent(` ${activeWorker}/${cliParams.targets.length} Working `);
}
const boxLog = blessed_1.default.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%-1',
    content: 'Log',
    tags: true
});
const logOuter = blessed_1.default.text({
    parent: boxLog,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: 'white'
        }
    }
});
const logInner = blessed_1.default.log({
    parent: logOuter,
    top: 0,
    left: 1,
    tags: true,
    width: '100%-4',
    height: '100%-2'
});
const logTitle = blessed_1.default.text({
    parent: logOuter,
    top: -1,
    left: 1,
    width: 5,
    height: 1,
    content: ' Log ',
    tags: true,
    style: {
        fg: 'white',
        bg: 'black'
    }
});
const boxHelp = blessed_1.default.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%-1',
    content: '',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: 'white'
        },
        hover: {
            bg: 'green'
        }
    }
});
const helpTitle = blessed_1.default.text({
    parent: boxHelp,
    top: -1,
    left: 1,
    width: 6,
    height: 1,
    content: ' Help ',
});
const helpHelp = blessed_1.default.text({
    parent: boxHelp,
    top: 0,
    left: 2,
    width: '100%-6',
    height: '100%-2',
    content: help,
    tags: true,
    style: {
        fg: 'white',
        bg: 'black'
    }
});
switchToTab(1);
const menuBar = blessed_1.default.listbar({
    parent: screen,
    bottom: 0,
    width: "100%",
    height: 1,
    style: {
        fg: "blue",
        bg: "white",
        label: "white",
        selected: {
            bg: "cyan",
            fg: "black"
        },
        item: {
            bg: "white",
            fg: "black"
        }
    },
    autoCommandKeys: false,
    keys: true,
    commands: {
        "Overview": {
            keys: ["1"],
            callback: () => { switchToTab(1); }
        },
        "Log": {
            keys: ["2"],
            callback: () => { switchToTab(2); }
        },
        "Help": {
            keys: ["3"],
            callback: () => { switchToTab(3); }
        },
        "Exit": {
            keys: ["0"],
            callback: () => {
                return process.exit(0);
            }
        }
    },
    // type definitions bug
    // shit I hate this
    items: []
});
const bottomText = blessed_1.default.text({
    parent: screen,
    bottom: 0,
    right: 23,
    width: 9,
    height: 1,
    content: "DLSF-cli",
    style: {
        fg: "black",
        bg: "white"
    }
});
const bottomTimer = blessed_1.default.text({
    parent: screen,
    bottom: 0,
    right: 13,
    width: 10,
    height: 1,
    content: " 00:00:00 ",
    style: {
        fg: "black",
        bg: "cyan"
    }
});
const bottomStatus = blessed_1.default.text({
    parent: screen,
    bottom: 0,
    right: 0,
    width: 13,
    height: 1,
    content: " 0/0 Working ",
    style: {
        fg: "white",
        bg: "red"
    }
});
let timer = 0;
setInterval(() => {
    timer += 1;
    bottomTimer.setContent(" " + formatSeconds(timer));
    screen.render();
}, 1000);
function formatSeconds(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
    let hh = hours < 10 ? '0' + hours : hours;
    let mm = minutes < 10 ? '0' + minutes : minutes;
    let ss = secs < 10 ? '0' + secs : secs;
    return `${hh}:${mm}:${ss}`;
}
// 监听退出事件
screen.key(["escape", "q", "C-c"], (ch, key) => {
    screen.destroy();
    console.clear();
    console.log("DLSF CLI 已退出。");
    return process.exit(0);
});
let currentTab = 1;
screen.key(["right"], (ch, key) => {
    if (currentTab < 3) {
        menuBar.select(currentTab + 1 - 1);
        switchToTab(currentTab + 1);
        currentTab++;
        screen.render();
    }
});
screen.key(["left"], (ch, key) => {
    if (currentTab > 1) {
        menuBar.select(currentTab - 1 - 1);
        switchToTab(currentTab - 1);
        currentTab--;
        screen.render();
    }
});
// 渲染屏幕
screen.render();
boxOverview.focus();
function switchToTab(index) {
    boxOverview.hide();
    boxLog.hide();
    boxHelp.hide();
    switch (index) {
        case 1:
            boxOverview.show();
            boxOverview.focus();
            break;
        case 2:
            boxLog.show();
            boxLog.focus();
            break;
        case 3:
            boxHelp.show();
            boxHelp.focus();
            break;
        default:
            boxOverview.show();
            boxOverview.focus();
            break;
    }
}
const logLevel = 0; // 0: debug, 1: info, 2: warn, 3: error
exports.logger = {
    debug: (msg) => {
        if (logLevel <= 0) {
            const str = `{cyan-fg}${new Date().toLocaleString()}{/cyan-fg} | {blue-fg}DEBUG{/blue-fg} | ${msg}`;
            try {
                logInner.log(str);
            }
            catch (e) {
                console.error(e);
            }
        }
    },
    info: (msg) => {
        if (logLevel <= 1) {
            const str = `{cyan-fg}${new Date().toLocaleString()}{/cyan-fg} | {green-fg}INFO{/green-fg} | ${msg}`;
            logInner.log(str);
        }
    },
    warn: (msg) => {
        if (logLevel <= 2) {
            const str = `{cyan-fg}${new Date().toLocaleString()}{/cyan-fg} | {yellow-fg}WARN{/yellow-fg} | ${msg}`;
            logInner.log(str);
        }
    },
    error: (msg) => {
        if (logLevel <= 3) {
            const str = `{cyan-fg}${new Date().toLocaleString()}{/cyan-fg} | {red-fg}ERROR{/red-fg} | ${msg}`;
            logInner.log(str);
        }
    },
    debugRaw: (msg, raw) => {
        if (logLevel <= 0) {
            logInner.log(`{cyan-fg}${new Date().toLocaleString()}{/cyan-fg} | {blue-fg}DEBUG{/blue-fg} | ${msg}`);
            logInner.log(raw);
        }
    },
    infoRaw: (msg, raw) => {
        if (logLevel <= 1) {
            logInner.log(`{cyan-fg}${new Date().toLocaleString()}{/cyan-fg} | {green-fg}INFO{/green-fg} | ${msg}`);
            logInner.log(raw);
        }
    },
    warnRaw: (msg, raw) => {
        if (logLevel <= 2) {
            logInner.log(`{cyan-fg}${new Date().toLocaleString()}{/cyan-fg} | {yellow-fg}WARN{/yellow-fg} | ${msg}`);
            logInner.log(raw);
        }
    },
    errorRaw: (msg, raw) => {
        if (logLevel <= 3) {
            logInner.log(`{cyan-fg}${new Date().toLocaleString()}{/cyan-fg} | {red-fg}ERROR{/red-fg} | ${msg}`);
            logInner.log(raw);
        }
    }
};
exports.logger.debugRaw("params:", cliParams);
function init() {
    (0, api_1.api)("/dlsf/version", {}).then((result) => {
        overViewInfoText2.content = `DLSF CLI 版本：${version}\nDLSF API 地址：${cliParams.api}\nDLSF API 版本：${result.currentVersion.slice(0, 7)}`;
    }).catch(error => {
        screen.destroy();
        console.clear();
        console.error(error);
        console.error("初始化失败：无法与 DLSF API 建立通信，请检查 API 地址是否正确或 DLSF API 是否已启动。");
        process.exit(1);
    });
    (0, api_1.api)("/dlsf/loginGetToken", { username: cliParams.username, password: cliParams.password }).then((result) => {
        if (result.DLSF_SUCCESS == false) {
            screen.destroy();
            console.clear();
            console.error("初始化失败：登录失败，请检查用户名和密码是否正确。");
            process.exit(1);
        }
        else {
            api_1.cookie.JSESSIONID = result.JSESSIONID;
            api_1.cookie.array = result.array;
            exports.logger.debugRaw("CAS 自动登录:", api_1.cookie);
        }
    }).then(() => {
        (0, api_1.api)("/studentui/initstudinfo", {}).then((result) => {
            if (cliParams.hideSensitive) {
                overViewInfoText1.content = `学号：{red-fg}[0xFFFFFFFF]{/red-fg}\n姓名：{red-fg}[PotatoD3v]{/red-fg}`;
            }
            else {
                overViewInfoText1.content = `学号：${result.studBasis.basisNo}\n姓名：${result.studBasis.basisName}`;
            }
        }).catch(error => {
            screen.destroy();
            console.clear();
            console.error(error);
            console.error("初始化失败：学生信息获取失败。");
            process.exit(1);
        });
        const promises = cliParams.targets.map((target) => __awaiter(this, void 0, void 0, function* () {
            const courseCode = target.split(":")[0];
            const cttId = target.split(":")[1];
            try {
                const result = yield (0, api_1.api)("/selectcourse/initACC", { courseCode: courseCode });
                const lessonData = result.aaData.find((course) => course.cttId == cttId);
                if (!lessonData) {
                    screen.destroy();
                    console.clear();
                    console.error(result);
                    process.exit(1);
                }
                else {
                    workerList.push({
                        targetId: cttId,
                        courseCode: courseCode,
                        name: lessonData.crName,
                        info: "",
                        teacher: lessonData.techName,
                        response: "",
                        status: -1
                    });
                }
            }
            catch (error) {
                screen.destroy();
                console.clear();
                console.error(error);
                console.error("初始化失败：课程信息获取失败。");
                process.exit(1);
            }
        }));
        Promise.all(promises).then(() => {
            startWorker();
        });
    });
}
init();
function printDebug(object) {
    screen.destroy();
    console.clear();
    console.error(object);
    process.exit(1);
}
