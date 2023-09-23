// ==UserScript==
// @name         BetterLZT
// @namespace    hasanbet
// @version      v40
// @description  Сделай свой жизнь на LolzTeam проще!
// @author       https://zelenka.guru/lays (openresty)
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        unsafeWindow
// @connect      lzt.hasanbek.ru
// @connect      tv.hasanbet.site
// @connect      localhost
// @run-at       document-body
// @license MIT
// ==/UserScript==


const
    version         = "4.0",
    blzt_link_tos   = "https://zelenka.guru/threads/5816508/",
    blzt_link_trust = "https://zelenka.guru/threads/5821466/",
    server          = "http://lzt.hasanbek.ru:8880",
    adlist_w        = ["zelenka.guru/threads/3649746", "http://proxysoxy.com", "zelenka.guru/threads/5720998", "https://zelenka.guru/threads/5488501", "https://zelenka.guru/threads/4871985/", "zelenka.guru/threads/3649746", "zelenka.guru/threads/5402454", "zelenka.guru/threads/2630352", "https://t.me/poseidon_project", "https://zelenka.guru/threads/4826265/", "zelenka.guru/threads/4939541", "zelenka.guru/threads/4073607", "zelenka.guru/threads/5071761/", "https://zelenka.guru/threads/3695705/", "zelenka.guru/members/4177803", "@verif_ads", "verifteam", "SmmPanelUS.com", "lteboost.ru"],
    adlist_l        = ["threads", "members", "lolz.live", "zelenka.guru", "t.me"],
    adlist_white    = ["https://zelenka.guru/threads/5456926/", "zelenka.guru/threads/5545248/"];

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
    avablock,
    contestblock,
    uniqstatus,
    shortcut;

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
    uniqstatus  = await GM.getValue("uniqstatus") ? GM.getValue("uniqstatus") : 'null';
    contestblock= await GM.getValue("contestblock") ? GM.getValue("contestblock") : 'null';
    shortcut   = await GM.getValue("shortcut") ? GM.getValue("shortcut") : 'null';
    window.addEventListener("DOMContentLoaded",async (event) => {
        if (await GM.getValue("firstrun") != "ok") {
            XenForo.alert(`Благодарим за установку расширения!\nПеред началом использования прочтите соглашение: ${blzt_link_tos}`, "[BetterLZT] Добро пожаловать!");
            await GM.setValue("firstrun", "ok");
        }
        // if (await GM.getValue("firsttrust2") != "ok") {
        //     XenForo.alert(`<h1>Переработка алгоритма "Фактора Доверия".</h1><h3>Что это?</h3>- Специальный алгоритм определяет уровень доверия к пользователю по шкале, от 0 до 100. Нормальное значение среднего пользователя = 35 и выше. Функция на стадии бета-тестирования, все предложения и недочеты просим присылать в тему указанную ниже<h3>Переработка алгоритма</h3>- Уровень доверия каждого пользователя, который имел средний рейтинг ≥ 5 был повышен. Однако, рейтинг некоторых пользователей остался неизменным, в таком случае можно обратиться к разработчику и уточнить, объективная ли это оценка, или же алогритм выставил неверную оценку. <br><b>Хотите сравнить рейтинг До и После?</b> На страничке нашего расширение в 'GreasyFork' можно откатиться до предыдущей версии (v30), сверить новый и старый рейтинг, а затем установить вновь новую версию<br><b>Спасибо за запуск BetterLZT, именно Вы помогаете нам становиться нам лучше с каждым днем.</b> <h3>Подробнее в статье: ${blzt_link_trust}</h3>`, "Фактор доверия 'BetterLZT'.");
        //     await GM.setValue("firsttrust2", "ok")
        // }
        profileRender();
        themeRender();
        renderFunctions();
        userid   = document.querySelector("input[name=_xfToken").value.split(",")[0];
        nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
        cacheSync();
        usernames();
        marketRender();
        threadRender();
    })
    setInterval(async () => {
        adBlockDaemon();
        daemon();
    }, 0);
    setInterval(usernames, 500);
    checkupdate();
})();

