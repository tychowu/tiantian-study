const questions = {
  zh: [
    ["我","喜歡","吃","紅蘋果"],["小貓","正在","曬太陽"],["爸爸","開車","去上班"],["媽媽","做了","香甜的","蛋糕"],["天空中","有","一朵","白雲"],
    ["弟弟","在公園","踢皮球"],["我們","一起","讀故事書"],["小鳥","在樹上","唱歌"],["今天","天氣","很晴朗"],["妹妹","穿著","紅色的","裙子"],
    ["我家","有一隻","可愛的","小狗"],["老師","教我們","寫字"],["爺爺","每天早上","去散步"],["魚兒","在水裡","游來游去"],["放學後","我","整理","書包"],
    ["春天","開了","許多","花朵"],["月亮","晚上","高高地","掛在天上"],["哥哥","會騎","兩輪單車"],["請你","把門","輕輕地","關上"],["我和朋友","開心地","玩積木"],
    ["雨後","天空","出現了","彩虹"],["早餐","我喝了","一杯牛奶"],["奶奶","種的花","很漂亮"],["小朋友們","排隊","進教室"],["生日那天","我收到","一份禮物"]
  ],
  en: [
    ["I","like","red apples"],["The cat","is sleeping","on the sofa"],["Dad","drives","to work"],["Mom","made","a yummy cake"],["The sun","is bright","today"],
    ["We","play","in the park"],["The bird","sings","in the tree"],["I","read","a storybook"],["My dog","has","a long tail"],["She","wears","a blue dress"],
    ["He","can ride","a bike"],["The fish","swims","in the water"],["I","wash","my hands"],["They","are eating","lunch"],["The baby","is very","happy"],
    ["Please","open","the window"],["We","go to school","in the morning"],["My teacher","is","very kind"],["I","have","two little hands"],["The flowers","are","very pretty"],
    ["A rainbow","is in","the sky"],["My friend","plays with","a yellow ball"],["The rabbit","has","long ears"],["I","drink milk","at breakfast"],["We","love","our family"]
  ]
};

let language = "zh", index = 0, answer = [], pool = [], soundOn = true, streak = 0;
const $ = (s) => document.querySelector(s);
const answerZone = $("#answerZone"), wordBank = $("#wordBank"), feedback = $("#feedback"), mascot = $("#mascot");

function shuffled(items){const a=items.map((text,id)=>({text,id}));for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}if(a.every((v,i)=>v.text===items[i])&&a.length>1)[a[0],a[1]]=[a[1],a[0]];return a}
function renderQuestion(){const q=questions[language][index];answer=[];pool=shuffled(q);feedback.textContent="";feedback.className="feedback";mascot.className="mascot";$("#checkBtn").classList.remove("hidden");$("#nextBtn").classList.add("hidden");$("#progressText").textContent=language==="zh"?`第 ${index+1} / 25 題`:`Question ${index+1} / 25`;$("#progressBar").style.width=`${(index+1)*4}%`;$("#instruction").textContent=language==="zh"?"點一點詞語，排出正確的句子":"Tap the words to make a sentence";renderWords()}
function renderWords(){answerZone.innerHTML=answer.length?"":"<span class='placeholder'>答案會放在這裡…</span>";wordBank.innerHTML="";answer.forEach((item,i)=>{const b=makeWord(item,()=>{pool.push(answer.splice(i,1)[0]);clearState();renderWords()});b.addEventListener("dragstart",e=>e.dataTransfer.setData("text/plain",String(i)));b.addEventListener("dragover",e=>e.preventDefault());b.addEventListener("drop",e=>{e.preventDefault();const from=Number(e.dataTransfer.getData("text/plain"));if(Number.isInteger(from)&&from!==i){const [moved]=answer.splice(from,1);answer.splice(i,0,moved);clearState();renderWords()}});answerZone.append(b)});pool.forEach((item,i)=>wordBank.append(makeWord(item,()=>{answer.push(pool.splice(i,1)[0]);clearState();renderWords()})))}
function makeWord(item,onClick){const b=document.createElement("button");b.className="word";b.type="button";b.textContent=item.text;b.draggable=true;b.addEventListener("click",onClick);return b}
function clearState(){answerZone.classList.remove("correct","wrong");feedback.textContent="";feedback.className="feedback"}
function tone(ok){if(!soundOn)return;const ctx=new (window.AudioContext||window.webkitAudioContext)();[...(ok?[523,659,784]:[220,170])].forEach((freq,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=freq;o.type="sine";g.gain.setValueAtTime(.06,ctx.currentTime+i*.1);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+i*.1+.22);o.connect(g).connect(ctx.destination);o.start(ctx.currentTime+i*.1);o.stop(ctx.currentTime+i*.1+.23)})}
function check(){if(answer.length!==questions[language][index].length){feedback.textContent=language==="zh"?"還有詞語沒有排進去喔！":"Use all the words first!";feedback.className="feedback bad";return}const ok=answer.every((v,i)=>v.text===questions[language][index][i]);tone(ok);mascot.className=`mascot ${ok?"correct":"wrong"}`;answerZone.className=`answer-zone ${ok?"correct":"wrong"}`;if(ok){streak++;$("#streakCount").textContent=streak;feedback.textContent=language==="zh"?"太棒了，句子完全正確！":"Great job! That is correct!";feedback.className="feedback good";$("#checkBtn").classList.add("hidden");$("#nextBtn").classList.remove("hidden");celebrate();localStorage.setItem(`tiantian-${language}`,String(Math.max(index+1,Number(localStorage.getItem(`tiantian-${language}`)||0))))}else{streak=0;$("#streakCount").textContent=0;feedback.textContent=language==="zh"?"差一點點，再試一次吧！":"Almost! Try one more time!";feedback.className="feedback bad"}}
function celebrate(){const box=$("#celebration");box.innerHTML="";for(let i=0;i<28;i++){const c=document.createElement("i");c.className="confetti";c.style.background=["#ff775f","#ffd05c","#58b98b","#6cb9d1","#a889da"][i%5];c.style.setProperty("--x",`${(Math.random()-.5)*700}px`);c.style.setProperty("--y",`${(Math.random()-.2)*500}px`);c.style.setProperty("--r",`${Math.random()*720}deg`);box.append(c)}setTimeout(()=>box.innerHTML="",1000)}
$("#checkBtn").addEventListener("click",check);$("#nextBtn").addEventListener("click",()=>{index=(index+1)%25;renderQuestion()});$("#resetBtn").addEventListener("click",()=>{pool=shuffled(questions[language][index]);answer=[];clearState();renderWords()});
document.querySelectorAll(".lang").forEach(btn=>btn.addEventListener("click",()=>{document.querySelector(".lang.active").classList.remove("active");btn.classList.add("active");language=btn.dataset.lang;index=Math.min(Number(localStorage.getItem(`tiantian-${language}`)||0),24);renderQuestion()}));
$("#sentenceModule").addEventListener("click",()=>{$("#game").classList.remove("collapsed");$("#game").scrollIntoView({behavior:"smooth"})});$("#closeGame").addEventListener("click",()=>$("#game").classList.add("collapsed"));$("#soundBtn").addEventListener("click",e=>{soundOn=!soundOn;e.currentTarget.textContent=soundOn?"🔊":"🔇";e.currentTarget.setAttribute("aria-pressed",String(soundOn))});
renderQuestion();
