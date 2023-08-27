// ==UserScript==
// @name         BetterLZT
// @namespace    hasanbet
// @version      v12
// @description  Free UNIQ??? ADBLOCK????
// @author       https://zelenka.guru/openresty (openresty)
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        unsafeWindow
// @connect      lzt.hasanbek.ru
// @connect      tv.hasanbet.site
// @run-at       document-body
// @license MIT
// ==/UserScript==


const
    version    = "2.32",
    server     = "http://lzt.hasanbek.ru:8880",
    adlist_w   = ["https://zelenka.guru/threads/5488501", "zelenka.guru/threads/5402454", "zelenka.guru/threads/2630352", "https://zelenka.guru/threads/5456926/", "https://t.me/poseidon_project", "https://zelenka.guru/threads/4826265/", "zelenka.guru/threads/4939541", "zelenka.guru/threads/4073607", "zelenka.guru/threads/5071761/", "https://zelenka.guru/threads/3695705/", "zelenka.guru/members/4177803", "@verif_ads", "verifteam"],
    adlist_l   = ["threads", "members", "lolz.live", "zelenka.guru"];

let usercss,
    adblock,
    banner,
    bannertxt,
    nickname,
    userid,
    cache,
    adnicks,
    secure,
    hidelike,
    secretph,
    marketblock,
    theme,
    simps,
    avamarket,
    avablock;

(async function() {
    usercss     = await GM.getValue("usercss") ? GM.getValue("usercss") : 'null';
    banner      = await GM.getValue("banner") ? GM.getValue("banner") : 'null';
    bannertxt   = await GM.getValue("bannertxt") ? GM.getValue("bannertxt") : 'null';
    adblock     = await GM.getValue("adblock") ? GM.getValue("adblock") : 'null';
    avablock    = await GM.getValue("avablock") ? GM.getValue("avablock") : 'null';
    cache       = await GM.getValue("cache") ? GM.getValue("cache") : 'null';
    secure      = await GM.getValue("secure") ? GM.getValue("secure") : 'not';
    hidelike    = await GM.getValue("hidelike") ? GM.getValue("hidelike") : 'null';
    marketblock = await GM.getValue("marketblock") ? GM.getValue("marketblock") : 'null';
    secretph    = await GM.getValue("secretph") ? GM.getValue("secretph") : 'not';
    theme       = await GM.getValue("theme") ? GM.getValue("theme") : 'null';
    simps       = await GM.getValue("simps") ? GM.getValue("simps") : 'null';
    avamarket   = await GM.getValue("avamarket") ? GM.getValue("avamarket") : 'null';
    window.addEventListener("DOMContentLoaded",(event) => {
        profileRender();
        themeRender();
        renderFunctions();
        userid   = document.querySelector("input[name=_xfToken").value.split(",")[0];
        nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
        cacheSync();
        usernames();
        marketRender();
    })
    setInterval(async () => {
        adBlockDaemon();
        daemon();
    }, 0);
    setInterval(usernames, 500);
    checkupdate();
})();

async function daemon() {
    if (document.querySelector("input[name=secret_answer]:not(.completed)") && await secretph != 'null') {
        document.querySelector("input[name=secret_answer]:not(.completed)").value = await secretph;
        document.querySelector("input[name=secret_answer]:not(.completed)").classList.add("completed")
    }

    // Сканирование кнопок в треде
    if (document.location.pathname.includes('threads') && document.querySelector("blockquote")) {
        if (document.querySelector("blockquote").innerHTML.trim().includes("betterfast")) {
            let str = document.querySelector("blockquote").innerHTML.trim();
            let arr = str.split('=');
            let value = arr[1].split(']')[0];

            let fastinfo = await request(`https://tv.hasanbet.site/better/fast.php?id=${value}`)
            try {
                let jsonfast = JSON.parse(fastinfo);
                
            } catch (error) {
                document.querySelector("blockquote").innerHTML = "Возникла ошибка"
            }
        }

        if (document.querySelector("blockquote").innerHTML.trim().includes("betterver")) {

            let fastinfo = await request(`https://tv.hasanbet.site/better/ver.php?version=${version}`)
            try {
                document.querySelector("blockquote").innerHTML = document.querySelector("blockquote").innerHTML.replace(/\[betterver\](.*?)\[\/betterver\]/g, await fastinfo);
                
            } catch (error) {
                document.querySelector("blockquote").innerHTML = document.querySelector("blockquote").innerHTML.replace(/\[betterver\](.*?)\[\/betterver\]/g, "ERROR");
            }
        }

        if (document.querySelector("blockquote").innerHTML.trim().includes("betterjs")) {
            let str = document.querySelector("blockquote").innerHTML.trim();
            let arr = str.split('=');
            let value = arr[1].split(']')[0];
            var match = str.match(/\](.*?)\[/);
            let atobed = window.btoa(`https://tv.hasanbet.site/better/js/${value}`);
            let response = await request(`https://tv.hasanbet.site/better/js/${value}`);
            try {
                document.querySelector("blockquote").innerHTML = document.querySelector("blockquote").innerHTML.replace(/\[betterjs=.*?\].*?\[\/betterjs\]/g, `<a onclick="eval(`+response+`)">${match[1]}</a>`);
                
            } catch (error) {
                document.querySelector("blockquote").innerHTML = "Возникла ошибка: "+error;
            }
        }
    }
    return;
}