async function threadRender() {
    if (!window.location.pathname.includes('threads')) {return;}
    // Быстрый репорт, спасибо Jack'у
    const buttons = {
        "Флуд / Оффтоп / Спам / Бесполезная тема": {
            name: '1.1',
        },
        "Создание темы не в соответствующем разделе": {
            name: '2.12',
        },
        "Неправильное оформление темы": {
            name: '3.2',
        },
    }
    const _xfToken = document.querySelector('input[name="_xfToken"]').value;

    async function postData(url = '', formData) {
        return await fetch(url, { method: 'POST', body: formData });
    }

    function addButtonToPosts() {
        const blocks = document.querySelectorAll('#messageList > li');
        for(let block of blocks) {
            if (block.querySelector(".custom-button")) {
                continue;
            }

            for(let key in buttons) {
                let name = buttons[key].name;
                let message = buttons[key].message;
                let span = document.createElement('span');
                span.innerText = name;
                span.className = "custom-button";
                span.setAttribute('style', 'font-weight: bold; padding: 3px 10px; background: #218e5d; border-radius: 50px; margin-right: 5px; cursor: pointer;')
                span.onclick = function() {
                    if(!confirm('Вы действительно хотите отправить жалобу?')) return false;
                    let formData = new FormData();
                    formData.append("message", key);
                    formData.append("is_common_reason", 1);
                    formData.append("_xfToken", _xfToken);
                    formData.append("_xfNoRedirect", 1);
                    formData.append("_xfToken", _xfToken);
                    formData.append("redirect", window.location.href);
                    postData('posts/' + block.id.split('-')[1] +'/report', formData);
                    XenForo.alert('Жалоба отправлена', '', 5000);
                }
                if(block.querySelector('.publicControls')) block.querySelector('.publicControls').prepend(span);
            }
        }
    }

    addButtonToPosts();

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                addButtonToPosts();
            }
        });
    });

    observer.observe(document.getElementById('messageList'), { childList: true });


}

async function shortcutCall() {
    document.querySelector(".fr-element.fr-view.fr-element-scroll-visible p").innerHTML += await shortcut;
}

async function daemon() {
    //шорткаты
    if (shortcut != 'null' && !document.querySelector("#lzt-better-shortcut") && window.location.pathname.includes("threads")) {
        let cutbtn = document.createElement("div")
        cutbtn.id = "lzt-better-shortcut";
        cutbtn.classList.add("lzt-fe-se-extraButton")
        cutbtn.onclick = async function() {
            await shortcutCall();
        };
        cutbtn.title = "Быстрая вставка";
        cutbtn.innerHTML = `<i class="fas fa-clone"></i>`;
        document.querySelector(".lzt-fe-se-extraButtonsContainer.js-lzt-fe-extraButtons").append(cutbtn);
    }

    let nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
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
            let fastinfo = await JSON.parse(await request(`${server}/v6/fast?id=${value}`));

       
                let text = `
                <h3>${fastinfo.title} | ${fastinfo.ammount} RUB</h3>
                ${fastinfo.totalusers} / ${fastinfo.maxusers} <progress value="${fastinfo.totalusers}" max="${fastinfo.maxusers}">${fastinfo.totalusers} / ${fastinfo.maxusers}</progress>
                ${fastinfo.needprem ? '<i>Для участия требуется подписка BetterLZT+</i>' : ''}
                <br>
                ${fastinfo.users[nickname] ? 'Вы уже приняли участие в данном розыгрыше' : `<a onclick="doFast(${fastinfo.id})">Принять участие</a>`}
                `
                document.querySelector("blockquote").innerHTML = document.querySelector("blockquote").innerHTML.replace(/\[betterfast=.*?\].*?\[\/betterfast\]/g, text);
           
        }

      
    }
    return;
}

