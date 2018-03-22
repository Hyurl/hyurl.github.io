let showICP = (location.pathname.indexOf("/modelar") === 0
    || location.hostname == "github.io")
    && isZH;

const Locals = {
    icp: showICP ? "" : "桂ICP备15001693号",
    module: "modelar",
    moduleName: "Modelar",
    lang: isZH ? "?lang=en-US" : "?lang=zh-CN",
    langLabel: isZH ? "English (US)" : "中文 (简体)",
    year: (new Date).getFullYear(),
    desc: isZH ? "一个富有表现力的 ORM，拥有查询语句建构器并支持多种数据库类型。" : "An expressive ORM with query builder and supports multiple databases.",
};

const NavbarMenu = {
    "/modelar/": isZH ? "主页" : "Home",
    "/modelar/docs/": isZH ? "文档" : "Documenation",
    "https://github.com/hyurl/modelar": isZH ? "源代码" : "Source Code",
};

const SidebarMenu = {
    intro: isZH ? "简介" : "Introduction",
    DB: isZH ? "DB 类" : "The DB class",
    Table: isZH ? "Table 类" : "The Table class",
    Query: isZH ? "Query 类" : "The Query class",
    Model: isZH ? "Model 类" : "The Model class",
    User: isZH ? "User 类" : "The User class",
    decorators: isZH ? "装饰器" : "Decorators",
    advanced: isZH ? "高级教程" : "Advanced",
    "migration-guide": isZH ? "迁移向导" : "Migration Guide",
};

const Home = new Vue({
    el: "#home",
    data: {
        Locals,
        NavbarMenu,
        fast: isZH ? "快速" : "Fast",
        fastDesc: isZH ? "Modelar 是精巧和强大的，它极大地提高了开发的效率，使用简单的几句代码，就能够完成复杂的任务。" : "Modelar is tiny but powerful, it extremely improves your development efficiency, uses only few lines of code to achieve complicated missions.",
        easy: isZH ? "简洁" : "Easy",
        easyDesc: isZH ? "Modelar 提供了大量的特性，使你能够用非常简洁明晰的方式来编写代码和操控数据，让你能够更专注于如何展现你的网站。" : "Modelar provides a lot of features that let you code and handle data in a very easy and clear way, allows you taking more focus on expressing your site.",
        functional: isZH ? "功能强大" : "Functional",
        functionalDesc: isZH ? "多数据库支持、查询建构器与表建构器、模型继承与关联、Promise 功能和事件处理机制，这一切，都旨在减少你的工作。" : "Multi-DB Supports, Query Builder and Table Creator, Model Inheritance and Associations, Promise Ability and Event Listeners, all mean to reduce your work.",
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