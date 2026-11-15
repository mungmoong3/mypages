const eventDate = '2026-11-28';
// 예시의 2026-11-14 기준 352일째에 맞춘 생년월일입니다. 실제 생일이 다르면 수정하세요.
const birthDate = '2025-11-28';
const address = '경기도 용인시 수지구 동천동 동천로 409';
const $ = selector => document.querySelector(selector);
const today = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const dayNumber = value => Date.parse(value + 'T00:00:00Z') / 86400000;
$('#age').textContent = Math.floor(dayNumber(today) - dayNumber(birthDate)) + 1;
const remaining = Math.round(dayNumber(eventDate) - dayNumber(today));
$('#dday').textContent = remaining > 0 ? `D-${remaining}` : remaining === 0 ? 'D-DAY' : `D+${-remaining}`;
$('#dday-copy').textContent = remaining > 0 ? `현서의 돌잔치까지 ${remaining}일 남았어요` : remaining === 0 ? '오늘은 현서의 돌잔치 날이에요' : '함께 축하해 주셔서 감사합니다';
const grid = $('#calendar-grid');
['일','월','화','수','목','금','토', ...Array.from({length:30},(_,i)=>i+1)].forEach((value,i)=>{const cell=document.createElement('span');cell.textContent=value;cell.className=i%7===0?'sun':i%7===6?'sat':'';if(value===28){cell.className='selected';cell.setAttribute('aria-label','28일 토요일 돌잔치');}grid.append(cell);});
// 꽃과 잎 장식은 로컬 SVG로 그려 외부 이미지 없이 표시합니다.
const leaf = (x,y,angle,color='#afbe91') => `<ellipse cx="${x}" cy="${y}" rx="13" ry="5" fill="${color}" transform="rotate(${angle} ${x} ${y})"/>`;
let wreath='<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><circle cx="150" cy="150" r="139" fill="none" stroke="#aabb8d" stroke-width="1.5"/>';
for(let i=0;i<30;i++){const a=i*Math.PI*2/30;const r=i%2?144:136;wreath+=leaf(150+r*Math.cos(a),150+r*Math.sin(a),i*12+(i%2?30:-30),i%3?'#b9c79f':'#9eaf80');}
for(const i of [1,6,11,17,22,27]){const a=i*Math.PI*2/30,x=150+139*Math.cos(a),y=150+139*Math.sin(a);wreath+=`<g transform="translate(${x} ${y})">`;for(let j=0;j<5;j++)wreath+=`<ellipse cy="-7" rx="5" ry="7" fill="#efa5a1" transform="rotate(${j*72})"/>`;wreath+='<circle r="3.5" fill="#efda9e"/></g>';}
$('.wreath').innerHTML=wreath+'</svg>';
let branch='<svg viewBox="0 0 100 180" xmlns="http://www.w3.org/2000/svg"><path d="M10 180 Q40 80 85 0" stroke="#b0be96" stroke-width="2" fill="none"/>';
for(let i=0;i<8;i++)branch+=leaf(23+i*7,155-i*21,i%2?15:-65,i%2?'#c6d1af':'#a5b68a');
document.querySelectorAll('.corner').forEach(el=>el.innerHTML=branch+'</svg>');
for(let month=1;month<=12;month++){const button=document.createElement('button');button.className='gallery-item';button.setAttribute('aria-label',`${month}개월 사진`);button.disabled=true;const img=document.createElement('img');img.alt=`현서 ${month}개월`;img.loading='lazy';img.onload=()=>{button.classList.add('has-photo');button.disabled=false;};img.onerror=()=>img.remove();img.src=`images/${String(month).padStart(2,'0')}.jpg`;const label=document.createElement('span');label.textContent=`${month}개월`;button.append(img,label);button.onclick=()=>{$('#large-photo').src=img.src;$('#large-photo').alt=img.alt;$('#photo-caption').textContent=img.alt;$('#photo-dialog').showModal();};$('#gallery').append(button);}
$('#close-photo').onclick=()=>$('#photo-dialog').close();
$('#photo-dialog').addEventListener('click',e=>{if(e.target===$('#photo-dialog'))$('#photo-dialog').close();});
let toastTimer;
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2800);}
async function copy(text,message){try{await navigator.clipboard.writeText(text);toast(message);}catch{window.prompt('아래 내용을 복사해 주세요.',text);}}
$('#copy-address').onclick=()=>copy(address,'주소를 복사했어요');
$('#share').onclick=async()=>{const data={title:'현서의 첫 생일에 초대합니다',text:'11월 28일 토요일 오후 1시 30분 · 오월식당 1층',url:location.href};if(navigator.share){try{await navigator.share(data);return;}catch(e){if(e.name==='AbortError')return;}}await copy(location.href,'초대장 링크를 복사했어요');};
const calendarParams=new URLSearchParams({action:'TEMPLATE',text:'현서의 첫 생일',dates:'20261128T133000/20261128T133000',ctz:'Asia/Seoul',location:`오월식당 1층, ${address}`,details:'현서의 첫 생일을 함께 축하해 주세요.\n'+location.href});
$('#google-calendar').href='https://calendar.google.com/calendar/render?'+calendarParams;
const music = $('#background-music');
const musicToggle = $('#music-toggle');
music.volume = 0.35;
function updateMusicButton() {
  musicToggle.textContent = music.paused ? '배경음 듣기' : '배경음 끄기';
  musicToggle.setAttribute('aria-pressed', String(!music.paused));
}
music.addEventListener('play', updateMusicButton);
music.addEventListener('pause', updateMusicButton);
music.addEventListener('error', () => { updateMusicButton(); toast('음악을 불러오지 못했어요. 잠시 후 다시 눌러 주세요.'); });
musicToggle.onclick = async () => {
  if (!music.paused) { music.pause(); return; }
  musicToggle.disabled = true;
  try { await music.play(); }
  catch { toast('음악을 재생하지 못했어요. 다시 눌러 주세요.'); }
  finally { musicToggle.disabled = false; updateMusicButton(); }
};
$('#apple-calendar').onclick=()=>{const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Hyunseo//First Birthday//KO','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:hyunseo-20261128@mungmoong3.github.io',`DTSTAMP:${stamp}`,'DTSTART:20261128T043000Z','SUMMARY:현서의 첫 생일',`LOCATION:오월식당 1층\\, ${address}`,'DESCRIPTION:현서의 첫 생일을 함께 축하해 주세요.','END:VEVENT','END:VCALENDAR',''].join('\r\n');const url=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='현서-첫생일.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);};