async function themeRender() {
    
    let usernickt = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    let data = await JSON.parse(await cache);
    data = data.users[usernickt];
    if (data) {
        if (data.profilebg != 'null') {
            if (!document.querySelector(".avatarScaler")) {
                document.querySelector("body").style = `
                background-size: cover;
                background-position: center;
                background-attachment: fixed;
                background-repeat: no-repeat;
                background-image: linear-gradient(rgba(54, 54, 54, 0.85), rgba(54, 54, 54, 0.85)), url('${data.profilebg}')`
            }
        }
    }

    // акцент профиля
    // .messageSimple .secondaryContent .darkBackground .tabs .simpleRedactor .pageNavLinkGroup
    if (data) {
        if (data.maincolor != 'null') {
            if (!document.querySelector(".avatarScaler")) {
                styles = `#header, .messageSimple, .discussionList, .sidebar .sidebarWrapper, .secondaryContent, .darkBackground, .tabs, .simpleRedactor, .pageNavLinkGroup {background: ${data.maincolor};} .page_top {border-bottom: 0;} .counts_module {border-top: 0;}`
                let styleSheet = document.createElement("style")
                styleSheet.innerText = styles;
                document.head.appendChild(styleSheet);
            }
        }
    }

    if(await theme != 'null') {
        var link = document.createElement( "link" );
        link.href = "https://tv.hasanbet.site/better/css/" + await theme + ".less";
        link.type = "text/css";
        link.rel = "stylesheet";
        document.getElementsByTagName( "head" )[0].appendChild( link );
    }
}

async function profileRender() {
    if (!document.querySelector(".avatarScaler")) {return false;}
    // ид юзера
    const id = /market\/user\/(\d+)\/items/.exec(document.querySelector('.userContentLinks .button[href^="market/"]').href)[1];
    idhtml = document.createElement("div");
    idhtml.innerHTML = `<div class="clear_fix profile_info_row"><div class="label fl_l">ID пользователя:</div><div class="labeled">${id}<span data-phr="ID скопирован в буфер обмена" onclick="Clipboard.copy(${id}, this)" class="copyButton Tooltip" title="" data-cachedtitle="Скопировать ID" tabindex="0"><i class="far fa-clone" aria-hidden="true"></i>
    </span></div></div>`;
    document.querySelector(".profile_info_row").prepend(idhtml)

    // фон профиля

    let usernickt = document.querySelector("h1.username span").innerHTML.replace(/ <i.*?>.*?<\/i>/ig,'');
    let data = await JSON.parse(await cache);
    data = data.users[usernickt];
    if (data) {
        if (data.profilebg != 'null') {
            document.querySelector("body").style = `
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-repeat: no-repeat;
            background-image: linear-gradient(rgba(54, 54, 54, 0.85), rgba(54, 54, 54, 0.85)), url('${data.profilebg}')`
        }
    }

    // акцент профиля
    // .messageSimple .secondaryContent .darkBackground .tabs .simpleRedactor .pageNavLinkGroup
    if (data) {
        if (data.maincolor != 'null') {
            styles = `#header, .messageSimple, .discussionList, .sidebar .sidebarWrapper, .secondaryContent, .darkBackground, .tabs, .simpleRedactor, .pageNavLinkGroup {background: ${data.maincolor};} .page_top {border-bottom: 0;} .counts_module {border-top: 0;}`
            let styleSheet = document.createElement("style")
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);
        }
    }

    // плашка с депозитом

    let deposit = parseInt(document.querySelector('h3.amount').innerHTML.replace('₽','').replace(' ',''));
    if (deposit >= 10000 && deposit < 50000) {
        let pref = document.createElement('span');
        pref.style = `color: #f5f5f5;padding: 2px 8px;
        margin: 0px 0px 0px 6px;
        border-radius: 0px 6px 6px 0px;
        display: inline-block;
        margin-left: 25px;
        background: #47626f;
        line-height: 16px;
        font-size: 12px;`;
        pref.innerHTML = "Депозит";
        pref.title = "Страховой депозит: "+document.querySelector('h3.amount').innerHTML;
        let nickarea = document.querySelector("h1 span").append(pref);
    }
    if (deposit >= 50000 && deposit < 100000) {
        let pref = document.createElement('span');
        pref.style = `color: #f5f5f5;padding: 2px 8px;
        margin: 0px 0px 0px 6px;
        border-radius: 0px 6px 6px 0px;
        display: inline-block;
        margin-left: 25px;
        background: #8a315d;
        line-height: 16px;
        font-size: 12px;`;
        pref.innerHTML = "Депозит";
        pref.title = "Страховой депозит: "+document.querySelector('h3.amount').innerHTML;
        let nickarea = document.querySelector("h1 span").append(pref);
    }
    if (deposit >= 100000) {
        let pref = document.createElement('span');
        pref.style = `color: #f5f5f5;padding: 2px 8px;
        margin: 0px 0px 0px 6px;
        border-radius: 0px 6px 6px 0px;
        margin-left: 25px;
        display: inline-block;
        background: #8152C6;
        line-height: 16px;
        font-size: 12px;`;
        pref.innerHTML = "Депозит";
        pref.title = "Страховой депозит: "+document.querySelector('h3.amount').innerHTML;
        let nickarea = document.querySelector("h1 span").append(pref);
    }
    // Плашка Premium
    // if (data) {
        // if (data.premium) {
        //     let pref = document.createElement('span');
        //     pref.style = `color: #f5f5f5;padding: 2px 8px;
        //     margin: 0px 0px 0px 6px;
        //     border-radius: 6px 0px 0px 6px;
        //     display: inline-block;
        //     background: #ff0076;
        //     margin-left: 25px;
        //     line-height: 16px;
        //     font-size: 12px;`;
        //     pref.innerHTML = "Premium";
        //     pref.title = "BetterLZT Premium";
        //     let nickarea = document.querySelector("h1 span").append(pref);
        // }
    // }


    // Скрытие лайков

    if (await hidelike=='on') {
        document.querySelectorAll(".page_counter")[1].remove();
    }
}

function request(url) {
    return new Promise((resolve, reject) => GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: response => resolve(response.responseText),
        onerror: error => resolve(error)
    }));
}

function getUID() {
    return document.querySelector("input[name=_xfToken").value.split(",")[0];
}

