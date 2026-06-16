// ═════════════════════════════════════════════════════════════
// CBC SCHOOL HUB - CORE APPLICATION LOGIC
// Kenya School Management System for CBC/CBE Curriculum
// ═════════════════════════════════════════════════════════════

// ═══ DATA STRUCTURES ═══
const LEARNERS = [
  {adm:'2025/001',name:'Aisha Wanjiku Kamau',class:'Grade 7',gender:'F',phone:'0712345678',fees:'Paid',level:'ME'},
  {adm:'2025/002',name:'Brian Otieno Mwangi',class:'Grade 7',gender:'M',phone:'0723456789',fees:'Outstanding',level:'AE'},
  {adm:'2025/003',name:'Cynthia Achieng Odhiambo',class:'Grade 7',gender:'F',phone:'0734567890',fees:'Paid',level:'EE'},
  {adm:'2025/004',name:'David Kipchoge Rotich',class:'Grade 8',gender:'M',phone:'0745678901',fees:'Partial',level:'ME'},
  {adm:'2025/005',name:'Eunice Wambui Njoroge',class:'Grade 8',gender:'F',phone:'0756789012',fees:'Paid',level:'ME'},
  {adm:'2025/006',name:'Francis Kamau Njenga',class:'Grade 8',gender:'M',phone:'0767890123',fees:'Outstanding',level:'BE'},
  {adm:'2025/007',name:'Grace Nekesa Wanjala',class:'Grade 9',gender:'F',phone:'0778901234',fees:'Paid',level:'EE'},
  {adm:'2025/008',name:'Hassan Mwenda Mutua',class:'Grade 9',gender:'M',phone:'0789012345',fees:'Paid',level:'ME'},
  {adm:'2025/009',name:'Irene Chebet Koech',class:'Grade 4',gender:'F',phone:'0790123456',fees:'Partial',level:'AE'},
  {adm:'2025/010',name:'James Ogutu Onyango',class:'Grade 4',gender:'M',phone:'0701234567',fees:'Paid',level:'ME'},
];

const TEACHERS = [
  {name:'Ms. Wanjiru Njenga',subjects:'English, Kiswahili',classes:'Grade 6, 7',phone:'0712111222',type:'TSC',color:'#0D6B46'},
  {name:'Mr. John Otieno',subjects:'Mathematics',classes:'Grade 7, 8, 9',phone:'0723222333',type:'TSC',color:'#1B9ED4'},
  {name:'Ms. Faith Akinyi',subjects:'Social Studies',classes:'Grade 4, 5, 6',phone:'0734333444',type:'BOM',color:'#F5A623'},
  {name:'Mr. Peter Kamau',subjects:'Integrated Science',classes:'Grade 6, 7, 8',phone:'0745444555',type:'TSC',color:'#6C3FC5'},
];

const FEES_DATA = [
  {date:'14 Jun',learner:'Aisha Kamau',amount:'KES 12,500',status:'Paid'},
  {date:'13 Jun',learner:'Grace Nekesa',amount:'KES 15,000',status:'Paid'},
  {date:'12 Jun',learner:'David Rotich',amount:'KES 8,000',status:'Partial'},
  {date:'11 Jun',learner:'Mercy Githinji',amount:'KES 11,000',status:'Paid'},
];

const CLASSES = [
  {grade:'Grade 1',count:28,streams:['Blue'],teacher:'Ms. Chebet',color:'#DCFCE7'},
  {grade:'Grade 4',count:30,streams:['Blue','Red'],teacher:'Ms. Akinyi',color:'#DBEAFE'},
  {grade:'Grade 7',count:34,streams:['Blue','Red'],teacher:'Mr. Otieno',color:'#EDE9FE'},
  {grade:'Grade 9',count:26,streams:['Blue'],teacher:'Mr. Hassan',color:'#EDE9FE'},
];

