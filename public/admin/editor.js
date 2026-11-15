const config = JSON.parse(document.getElementById('cms-config').textContent);
window.CMS.init({ config });
window.CMS.registerPreviewStyle('/research-blog/admin/preview.css');
window.CMS.registerPreviewTemplate('posts', ({ entry, widgetFor }) =>
  window.h(
    'main',
    { className: 'article-shell' },
    window.h(
      'article',
      {},
      window.h(
        'header',
        {},
        window.h('p', { className: 'section-label' }, 'Article preview'),
        window.h('h1', {}, entry.getIn(['data', 'title']) || 'Untitled'),
      ),
      window.h('div', { className: 'article-body' }, widgetFor('body')),
    ),
  ),
);
