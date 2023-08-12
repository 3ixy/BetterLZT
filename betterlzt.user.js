// ==UserScript==
// @name         BetterLZT
// @namespace    hasanbet
// @version      v1
// @description  Free UNIQ??? ADBLOCK????
// @author       https://zelenka.guru/openresty (openresty)
// @match        https://zelenka.guru/*
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        unsafeWindow
// @connect      localhost
// @run-at       document-body
// @license MIT
// ==/UserScript==


const
    version  = "1.0",
    server   = "http://localhost:8880",
    adlist   = ["https://zelenka.guru/threads/5488501", "https://zelenka.guru/threads/3695705/", "zelenka.guru/members/4177803", "@verif_ads", "verifteam", "threads", "members", "lolz.live", "zelenka.guru"];

let usercss,
    adblock,
    banner,
    bannertxt,
    nickname,
    userid,
    cache,
    adnicks,
    avablock;
 
(async function() {        
    usercss   = await GM.getValue("usercss") ? GM.getValue("usercss") : 'null';
    banner    = await GM.getValue("banner") ? GM.getValue("banner") : 'null';
    bannertxt = await GM.getValue("bannertxt") ? GM.getValue("bannertxt") : 'null';
    adblock   = await GM.getValue("adblock") ? GM.getValue("adblock") : 'null';
    avablock  = await GM.getValue("avablock") ? GM.getValue("avablock") : 'null';
    cache     = await GM.getValue("cache") ? GM.getValue("cache") : 'null';
    window.addEventListener("DOMContentLoaded",(event) => {
        profileRender();
        renderFunctions();
        userid   = document.querySelector("input[name=_xfToken").value.split(",")[0];
        nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
        cacheSync();
    })
    usernames();
    setInterval(async () => {
        adBlockDaemon();
    }, 0);
    setInterval(usernames, 500);
    checkupdate();
})();

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
    if (data.profilebg) {
        document.querySelector("body").style = `
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        background-repeat: no-repeat;
        background-image: linear-gradient(rgba(54, 54, 54, 0.85), rgba(54, 54, 54, 0.85)), url('${data.profilebg}')`
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
 
function uniqSave() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    localcss = document.getElementsByClassName("UsernameCss")[0].value;
    banner = document.getElementsByClassName("BannerCss")[0].value;
    svgcss = document.getElementsByClassName("BannerCss")[0].value;
    bannertxt = document.querySelector("input[name='banner_text']").value;
    css = encodeURIComponent(localcss.replace(/\n/g, "").replace(/; +/g, ";"));
    banner = encodeURIComponent(banner.replace(/\n/g, "").replace(/; +/g, ";"));
    bannertxt = encodeURIComponent(bannertxt.replace(/\n/g, "").replace(/; +/g, ";"));
    svgcss = encodeURIComponent(svgcss.replace(/\n/g, "").replace(/; +/g, ";"));
    request(`${server}/v3/new?user=${nickname}&css=${css}&banner=${banner}&bannertxt=${bannertxt}&svgcss=${svgcss}`).catch(e => {
        XenForo.alert("Ошибка синхронизации с сервером, попробуйте еще раз", 1, 10000)
    });
    XenForo.alert("Успех", 1, 10000);
    cacheSync();
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
    if (response == 'no') { return XenForo.alert("Доступна новая версия BetterLZT!\nПерейдите в настройки.", 1, 10000); }
    if (response == 'dis') { return XenForo.alert("Расширение BetterLZT нуждается в обновлении.\nБез него многие функции могут перестать работать.\nПерейдите в настройки", 1, 10000); }
}
 
