(function(){
  if(typeof window.bfCard!=='function'||!window.BF_PRODUCTS)return;
  window.bfCard=function(p){return `<article class="product-card"><a class="product-art" href="product.html?id=${p.id}"><img class="figma-card-art" src="${p.image}" alt="${p.name}" width="173" height="301"></a><div class="product-info"><h4><a href="product.html?id=${p.id}">${p.name}</a></h4><div class="price"><b>৳${Number(p.price).toLocaleString('en-BD')}</b><span>/mo</span><del>৳${Number(p.old).toLocaleString('en-BD')}</del></div><div class="card-actions"><button data-add="${p.id}" aria-label="Add ${p.name} to cart">🛒</button><a class="buy" href="product.html?id=${p.id}">Buy now</a></div></div></article>`};
  const page=location.pathname.split('/').pop();
  if(page==='shop.html')window.bfShop();
  if(page==='product.html')window.bfProductPage();
})();