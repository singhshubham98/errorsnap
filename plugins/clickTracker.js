export function trackClicks() {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target) return;

    let description = target.tagName.toLowerCase();

    const testId = target.getAttribute('data-testid');
    if (testId) {
      description += `[data-testid="${testId}"]`;
    }

    if (target.id) {
      description += `#${target.id}`;
    }

    if (target.className && typeof target.className === 'string') {
      description += `.${target.className.trim().split(/\s+/).join('.')}`;
    }

    addBreadcrumb({
      type: 'click',
      message: description,
    });
  }, true);
}