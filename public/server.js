"use strict";const users=[];function pubUsers(){const s=users.filter(e=>1==e.status).map(e=>({id:e.id,nick:e.nick,level:e.level})),t=users.filter(e=>1<e.status).map(e=>({id:e.id,nick:e.nick,level:e.level}));users.filter(e=>1==e.status).forEach(e=>e.emit("lobby",{available:s,playing:t}))}function removeUser(s){var e=users.findIndex(e=>e.id==s.id);0<=e&&users.splice(e,1)}module.exports={io:t=>{const l={id:+new Date,nick:null,level:null,status:0,emit:(e,s)=>t.emit(e,s)};console.log("Connected: "+t.id),t.on("disconnect",()=>{console.log("Disconnected: "+t.id),removeUser(l),pubUsers()}),t.on("enter",e=>{removeUser(l),l.nick=e.nick,l.level=e.level,l.status=1,users.push(l),pubUsers()}),t.on("leave",e=>{removeUser(l),pubUsers()}),t.on("play",s=>{let e=users.find(e=>e.id==s.opponent);e&&1==e.status&&(e.status=2,e.match=l,l.status=3,l.match=e,e.emit("playstart",{lead:!0}),l.emit("playstart",{lead:!1}),pubUsers())}),t.on("gamemsg",e=>{l.match&&l.match.emit("gamemsg",e)}),t.on("playend",e=>{l.match=null,l.status=1,pubUsers()})}};