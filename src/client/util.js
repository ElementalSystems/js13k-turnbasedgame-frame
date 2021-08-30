let ge=(id)=>document.getElementById(id); //get element by id
let gecl=(id,c,s)=>ge(id).classList.toggle(c,s); //toggle class by id
let geclk=(id,f)=>ge(id).onclick=f;
let ge_gone=(id,s)=>gecl(id,'gone',s); //cstom toggle class gone
let ge_no=(id,s)=>gecl(id,'no',s); //custom toggle class no
let cloneIn=(par,tempid,q)=>{
    let clone=document.querySelector('#'+tempid).content.querySelector(q).cloneNode(true);
    par.appendChild(clone);
    return clone;
}
let clone=(pid,tempid)=>{
    return cloneIn(ge(pid),tempid,'*')
}
let ge_qs=(id,qs)=>ge(id).querySelector(qs);
let qs_txt=(e,qs,txt)=>e.querySelector(qs).textContent=txt;


let oneof=(x)=>{ //gets one of an array at random or return the input
  if (!Array.isArray(x)) return x;
  return x[Math.floor(Math.random()*x.length)]
}
let cloneM=(par,tempid,n,cp,cls)=>//clone multiple nodes
{
  return (new Array(n)).fill(0).map((_,i)=>{
    let nn=cloneIn(par,oneof(tempid),'*');
    nn.classList.toggle(cp+i,true);
    nn.classList.toggle(cls,true);
    return nn;
  });
}
