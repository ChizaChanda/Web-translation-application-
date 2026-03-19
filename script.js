const src=document.getElementById('source');
const tgt=document.getElementById('target');
const input=document.getElementById('inputText');
const output=document.getElementById('outputText');
const count=document.getElementById('count');

document.getElementById('translateBtn').onclick=translate;
document.getElementById('swap').onclick=()=>{
  // swap languages
  const tmp=src.value;
  src.value=tgt.value;
  tgt.value=tmp;
  // swap texts
  const txt=input.value;
  input.value=output.value;
  output.value=txt;
  updateCount();
};
input.addEventListener('input',updateCount);
function updateCount(){count.textContent=`${input.value.length}/500`;}

function translate(){
  const q=input.value;
  const langpair=`${src.value.slice(0,2).toLowerCase()}|${tgt.value.slice(0,2).toLowerCase()}`;
  fetch('https://api.mymemory.translated.net/get',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({q,langpair})
  })
  .then(r=>r.json())
  .then(d=>{output.value=d.responseData.translatedText})
  .catch(()=>alert('Translation error'));
}
let timer;
input.addEventListener('input',()=>{
  clearTimeout(timer);
  timer=setTimeout(translate,400); // 400 ms pause, then translate
});
function speak(txt,lang){
    const u=new SpeechSynthesisUtterance(txt);
    u.lang=lang; // e.g. 'en' or 'fr'
    speechSynthesis.speak(u);
  }
  document.getElementById('listenIn').onclick=()=>{
    const lang=code(src.value); // en/fr
    speak(input.value,lang);
  };
  document.getElementById('listenOut').onclick=()=>{
    const lang=code(tgt.value);
    speak(output.value,lang);
  };
  function code(l){return {English:'en',French:'fr', 'Detect Language':'en'}[l]||'en';}
function translate(){
  const q=input.value.trim();
  if(!q){output.value='';return;}
  const langpair=`${code(src.value)}|${code(tgt.value)}`;
  fetch('https://api.mymemory.translated.net/get',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({q,langpair})
  })
 .then(r=>r.json())
 .then(d=>{output.value=(d.responseData||{}).translatedText||'';
  })
 .catch(()=>{output.value='';}); // no alert
}

// initial load
translate();