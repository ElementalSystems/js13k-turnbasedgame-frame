"use strict";const users=[];function pubUsers(){const s=users.filter(e=>1==e.status).map(e=>({id:e.id,nick:e.nick,level:e.level})),t=users.filter(e=>1<e.status).map(e=>({id:e.id,nick:e.nick,level:e.level}));users.filter(e=>1==e.status).forEach(e=>e.emit("lobby",{available:s,playing:t}))}function removeUser(s){var e=users.findIndex(e=>e.id==s.id);0<=e&&users.splice(e,1)}module.exports={io:t=>{const l={id:+new Date,nick:null,level:null,status:0,emit:(e,s)=>t.emit(e,s)};console.log("Connected: "+t.id),t.on("disconnect",()=>{console.log("Disconnected: "+t.id),removeUser(l),pubUsers()}),t.on("el",e=>{removeUser(l),l.nick=e.nick,l.level=e.level,l.status=1,users.push(l),pubUsers()}),t.on("ll",e=>{removeUser(l),pubUsers()}),t.on("reqstart",s=>{console.log("got request - matching");let e=users.find(e=>e.id==s.opponent);e&&1==e.status&&(e.status=2,e.match=l,l.status=3,l.match=e,e.emit("playstart",{lead:!0,op:l.nick}),l.emit("playstart",{lead:!1,op:e.nick}),pubUsers())}),t.on("gm",e=>{l.match&&(console.log("forwarded gm:"+JSON.stringify(e)),l.match.emit("gm",e))}),t.on("reqend",e=>{l.match&&(l.match.emit("playend",e),l.match.match=null,l.match.status=1),l.emit("playend",e),l.match=null,l.status=1,pubUsers()})}};