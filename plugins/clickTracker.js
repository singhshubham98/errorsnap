import { addBreadcrumb } from '../breadcrumbs.js';

export function trackClicks() {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target) return;

    let description = target.tagName.toLowerCase();
    if (target.id) description += `#${target.id}`;
    if (target.className && typeof target.className === 'string') {
      description += `.${target.className.split(' ').join('.')}`;
    }

    addBreadcrumb({
      type: 'click',
      message: description,
    });
  });
}