async function uniqSave() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    localcss = document.getElementsByClassName("UsernameCss")[0].value;
    banner = document.getElementsByClassName("BannerCss")[0].value;
    svgcss = document.getElementsByClassName("BannerCss")[0].value;
    bannertxt = document.querySelector("input[name='banner_text']").value;
    css = encodeURIComponent(localcss.replace(/\n/g, "").replace(/; +/g, ";"));
    banner = encodeURIComponent(banner.replace(/\n/g, "").replace(/; +/g, ";"));
    bannertxt = encodeURIComponent(bannertxt.replace(/\n/g, "").replace(/; +/g, ";"));
    svgcss = encodeURIComponent(svgcss.replace(/\n/g, "").replace(/; +/g, ";"));

    if (secure == 'null') {
        await setSecure(`${document.querySelector("input[name=_xfToken").value.split(",")[0]+document.querySelector("input[name=_xfToken").value.split(",")[1]}`);
    }
    let req = request(`${server}/v5/new?user=${nickname}&css=${css}&banner=${banner}&bannertxt=${bannertxt}&svgcss=${svgcss}&secure=${secure}`).catch(e => {
        XenForo.alert("Ошибка синхронизации с сервером, попробуйте еще раз", 1, 10000)
    });
    if (req != '200' || req != '401') {
        XenForo.alert("Ошибка синхронизации с сервером, свяжитесь с разработчиком t.me/hasantigiev or zelenka.guru/lays", 1, 10000)
    }
    else if (req == '401') {
        XenForo.alert("Для вашего профиля не найдены ключи авторизации. Cвяжитесь с разработчиком t.me/hasantigiev or zelenka.guru/lays", 1, 10000)
    }else {
        XenForo.alert("Успех", 1, 10000);
        cacheSync();
        location.reload();
    }
    document.querySelector("input[type=submit]").click();
}

async function usernames() {
    let usernames = document.querySelectorAll(".username span:not(.custom)");
    await parseUsernames(Array.from(usernames));
}

async function parseUsernames(usernames) {
    try {
        for(let e of usernames) parseUsername(e);
    } catch {}
}

async function checkupdate() {
    let response = await request(`${server}/v2/support?ver=${version}`).catch(err => {});
    if (response == 'no' || response == 'dis') { return XenForo.alert("Вышла новая версия BetterLZT!\nСписок изменений можно посмотреть в настройках расширения", 1, 5000); }
    // if (response == 'dis') { return XenForo.alert("Расширение BetterLZT нуждается в обновлении.\nБез него многие функции могут перестать работать.\nПерейдите в настройки", 1, 10000); }
}

async function cacheSync() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    let response = await request(`${server}/v2/sync?user=${nickname}`).catch(err => {});
    if (response != cache && response != '') {
        cache = response;
        await setCache(response);
        console.log('OK')
    }
}

async function setCache(e) {
    return await GM.setValue('cache', e);
}

async function setSecure(e) {
    return await GM.setValue('secure', e);
}


async function parseUsername(e) {
    let data = await JSON.parse(await cache);
    try {
        if (!data.users[e.innerHTML]) { e.classList.add("custom"); return; }
        data = data.users[e.innerHTML];

        if (data && !e.classList.contains("custom") ) {
            e.style = data.css;
            e.classList.add("custom");
            switch (data.status) {
                case "js":
                    e.innerHTML += ` <i title="BetterLZT User" class="fab fa-js-square" style="-webkit-text-fill-color: gold;"></i>`
                    break;
                case "python":
                    e.innerHTML += ` <i class="fab fa-python" style="-webkit-text-fill-color: gold;"></i>`
                    break;
                case "server":
                    e.innerHTML += ` <i title="BetterLZT User" class="fa fa-hdd"></i>`
                    break;
                case "bug":
                    e.innerHTML += ` <i title="BetterLZT User" class="fa fa-bug"></i>`
                    break;
                case "code":
                    e.innerHTML += ` <i title="BetterLZT User" class="fas fa-code"></i>`
                    break;
                case "verified":
                    e.innerHTML += ` <i title="BetterLZT User" class="far fa-badge-check"></i>`
                    break;
                case "gold":
                    e.innerHTML += ` <i title="BetterLZT User" class="fas fa-spinner-third fa-spin" style="--fa-primary-color: #fe6906; --fa-secondary-color: #1a6eff; background: none; -webkit-text-fill-color: gold;"></i>`
                    break;
                case "silver":
                    e.innerHTML += ` <i title="BetterLZT User" class="fas fa-spinner fa-spin"  style="--fa-primary-color: #c0c0c0; --fa-secondary-color: #1a72ff; background: none; -webkit-text-fill-color: #c0c0c0;"></i>`
                    break;
                case "beta":
                    e.innerHTML += ` <i title="BetterLZT User" class="fa fa-heartbeat"></i>`
                    break;
                case "cookie":
                    e.innerHTML += ` <i title="BetterLZT User" class="fas fa-cookie" style="-webkit-text-fill-color: #228e5d;"></i>`
                    break;
                case "admin":
                    e.innerHTML += ` <i title="BetterLZT User" class="fas fa-wrench" style="-webkit-text-fill-color: rgb(150,68,72);"></i> `
                    break;
                case "moderate":
                    e.innerHTML += ` <i title="BetterLZT User" class="fas fa-bolt" style="-webkit-text-fill-color: #12470D;"></i> `
                    break;
                case "smoderate":
                    e.innerHTML += ` <i title="BetterLZT User" class="fas fa-bolt" style="-webkit-text-fill-color: rgb(46,162,74);"></i> `
                    break;
                case "arbitr":
                    e.innerHTML += ` <i title="BetterLZT User" class="fas fa-gavel" style="-webkit-text-fill-color: rgb(255,154,252);"></i> `
                    break;
                case "editor":
                    e.innerHTML += ` <i title="BetterLZT User" class="fas fa-pen" style="-webkit-text-fill-color: rgb(0,135,255);"></i> `
                    break;
                case "designer":
                    e.innerHTML += ` <i title="BetterLZT User" class="fas fa-drafting-compass" style="-webkit-text-fill-color: #5c45ff;"></i>`
                    break;
                case "designer2":
                    e.innerHTML += ` <i title="BetterLZT User" class="fas fa-drafting-compass" style="background: url('https://i.gifer.com/7HHu.gif');-webkit-background-clip: text;-webkit-text-fill-color: transparent;"></i>`
                    break;
                case "walking":
                    e.innerHTML += ` <i title="BetterLZT User" class="fas fa-walking"></i>`
                    break;
                case "usd":
                    e.innerHTML += `<i title="BetterLZT User" class="fas fa-badge-dollar" style="background: url('https://i.gifer.com/7HHu.gif');-webkit-background-clip: text;-webkit-text-fill-color: transparent;"></i>`
                    break;
                case "custom":
                    e.innerHTML += ` ${data.statusCode}`
                    break;
                default:
                    e.innerHTML += ` <i title="BetterLZT User" class="fa fa-stars"></i>`
                    break;
            }
            // switch (data.premium) {
            //     case "true":
            //         e.innerHTML += ` <span style="-webkit-text-fill-color: #f5f5f5;padding: 2px 8px;margin: 0px 0px 0px 6px;border-radius: 6px 6px 6px 6px;display: inline-block;background: #ff0076;margin-left: 5px;line-height: 16px;font-size: 12px;"> Premium </span>`;
            //         break;
            // }
        }
        if (e.parentNode.parentNode.parentNode.parentElement.parentElement.querySelector(".avatarHolder:not(.custom)") && data.svgcss) {
            let svg = document.createElement('div');
            e.parentNode.parentNode.parentNode.parentElement.parentElement.querySelector(".avatarHolder:not(.custom)").classList.add("custom")
            svg.classList.add("avatarUserBadges");
            svg.innerHTML = `
            <span style="${data.svgcss}" class="avatarUserBadge  Tooltip uniq_default" title="" tabindex="0" data-cachedtitle="${data.bannertxt}">
            </span>`;
            e.parentNode.parentNode.parentNode.parentElement.parentElement.querySelector(".avatarHolder").prepend(svg)
        }
        if (document.querySelector(".avatarScaler") && data.banner && !document.querySelector(".customBanner") && document.querySelectorAll("h1.username")[0].innerHTML.includes(e.innerHTML)) {
            let banner = document.createElement('em');
            banner.classList.add("userBanner");
            banner.classList.add("customBanner");
            banner.classList.add("wrapped");
            banner.style = data.banner;
            banner.innerHTML = `<span class="before"></span><strong>${data.bannertxt}</strong><span class="after"></span>`;
            document.querySelector(".avatarScaler").append(banner);
        }
    } catch {}
}