const PAGE_META = {
  dashboard:{title:'Dashboard',sub:'Welcome back, Headteacher · Term 2, 2025'},
  learners:{title:'Learners',sub:'Manage enrolled learners — CBC records'},
  teachers:{title:'Teaching Staff',sub:'TSC & BOM staff records'},
  classes:{title:'Classes & Streams',sub:'Class structure management'},
  schemes:{title:'Schemes of Work',sub:'KICD-aligned CBC schemes generator'},
  lessonplans:{title:'Lesson Plans',sub:'CBC lesson plan management'},
  assessment:{title:'CBC Assessment',sub:'CBAF strand assessment — EE, ME, AE, BE'},
  reportcards:{title:'Report Cards',sub:'Auto-generate learner reports'},
  timetable:{title:'Class Timetable',sub:'Weekly period timetable builder'},
  attendance:{title:'Attendance Register',sub:'Daily learner attendance'},
  fees:{title:'Fees & M-Pesa',sub:'Fee management and M-Pesa payments'},
  communications:{title:'Parent Communications',sub:'WhatsApp & SMS to parents'},
  events:{title:'School Calendar',sub:'Academic events and deadlines'},
  cpd:{title:'Teacher CPD',sub:'Continuous Professional Development tracking'},
  analytics:{title:'Analytics & Reports',sub:'Performance data and insights'},
  settings:{title:'Settings',sub:'School profile and system configuration'},
};

// ═══ NAVIGATION ═══
function nav(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+id)?.classList.add('active');
  document.querySelectorAll('.sb-item').forEach(i=>i.classList.remove('active'));
  document.querySelectorAll('.sb-item').forEach(i=>{
    if(i.textContent.toLowerCase().includes(id.substring(0,5).toLowerCase()))
      i.classList.add('active');
  });
  const m=PAGE_META[id]||{title:id,sub:''};
  document.getElementById('page-title').textContent=m.title;
  document.getElementById('page-subtitle').textContent=m.sub;
  closeSidebar();
  
  // Initialize page-specific content
  if(id==='learners') renderLearners(LEARNERS);
  if(id==='teachers') renderTeachers();
  if(id==='classes') renderClasses();
  if(id==='fees') renderFees();
  if(id==='events') buildCalendar(calYear,calMonth);
  if(id==='timetable') buildTimetable();
}

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sb-overlay').classList.toggle('open');
}

function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sb-overlay').classList.remove('open');
}

// ═══ TOAST NOTIFICATIONS ═══
function toast(msg, type='success'){
  const t=document.getElementById('toast');
  t.textContent = (type==='success'?'✅ ':type==='error'?'❌ ':'ℹ️ ')+msg;
  t.className='show '+type;
  setTimeout(()=>t.className='',3000);
}

// ═══ MODALS ═══
function openModal(id){document.getElementById(id).classList.add('open')}
function closeModal(id){document.getElementById(id).classList.remove('open')}
document.querySelectorAll('.modal-overlay').forEach(m=>
  m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')})
);

// ═══ LEARNERS ═══
function renderLearners(list){
  const tbody=document.getElementById('learner-tbody');
  tbody.innerHTML=list.map(l=>`
    <tr>
      <td style="font-weight:700;color:var(--primary)">${l.adm}</td>
      <td><strong>${l.name}</strong></td>
      <td>${l.class}</td>
      <td>${l.gender==='F'?'👧 Female':'👦 Male'}</td>
      <td>${l.phone}</td>
      <td><span class="badge badge-${l.fees==='Paid'?'green':l.fees==='Partial'?'yellow':'red'}">${l.fees}</span></td>
      <td><span class="badge badge-${l.level.toLowerCase()}">${l.level}</span></td>
      <td><button class="btn btn-sm btn-secondary" onclick="toast('${l.name} profile','success')">View</button></td>
    </tr>`).join('');
  document.getElementById('learner-count').textContent=`(${list.length} shown of ${list.length} total)`;
}

function filterLearners(q){
  const cls=document.getElementById('class-filter')?.value||'';
  let list=LEARNERS.filter(l=>{
    const matchQ=!q||l.name.toLowerCase().includes(q.toLowerCase())||l.adm.includes(q);
    const matchC=!cls||l.class===cls;
    return matchQ&&matchC;
  });
  renderLearners(list);
}

function addLearner(){
  const fn=document.getElementById('new-fname').value;
  const ln=document.getElementById('new-lname').value;
  if(!fn||!ln){toast('Enter first and last name','error');return;}
  LEARNERS.unshift({
    adm:`2025/${String(LEARNERS.length+1).padStart(3,'0')}`,
    name:`${fn} ${ln}`,
    class:document.getElementById('new-class').value,
    gender:'F',
    phone:document.getElementById('new-phone').value||'—',
    fees:'Outstanding',
    level:'AE'
  });
  closeModal('add-learner-modal');
  renderLearners(LEARNERS);
  toast(`${fn} ${ln} enrolled!`,'success');
  document.getElementById('badge-learners').textContent=LEARNERS.length;
}