async function doFast(id) {
    let nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    let answer = await request(`${server}/v6/dofast?id=${id}&nick=${nickname}`)
    if (answer == "200") {
        document.querySelector("blockquote").innerHTML = document.querySelector("blockquote").innerHTML + `<br> Вы успешно приняли участие`;
    }
    else if (answer == "201") {
        XenForo.alert("Вы уже приняли участие в розыгрыше", 1, 10000)
    }
    else if (answer == "202") {
        XenForo.alert("Увы, вы неуспели принять участие в розыгрыше", 1, 10000)
    }
    else if (answer == "403") {
        XenForo.alert("Для участия в данном розыгрыше нужен Premium", 1, 10000)
    }
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
        link.href = "https://tv.hasanbet.site/better/css/" + await theme + ".css";
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
        if (data.profilebg) {
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

    // let deposit = parseInt(document.querySelector('h3.amount').innerHTML.replace('₽','').replace(' ',''));
    // if (deposit >= 10000 && deposit < 50000) {
    //     let pref = document.createElement('span');
    //     pref.style = `color: #f5f5f5;padding: 2px 8px;
    //     margin: 0px 0px 0px 6px;
    //     border-radius: 0px 6px 6px 0px;
    //     display: inline-block;
    //     margin-left: 25px;
    //     background: #47626f;
    //     line-height: 16px;
    //     font-size: 12px;
    //     -webkit-background-clip: text;-webkit-text-fill-color: white;`;
    //     pref.innerHTML = "Депозит";
    //     pref.title = "Страховой депозит: "+document.querySelector('h3.amount').innerHTML;
    //     let nickarea = document.querySelector("h1 span").append(pref);
    // }
    // if (deposit >= 50000 && deposit < 100000) {
    //     let pref = document.createElement('span');
    //     pref.style = `color: #f5f5f5;padding: 2px 8px;
    //     margin: 0px 0px 0px 6px;
    //     border-radius: 0px 6px 6px 0px;
    //     display: inline-block;
    //     margin-left: 25px;
    //     background: #8a315d;
    //     line-height: 16px;
    //     font-size: 12px;
    //     -webkit-background-clip: text;-webkit-text-fill-color: white;`;
    //     pref.innerHTML = "Депозит";
    //     pref.title = "Страховой депозит: "+document.querySelector('h3.amount').innerHTML;
    //     let nickarea = document.querySelector("h1 span").append(pref);
    // }
    // if (deposit >= 100000) {
    //     let pref = document.createElement('span');
    //     pref.style = `color: #f5f5f5;padding: 2px 8px;
    //     margin: 0px 0px 0px 6px;
    //     border-radius: 0px 6px 6px 0px;
    //     margin-left: 25px;
    //     display: inline-block;
    //     background: #8152C6;
    //     line-height: 16px;
    //     font-size: 12px;
    //     -webkit-background-clip: text;-webkit-text-fill-color: white;`;
    //     pref.innerHTML = "Депозит";
    //     pref.title = "Страховой депозит: "+document.querySelector('h3.amount').innerHTML;
    //     let nickarea = document.querySelector("h1 span").append(pref);
    // }
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


    // TrustFactor
    let blzt_trust_val = 0;

    let blzt_puser_likes = parseInt(document.querySelector(".page_counter .count").innerHTML.replace(' ', ''));
    let blzt_puser_nick = document.querySelector("h1.username span"),
        blzt_puser_nick_val = blzt_puser_nick.innerHTML.replace(/ <i.*?>.*?<\/i>/ig,''),
        blzt_puser_role = blzt_puser_nick.classList,
        blzt_puser_deposit = parseInt(document.querySelector('h3.amount').innerHTML.replaceAll(' ','').replace('₽',''));
        
    if (blzt_puser_deposit > 10000) {
        blzt_trust_val+=10;
    }   
    if (blzt_puser_deposit > 20000) {
        blzt_trust_val+=10;
    }   
    if (blzt_puser_deposit > 50000) {
        blzt_trust_val+=10;
    }   
    if (blzt_puser_deposit > 100000) {
        blzt_trust_val+=20;
    }   
    if (blzt_puser_deposit > 200000) {
        blzt_trust_val+=10;
    }   
    if (blzt_puser_deposit > 300000) {
        blzt_trust_val+=15;
    }   
    if (blzt_puser_deposit > 500000) {
        blzt_trust_val+=10;
    }   
    if (blzt_puser_deposit > 700000) {
        blzt_trust_val+=20;
    }   


    if (blzt_puser_likes > 100) {
        blzt_trust_val+=5;
    }
    if (blzt_puser_likes > 200) {
        blzt_trust_val+=10;
    }
    if (blzt_puser_likes > 500) {
        blzt_trust_val+=10;
    }
    if (blzt_puser_likes > 1000) {
        blzt_trust_val+=13;
    }
    if (blzt_puser_likes > 2000) {
        blzt_trust_val+=7;
    }
    if (blzt_puser_likes > 3000) {
        blzt_trust_val+=10;
    }
    if (blzt_puser_likes > 5000) {
        blzt_trust_val+=10;
    }
    if (blzt_puser_likes > 10000) {
        blzt_trust_val+=15;
    }
    if (blzt_puser_likes > 20000)   {
        blzt_trust_val+=10;
    }
    if (blzt_puser_likes > 40000) {
        blzt_trust_val+=15;
    }

    
    if (blzt_puser_role.contains("style3")) {
        blzt_trust_val+=85;
    }
    if (blzt_puser_role.contains("style4")) {
        blzt_trust_val+=25;
    }
    if (blzt_puser_role.contains("style30")) {
        blzt_trust_val+=35;
    }
    if (blzt_puser_role.contains("style365")) {
        blzt_trust_val+=15;
    }
    if (blzt_puser_role.contains("style353")) {
        blzt_trust_val+=40;
    }
    if (blzt_puser_role.contains("style12")) {
        blzt_trust_val+=35;
    }
    if (blzt_puser_role.contains("style349")) {
        blzt_trust_val+=20;
    }
    if (blzt_puser_role.contains("style350")) {
        blzt_trust_val+=40;
    }
    if (blzt_puser_role.contains("style354")) {
        blzt_trust_val+=35;
    }
    if (blzt_puser_role.contains("style7")) {
        blzt_trust_val+=30;
    }
    if (blzt_puser_role.contains("style26")) {
        blzt_trust_val+=10;
    }
    if (blzt_puser_role.contains("banned")) {
        blzt_trust_val=0;
    }



    if (blzt_trust_val > 100) {
        blzt_trust_val=100;
    }

    if (data) {
        if (data.trustfactor) {
            blzt_trust_val += data.trustfactor;
        }
    }

    let blzt_trust = document.querySelector(".insuranceDeposit");
    let blzt_trust_render = `
    <br>
    <div class="section insuranceDeposit">
        <div class="secondaryContent">
            <h3>
                <a href="${blzt_link_trust}" class="OverlayTrigger username" style="max-width: 200px; word-wrap: break-word;">
                    Фактор доверия (β) ${blzt_puser_nick_val}
                </a>
            </h3>

            <h3 style="margin-bottom: 0px; font-size: 18px !important;" class="amount ${blzt_trust_val > 35 ? 'mainc' : 'redc'}">
            ≈ ${blzt_trust_val} / 100
            </h3>
            <br>
            <a class="button leftButton primary" onclick="voteTrust(${blzt_trust_val})">Изменить рейтинг👍👎</a>
        </div>
    </div>`;
    let blzt_trust_block = document.createElement("div");
        blzt_trust_block.innerHTML = blzt_trust_render;

    blzt_trust.append(blzt_trust_block);
}

function voteTrust(trust) {
    let html = `
    <i>Введите комментарий, после чего нажмите на кнопку для голосования. КОММЕНТАРИЙ ОБЯЗАТЕЛЕН! <br>О решении вы будете в ЛС форума<br>За спам  вы будете лишены доступа к голосованию и получите пониженый фактор доверия.</i>
    <input id="commentt" style=" padding: 6px;border-radius: 6px;height: 20px;background: #303030;color: white;border: 1px solid rgb(54, 54, 54); placeholder="Почему вы считаете свое решение правильным?">
    <div style="margin-top: 15px;  display: flex; gap: 5px;">
    <a class="button leftButton primary" onclick="commitVote('1', ${trust})">👍</a>
    <a class="button rightButton primary"  onclick="commitVote('2', ${trust})">👎</a></div>
    
    <p>Спасибо за Ваш вклад в BetterLZT</p>
    `;
    XenForo.alert(html, "BetterLZT > Голосование");
}

async function commitVote(type, trust) {
    let comment = document.querySelector("#commentt").value;
    if (!comment)  {
        return XenForo.alert("Укажите комментарий!", 1, 10000)
    }
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    let blzt_puser_likes = parseInt(document.querySelector(".page_counter .count").innerHTML.replace(' ', ''));
    let blzt_puser_nick = document.querySelector("h1.username span"),
        blzt_puser_nick_val = blzt_puser_nick.innerHTML.replace(/ <i.*?>.*?<\/i>/ig,''),
        blzt_puser_role = blzt_puser_nick.classList,
        blzt_puser_deposit = parseInt(document.querySelector('h3.amount').innerHTML.replaceAll(' ','').replace('₽',''));
   
    let response = await request(`${server}/v6/report?user=${nickname}&originuser=${blzt_puser_nick_val}&originurl=${window.location.pathname}&originaction=${type}&origintrust=${trust}&origindeposit=${blzt_puser_deposit}&originlikes=${blzt_puser_likes}&comment=${comment}`)
    if (response  == "200") {
        return XenForo.alert("Успех!", 1, 10000)
    }
    else if (response == "403") {
        return XenForo.alert("Доступ к функционалу ограничен. Свяжитесь с разработчиком", 1, 10000)
    }
    else {
        return XenForo.alert("Ошибка", 1, 10000)
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
    svg = document.querySelector("textarea[name=banner_icon]").value;
    css = encodeURIComponent(localcss.replace(/\n/g, "").replace(/; +/g, ";"));
    banner = encodeURIComponent(banner.replace(/\n/g, "").replace(/; +/g, ";"));
    bannertxt = encodeURIComponent(bannertxt.replace(/\n/g, "").replace(/; +/g, ";"));
    svgcss = encodeURIComponent(svgcss.replace(/\n/g, "").replace(/; +/g, ";"));
    svg = encodeURIComponent(svg)

    if (secure == 'null') {
        await setSecure(`${document.querySelector("input[name=_xfToken").value.split(",")[0]+document.querySelector("input[name=_xfToken").value.split(",")[1]}`);
    }
    let req = await request(`${server}/v5/new?user=${nickname}&css=${css}&banner=${banner}&bannertxt=${bannertxt}&svgcss=${svgcss}&svg=${svg}`).catch(e => {
        XenForo.alert("Ошибка синхронизации с сервером, попробуйте еще раз", 1, 10000)
    });
    if (await req != '200' && req != '401') {
        XenForo.alert("Ошибка синхронизации с сервером, свяжитесь с разработчиком t.me/hasantigiev or zelenka.guru/lays", 1, 10000)
    }
    if (await req == '401') {
        XenForo.alert("Для вашего профиля не найдены ключи авторизации. Cвяжитесь с разработчиком t.me/hasantigiev or zelenka.guru/lays", 1, 10000)
    }
    if (await req == '200') {
        XenForo.alert("Успех", 1, 10000);
        cacheSync();
        location.reload();
    }
    document.querySelector("input[type=submit]").click();
}

async function usernames() {
    if (await uniqstatus == 'on') {return;}
    let usernames = document.querySelectorAll(".username span:not(.custom)"); 
    try {
        for(let e of usernames) parseUsername(e);
    } catch {}
}


async function checkupdate() {
    try {
         let response = await request(`${server}/v2/support?ver=${version}`).catch(err => {});
        if (response == 'no' || response == 'dis') { 
            let waterm = document.createElement('h1')
            waterm.style = "position:fixed;bottom:5px;right:5px;opacity:0.5;z-index:99;color:white;font-size: 25px;";
            waterm.innerHTML = "BetterLZT Needs an update";
            return document.body.append(waterm); 
        }
        // if (response == 'dis') { return XenForo.alert("Расширение BetterLZT нуждается в обновлении.\nБез него многие функции могут перестать работать.\nПерейдите в настройки", 1, 10000); }
    } catch (error) {
        console.error("[BetterLZT] Failed to check update: "+error)
    }
   
}

async function cacheSync() {
    try {
        nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
        let response = await request(`${server}/v2/sync?user=${nickname}`).catch(err => {});
        if (response != cache && response != '') {
            cache = response;
            await setCache(response);
            console.log('OK')
        }
    } catch (error) {
        console.error("[BetterLZT] Sync error: "+error)
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
            if (data.css)  {
                e.style = data.css;
            }
            e.classList.add("custom");
            if (data.status) {
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
                    case "bmoder":
                        e.innerHTML += `<i class="far fa-user-cog" title="BetterLZT Moderator" style="-webkit-text-fill-color: #810404;"></i>`;
                        break
                    default:
                        e.innerHTML += ` <i title="BetterLZT User" class="fa fa-stars"></i>`
                        break;
                }
            }
        }
        if (e.parentElement.parentElement.parentElement.parentElement.parentElement.classList[0] == "message" && data.svgcss) {
           
            let avatars = e.parentNode.parentNode.parentNode.parentElement.parentElement.querySelectorAll(".avatarHolder:not(.custom)");
            let svg = document.createElement('div');
            svg.classList.add("avatarUserBadges");
            svg.innerHTML = `
            <span style="${data.svgcss}" class="avatarUserBadge  Tooltip ${!data.svg ? 'uniq_default' : ''}" title="${data.bannertxt}" tabindex="0" data-cachedtitle="${data.bannertxt}">
            <div class="customUniqIcon"> ${data.svg ? data.svg : ''} </div>
            </span>`;
            avatars.forEach(el => {
                el.classList.add("custom")
                el.prepend(svg);
            });
        }
        // parentElement.parentElement.parentElement.parentElement.querySelector(".avatarHolder"); 
        if (e.parentElement.parentElement.parentElement.parentElement.querySelector(".avatarHolder") && data.svgcss) {
            let svg = document.createElement('div');
            e.parentElement.parentElement.parentElement.parentElement.querySelector(".avatarHolder:not(.custom)").classList.add("custom")
            svg.classList.add("avatarUserBadges");
            svg.innerHTML = `
            <span style="${data.svgcss}" class="avatarUserBadge  Tooltip ${!data.svg ? 'uniq_default' : ''}" title="${data.bannertxt}" tabindex="0" data-cachedtitle="${data.bannertxt}">
            <div class="customUniqIcon"> ${data.svg ? data.svg : ''} </div>
            </span>`;
            e.parentElement.parentElement.parentElement.parentElement.querySelector(".avatarHolder").prepend(svg)
        }
        // if (e.parentNode.parentNode.parentNode.parentElement.parentElement.querySelector(".avatarHolder:not(.custom)") && data.svgcss) {
        //     let svg = document.createElement('div');
        //     e.parentNode.parentNode.parentNode.parentElement.parentElement.querySelector(".avatarHolder:not(.custom)").classList.add("custom")
        //     svg.classList.add("avatarUserBadges");
        //     svg.innerHTML = `
        //     <span style="${data.svgcss}" class="avatarUserBadge  Tooltip uniq_default" title="" tabindex="0" data-cachedtitle="${data.bannertxt}">
        //     </span>`;
        //     e.parentNode.parentNode.parentNode.parentElement.parentElement.querySelector(".avatarHolder").prepend(svg)
        // }
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

function setUniq(e) {
    GM.setValue("uniqstatus", e)
    uniqstatus = e;
    XenForo.alert('BetterLZT> Успех!', 1, 10000)
}

function setContest(e) {
    GM.setValue("contestblock", e)
    contestblock = e;
    XenForo.alert('BetterLZT> Успех!', 1, 10000)
}

function setSecretph(e) {
    GM.setValue("secretph", e)
    hidelike = e;
    XenForo.alert('BetterLZT> Успех!', 1, 10000);
}

function setShortcut(e) {
    GM.setValue("shortcut", e)
    shortcut = e;
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
    unsafeWindow.shortcut = shortcut;
    unsafeWindow.uniqstatus = uniqstatus
    unsafeWindow.setAdblock = e => setAdblock(e);
    unsafeWindow.setMarketblock = e => setMarketblock(e);
    unsafeWindow.setCache = e => setCache(e);
    unsafeWindow.setSecure = e => setSecure(e);
    unsafeWindow.setSecretph = e => setSecretph(e);
    unsafeWindow.setLike = e => setLike(e);
    unsafeWindow.setTheme = e => setTheme(e);
    unsafeWindow.setSimps = e => setSimps(e);
    unsafeWindow.setAva = e => setAva(e);
    unsafeWindow.setUniq = e => setUniq(e);
    unsafeWindow.setContest = e => setContest(e);
    unsafeWindow.setShortcut = e => setShortcut(e);
    unsafeWindow.request = request;
    let torender = [uniqSave, voteTrust, shortcutSet, commitVote, shortcutCall, simpsSet, doFast, SecretSet, ColorSet, BgSet, dialogWindow, cacheSync, EmojiSet, getUID, usernames, parseUsername, cacheSync, blockNotice, BannerStyle, NickStyle];
    let funcs = torender.map(e => e.toString());
    let script = document.createElement('script');
    script.appendChild(document.createTextNode(funcs.join("")));
    document.head.appendChild(script);
    renderSettings();
}

function isAd(e) {
    if (adlist_w.some(o => e.innerHTML.toLowerCase().includes(o)) && !adlist_white.some(o => e.innerHTML.toLowerCase().includes(o))) {
        return true;
    }
    return false;
}

function isLink(e) {
    if (adlist_l.some(o => e.innerHTML.toLowerCase().includes(o)) && !adlist_white.some(o => e.innerHTML.toLowerCase().includes(o))) {
        return true;
    }
    return false;
}

async function adBlockDaemon() {
    if (await contestblock == 'on' && document.querySelector(".messageText.SelectQuoteContainer.ugc") && document.querySelector(".moneyContestWithValue")) {
        document.querySelector(".messageText.SelectQuoteContainer.ugc").remove()
    }
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
	// проверка на рекламу в минипрофиле
	
	if (document.querySelector(".userTitleBlurb h4") && adblock == 'on')
	{
		let e = document.querySelector(".userTitleBlurb h4");
		let img = document.querySelector(".avatarBox span.img");
		if (isAd(e)) {
			e.classList.add("blocked");
			e.innerHTML = "Реклама скрыта";
			img.style.backgroundImage = `url('https://placehold.co/600x600?text=%D0%A0%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D0%B0%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B0')`;
		}
	}
	if (document.querySelector(".userTitleBlurb h4") && adblock == 'on')
	{
		let e = document.querySelector(".userTitleBlurb h4");
		let img = document.querySelector(".avatarBox span.img");
		if (isLink(e)) {
			e.classList.add("blocked");
			e.innerHTML = "Реклама скрыта";
		}
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

    // $('ul.secondaryContent li:nth-child(10)').after('<li><a href="account/uniq/test">Настройка BetterLZT</a></li>');
    if(window.location.pathname == "/account/uniq/test") {
        if (document.querySelector("[name=banner_text]").value == "Lolzteam") document.querySelector("[name=banner_text]").value = "BetterLZT";
        let adduniq = document.createElement("div");
        adduniq.style = "margin-bottom: 25px";
        adduniq.innerHTML = `
        <div class="menu">

        <div class="menu-header">
            <h1 class="menu-header-title">Настройки бесплатного "Уника"</h1>

        </div>
        <div class="menu-body">
            <a onclick="uniqSave();">Применить уник</a>
            <a onclick="BannerStyle('1');">Анимированная лычка 1</a>
            <a onclick="BannerStyle('2');">Анимированная лычка 2</a>
            <a onclick="NickStyle('1');">Анимированный уник 1</a>
            <a onclick="NickStyle('2');">Анимированный уник 2</a>
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
    uniqstatust = false;
    uniqstatust = false;
    contestblockt = false;
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
    if (await uniqstatus == 'on') {
        uniqstatust = true;
    }
    if (await contestblock == 'on') {
        contestblockt = true;
    }

    let htmlall = `
    <details style="">
        <summary>Основные<br><i>Реклама, секретный вопрос</i></summary>
        <div style="margin-top: -25px">
            <i>Отключить "Уники" от BetterLZT <input onclick="setUniq('${uniqstatust ? 'off' : 'on'}');" type="checkbox" id="scales" name="scales" ${uniqstatust ? 'checked' : ''} /> </i>    

            <i>Блокировщик рекламы <input onclick="setAdblock('${adblockt ? 'off' : 'on'}');" type="checkbox" id="scales" name="scales" ${adblockt ? 'checked' : ''} /> </i>

            <i>Скрывать продавцов в ЧС <input onclick="setMarketblock('${marketblockt ? 'off' : 'on'}');" type="checkbox" id="scales" name="scales" ${marketblockt ? 'checked' : ''} /> </i>
            
            <i>Скрывать счетчик лайков в профиле <input onclick="setLike('${hideliket ? 'off' : 'on'}');" type="checkbox" id="scales" name="scales" ${hideliket ? 'checked' : ''} /> </i>

            <i>Скрывать аватарки на маркете <input onclick="setAva('${hideava ? 'off' : 'on'}');" type="checkbox" id="scales" name="scales" ${hideava ? 'checked' : ''} /> </i>
            
            <i>Скрывать контент с розыгрышей <input onclick="setContest('${contestblockt ? 'off' : 'on'}');" type="checkbox" id="scales" name="scales" ${contestblockt ? 'checked' : ''} /> </i>

            <i>Секретная фраза</i>
            <input id="secretph" placeholder="Секретная фраза"> <a onclick="SecretSet()" class="button leftButton primary">Сохранить</a>

            
            <i>Быстрая вставка текста</i>
            <textarea id="shortcut" placeholder="Секретная фраза">${await shortcut == 'null' ? '' : await shortcut}</textarea><a onclick="shortcutSet()" class="button leftButton primary">Сохранить</a>
          
        </div>
    </details>

    <details style="">
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

    <details style="">
        <summary>Кастомизация<br></summary>
        <div style="margin-top: -25px">
            <h3>Фон</h3>
            <i>Данный фон Вы будете видеть на всех страницах форума и маркета. Так же, он будет виден посетителям Вашего форума (при использовании расширения)</i>
            <input id="bgurl" placeholder="Ссылка на картинку"> <a onclick="BgSet()" class="button leftButton primary OverlayTrigger">Сохранить</a>
            
        
            <h3>Своя тема</h3><i>Данную тему Вы будете видеть на всех страницах форума и маркета. Так же, она будет видна посетителям Вашего форума (при использовании расширения)</i>
            <i> <i class="fas fa-italic"></i> Нужен Premium</i>
            <input id="colorbg" placeholder="цвет в формате rgba()"> <a onclick="ColorSet()" class="button leftButton primary OverlayTrigger">Сохранить</a>

            
            </div>
    </details>

    <details style="">
        <summary>Готовые темы<br></summary>
        <div style="margin-top: -25px">
            <a class="button leftButton primary" onclick="setTheme('1')">Amoled</a> | <a class="button leftButton primary" onclick="setTheme('2')">BetterLZT</a> | <a class="button leftButton primary" onclick="setTheme('3')">Lime</a>
            
            <a class="button leftButton primary" onclick="setTheme('4')">LZT Purple</a> | <a class="button leftButton primary" onclick="setTheme('5')">Lzt Sakura</a>
            
            <a class="button leftButton primary" onclick="setTheme('null')">Отключить</a> 
        </div>
    </details>

    <details style="">
        <summary>Базы AdBlock и обновления<br></summary>
        <div style="margin-top: -25px">
        <iframe src="https://tv.hasanbet.site/better/hub.php?user=${nickname}&version=${version}" frameborder="0" width="100%"></iframe>
        </div>
    </details>

    <details style="">
        <summary>Управление Premium<br></summary>
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
    version ${version}<br><iframe src="https://tv.hasanbet.site/better/premium.php?user=openresty" frameborder="0" width="200px" style="" height="30px"></iframe>
    <style>
    details {
        width: 100%;
        background: #282828;
        box-shadow: 0 0.1rem 1rem -0.5rem rgba(0, 0, 0, .4);
        border-radius: 5px;
        overflow: hidden;
        margin-top: -15px;
   }
    summary i{
        font-size: 10px;
    }
    summary {
        padding: 1rem;
        display: block;
        background: #333;
        padding-left: 2.2rem;
        position: relative;
        cursor: pointer;
   }
    summary:before {
        content: '';
        padding: 3px;
        border-width: 0.4rem;
        border-style: solid;
        border-color: transparent transparent transparent #fff;
        position: absolute;
        top: 1.3rem;
        left: 1rem;
        transform: rotate(0);
        transform-origin: 0.2rem 50%;
        transition: 0.25s transform ease;
   }
    details[open] > div{
        padding: 5px;
    }
    details[open] > summary:before {
        transform: rotate(90deg);
   }
    details summary::-webkit-details-marker {
        display: none;
   }
    details > ul {
        padding-bottom: 1rem;
        margin-bottom: 0;
   }
    
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

async function shortcutSet() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    shortcut = document.querySelector("#shortcut").value;
    setShortcut(shortcut);
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
    if (await marketblock == 'on') {
		alerts = document.querySelectorAll(".itemIgnored");
        alerts.forEach(function (e){
            e.remove();
        })    
	}

    if(document.querySelector(".sidebarUserAvatar") && await avamarket == 'on') {
        document.querySelector(".sidebarUserAvatar").remove();
    }
}