function setAdblock(e) {
    GM.setValue("adblock", e)
    adblock = e;
    XenForo.alert('AdBlock настроен', 1, 10000)
}

function setLike(e) {
    GM.setValue("hidelike", e)
    hidelike = e;
    XenForo.alert('BetterLZT> Успех!', 1, 10000)
}

function setAva(e) {
    GM.setValue("avamarket", e)
    avamarket = e;
    XenForo.alert('BetterLZT> Успех!', 1, 10000)
}

function setSecretph(e) {
    GM.setValue("secretph", e)
    hidelike = e;
    XenForo.alert('BetterLZT> Успех!', 1, 10000);
}


function setMarketblock(e) {
    GM.setValue("marketblock", e)
    marketblock = e;
    XenForo.alert('BetterLZT> Успех!', 1, 10000)
}

function setTheme(e) {
    GM.setValue("theme", e)
    marketblock = e;
    XenForo.alert('BetterLZT> Успех!', 1, 10000)
}


function setSimps(e) {
    GM.setValue("simps", e)
    simps = e;
    XenForo.alert('BetterLZT> Успех!', 1, 10000);
}

function renderFunctions() {
    unsafeWindow.nickname = nickname;
    unsafeWindow.usercss = usercss;
    unsafeWindow.server = server;
    unsafeWindow.cache = cache;
    unsafeWindow.version = version;
    unsafeWindow.adblock = adblock;
    unsafeWindow.hidelike = hidelike;
    unsafeWindow.marketblock = marketblock;
    unsafeWindow.avamarket = avamarket;
    unsafeWindow.secure = secure;
    unsafeWindow.theme = theme;
    unsafeWindow.simps = simps
    unsafeWindow.setAdblock = e => setAdblock(e);
    unsafeWindow.setMarketblock = e => setMarketblock(e);
    unsafeWindow.setCache = e => setCache(e);
    unsafeWindow.setSecure = e => setSecure(e);
    unsafeWindow.setSecretph = e => setSecretph(e);
    unsafeWindow.setLike = e => setLike(e);
    unsafeWindow.setTheme = e => setTheme(e);
    unsafeWindow.setSimps = e => setSimps(e);
    unsafeWindow.setAva = e => setAva(e);
    unsafeWindow.request = request;
    let torender = [uniqSave, simpsSet, SecretSet, ColorSet, BgSet, dialogWindow, cacheSync, EmojiSet, getUID, usernames, parseUsername, parseUsernames, cacheSync, blockNotice, BannerStyle, NickStyle];
    let funcs = torender.map(e => e.toString());
    let script = document.createElement('script');
    script.appendChild(document.createTextNode(funcs.join("")));
    document.head.appendChild(script);
    renderSettings();
}

function isAd(e) {
    if (adlist_w.some(o => e.innerHTML.toLowerCase().includes(o))) {
        return true;
    }
    return false;
}

function isLink(e) {
    if (adlist_l.some(o => e.innerHTML.toLowerCase().includes(o))) {
        return true;
    }
    return false;
}