function exportLearners(){toast('Learner register exported to Excel!','success')}
function globalSearch(q){if(q.length>1){nav('learners');filterLearners(q)}}

// ═══ TEACHERS ═══
function renderTeachers(){
  document.getElementById('teacher-cards').innerHTML=TEACHERS.map(t=>`
    <div class="person-card" onclick="toast('${t.name} profile','success')">
      <div class="person-avatar" style="background:${t.color}">${t.name.split(' ').map(x=>x[0]).join('').substring(0,2)}</div>
      <div>
        <div class="person-name">${t.name}</div>
        <div class="person-meta">${t.subjects}</div>
        <div class="person-meta" style="margin-top:4px">
          <span class="badge badge-${t.type==='TSC'?'blue':'yellow'}" style="margin-right:4px">${t.type}</span>
          <span class="badge badge-gray">${t.classes}</span>
        </div>
      </div>
    </div>`).join('');
}

function addTeacher(){
  const name=document.getElementById('t-name').value;
  if(!name){toast('Enter teacher name','error');return;}
  TEACHERS.push({
    name,
    subjects:document.getElementById('t-subjects').value,
    classes:'Grade 7',
    phone:document.getElementById('t-phone').value,
    type:'TSC',
    color:'#6C3FC5'
  });
  closeModal('add-teacher-modal');
  renderTeachers();
  toast(`${name} added!`,'success');
}

// ═══ CLASSES ═══
function renderClasses(){
  document.getElementById('classes-grid').innerHTML=CLASSES.map(c=>`
    <div class="card" style="border-top:4px solid var(--primary);cursor:pointer" onclick="toast('${c.grade} details','success')">
      <div class="card-body">
        <div style="font-family:'Syne',sans-serif;font-size:18px;font-weight:800;margin-bottom:8px">${c.grade}</div>
        <div style="font-size:13px;color:var(--muted)">Teacher: <strong>${c.teacher}</strong></div>
        <div style="font-size:13px;color:var(--muted);margin-top:4px">Learners: <strong>${c.count}</strong></div>
        <div style="margin-top:10px;display:flex;gap:6px">${c.streams.map(s=>`<span class="badge badge-blue">${s}</span>`).join('')}</div>
      </div>
    </div>`).join('');
}

// ═══ FEES ═══
function renderFees(){
  document.getElementById('fees-tbody').innerHTML=FEES_DATA.map(f=>`
    <tr><td>${f.date}</td><td><strong>${f.learner}</strong></td>
    <td style="font-weight:700;color:var(--primary)">${f.amount}</td>
    <td><span class="badge badge-${f.status==='Paid'?'green':f.status==='Partial'?'yellow':'red'}">${f.status}</span></td></tr>`).join('');
}

// ═══ SCHEMES OF WORK ═══
const SCHEME_DATA={
  'Mathematics':{
    'Grade 4':{strands:['Numbers — Whole Numbers','Fractions','Measurement','Geometry','Data Handling']},
    'Grade 7':{strands:['Numbers — Integers','Algebra — Equations','Geometry','Measurement','Statistics']},
  },
  'English':{
    'Grade 7':{strands:['Listening & Speaking','Reading','Writing','Grammar','Literature']},
  },
};

function buildScheme(){
  const grade=document.getElementById('scheme-grade').value;
  const subject=document.getElementById('scheme-subject').value;
  const term=document.getElementById('scheme-term').value;
  if(!grade||!subject){toast('Select grade and subject','error');return;}
  const data=SCHEME_DATA[subject]?.[grade]||{strands:['Strand 1','Strand 2','Strand 3','Strand 4','Strand 5']};
  document.getElementById('scheme-title').textContent=`📋 ${subject} — ${grade} | Term ${term}, 2025`;
  let rows='';
  for(let w=1;w<=13;w++){
    const strandIdx=Math.min(Math.floor((w-1)/3),data.strands.length-1);
    const strand=data.strands[strandIdx];
    rows+=`<tr><td style="font-weight:700;text-align:center;width:50px">${w}</td>
      <td class="c1">${strand}</td>
      <td>Core concepts and skills</td>
      <td>Apply concepts effectively</td>
      <td>Discussions, exercises</td>
      <td>Learner's book, materials</td>
      <td>Observation, exercises</td>
      <td><span class="badge badge-gray">Week ${w}</span></td></tr>`;
  }
  document.getElementById('scheme-body').innerHTML=`
    <div style="overflow-x:auto;margin-bottom:16px;padding:14px;background:var(--bg);border-radius:10px;font-size:13px">
      <strong>Subject:</strong> ${subject} | <strong>Grade:</strong> ${grade} | <strong>Term:</strong> ${term}, 2025
    </div>
    <div style="overflow-x:auto">
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead><tr style="background:var(--primary);color:#fff">
        <th style="padding:8px 10px;font-size:11px;font-weight:700;text-transform:uppercase">Wk</th>
        <th style="padding:8px 10px">Strand</th><th style="padding:8px 10px">Sub-Strand</th>
        <th style="padding:8px 10px">SLOs</th><th style="padding:8px 10px">Activities</th>
        <th style="padding:8px 10px">Resources</th><th style="padding:8px 10px">Assessment</th><th style="padding:8px 10px">Remarks</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    </div>`;
  toast(`${subject} scheme generated!`,'success');
}

