/* Remove target="_blank" rel="noopener" where missing */
document.querySelectorAll('a[target="_blank"]').forEach(a=>{
  if(!a.relList.contains('noopener')) a.relList.add('noopener');
});

/* Report CSP violations to your server (optional) */
document.addEventListener('securitypolicyviolation', e => {
  fetch('/csp-violation-report',{
    method:'POST',
    headers:{'Content-Type':'application/csp-report'},
    body:JSON.stringify({csp:e})
  }).catch(()=>{});
});