async function adBlockDaemon() {
    adblock = await adblock;
    avablock = await avablock;
    if (window.location.pathname == '/' && document.querySelector(".text_Ads") && adblock == 'on') { document.querySelector(".text_Ads").remove(); return;}
    let users = document.querySelectorAll("span.userStatus:not(.blocked)");

    // удаление рекламы в алертах
    if (document.querySelector('[data-author="Реклама"]') && adblock == 'on')
    {
        let ads = document.querySelectorAll('[data-author="Реклама"]');
        ads.forEach(function (e){
            e.remove();
        })
    }

    // Проверка статуса на юзер пейдже
    if (document.querySelector(".current_text:not(.blocked)") && adblock == 'on')
    {
        let e = document.querySelector(".current_text:not(.blocked)");
        let img = document.querySelector(".avatarScaler img");
        if (isAd(e)) {
            e.classList.add("blocked");
            e.innerHTML = "Реклама скрыта";
            img.src = 'https://placehold.co/600x600?text=%D0%A0%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D0%B0%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B0';
        }

        if (isLink(e)) {
            e.classList.add("blocked");
            e.innerHTML = "Реклама скрыта";
        }

    }

    if (users.length < 1 && adblock != 'on') {return;}

    users.forEach(function (e) {
        // проверка на рекламу
        if (isAd(e) && adblock == 'on')
        {
            e.innerHTML = 'Реклама скрыта';
            e.classList.add("blocked");
            // такое говно в будущем стоит переписать =)
            $(e).parent().parent().parent().find(".img")[0].style.backgroundImage = `url('https://placehold.co/600x600?text=%D0%A0%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D0%B0%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B0')`;
            return;
        }
        if (isLink(e) && adblock == 'on')
        {
            e.innerHTML = 'Реклама скрыта';
            e.classList.add("blocked");
            return;
        }
        return;
    })
    simpss = await simps
    simpsss = parseInt(simpss)
    threads = document.querySelectorAll(".discussionListItem");
    threads.forEach(function (e){
        if (simpsss >= 0) {
            if(!e.querySelector(".contest")) {
                if (parseInt(e.querySelector(".pclikeCount").innerHTML) < simpsss) {
                    e.remove();
                }
            }
        }
    })
}

function blockNotice() {
    return XenForo.alert('Первый режим - скрывает все, что есть в базе и НЕ скрывает аватарки при обнаружении рекламы, вне базы\nВторой режим - скрывает все, что есть в базе и СКРЫВАЕТ аватарки при обнаружении рекламы вне базы','Режимы AdBlock');
}

function BannerStyle(type) {
    switch (type) {
        case '1':
            document.getElementsByClassName("BannerCss")[0].value = `border-radius: 6px;background: url('https://media1.giphy.com/media/JtBZm3Getg3dqxK0zP/giphy.gif') center center;text-shadow: 0px 0px 3px #7a00ff, 0px 1px 0px #7a00ff, 1px 2px 0px red, 1px 3px 0px green;color: white`;
            document.getElementsByClassName("UserBannerStyle")[0].style = `border-radius: 6px;background: url('https://media1.giphy.com/media/JtBZm3Getg3dqxK0zP/giphy.gif') center center;text-shadow: 0px 0px 3px #7a00ff, 0px 1px 0px #7a00ff, 1px 2px 0px red, 1px 3px 0px green;color: white`;
            break;
        case '2':
            document.getElementsByClassName("BannerCss")[0].value = `border-radius: 6px;background: url('https://media1.giphy.com/media/3o7522WIg2FkHbCHvO/giphy.gif') center center;text-shadow: 0px 0px 3px #7a00ff, 0px 1px 0px gray, 1px 2px 0px lime, 1px 3px 0px blue;color: white`;
            document.getElementsByClassName("UserBannerStyle")[0].style = `border-radius: 6px;background: url('https://media1.giphy.com/media/3o7522WIg2FkHbCHvO/giphy.gif') center center;text-shadow: 0px 0px 3px #7a00ff, 0px 1px 0px gray, 1px 2px 0px lime, 1px 3px 0px blue;color: white`;

        default:
            break;
    }
}

function NickStyle(type) {
    switch (type) {
        case '1':
            document.getElementsByClassName("UsernameCss")[0].value = `background: url('https://media3.giphy.com/media/h5XENtRSEjj8tELOXW/giphy.gif');text-shadow: 0 0 5px #ff00f7;-webkit-background-clip: text;-webkit-text-fill-color: transparent`;
            document.getElementsByClassName("UsernameStyle")[0].style = `background: url('https://media3.giphy.com/media/h5XENtRSEjj8tELOXW/giphy.gif');text-shadow: 0 0 5px #ff00f7;-webkit-background-clip: text;-webkit-text-fill-color: transparent`;
            break;
        case '2':
            document.getElementsByClassName("UsernameCss")[0].value = `background: url('https://media4.giphy.com/media/dwaeIbBnF6HBu/giphy.gif');text-shadow: 0 0 5px #ff00f7;-webkit-background-clip: text;-webkit-text-fill-color: transparent`;
            document.getElementsByClassName("UsernameStyle")[0].style = `background: url('https://media4.giphy.com/media/dwaeIbBnF6HBu/giphy.gif');text-shadow: 0 0 5px #ff00f7;-webkit-background-clip: text;-webkit-text-fill-color: transparent`;

        default:
            break;
    }
}

