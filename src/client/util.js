let ge=(id)=>document.getElementById(id); //get element by id
let gecl=(id,c,s)=>ge(id).classList.toggle(c,s); //toggle class by id
let geclk=(id,f)=>ge(id).onclick=f;
let ge_gone=(id,s)=>gecl(id,'gone',s); //cstom toggle class gone
let ge_no=(id,s)=>gecl(id,'no',s); //custom toggle class no
let clone=(pid,tempid)=>{
    let clone=document.querySelector('#'+tempid).content.firstElementChild.cloneNode(true);
    ge(pid).appendChild(clone);
    return clone;
}
let ge_qs=(id,qs)=>ge(id).querySelector(qs);
