let ge=(id)=>document.getElementById(id); //get element by id
let gecl=(id,c,s)=>ge(id).classList.toggle(c,s); //toggle class by id
let ge_gone=(id,s)=>gecl(id,'gone',s); //cstom toggle class gone
let ge_no=(id,s)=>gecl(id,'no',s); //custom toggle class no
let clone=(pid,tempid)=>{
  let clone=document.querySelector('#'+tempid).content.firstElementChild.cloneNode(true);
  ge(pid).addChild(clone);
  return clone;
}