function renderSettings() {

    // Проверка на нахождение в профиле и наличие кнопки редактирования профиля
    if (document.querySelector(".secondaryContent a.button.block[href='account/personal-details']")) {
        let profileeditbtn = document.createElement('a')
        profileeditbtn.classList.add('block');
        profileeditbtn.classList.add('button');
        profileeditbtn.onclick = function () {
            dialogWindow();
        };
        profileeditbtn.innerHTML = 'Настроить BetterLZT';
        document.querySelector(".topblock .secondaryContent").append(profileeditbtn)
    }

    $('ul.secondaryContent li:nth-child(10)').after('<li><a href="account/uniq/test">Настройка BetterLZT</a></li>');
    if(window.location.pathname == "/account/uniq/test") {
        if (document.querySelector("[name=banner_text]").value == "Lolzteam") document.querySelector("[name=banner_text]").value = "BetterLZT";
        let adduniq = document.createElement("div");
        adduniq.style = "margin-bottom: 25px";
        adduniq.innerHTML = `
        <div class="menu">

        <div class="menu-header">
            <h1 class="menu-header-title">Настройки BetterLZT</h1>
            <br>
            <h2 class="menu-header-title">AdBlock <a onclick="blockNotice();" style="text-decoration: underline dotted; animation: pulse 2s infinite;">(?)</a></h2>

        </div>
        <div class="menu-body">
            <a onclick="uniqSave();">Применить уник</a>
            <a onclick="BannerStyle('1');">Стиль лычки 1</a>
            <a onclick="BannerStyle('2');">Стиль лычки 2</a>
            <a onclick="NickStyle('1');">Стиль ника 1</a>
            <a onclick="NickStyle('2');">Стиль ника 2</a>
            <br>
            <a href="https://telegra.ph/BetterLZT-v3-08-04">Подробнее о стилях и AdBlock</a>
            <br>
            <a href="https://greasyfork.org/ru/scripts/470626-betterlzt">Обновить расширение/Базы AdBlock'а</a>
        </div>

    </div><style>
    @keyframes pulse {
        0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 white;
            border-radius: 100%;
            opacity: 0.5;
        }

        70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px white;
            border-radius: 100%;
            opacity: 0.5;
        }

        100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 white;
            border-radius: 100%;
            opacity: 0.5;
        }
    }
:root {
    --c-text-primary: #edeeef;
    --c-text-secondary: #d4d7e1;
    --c-border-primary: #323232;
    --c-bg-body: #000;
    --c-bg-primary: #1b1d23;
    --c-bg-secondary: #000001;
    --c-bg-button: #343844;
}

.menu {
  width: 90%;
  max-width: 320px;
  background-color: var(--c-bg-primary);
  transition: background-color .30s ease;
  border-radius: 15px;
}

/* header */
.menu-header {
  padding: 1rem;
}

.menu-heaser-title {
  font-size: 1.2rem;
  color: var(--c-text-secondary);
  font-weight: 700;
}

/* theme switcher */
.theme-switcher input {
  display: none;
}

.theme-switcher {
  position: relative;
  background-color: var(--c-bg-secondary);
  border-radius: 10px;
  display: flex;
  padding: 0 3px;
}

.theme-switcher label {
  position: relative;
  z-index: 2;
  width: calc(100% / 3);
  color: var(--c-text-secondary);
}

.theme-switcher label span {
  padding: 8px 0;
  display: flex;
  justify-content: center;
  font-weight: 600;
  opacity: 0.8;
}

.theme-switcher label span:hover {
  opacity: 1;
  cursor: pointer;
}

.theme-switcher .slider {
  position: absolute;
  z-index: 1;
  width: calc((100% - 6px) / 3);
  top: 3px;
  transform: translatex(-110%);
  bottom: 3px;
  border-radius: 8px;
  transition: .30s ease, transform 0.25s ease-out;
  background-color: var(--c-bg-button);
}

.theme-switcher input:nth-of-type(1):checked ~ .slider {
  transform: translateX(0);
}
.theme-switcher input:nth-of-type(2):checked ~ .slider {
  transform: translateX(100%);
}
.theme-switcher input:nth-of-type(3):checked ~ .slider {
  transform: translateX(200%);
}

/* Menu body */
.menu-body {
  padding: 1rem;
  border-top: 1px solid var(--c-border-primary);
  transition: border-color .30s ease;
}

.menu-body a {
  text-decoration: none;
  color: inherit;
  display: flex;
  padding: 0.6rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  transition: .30s ease;
}

.menu-body a:hover {
  background-color: var(--c-bg-secondary);
}

ion-icon {
  margin-right: 5px;
  font-size: 20px;
  margin-top: 2px;
}</style>
`
        document.getElementsByClassName("ToggleTriggerAnchor")[0].prepend(adduniq);
    }
}


