const topics=window.COURSE5_TOPICS;
const root=document.getElementById('course');
let done=[];
try { done=JSON.parse(localStorage.getItem('peterson5done')||'[]'); if(!Array.isArray(done)) done=[]; } catch { done=[]; }
let topic=null,stage='explain',index=0,score=0,chosen=null;
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){
  if(!topic){
    root.innerHTML=`<section class="course-hero"><div><p class="eyebrow">Петерсон · 5 класс</p><h1>Карта математической экспедиции</h1><p>Выбирай тему в любом порядке. В каждой остановке тебя ждут правила, примеры, тренировка и проверка знаний.</p></div><div class="progress-chip">Пройдено: <strong>${done.length}/${topics.length}</strong></div></section><section class="topic-grid">${topics.map((t,i)=>`<button type="button" class="topic-card ${done.includes(t.id)?'completed':''}" style="--topic:${t.color}" data-topic="${t.id}"><span class="topic-number">${i+1}</span><span class="topic-icon">${t.icon}</span><h2>${escapeHtml(t.title)}</h2><p>${escapeHtml(t.subtitle)}</p><span class="topic-state">${done.includes(t.id)?'✅ Пройдена · открыть снова →':'Открыть тему →'}</span></button>`).join('')}</section>`;
    root.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>{topic=topics.find(t=>t.id===b.dataset.topic);stage='explain';index=score=0;chosen=null;render();scrollTo(0,0)});
    return;
  }
  const tasks=topic[stage==='practice'?'practice':'test'];
  const progress=stage==='explain'?15:stage==='practice'?20+Math.round((index+1)/tasks.length*35):stage==='test'?60+Math.round((index+1)/tasks.length*35):100;
  let body='';
  if(stage==='explain') body=`<section class="lesson-card"><span class="stage-label">1 · Объяснение</span><h2>Разберём тему спокойно и по шагам</h2><p class="explanation">${escapeHtml(topic.explanation)}</p><h3>Разобранные примеры</h3><div class="worked-examples">${topic.examples.map((x,i)=>`<div><b>Пример ${i+1}</b><span>${escapeHtml(x)}</span></div>`).join('')}</div><div class="lesson-actions"><button id="next">Перейти к закреплению →</button></div></section>`;
  else if(stage==='result') body=`<section class="lesson-card result-card"><div class="result-icon">${score===topic.test.length?'🏆':'🌟'}</div><span class="stage-label">Тема завершена</span><h2>${score} из ${topic.test.length}</h2><p>${score/topic.test.length>=.75?'Тема усвоена. Можно двигаться дальше!':'Стоит ещё раз посмотреть объяснение и повторить тест.'}</p><div class="lesson-actions centered"><button class="ghost" id="repeat">Повторить тему</button><button id="map">Вернуться к карте</button></div></section>`;
  else {const task=tasks[index];body=`<section class="lesson-card"><span class="stage-label">${stage==='practice'?'2 · Закрепление с подсказками':'3 · Контрольный тест'} · ${index+1}/${tasks.length}</span><h2>${escapeHtml(task.question)}</h2><div class="answer-grid">${task.options.map((x,i)=>`<button data-answer="${i}" ${chosen!==null?'disabled':''} class="${chosen===null?'':i===task.correct?'right':i===chosen?'wrong':''}">${escapeHtml(x)}</button>`).join('')}</div>${chosen===null?'':`<div class="feedback ${chosen===task.correct?'good':'bad'}">${chosen===task.correct?'Верно! Отличная работа.':'Пока не так. '+escapeHtml(task.hint)}</div>`}<div class="lesson-actions"><button id="next" ${chosen===null?'disabled':''}>${index+1<tasks.length?'Следующее задание →':stage==='practice'?'Перейти к тесту →':'Узнать результат →'}</button></div></section>`;}
  root.innerHTML=`<section class="lesson-head"><button class="round-back" id="back" aria-label="К карте">←</button><div><p class="eyebrow">${topic.icon} Учебная экспедиция</p><h1>${escapeHtml(topic.title)}</h1><p>${escapeHtml(topic.subtitle)}</p></div></section><div class="lesson-progress"><span style="width:${progress}%"></span><b style="left:${progress}%">🚀</b></div>${body}`;
  root.querySelector('#back').onclick=()=>{topic=null;render()};
  if(stage==='result'){root.querySelector('#map').onclick=()=>{topic=null;render()};root.querySelector('#repeat').onclick=()=>{stage='explain';index=score=0;chosen=null;render()};return;}
  if(stage!=='explain')root.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{chosen=Number(b.dataset.answer);if(stage==='test'&&chosen===tasks[index].correct)score++;render()});
  root.querySelector('#next').onclick=()=>{if(stage==='explain'){stage='practice';index=0}else if(index+1<tasks.length){index++}else if(stage==='practice'){stage='test';index=score=0}else{stage='result';if(!done.includes(topic.id)){done.push(topic.id);localStorage.setItem('peterson5done',JSON.stringify(done))}}chosen=null;render()};
}
render();
