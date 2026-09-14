(function(){
  if(typeof window.bfCard!=='function'||!window.BF_PRODUCTS)return;

  window.bfCard=function(p){return `<article class="product-card"><a class="product-art" href="product.html?id=${p.id}"><img class="figma-card-art" src="${p.image}" alt="${p.name}" width="173" height="301"></a><div class="product-info"><h4><a href="product.html?id=${p.id}">${p.name}</a></h4><div class="price"><b>৳${Number(p.price).toLocaleString('en-BD')}</b><span>/mo</span><del>৳${Number(p.old).toLocaleString('en-BD')}</del></div><div class="card-actions"><button data-add="${p.id}" aria-label="Add ${p.name} to cart">🛒</button><a class="buy" href="product.html?id=${p.id}">Buy now</a></div></div></article>`};

  const allProducts=window.BF_PRODUCTS.slice();
  const page=location.pathname.split('/').pop();
  const moreTab=document.querySelector('#category-tabs [data-category="more"]');
  if(moreTab)moreTab.textContent='More Plans';
  const featuredOption=document.querySelector('#shop-sort option:first-child');
  if(featuredOption)featuredOption.textContent='Default sorting';
  if(page!=='shop.html'){
    if(page==='product.html')window.bfProductPage();
    return;
  }

  let grid=document.querySelector('#shop-grid');
  const count=document.querySelector('#product-count');
  const tabs=document.querySelector('#category-tabs');
  const search=document.querySelector('#shop-search');
  const category=document.querySelector('#shop-category');
  const sort=document.querySelector('#shop-sort');
  const pageSize=30;
  let currentPage=1;

  function currentList(){
    const q=(search?.value||'').trim().toLowerCase();
    const group=category?.value||'all';
    const sortValue=sort?.value||'';
    const list=allProducts.filter(p=>
      (group==='all'||p.group===group)&&(!q||p.name.toLowerCase().includes(q))
    );
    if(/low to high/i.test(sortValue))list.sort((a,b)=>Number(a.price)-Number(b.price));
    if(/high to low/i.test(sortValue))list.sort((a,b)=>Number(b.price)-Number(a.price));
    if(/newest/i.test(sortValue))list.reverse();
    return list;
  }

  function pagination(totalPages){
    let holder=document.querySelector('.pagination');
    const legacy=document.querySelector('.hero-buttons');
    if(!holder){
      holder=document.createElement('nav');
      holder.className='pagination';
      holder.setAttribute('aria-label','Product pagination');
      (legacy||grid).insertAdjacentElement('afterend',holder);
    }
    if(legacy)legacy.hidden=true;
    holder.innerHTML=Array.from({length:totalPages},(_,i)=>{
      const n=i+1;
      return `<button type="button" class="${n===currentPage?'active':''}" data-page="${n}" aria-label="Page ${n}">${n}</button>`;
    }).join('')+(currentPage<totalPages?'<button type="button" data-next aria-label="Next page">›</button>':'');
  }

  function render(){
    grid=document.querySelector('#shop-grid');
    if(!grid)return;
    const list=currentList();
    const totalPages=Math.max(1,Math.ceil(list.length/pageSize));
    currentPage=Math.min(currentPage,totalPages);
    const start=(currentPage-1)*pageSize;
    grid.dataset.figmaRendering='1';
    grid.innerHTML=list.slice(start,start+pageSize).map(window.bfCard).join('');
    delete grid.dataset.figmaRendering;
    if(count)count.textContent=`${list.length} plan${list.length===1?'':'s'}`;
    tabs?.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('active',b.dataset.category===(category?.value||'all')));
    pagination(totalPages);
  }

  window.bfShop();
  render();
  setTimeout(render,0);
  window.addEventListener('load',render,{once:true});

  let repairTimer;
  new MutationObserver(()=>{
    if(grid.dataset.figmaRendering==='1')return;
    clearTimeout(repairTimer);
    repairTimer=setTimeout(()=>{
      const expected=Math.min(pageSize,Math.max(0,currentList().length-(currentPage-1)*pageSize));
      if(grid.children.length!==expected)render();
    },0);
  }).observe(document.body,{childList:true,subtree:true});

  [search,category,sort].forEach(control=>control?.addEventListener(control===search?'input':'change',()=>{
    currentPage=1;
    queueMicrotask(render);
  }));
  tabs?.addEventListener('click',event=>{
    if(event.target.closest('[data-category]')){
      currentPage=1;
      queueMicrotask(render);
    }
  });
  document.addEventListener('click',event=>{
    const button=event.target.closest('.pagination button');
    if(!button)return;
    if(button.dataset.next!==undefined)currentPage++;
    else currentPage=Number(button.dataset.page)||1;
    render();
    document.querySelector('.category-tabs')?.scrollIntoView({behavior:'smooth',block:'start'});
  });
})();