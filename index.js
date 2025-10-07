(function(){
  if(!window.document) return;
  const addBtn = document.getElementById('addBtn');
  const input = document.getElementById('taskInput');
  const listArea = document.getElementById('listArea');
  const countInfo = document.getElementById('countInfo');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');
  const resetBtn = document.getElementById('resetBtn');
  const filterAll = document.getElementById('filterAll');
  const filterActive = document.getElementById('filterActive');
  const filterDone = document.getElementById('filterDone');

  let tasks = [
    {id:1,text:'Finish the project report', done:false, meta:'Due: Today • 2h'},
    {id:2,text:'Morning workout — 30 min', done:true, meta:'Completed'},
    {id:3,text:'Read 20 pages of book', done:false, meta:'Due: Oct 5'},
  ];
  let nextId = 4;
  let filter = 'all';

  function render(){
    listArea.innerHTML = '';
    const filtered = tasks.filter(t => filter==='all' ? true : (filter==='active' ? !t.done : t.done));
    if(filtered.length===0){
      listArea.innerHTML = '<div class="empty">No tasks here. Add your first task!</div>';
    } else {
      for(const t of filtered){
        const node = document.createElement('div');
        node.className = 'task' + (t.done ? ' completed' : '');
        node.dataset.id = t.id;
        node.innerHTML = `
          <input type="checkbox" ${t.done ? 'checked' : ''}/>
          <div class="meta">
            <div>
              <div class="text">${escapeHtml(t.text)}</div>
              <div class="text small">${escapeHtml(t.meta || '')}</div>
            </div>
            <div class="actions">
              <button class="icon-btn edit" title="Edit">✎</button>
              <button class="icon-btn del" title="Delete">🗑</button>
            </div>
          </div>
        `;
        listArea.appendChild(node);
      }
    }
    updateCounts();
  }

  function updateCounts(){
    const total = tasks.length;
    const done = tasks.filter(t=>t.done).length;
    countInfo.textContent = ${total} task${total!==1?'s':''} • ${done} completed;
  }

  function escapeHtml(s){ 
    return String(s).replace(/[&<>"']/g, c=>({ 
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' 
    }[c])); 
  }

  // events
  addBtn.addEventListener('click', ()=> {
    const v = input.value.trim();
    if(!v) return input.focus();
    tasks.unshift({id:nextId++, text:v, done:false});
    input.value='';
    render();
  });
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') addBtn.click(); });

  listArea.addEventListener('click', (e)=>{
    const tnode = e.target.closest('.task');
    if(!tnode) return;
    const id = Number(tnode.dataset.id);
    if(e.target.matches('input[type="checkbox"]')){
      const task = tasks.find(x=>x.id===id);
      if(task) task.done = e.target.checked;
      if(task && task.done) tnode.classList.add('completed'); else tnode.classList.remove('completed');
      updateCounts();
    } else if(e.target.classList.contains('del')){
      tasks = tasks.filter(x=>x.id!==id);
      render();
    } else if(e.target.classList.contains('edit')){
      const task = tasks.find(x=>x.id===id);
      if(!task) return;
      const newText = prompt('Edit task', task.text);
      if(newText!==null) { task.text = newText.trim(); render(); }
    }
  });

  clearCompletedBtn.addEventListener('click', ()=>{
    tasks = tasks.filter(t=>!t.done); render();
  });
  resetBtn.addEventListener('click', ()=>{
    tasks = [
      {id:1,text:'Finish the project report', done:false, meta:'Due: Today • 2h'},
      {id:2,text:'Morning workout — 30 min', done:true, meta:'Completed'},
      {id:3,text:'Read 20 pages of book', done:false, meta:'Due: Oct 5'},
    ];
    nextId = 4; filter='all'; render();
  });

  filterAll.addEventListener('click', ()=>{ filter='all'; render(); });
  filterActive.addEventListener('click', ()=>{ filter='active'; render(); });
  filterDone.addEventListener('click', ()=>{ filter='done'; render(); });

  (function syncInitialChecked(){
    document.querySelectorAll('.task').forEach(node=>{
      const cb = node.querySelector('input[type="checkbox"]');
      if(cb && cb.checked) node.classList.add('completed');
    });
  })();

  render();
})();