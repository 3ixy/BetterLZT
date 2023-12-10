const express = require('express')
const app = express()
const port = 8880
 
const fs = require("fs"); 
const users = require("./users.json");
const { group } = require('console');
const axios = require('axios')

setInterval(function(){
	fs.writeFileSync("./users.json", JSON.stringify(users, null, "\t"))  
}, 1500);   


function new_audio(author, name, src){
	if(!users.audio[src]){
		users.audio[src] = {
            author: author,
            name: name,
            src: src
		}
        return true;
	}
    return false;
} 

function new_user(nick, css){
	if(!users.users[nick]){
		users.users[nick] = {
            nick: nick,
            status: 'user',
			// group: group
            css: css
		}
        return true;
	}
    return false;
} 

function v1_editUser(nick, css, banner, bannertxt){
	if(!users.users[nick]){
		users.users[nick] = {
            nick: nick,
            status: 'user',
			banner: banner,
            bannertxt, bannertxt,
            css: css
		}
        return true;
	}
    return false;
} 

function v3_editUser(nick, css, banner, bannertxt, svgcss){
	if(!users.users[nick]){
		users.users[nick] = {
            nick: nick,
            status: 'user',
			banner: banner,
            svgcss: svgcss,
            bannertxt, bannertxt,
            css: css
		}
        return true;
	}
    return false;
} 

