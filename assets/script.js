/* Reading pane, shareable piece links (#slug), and optional filter and theme icons. Pieces are rendered by Jekyll. */
(function(){
  var $=function(id){return document.getElementById(id)};
  var backdrop=$("backdrop"),modal=$("modal"),closeBtn=$("close");
  var cards=[].slice.call(document.querySelectorAll(".card"));
  var bySlug={};cards.forEach(function(c){bySlug[c.dataset.slug]=c});
  var last=null,pushed=false;
  var isOpen=function(){return backdrop.classList.contains("open")};

  function show(card){
    var d=card.dataset,essay=d.type==="essay",words=parseInt(d.words,10)||0;
    if(!isOpen())last=document.activeElement;
    modal.className="modal "+d.type;
    modal.dataset.slug=d.slug;
    $("mType").innerHTML='<i class="fa-solid '+(essay?"fa-pen-nib":"fa-book-open")+'" aria-hidden="true"></i>'+(essay?"Essay":"Fiction")+(d.year?", "+d.year:"");
    $("mTitle").textContent=d.title;
    $("mNote").textContent=d.note||"";
    $("mNote").style.display=d.note?"block":"none";
    if(d.note)$("mNote").insertAdjacentHTML("afterbegin",'<i class="fa-solid fa-award" aria-hidden="true"></i>');
    $("mBody").className="m-body "+d.type;
    $("mBody").innerHTML=card.querySelector("template").innerHTML;
    $("mCount").innerHTML='<i class="fa-regular fa-clock" aria-hidden="true"></i>'+words.toLocaleString()+" words, about "+Math.max(1,Math.round(words/230))+" min";
    backdrop.scrollTop=0;
    backdrop.classList.add("open");
    document.body.classList.add("lock");
    closeBtn.focus();
    document.addEventListener("keydown",onKey);
  }
  function hide(){
    if(!isOpen())return;
    backdrop.classList.remove("open");
    document.body.classList.remove("lock");
    document.removeEventListener("keydown",onKey);
    if(last&&last.focus)last.focus();
  }
  function currentSlug(){
    try{return decodeURIComponent(location.hash.slice(1))}catch(e){return ""}
  }
  function openFromClick(card){
    try{history.pushState(null,"","#"+card.dataset.slug)}catch(e){location.hash=card.dataset.slug}
    pushed=true;
    show(card);
  }
  function closeFromUser(){
    if(!bySlug[currentSlug()]){hide();return}
    if(pushed){pushed=false;history.back()}            /* hashchange then hides the pane */
    else{try{history.replaceState(null,"",location.pathname+location.search)}catch(e){location.hash=""}hide()}
  }
  function sync(){                                     /* runs on load and when the #hash changes */
    var c=bySlug[currentSlug()];
    if(c){if(!isOpen()||modal.dataset.slug!==c.dataset.slug)show(c)}
    else hide();
  }
  function onKey(e){
    if(e.key==="Escape")closeFromUser();
    if(e.key==="Tab"){e.preventDefault();closeBtn.focus()}   /* one focusable control inside */
  }

  cards.forEach(function(c){c.addEventListener("click",function(){openFromClick(c)})});
  closeBtn.addEventListener("click",closeFromUser);
  backdrop.addEventListener("click",function(e){if(e.target===backdrop)closeFromUser()});
  window.addEventListener("hashchange",sync);
  sync();

/* ---- THEME ICONS (disabled): to enable, delete this line and the "end" line below (index.html and style.css have matching blocks) ----
  // Each piece names a theme in its front matter (theme: history). This maps a theme to a Font Awesome icon.
  // The icons below are examples only; swap in any Font Awesome icon names.
  var themeIcons={history:"fa-landmark",literature:"fa-book",games:"fa-gamepad",vampires:"fa-droplet"};
  cards.forEach(function(c){
    var icon=themeIcons[c.dataset.theme];
    var slot=c.querySelector(".card-icon");
    if(icon&&slot)slot.innerHTML='<i class="fa-solid '+icon+'" aria-hidden="true"></i>';
  });
---- end THEME ICONS ---- */

/* ---- FILTER (disabled): to enable, delete this line and the "end" line below (index.html and style.css have matching blocks) ----
  var bar=document.querySelector(".filters");
  if(bar){
    bar.addEventListener("click",function(e){
      var b=e.target.closest(".filter");
      if(!b)return;
      bar.querySelectorAll(".filter").forEach(function(x){
        var on=x===b;
        x.classList.toggle("on",on);
        x.setAttribute("aria-pressed",on);
      });
      var f=b.dataset.filter;
      cards.forEach(function(c){c.hidden=!(f==="all"||c.dataset.type===f)});
    });
  }
---- end FILTER ---- */
})();
