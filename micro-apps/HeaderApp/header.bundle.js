const { MicroAppStore, container } = microAppArgs;
const span = document.createElement('span');
container.innerText = 'HEADER';
container.classList.add('header');
container.appendChild(span);
MicroAppStore.select('tick').subscribe(state => {
    span.innerText = state;
});
