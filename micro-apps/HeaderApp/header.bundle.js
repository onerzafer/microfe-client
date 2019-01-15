const { MicroAppRouter, container } = microAppArgs;
const header = document.createElement('H1');
const headerLink = document.createElement('a');
headerLink.onclick = () => MicroAppRouter.navigate('/');
headerLink.innerText = 'microfe';
header.appendChild(headerLink);
container.appendChild(header);
const Links = {
    angularLink: document.createElement('a'),
    reactLink: document.createElement('a'),
};
Links.angularLink.innerText = 'Angular App';
Links.angularLink.onclick = () => MicroAppRouter.navigate('/angular');
container.appendChild(Links.angularLink);
Links.reactLink.innerText = 'React App';
Links.reactLink.onclick = () => MicroAppRouter.navigate('/react');
container.appendChild(Links.reactLink);
container.classList.add('header');

function removeActiveClass(path) {
    switch (path) {
        case '/angular':
            Links.angularLink.classList.remove('active');
            break;
        case '/react':
            Links.reactLink.classList.remove('active');
            break;
    }
}

function addActiveClass(path) {
    switch (path) {
        case '/angular':
            Links.angularLink.classList.add('active');
            break;
        case '/react':
            Links.reactLink.classList.add('active');
            break;
    }
}

MicroAppRouter.onChange((oldPath, newPath) => {
    addActiveClass(newPath);
    removeActiveClass(oldPath);
});
