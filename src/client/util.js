let ge=(id)=>document.getElementById(id); //get element by id
let gecl=(id,c,s)=>ge(id).classList.toggle(c,s); //toggle class by id
let geclk=(id,f)=>ge(id).onclick=f;
let ge_gone=(id,s)=>gecl(id,'gone',s); //cstom toggle class gone
let ge_no=(id,s)=>gecl(id,'no',s); //custom toggle class no
let cloneIn=(par,tempid)=>{
    let clone=document.querySelector('#'+tempid).content.firstElementChild.cloneNode(true);
    par.appendChild(clone);
    return clone;
}
let clone=(pid,tempid)=>{
    return cloneIn(ge(pid),tempid)
}
let ge_qs=(id,qs)=>ge(id).querySelector(qs);
let cloneM=(par,tempid,n,cp)//clone multiple nodes
{
  return (new Array(n)).fill(0).map((_,i)=>{
    let nn=cloneIn(par,tempid);
    nn.classList.toggle(cp+i,true);
    return nn;
  });
}
