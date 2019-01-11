const { EventBus, container } = microAppArgs;
const span = document.createElement('span');
container.innerText = 'HEADER';
container.classList.add('header');
container.appendChild(span);
EventBus.subscribe(({payload}) => {
    span.innerText = payload;
});