async function dialogWindow() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim().replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim().replace(" Premium", "").trim();
    let data = await JSON.parse(await cache);
    data = data.users[nickname];
    adblockt = false;
    marketblockt = false;
    hideliket = false;
    hideava = false;
    if (await adblock == 'on') {
        adblockt = true;
    }
    if (await marketblock == 'on') {
        marketblockt = true;
    }
    if (await hidelike == 'on') {
        hideliket = true;
    }
    if (await avamarket == 'on') {
        hideava = true;
    }

    let htmlall = `
    <details style="margin-top: -25px; padding: 10px; border-radius: 6px; background-color: rgb(54, 54, 54);">
        <summary>Основные<br><i>Реклама, секретный вопрос</i></summary>
        <div style="margin-top: -25px">
            <i>Блокировщик рекламы <input onclick="setAdblock('${adblockt ? 'off' : 'on'}');" type="checkbox" id="scales" name="scales" ${adblockt ? 'checked' : ''} /> </i>

            <i>Скрывать продавцов в ЧС <input onclick="setMarketblock('${marketblockt ? 'off' : 'on'}');" type="checkbox" id="scales" name="scales" ${marketblockt ? 'checked' : ''} /> </i>
            
            <i>Скрывать счетчик лайков в профиле <input onclick="setLike('${hideliket ? 'off' : 'on'}');" type="checkbox" id="scales" name="scales" ${hideliket ? 'checked' : ''} /> </i>

            <i>Скрывать аватарки на маркете <input onclick="setAva('${hideava ? 'off' : 'on'}');" type="checkbox" id="scales" name="scales" ${hideava ? 'checked' : ''} /> </i>

            <i>Секретная фраза</i>
            <input id="secretph" placeholder="Секретная фраза"> <a onclick="SecretSet()" class="button leftButton primary">Сохранить</a>
          
            <i>Скрывать тему на главной, если число симпатий у ТС меньше, чем:</i>
            <input id="simps" placeholder="Число симпатий"> <a onclick="simpsSet()" class="button leftButton primary">Сохранить</a>
        </div>
    </details>

    <details style="margin-top: -25px; padding: 10px; border-radius: 6px; background-color: rgb(54, 54, 54);">
        <summary>Выбор иконки у ника<br><i>Для выбора просто кликните на понравившуюся иконку</i></summary>
        <div style="margin-top: -25px">
        <button onclick="EmojiSet('walking')"><i class="fas fa-walking"></i></button><button onclick="EmojiSet('code')"><i class="fas fa-code"></i></button> <button onclick="EmojiSet('silver')"><i class="fas fa-spinner fa-spin"></i></button>
        <p>Premium  <i> <i class="fas fa-info"></i> Нужен Premium</i></p> <button onclick="EmojiSet('cookie')"><i class="fas fa-cookie" style="color: #228e5d;"></i></button><button onclick="EmojiSet('gold')"><i title="BetterLZT User" class="fas fa-spinner-third fa-spin"  style="--fa-primary-color: #fe6906; --fa-secondary-color: #1a6eff; background: none; -webkit-text-fill-color: gold;"></i></button><button onclick="EmojiSet('js')"><i class="fab fa-js-square" style="-webkit-text-fill-color: gold;"></i></button><button onclick="EmojiSet('python')"><i class="fab fa-python" style="-webkit-text-fill-color: gold;"></i></button><button onclick="EmojiSet('verified')"><i class="fas fa-badge-check"></i></button>
        <button onclick="EmojiSet('admin')"><i class="fas fa-wrench" style="color: rgb(150,68,72);"></i></button><button onclick="EmojiSet('moderate')"><i class="fas fa-bolt" style="color: #12470D"></i></button><button onclick="EmojiSet('smoderate')"><i class="fas fa-bolt" style="color: rgb(46,162,74);"></i></button><button onclick="EmojiSet('arbitr')"><i class="fas fa-gavel" style="color: rgb(255,154,252);"></i></button><button onclick="EmojiSet('editor')"><i class="fas fa-pen" style="color: rgb(0,135,255);"></i></button>
        <button onclick="EmojiSet('designer')"><i class="fas fa-drafting-compass" style="color: #5c45ff;"></i></button><button onclick="EmojiSet('designer2')"><i class="fas fa-drafting-compass" style="background: url('https://i.gifer.com/7HHu.gif');-webkit-background-clip: text;-webkit-text-fill-color: transparent;"></i></button><button onclick="EmojiSet('usd')"><i class="fas fa-badge-dollar" style="background: url('https://i.gifer.com/7HHu.gif');-webkit-background-clip: text;-webkit-text-fill-color: transparent;"></i></button>
        <a class="button leftButton primary" target="_blank" href="https://hasantigiev.t.me">Установить свое</a>

        <a class="button leftButton primary" onclick="EmojiSet('default')">Установить стандартное</a>
        </div>
    </details>

    <details style="margin-top: -25px; padding: 10px; border-radius: 6px; background-color: rgb(54, 54, 54);">
        <summary>Кастомизация</summary>
        <div style="margin-top: -25px">
            <i>Фон<br>Все пользователи расширения при посещении Вашего профиля увидят Ваш фон, для отключения напишите "null"</i>
            <input id="bgurl" placeholder="Ссылка на картинку"> <a onclick="BgSet()" class="button leftButton primary OverlayTrigger">Сохранить</a>
            
            <i>Данный фон Вы будете видеть на всех страницах форума и маркета</i>
            
            <br>
            <i>Своя тема<br>Все пользователи расширения при посещении Вашего профиля увидят замененный цвет, для отключения напишите "null"</i>
            <i> <i class="fas fa-italic"></i> Нужен Premium</i>
            <input id="colorbg" placeholder="цвет в формате rgba()"> <a onclick="ColorSet()" class="button leftButton primary OverlayTrigger">Сохранить</a>

            <i>Данную тему Вы будете видеть на всех страницах форума и маркета</i>
            </div>
    </details>

    <details style="margin-top: -25px; padding: 10px; border-radius: 6px; background-color: rgb(54, 54, 54);">
        <summary>Готовые темы</summary>
        <div style="margin-top: -25px">
            <a class="button leftButton primary" onclick="setTheme('1')">Amoled</a> | <a class="button leftButton primary" onclick="setTheme('2')">BetterLZT</a> | <a class="button leftButton primary" onclick="setTheme('3')">Lime</a>
            
            <a class="button leftButton primary" onclick="setTheme('4')">LZT Purple</a> | <a class="button leftButton primary" onclick="setTheme('5')">Lzt Sakura</a>
            
            <a class="button leftButton primary" onclick="setTheme('null')">Отключить</a> 
        </div>
    </details>

    <details style="margin-top: -5px; padding: 10px; border-radius: 6px; background-color: rgb(54, 54, 54);">
        <summary>Базы AdBlock и обновления</summary>
        <div style="margin-top: -25px">
        <iframe src="https://tv.hasanbet.site/better/hub.php?user=${nickname}&version=${version}" frameborder="0" width="100%"></iframe>
        </div>
    </details>

    <details style="margin-top: -25px; padding: 10px; border-radius: 6px; background-color: rgb(54, 54, 54);">
        <summary>Управление Premium</summary>
        <div style="margin-top: -25px">
            <iframe src="https://tv.hasanbet.site/better/prem.php?user=${nickname}" frameborder="0" width="100%"></iframe>
        </div>
    </details>

    <a class="button leftButton primary" href="account/uniq/test">Настроить уник</a>

    <a class="button leftButton primary" href="https://greasyfork.org/ru/scripts/470626-betterlzt">Обновить</a>

    <a class="button leftButton primary" target="_blank" href="https://hasantigiev.t.me">Приобрести Premium</a>
    `

    let html_prem = `
    <iframe src="https://tv.hasanbet.site/better/ver.php?user=${nickname}&version=${version}" frameborder="0" width="100%" style="margin-top: -25px;" height="70px"></iframe>

    ${htmlall}

    <style>
    details button {
        width: 35px; height: 35px; color: rgb(34,142,93); background: #303030; border: solid 1px white; font-size: 25px; margin-bottom: 5px; margin-left: 5px;
    }
    details input {
        padding: 6px;
        border-radius: 6px;
        height: 20px;
        background: #303030;
        color: white;
        border: 1px solid rgb(54, 54, 54);
    }
    </style>
    `;
    return  XenForo.alert(
        `${html_prem}`, 'BetterLZT v.'+version
    )
}

