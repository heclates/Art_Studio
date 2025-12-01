export const createAbout = () => {
    const article = document.createElement('article')
    article.className('about-us')

    const h3 = document.createElement('h3')
    h3.className = 'about-us__title'
    h3.textContent = 'О студии'
    article.appendChild(h3)

    const introP = document.createElement('p')
    introP.className = 'about-us__text'
    introP.textContent = 'Наша история'
    article.appendChild(introP)

    const section = document.createElement('section')
    section.className = 'about-us__content'
    
    const h4 = document.createElement('h4')
    h4.className = 'about-us__content__title'
    h4.textContent = 'Екатерина Александрова'
    
    const sectionP = document.createElement('p')
    sectionP.className = 'about-us__content__text'
    sectionP.textContent = 'Основатель и главный преподователь'

    return article
}