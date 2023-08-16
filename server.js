const express = require('express')
const app = express()
const port = 8880
 
const fs = require("fs"); 
const users = require("./users.json");
const { group } = require('console');

setInterval(function(){
	fs.writeFileSync("./users.json", JSON.stringify(users, null, "\t"))  
}, 1500);



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

function v5_editUser(nick, css, banner, bannertxt, svgcss, secured){
	if(!users.users[nick]){
		users.users[nick] = {
            nick: nick,
            status: 'user',
			banner: banner,
            svgcss: svgcss,
            bannertxt, bannertxt,
            css: css,
            secure: secured
		}
        return true;
	}
    return false;
} 

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

app.get('/v1/new', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    user = req.query.user ? req.query.user : res.send("err");
    // groupg = req.query.group ? req.query.group : res.send("err");
    css = req.query.css ? req.query.css : res.send("err");
    banner = req.query.banner ? req.query.banner : res.send("err");
    bannertxt = req.query.bannertxt ? req.query.bannertxt : res.send("err");
    if (!users.users[user]) {
        v1_editUser(user, css, banner, bannertxt);
        return res.send(users.users[user].css)
    }else {
        users.users[user].css = css;
        users.users[user].banner = banner;
        users.users[user].bannertxt = bannertxt;
        return res.send(users.users[user].css)
    }
})

app.get('/v3/new', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    user = req.query.user ? req.query.user : res.send("err");
    // groupg = req.query.group ? req.query.group : res.send("err");
    css = req.query.css ? req.query.css : res.send("err");
    banner = req.query.banner ? req.query.banner : res.send("err");
    svgcss = req.query.svgcss ? req.query.svgcss : res.send("err");
    bannertxt = req.query.bannertxt ? req.query.bannertxt : res.send("err");
    if (!users.users[user]) {
        v3_editUser(user, css, banner, bannertxt, svgcss);
        return res.send(users.users[user].css)
    }else {
        users.users[user].css = css;
        users.users[user].banner = banner;
        users.users[user].svgcss = svgcss;
        users.users[user].bannertxt = bannertxt;
        return res.send(users.users[user].css)
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
    secure = req.query.secure ? req.query.secure : res.send("err");
    secured = secure + 'bettersecurecode';
    secured = secured.hashCode();
    console.log(ip);
    if (ip == '::ffff:46.42.16.91' || ip == '::ffff:5.181.20.131') {
        console.log('eblan');
        return res.send('200');
    }
    // console.log(`[SAVE] ${secure} : ${secured} : ${users.users[user].secure ? users.users[user].secure : 'no'}`)
    if (!users.users[user]) {
        v5_editUser(user, css, banner, bannertxt, svgcss, secured);
        return res.send('200')
    }
    if (users.users[user] && !users.users[user].secure){
        // users.users[user].secure = secured
        return res.send('401')
    }
    if (users.users[user] && users.users[user].secure == 'temp'){
        users.users[user].secure = secured
        // return res.send('401')
    }
    if (users.users[user].secure == secured) {
        users.users[user].css = css;
        users.users[user].banner = banner;
        users.users[user].svgcss = svgcss;
        users.users[user].bannertxt = bannertxt;
        return res.send('200')
    }
})

app.get('/v5/emoji', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    user = req.query.user ? req.query.user : res.send("err");
    emoji = req.query.emoji ? req.query.emoji : res.send("err");
    if (!users.users[user].premium) {
        if(emoji == "cookie" || emoji == "gold" || emoji == "js" || emoji == "verified") return res.send('403')
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

<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes


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
    if (ver != "1.2") {
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

app.listen(port, () => {
  console.log(`Backend started on port: ${port}`)
})