// ═══ LESSON PLAN GENERATOR ═══
function generateLessonPlan(){
  const today=new Date().toLocaleDateString('en-KE',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  document.getElementById('lp-generated').style.display='block';
  document.getElementById('lp-output').style.display='none';
  document.getElementById('lp-generated').innerHTML=`
    <div class="card">
      <div class="card-header">
        <h3>📝 Generated Lesson Plan</h3>
        <div style="display:flex;gap:8px">
          <button class="btn btn-sm btn-secondary" onclick="window.print()">🖨 Print</button>
          <button class="btn btn-sm btn-primary" onclick="toast('Lesson plan saved!','success')">💾 Save</button>
        </div>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;padding:16px;background:var(--bg);border-radius:10px;font-size:13px">
          <div><strong>School:</strong> Makemba Academy</div>
          <div><strong>Date:</strong> ${today}</div>
          <div><strong>Subject:</strong> Mathematics</div>
          <div><strong>Grade:</strong> Grade 7</div>
          <div><strong>Duration:</strong> 40 Minutes</div>
          <div><strong>No. of Learners:</strong> 32</div>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <tr style="background:var(--primary);color:#fff"><td style="padding:10px 14px;font-weight:700">SPECIFIC LEARNING OUTCOMES</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid var(--border)">By the end of the lesson, the learner should be able to apply multiplication in real-life situations.</td></tr>
          <tr style="background:var(--bg)"><td style="padding:10px 14px;font-weight:700;border:1px solid var(--border)">RESOURCES</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid var(--border)">Number cards, multiplication charts, counters, learner's book</td></tr>
          <tr style="background:var(--bg)"><td style="padding:10px 14px;font-weight:700;border:1px solid var(--border)">LESSON FLOW</td></tr>
          <tr><td style="padding:10px 14px;border:1px solid var(--border)"><strong>Introduction (5 min):</strong> Warm-up and context setting<br><strong>Development (10 min):</strong> Teacher demonstration<br><strong>Practice (15 min):</strong> Guided and independent practice<br><strong>Conclusion (10 min):</strong> Assessment and homework</td></tr>
        </table>
      </div>
    </div>`;
  toast('Lesson plan generated!','success');
}

// ═══ CBC ASSESSMENT ═══
const STRANDS={
  'Mathematics':['Numbers','Algebra','Geometry','Measurement','Statistics'],
  'English':['Listening','Reading','Writing','Language','Literature'],
};
const LEVELS=['EE','ME','AE','BE'];

function loadAssessmentGrid(){
  const grade=document.getElementById('assess-grade').value;
  if(!grade){toast('Select a grade','error');return;}
  const learners=LEARNERS.filter(l=>l.class===grade).slice(0,8);
  if(!learners.length){toast('No learners in this grade','error');return;}
  const strands=STRANDS['Mathematics']||STRANDS['English'];
  document.getElementById('assess-grid-title').textContent=`Mathematics · ${grade} · Term 2, 2025`;
  let thead=`<thead><tr><th>#</th><th>Learner</th>${strands.map(s=>`<th>${s}</th>`).join('')}<th>Overall</th></tr></thead>`;
  let tbody=`<tbody>${learners.map((l,i)=>`
    <tr>
      <td style="font-weight:700;color:var(--muted)">${i+1}</td>
      <td><strong>${l.name}</strong></td>
      ${strands.map(s=>`<td><select class="form-control" style="padding:4px 6px;font-size:12px">
        <option>-</option>${LEVELS.map(lv=>`<option>${lv}</option>`).join('')}</select></td>`).join('')}
      <td><span class="badge badge-${l.level.toLowerCase()}">${l.level}</span></td>
    </tr>`).join('')}</tbody>`;
  document.getElementById('assess-table').innerHTML=thead+tbody;
  document.getElementById('assess-grid-card').style.display='block';
  toast('Grid loaded!','success');
}

function saveAssessment(){toast('Marks saved!','success')}
function loadAssessmentView(){}

// ═══ REPORT CARD ═══
const RC_SUBJECTS={'Grade 7':['Mathematics','English','Kiswahili','Science','Social Studies']};

function buildReportCard(){
  const grade=document.getElementById('rc-grade').value;
  const learner=document.getElementById('rc-learner').value;
  const subs=RC_SUBJECTS[grade]||['Mathematics','English','Science','Social Studies'];
  document.getElementById('report-card-container').innerHTML=`
    <div style="background:#fff;border:1px solid #ccc;border-radius:6px;max-width:700px;margin:0 auto;font-size:13px;padding:20px">
      <div style="background:var(--primary);color:#fff;padding:20px;border-radius:6px;margin-bottom:20px">
        <div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800">Makemba Academy</div>
        <div style="font-size:12px;opacity:.8">CBC LEARNER'S PROGRESS REPORT — ${grade}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;padding:12px;background:var(--bg);border-radius:8px">
        <div><strong>Learner:</strong> ${learner}</div>
        <div><strong>Class:</strong> ${grade}</div>
        <div><strong>Attendance:</strong> 58/62 Days</div>
        <div><strong>Term:</strong> 2, 2025</div>
      </div>
      <div style="margin-bottom:20px">
        ${subs.map(s=>`<div style="border-bottom:1px solid var(--border);padding:10px 0">
          <div style="font-weight:700;margin-bottom:8px">${s}</div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:8px">
            <span class="badge badge-ee">EE</span>
            <span class="badge badge-me">ME</span>
            <span class="badge badge-ae">AE</span>
            <span class="badge badge-be">BE</span>
          </div>
          <textarea style="width:100%;padding:8px;border:1px solid var(--border);border-radius:6px;font-family:inherit;font-size:12px;resize:none" rows="2" placeholder="Teacher comment…"></textarea>
        </div>`).join('')}
      </div>
      <div style="padding:12px;background:var(--bg);border-radius:6px;margin-bottom:20px">
        <strong>Headteacher's Comment:</strong>
        <textarea style="width:100%;margin-top:8px;padding:8px;border:1px solid var(--border);border-radius:6px;font-family:inherit;font-size:12px;resize:none" rows="2" placeholder="General comment…"></textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;text-align:center;font-size:12px">
        <div><div style="border-bottom:1px solid var(--ink);margin-bottom:4px;height:30px"></div>Teacher</div>
        <div><div style="border-bottom:1px solid var(--ink);margin-bottom:4px;height:30px"></div>H/T</div>
        <div><div style="border-bottom:1px solid var(--ink);margin-bottom:4px;height:30px"></div>Parent</div>
      </div>
    </div>`;
  toast('Report card generated!','success');
}

// ═══ TIMETABLE ═══
const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday'];
const PERIODS=['7:30–8:10','8:10–8:50','8:50–9:30','Break','9:50–10:30','10:30–11:10','11:10–11:50','Lunch','1:00–1:40','1:40–2:20'];
const TT_SUBJECTS={
  'Grade 7 Blue':[
    ['Math','English','Kiswahili','Science','Social'],
    ['English','Science','Math','CRE','P.E.'],
    ['Kiswahili','Math','Science','English','Agric'],
    ['BREAK','BREAK','BREAK','BREAK','BREAK'],
    ['Science','Kiswahili','English','Math','ICT'],
    ['Social','CRE','ICT','Kiswahili','Math'],
    ['P.E.','Agric','Social','Art','English'],
    ['LUNCH','LUNCH','LUNCH','LUNCH','LUNCH'],
    ['ICT','P.E.','Art','Agric','Science'],
    ['Art','Social','CRE','P.E.','Kiswahili'],
  ],
};

function buildTimetable(){
  const cls=document.getElementById('tt-class')?.value||'Grade 7 Blue';
  document.getElementById('tt-title').textContent=`${cls} — Timetable Term 2, 2025`;
  const data=TT_SUBJECTS[cls]||TT_SUBJECTS['Grade 7 Blue'];
  let html=`<table class="timetable"><thead><tr><th>Period</th>${DAYS.map(d=>`<th>${d}</th>`).join('')}</tr></thead><tbody>`;
  PERIODS.forEach((period,pi)=>{
    html+=`<tr><td style="font-weight:700;font-size:11px;background:var(--bg)">${period}</td>`;
    DAYS.forEach((_,di)=>{
      const subj=data[pi]?.[di]||'—';
      const isBreak=period.includes('Break')||period.includes('Lunch');
      if(isBreak){html+=`<td style="background:#F3F4F6;text-align:center;font-weight:700;font-size:12px;color:var(--muted)">${subj}</td>`;return;}
      html+=`<td onclick="toast('${subj}','success')"><div style="border-radius:6px;padding:4px 6px;font-size:11px;font-weight:700;background:#F0FDF4;cursor:pointer">${subj}</div></td>`;
    });
    html+='</tr>';
  });
  html+='</tbody></table>';
  document.getElementById('tt-container').innerHTML=html;
}

// ═══ ATTENDANCE ═══
function loadAttendance(){
  const cls=document.getElementById('att-class').value;
  const date=document.getElementById('att-date').value;
  const learners=LEARNERS.slice(0,10);
  buildAttTable(learners,cls,date);
}

function buildAttTable(learners,cls,date){
  document.getElementById('att-title').textContent=`${cls} — ${date}`;
  let rows=learners.map((l,i)=>`
    <tr>
      <td style="font-weight:700">${i+1}</td>
      <td>${l.adm}</td>
      <td><strong>${l.name}</strong></td>
      <td>
        <select class="form-control" style="width:100px;padding:4px 6px;font-size:12px" onchange="updateAttStats()">
          <option value="P" selected>✅ Present</option>
          <option value="A">❌ Absent</option>
          <option value="L">⏰ Late</option>
        </select>
      </td>
    </tr>`).join('');
  document.getElementById('att-table').innerHTML=`<thead><tr><th>#</th><th>Adm</th><th>Name</th><th>Status</th></tr></thead><tbody>${rows}</tbody>`;
  document.getElementById('att-card').style.display='block';
  updateAttStats();
}

function updateAttStats(){
  const sels=[...document.querySelectorAll('#att-table select')];
  const p=sels.filter(s=>s.value==='P').length;
  const a=sels.filter(s=>s.value==='A').length;
  const l=sels.filter(s=>s.value==='L').length;
  const total=sels.length;
  document.getElementById('att-present').textContent=p;
  document.getElementById('att-absent').textContent=a;
  document.getElementById('att-late').textContent=l;
  document.getElementById('att-pct').textContent=total?Math.round((p/total)*100)+'%':'—';
}

function markAllPresent(){
  document.querySelectorAll('#att-table select').forEach(s=>s.value='P');
  updateAttStats();
  toast('All marked present!','success');
}

// ═══ CALENDAR ═══
let calYear=2025,calMonth=5;
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];

