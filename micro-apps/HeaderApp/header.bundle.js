const { MicroAppRouter, container } = microAppArgs;

const Links = {
    angularLink: document.createElement('a'),
    reactLink: document.createElement('a'),
    staticLink: document.createElement('a'),
    headerLink: document.createElement('a')
};

const header = document.createElement('H1');
Links.headerLink.innerText = 'microfe';
Links.headerLink.href = '/';
Links.headerLink.onclick = (e) => { MicroAppRouter.navigate(Links.headerLink.href); e.preventDefault(); return false;};
header.appendChild(Links.headerLink);
container.appendChild(header);


Links.angularLink.innerText = 'Angular App';
Links.angularLink.href = '/angular';
Links.angularLink.onclick = (e) => { MicroAppRouter.navigate(Links.angularLink.href); e.preventDefault(); return false;};
container.appendChild(Links.angularLink);

Links.reactLink.innerText = 'React App';
Links.reactLink.href = '/react';
Links.reactLink.onclick = (e) => { MicroAppRouter.navigate(Links.reactLink.href); e.preventDefault(); return false;};
container.appendChild(Links.reactLink);

Links.staticLink.innerText = 'Static App';
Links.staticLink.href = '/static';
Links.staticLink.onclick = (e) => { MicroAppRouter.navigate(Links.staticLink.href); e.preventDefault(); return false;};
container.appendChild(Links.staticLink);

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
