import { isSafari, checkWebp, checkBurgerAndMenu } from './other/checks'
import { throttle } from './core/helpers'
import { loaded } from './core/dom'
import { headerTop } from './core/variables'
import { haveScroll } from './other/checks'


// Проверка на браузер safari
if (isSafari) document.documentElement.classList.add('safari')

// Проверка поддержки webp 
checkWebp()

// Закрытие бургера на десктопе
window.addEventListener('resize', throttle(checkBurgerAndMenu, 100))
checkBurgerAndMenu()

// Добавление класса loaded при загрузке страницы
loaded()