async function EmojiSet(emoji) {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    request(`${server}/v5/emoji?user=${nickname}&emoji=${emoji}`).catch(e => {
        XenForo.alert("Ошибка синхронизации с сервером, попробуйте еще раз", 1, 10000)
    });
    cacheSync();
    location.reload();
}

async function BgSet() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    bg = document.querySelector("#bgurl").value
    request(`${server}/v5/bg?user=${nickname}&bg=${bg}`).catch(e => {
        XenForo.alert("Ошибка синхронизации с сервером, попробуйте еще раз", 1, 10000)
    });
    cacheSync();
    location.reload();
}

async function SecretSet() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    secretph = document.querySelector("#secretph").value;
    setSecretph(secretph);
}

async function simpsSet() {
    simps = document.querySelector("#simps").value;
    setSimps(simps);
}

async function ColorSet() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    bg = document.querySelector("#colorbg").value
    request(`${server}/v5/color?user=${nickname}&color=${bg}`).catch(e => {
        XenForo.alert("Ошибка синхронизации с сервером, попробуйте еще раз", 1, 10000)
    });
    cacheSync();
    location.reload();
}

async function currencyRead(url) {
    // from Vuchaev2015 <3
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function marketRender() {
    if (document.location.host != "lzt.market") {return false;}
    // Курс валют from Vuchaev2015
    const currencyMap = {
        'Рубль': 'rub',
        'Гривна': 'uah',
        'Тенге': 'kzt',
        'Бел. рубль': 'byn',
        'Доллар': 'usd',
        'Евро': 'eur',
        'Фунт стерлингов': 'gbp',
        'Юань': 'cny',
        'Турецкая лира': 'try'
    };

    const currencySymbolMap = {
        'rub': '₽',
        'uah': '₴',
        'kzt': '₸',
        'byn': 'BYN',
        'usd': '$',
        'eur': '€',
        'gbp': '£',
        'cny': '¥',
        'try': '₺'
    };
    let curr_api = "https://raw.githubusercontent.com/fawazahmed0/currency-api/1/latest/currencies/";
    const chosenCurrency = document.querySelector("#content > div > div > aside > div > div > div:nth-child(2) > div > div.marketSidebarMenu.bordered-top > div > form > div > a > span").textContent.trim().split(' — ')[0];
    const currency = currencyMap[chosenCurrency];
    const currencySymbol = currencySymbolMap[currency];
    const usd_url = `${curr_api}/usd/${currency}.json`;
    const eur_url = `${curr_api}/eur/${currency}.json`;
    const cny_url = `${curr_api}/cny/${currency}.json`;

    const usd_value = await currencyRead(usd_url);
    const eur_value = await currencyRead(eur_url);
    const cny_value = await currencyRead(cny_url);
    const datecurr = usd_value['date'];

    const currencies = [
        { name: 'USD', value: usd_value[currency].toFixed(2) },
        { name: 'EUR', value: eur_value[currency].toFixed(2) },
        { name: 'CNY', value: cny_value[currency].toFixed(2) }
    ];

    const currencyHtml = currencies.map((currency, index) => `
    <div class="item">
        <div class="trimmedTitle">${currency.name}</div>
        <div class="paymentFooter">
            <span class="priceBadgeTransparent">${currency.value} ${currencySymbol}</span>
        </div>
    </div>
    ${index === currencies.length - 1 ? '' : '<br>'}
`).join('');


    const html = `
        <br><div class="secondaryContent">
            <h3>Курс валют на ${datecurr}</h3>
            <div class="marketCurrencyApi marketCurrencyItems">
                <div class="wrapper">
                    ${currencyHtml}
                </div>
            </div>
        </div>
    `;

    document.querySelector('#content > div > div > aside > div > div > div:nth-child(2)').innerHTML += html;

    if(window.location.href.includes('goods/add')) {
        if(document.querySelector(".bbCodeSpoilerContainer")){
            document.querySelector(".bbCodeSpoilerContainer button").click()
        }
    }

    // <div class="section">
	// 	<a href="balance/deposit/problem" class="depositProblemButton button dark full large button" style="border-radius: 10px;">Не пришли деньги?</a>
	// </div>
    // let marketsettings = document.createElement("div")
    // marketsettings.classList.add("section")
    // marketsettings.innerHTML = `<a class="depositProblemButton button dark full large button" style="border-radius: 10px;">Настройки BetterLZT</a>`
    if (marketblock == 'on') {
        alerts = document.querySelectorAll(".itemIgnored");
        alerts.forEach(function (e){
            e.remove();
        })
    }

    if(document.querySelector(".sidebarUserAvatar") && await avamarket == 'on') {
        document.querySelector(".sidebarUserAvatar").remove();
    }
}