async function cacheSync() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    let response = await request(`${server}/v2/sync?user=${nickname}`).catch(err => {});
    if (response != cache) {
        cache = response;
        await GM.setValue('cache', response)
        console.log('OK')
    }
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
                    e.innerHTML += ` <i class="fab fa-js-square"></i>`
                    break;
                case "server":
                    e.innerHTML += ` <i class="fa fa-hdd"></i>`
                    break;
                case "bug":
                    e.innerHTML += ` <i class="fa fa-bug"></i>`
                    break;
                case "code":
                    e.innerHTML += ` <i class="fas fa-code"></i>`
                    break;
                case "verified":
                    e.innerHTML += ` <i class="far fa-badge-check"></i>`
                    break;
                case "gold":
                    e.innerHTML += ` <i class="fas fa-spinner-third fa-spin" style="--fa-primary-color: #fe6906; --fa-secondary-color: #1a6eff; background: none; -webkit-text-fill-color: gold;"></i>`
                    break;
                case "silver":
                    e.innerHTML += ` <i class="fas fa-spinner fa-spin"  style="--fa-primary-color: #c0c0c0; --fa-secondary-color: #1a72ff; background: none; -webkit-text-fill-color: #c0c0c0;"></i>`
                case "beta":
                    e.innerHTML += ` <i class="fa fa-heartbeat"></i>`
                    break;
                case "custom":
                    e.innerHTML += ` ${data.statusCode}`
                    break;
                default:
                    e.innerHTML += ` <i class="fa fa-stars"></i>`
                    break;
            }
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
 
function setAvablock(e) {
    GM.setValue("avablock", e)
    avablock = e;
}

function renderFunctions() {
    unsafeWindow.nickname = nickname;
    unsafeWindow.usercss = usercss;
    unsafeWindow.server = server;
    unsafeWindow.cache = cache;
    unsafeWindow.adblock = adblock;
    unsafeWindow.avablock = avablock;
    unsafeWindow.setAdblock = e => setAdblock(e);
    unsafeWindow.setAvablock = e => setAvablock(e);
    unsafeWindow.request = request;
    let torender = [uniqSave, getUID, usernames, parseUsername, parseUsernames, cacheSync, blockNotice, BannerStyle, NickStyle];
    let funcs = torender.map(e => e.toString());
    let script = document.createElement('script');
    script.appendChild(document.createTextNode(funcs.join("")));
    document.head.appendChild(script);
    renderSettings();
}
 
