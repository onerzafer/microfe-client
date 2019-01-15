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
Links.angularLink.href = '/angular';
Links.angularLink.onclick = (e) => { MicroAppRouter.navigate(Links.angularLink.href); e.preventDefault(); return false;};
container.appendChild(Links.angularLink);
Links.reactLink.innerText = 'React App';
Links.reactLink.href = '/react';
Links.reactLink.onclick = (e) => { MicroAppRouter.navigate(Links.reactLink.href); e.preventDefault(); return false;};
container.appendChild(Links.reactLink);
container.classList.add('header');

MicroAppRouter.onChange(() => {
    Object.keys(Links).forEach(key => {
        if(MicroAppRouter.isActive(Links[key].href)) {
            Links[key].classList.add('active');
        } else {
            Links[key].classList.remove('active');
        }
    })
});