async function sendTg(msg) {
    let token = "5039023830:AAECCGjRRqyS0CppezvuuTyJvz2t8-Jdn7Q";
    let chatID = "-4032697012";
    let response = await axios.get(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatID}&text=${msg}`);
    return response.data;
}

function v5_editUser(nick, css, banner, bannertxt, svgcss, svg){
	if(!users.users[nick]){
		users.users[nick] = {
            nick: nick,
            status: 'user',
			banner: banner,
            svgcss: svgcss,
            bannertxt, bannertxt,
            css: css,
            svg: svg
		}
        return true;
	}
    return false;
} 

app.get('/v6/report', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    user = req.query.user ? req.query.user : res.send("err1");
    originuser = req.query.originuser ? req.query.originuser : res.send("err2");
    originurl = req.query.originurl ? req.query.originurl : res.send("err3");
    originaction = req.query.originaction ? req.query.originaction : res.send("err4");
    origintrust = req.query.origintrust ? req.query.origintrust : res.send("err5");
    origindeposit = req.query.origindeposit ? req.query.origindeposit : res.send("err6");
    originlikes = req.query.originlikes ? req.query.originlikes : res.send("err7");
    comment = req.query.comment ? req.query.comment : res.send("err8");
    let originact = originaction;
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    console.log(ip + ":" + user + ":" + comment);
    if (originact == '1' || originact == '2') {
        return res.send('403');
    }
    if (user == "skuns2007") {
        return res.send('403'); 
    }
    if (user == "скит") {
        return res.send('403'); 
    }
    if (user == "flexzi") {
        return res.send('403'); 
    }
    if (ip == "::ffff:176.59.139.178") {
        console.log("banned user");
        return res.send('200')
    }
    
    sendTg(encodeURI(`
Запрос на модерацию от: ${user}
К проверке: ${originuser} (https://zelenka.guru${originurl})
Требование: ${originact}
---
Комментарий от ${user}: ${comment}
    `))
    return res.send('200')
})


app.get('/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    user = req.query.user ? req.query.user : '';
    if (users.users[user])
    {
        return res.send(users.users[user].css)
    }else {
        return res.send("")
    }
})

String.prototype.hashCode = function() {
    var hash = 0,
      i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

app.get('/v5/stemp', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    user = req.query.user ? req.query.user : res.send("err");
    secured = secure + 'bettersecurecode';
    secured = secured.hashCode();
    // console.log(`[SAVE] ${secure} : ${secured} : ${users.users[user].secure ? users.users[user].secure : 'no'}`)
    users.users[user].secure = 'temp'
    return res.send('200')
   
})

app.get('/v5/new', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    user = req.query.user ? req.query.user : res.send("err");
    // groupg = req.query.group ? req.query.group : res.send("err");
    css = req.query.css ? req.query.css : res.send("err");
    banner = req.query.banner ? req.query.banner : res.send("err");
    svgcss = req.query.svgcss ? req.query.svgcss : res.send("err");
    bannertxt = req.query.bannertxt ? req.query.bannertxt : res.send("err");
    svg = req.query.svg ? req.query.svg : 'false';
    console.log(css + ":" +svg + ":" +banner)
    console.log(ip);
    console.log('returned0')
    if (ip == "::ffff:176.59.139.178") {
        console.log("200");
        return res.send('200')
    }
    // console.log(`[SAVE] ${secure} : ${secured} : ${users.users[user].secure ? users.users[user].secure : 'no'}`)
    if (!users.users[user]) {
        v5_editUser(user, css, banner, bannertxt, svgcss, svg);
        console.log('returned')
        return res.send('200')
        
    }
    // if (users.users[user] && !users.users[user].secure){
    //     // users.users[user].secure = secured
    //     return res.send('401')
    // }
    if (users.users[user]) {
        users.users[user].css = css;
        users.users[user].banner = banner;
        users.users[user].svgcss = svgcss;
        users.users[user].svg = svg;
        users.users[user].bannertxt = bannertxt;
        console.log('returned2')
        return res.send('200')
    }
})

app.get('/v6/newaudio', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    author = req.query.author ? req.query.author : res.send("err");
    namee = req.query.name ? req.query.name : res.send("err");
    src = req.query.src ? req.query.src : res.send("err");
    // console.log(`[SAVE] ${secure} : ${secured} : ${users.users[user].secure ? users.users[user].secure : 'no'}`)
    if (!users.users[user]) {
        new_audio(author, namee, src);
        console.log('returned')
        return res.send('200')
        
    }
    // if (users.users[user] && !users.users[user].secure){
    //     // users.users[user].secure = secured
    //     return res.send('401')
    // }
    if (users.users[user]) {
        return res.send('200')
    }
})

app.get('/v5/emoji', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    user = req.query.user ? req.query.user : res.send("err");
    emoji = req.query.emoji ? req.query.emoji : res.send("err");
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    console.log("ICON:"+ip);
    if (!users.users[user].premium) {
        if(emoji == "cookie" || emoji == "gold" || emoji == "js" || emoji == "designer" || emoji == "designer2" || emoji == "usd" || emoji == "python" || emoji == "verified" || emoji == "moderate" || emoji == "smoderate" || emoji == "arbitr" || emoji == "editor" || emoji == "admin") return res.send('403')
        else { users.users[user].status = emoji;
            return res.send(users.users[user])
        } 
    }else {
        users.users[user].status = emoji;
        return res.send(users.users[user])
    }
})

app.get('/v5/emojic', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    user = req.query.user ? req.query.user : res.send("err");
    emoji = req.query.emoji ? req.query.emoji : res.send("err");
    if (!users.users[user].premium) {
        return res.send('403')
    }else {
        users.users[user].statusCode = emoji;
        return res.send(users.users[user])
    }
})

app.get('/v5/color', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    user = req.query.user ? req.query.user : res.send("err");
    color = req.query.color ? req.query.color : res.send("err");
    if (!users.users[user].premium) {
        return res.send('403')
    }else {
        users.users[user].maincolor = color;
        return res.send(users.users[user])
    }
})

app.get('/v5/bg', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    user = req.query.user ? req.query.user : res.send("err");
    bg = req.query.bg ? req.query.bg : res.send("err");
    if (!users.users[user]) {
        return res.send('403')
    }else {
        users.users[user].profilebg = bg;
        return res.send(users.users[user])
    }
})
 

app.get('/v1/support', (req, res) => { 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    ver = req.query.ver ? req.query.ver : '';
    if (ver != "3.0") {
        return res.send("dis");
    }
    return res.send("yes");
})

app.get('/v2/support', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    ver = req.query.ver ? req.query.ver : '';
    if (ver != "4.2") {
        return res.send("dis");
    }
    return res.send("yes");
})


app.get('/v2/sync', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    user = req.query.user ? req.query.user : '';
    console.log(`[V2][Cache]: New sync request from ${user}`)
    return res.send(JSON.stringify(users))
})
app.get('/v2/synced', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    user = req.query.user ? req.query.user : '';
    console.log(`[V2][Cache]: Synced ${user}`)
    return res.send('ok')
})

app.get('/v2/adblock', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    q = req.query.q ? req.query.q : res.send("no");
    if (
        q.toLowerCase().includes("@verif_ads") 
        || q.toLowerCase().includes("t.me") 
        || q.toLowerCase().includes("zelenka.guru") 
        || e.innerHTML.toLowerCase().includes("lolz.live")
        || e.innerHTML.toLowerCase().includes("threads")
        || e.innerHTML.toLowerCase().includes("member")
        ) 
    {
        return res.send("yes")
    }
    return res.send("no")
})

app.get('/new', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    user = req.query.user ? req.query.user : res.send("err");
    // groupg = req.query.group ? req.query.group : res.send("err");
    css = req.query.css ? req.query.css : res.send("err");
    if (!users.users[user]) {
        new_user(user, css)
        return res.send(users.users[user].css)
    }else {
        users.users[user].css = css
        return res.send(users.users[user].css)
    }
})

// v6

app.get('/v6/fast', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    id = req.query.id ? req.query.id : res.send("err");
    if (!users.fasts[id]) {
        return res.send('403')
    }else {
        return res.send(users.fasts[id])
    }
})

app.get('/v6/audio', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    id = req.query.id ? req.query.id : res.send("err");
    if (!users.fasts[id]) {
        return res.send('403')
    }else {
        return res.send(users.audio[id])
    }
})

app.get('/v6/dofast', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    id = req.query.id ? req.query.id : res.send("err");
    nick = req.query.nick ? req.query.nick : res.send("err");
    if (!users.fasts[id]) {
        return res.send('403')
    }else {
        if(users.fasts[id].needprem && !users.users[nick].premium) {
            return res.send('403')
        }
        else if (users.fasts[id].totalusers >= users.fasts[id].maxusers) {
            return res.send('202')
        }
        else if (users.fasts[id].end) {
            return res.send('202')
        }
        else if (users.fasts[id].users[nick]) { 
            return res.send('201')
        }
        else {
            users.fasts[id].users[nick] = true;
            users.fasts[id].totalusers++;
            return res.send('200')
        }
        
    }
})


app.listen(port, () => {
  console.log(`Backend started on port: ${port}`)
})