function isAd(e) {
    if (adlist.includes(e.innerHTML.toLowerCase()))
    {
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
        
    }
 
    if (users.length < 1 && adblock != 'on') {return;}
    // if (adnicks) {
    //     users.forEach(function (f) {
    //         let nicknamet = e.parentNode.querySelectorAll(".username span");
    //         nicknamet.forEach(function (d) {
    //             if (adnicks.includes(d.innerHTML)) {
    //                 if(d.parentNode.parentNode.nextElementSibling.querySelectorAll(".username span:not(.blocked)")[0]){
    //                     $(e).parent().parent().parent().find(".img")[0].style.backgroundImage
    //                 }
    //             }
    //         })

    //     })
    //     document.querySelectorAll("span.userStatus:not(.blocked)").parentNode.querySelector(".username span");
    // }
 
    users.forEach(function (e) {
        // проверка на рекламу
        if (isAd(e) && adblock == 'on')
        {
            e.innerHTML = 'Реклама скрыта';
            e.classList.add("blocked");
            // такое говно в будущем стоит переписать =)
            $(e).parent().parent().parent().find(".img")[0].style.backgroundImage = `url('https://placehold.co/600x600?text=%D0%A0%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D0%B0%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B0')`;
            let adnick = e.parentNode.querySelector(".username span")
            let replies = e.parentNode.parentNode.nextElementSibling.querySelectorAll(".username span");
            adnicks.push(adnick);
            replies.forEach(function (f) {
                if(f.innerHTML == adnick) {
                    f.parentNode.parentNode.parentNode.querySelector('.img').style.backgroundImage = `url('https://placehold.co/600x600?text=%D0%A0%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D0%B0%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B0')`;
                }
            })
            return;
        }
        return;
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
    if (document.querySelector("a[href='account/personal-details']") && document.querySelector(".avatarScaler")) {
        let profileeditbtn = document.createElement('a')
        profileeditbtn.classList.add('block');
        profileeditbtn.classList.add('button');
        profileeditbtn.href = 'account/uniq/test';
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
            <div class="theme-switcher">
                
                <input type="radio" id="mode1-theme" name="themes" ${adblock == 'on' && avablock == 'off' ? 'checked' : ''}/>
                <label for="mode1-theme" onclick="setAdblock('on'); setAvablock('off');">
                    <span>
                        <ion-icon name="moon"></ion-icon> Режим 1
                    </span>
                </label>
                <input type="radio" id="mode2-theme" name="themes" ${adblock == 'on' && avablock == 'on' ? 'checked' : ''}/>
                <label for="mode2-theme" onclick="setAdblock('on'); setAvablock('on');">
                    <span>
                        <ion-icon name="moon"></ion-icon> Режим 2
                    </span>
                </label>
                <input type="radio" id="off-theme" name="themes" ${adblock != 'on' ? 'checked' : ''}/>
                <label for="off-theme" onclick="setAdblock('off');">
                    <span>
                        <ion-icon name="contrast"></ion-icon> Выкл
                    </span>
                </label>
                <span class="slider"></span>
            </div>
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
            <a href="https://greasyfork.org/ru/scripts/470626-betterlzt">Обновления</a>
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
<button type="button" class="button bbCodeSpoilerButton ToggleTrigger JsOnly" data-target="> .SpoilerTarget1"><span class="SpoilerTitle"><span class="SpoilerTitle">Выбрать иконку возле ника</span></span></button>
<div class="SpoilerTarget1 bbCodeSpoilerText mn-15-0-0 dnone" style="display: block">
<div class="scroll-wrapper allUniqList AllUniqList scrollbar-macosx scrollbar-dynamic" style="position: relative;"><div class="allUniqList AllUniqList scrollbar-macosx scrollbar-dynamic scroll-content scroll-scrolly_visible" style="height: auto; margin-bottom: 0px; margin-right: 0px; max-height: 400px;">

    <h3>Бесплатные</h3>
        <div class="Item" >
            <i class="fas fa-spinner fa-spin"  style="--fa-primary-color: #c0c0c0; --fa-secondary-color: #1a72ff; background: none; -webkit-text-fill-color: #c0c0c0;"></i>
        </div>

        <div class="Item" >
            <i class="fas fa-code"></i>
        </div>
    <h3>Платные</h3>
        <div class="Item">
            <i class="fas fa-spinner-third fa-spin" style="--fa-primary-color: #fe6906; --fa-secondary-color: #1a6eff; background: none; -webkit-text-fill-color: gold;"></i>
        </div>
        <div class="Item">
            <h4><i class="far fa-badge-check"></i> Своя иконка</h4>
        </div>
</div>
<div class="scroll-element scroll-x scroll-scrolly_visible" style=""><div class="scroll-element_outer"><div class="scroll-element_size"></div><div class="scroll-element_track"></div><div class="scroll-bar" style="width: 89px;"></div></div></div><div class="scroll-element scroll-y scroll-scrolly_visible" style=""><div class="scroll-element_outer"><div class="scroll-element_size"></div><div class="scroll-element_track"></div><div class="scroll-bar" style="height: 1px; top: 0px;"></div></div></div></div>
</div>  
`
        document.getElementsByClassName("ToggleTriggerAnchor")[0].prepend(adduniq);
    }
}

async function dialogWindow() {
    let data = await JSON.parse(await cache);
    data = data.users[e.innerHTML];
    if (data.premium) {
        return  XenForo.alert(
            `<details open="">
            <summary>Выбор иконки у ника<br><i>Для выбора просто кликните на понравившуюся иконку</i></summary>
            <div>
            <button onclick="EmojiSet('code')"><i class="fas fa-code"></i></button> | <button onclick="EmojiSet('silver')"><i class="fas fa-spinner fa-spin"></i></button>
             | <button onclick="EmojiSet('js')"><i class="fas fa-js-square"></i></button> | <button onclick="EmojiSet('verified')"><i class="fas fa-badge-check"></i></button>
            </div>
          </details>`, 'BetterLZT'
        )
    }
    return XenForo.alert(
        `<details open="">
        <summary>Выбор иконки у ника<br><i>Для выбора просто кликните на понравившуюся иконку</i></summary>
        <div>
        <button onclick="EmojiSet('code')"><i class="fas fa-code"></i></button> | <button onclick="EmojiSet('silver')"><i class="fas fa-spinner fa-spin"></i></button>
        </div>
      </details>`, 'BetterLZT'
    )
}

async function EmojiSet(emoji) {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    request(`${server}/v5/emoji?user=${nickname}&emoji=${emoji}`).catch(e => {
        XenForo.alert("Ошибка синхронизации с сервером, попробуйте еще раз", 1, 10000)
    });
    cacheSync();
}