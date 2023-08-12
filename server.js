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


app.get('/v1/support', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    ver = req.query.ver ? req.query.ver : '';
    if (ver != "3.0") {
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