let showICP = (location.pathname.indexOf("/modelar") === 0
    || location.hostname == "github.io")
    && isZH;

const Locals = {
    icp: showICP ? "桂ICP备15001693号" : "",
    module: "sfn",
    moduleName: "SFN",
    lang: isZH ? "?lang=en-US" : "?lang=zh-CN",
    langLabel: isZH ? "English (US)" : "中文 (简体)",
    year: (new Date).getFullYear(),
    desc: isZH ? "一个优雅的 Node.js web 服务框架。" : "An elegant web service framework for Node.js.",
};

const NavbarMenu = {
    "/sfn/": isZH ? "主页" : "Home",
    "/sfn/docs/": isZH ? "文档" : "Documenation",
    "https://github.com/hyurl/sfn": isZH ? "源代码" : "Source Code",
};

const SidebarMenu = {
    "getting-started": isZH ? "起步" : "Getting Started",
    "structure": isZH ? "结构预览" : "Structure",
    "http-controller": isZH ? "HTTP 控制器" : "HTTP Controller",
    "websocket-controller": isZH ? "WebSocket 控制器" : "WebSocket Controller",
    "orm-model": isZH ? "ORM 模型" : "ORM Model",
    "view": isZH ? "视图" : "View",
    "command-line": isZH ? "命令行" : "Command Line",
    "session": isZH ? "会话" : "Session",
    "security": isZH ? "安全" : "Security",
    "service": isZH ? "服务" : "Service",
    "logger": isZH ? "日志" : "Logging",
    "cache": isZH ? "缓存" : "Cache",
    "uploading": isZH ? "上传" : "Uploading",
    "i18n": isZH ? "国际化" : "Internalization",
    "e-mail": isZH ? "电子邮件" : "E-mail",
    "multi-processing": isZH ? "多进程" : "Multi-Processing",
    "schedule": isZH ? "定时任务" : "Scheduling",
};

const Home = new Vue({
    el: "#home",
    data: {
        Locals,
        NavbarMenu,
        easy: isZH ? "简单易用" : "Easy To Use",
        easyDesc: isZH
            ? "<strong>sfn</strong> 提供了一堆简洁友好的 API，你可以使用它们来快速搭建新应用。只需要专注于你的程序逻辑，然后框架就能帮你处理剩下的所有事务。"
            : "Modelar is tiny but powerful, it extremely improves your development efficiency, uses only few lines of code to achieve complicated missions.",
        elegant: isZH ? "编码优雅" : "Coding Elegantly",
        elegantDesc: isZH
            ? "得益于 <strong>sfn</strong> 的友好设计，你可以使用非常优雅的方式来编写代码。你可能听说过“<em>代码如诗</em>”这句话，现在，你终于可以将其应用在自己的项目中了。" 
            : "Thanks to the design of <strong>sfn</strong>, you can write your code in a very elegant way. Perhaps you've heard <strong><em>Code is poetry</em></strong> from<strong>WordPress</strong>, well, now you can finally do that in your project.",
        powerful: isZH ? "功能强大" : "Functional",
        powerfulDesc: isZH
            ? "基于一个实用的原则，<strong>sfn</strong> 是非常强大的，你可以利用它出色的特性，来帮助你在很短的时间内搭建出不平凡的 web 应用程序。"
            : "Based on a practical principle, <strong>sfn</strong> is extremely powerful, utilizes its excellent features, to help you building extraordinary web applications in no time.",
    }
});

const Docs = new Vue({
    el: "#docs",
    data: {
        Locals,
        NavbarMenu,
        SidebarMenu,
    }
});