function buildCalendar(year,month){
  const label=`${MONTHS[month]} ${year}`;
  const el=document.getElementById('cal-month-label');
  if(el)el.textContent=label;
  const first=new Date(year,month,1);
  let startDay=first.getDay()-1;if(startDay<0)startDay=6;
  const daysInMonth=new Date(year,month+1,0).getDate();
  let html='';
  for(let i=0;i<startDay;i++)html+=`<div style="text-align:center;padding:6px;color:#ccc;font-size:12px">${new Date(year,month,i-startDay+1).getDate()}</div>`;
  for(let d=1;d<=daysInMonth;d++){
    const isToday=d===new Date().getDate()&&month===new Date().getMonth()&&year===new Date().getFullYear();
    html+=`<div style="text-align:center;padding:6px;border:1px solid var(--border);border-radius:7px;cursor:pointer;${isToday?'background:var(--primary);color:#fff;font-weight:700':''}">${d}</div>`;
  }
  const container=document.getElementById('cal-days');
  if(container)container.innerHTML=html;
}

function changeMonth(dir){
  calMonth+=dir;
  if(calMonth>11){calMonth=0;calYear++;}
  if(calMonth<0){calMonth=11;calYear--;}
  buildCalendar(calYear,calMonth);
}

// ═══ SETTINGS ═══
function saveSettings(){
  const name=document.getElementById('set-school-name')?.value;
  if(name){
    document.getElementById('sb-school-name').textContent=name.length>22?name.substring(0,22)+'…':name;
  }
  toast('Settings saved!','success');
}

// ═══ INITIALIZATION ═══
document.querySelectorAll('.modal-overlay').forEach(m=>
  m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')})
);

buildTimetable();
buildCalendar(calYear,calMonth);
