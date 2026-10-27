import './style.css'

import { useContext } from "react"
import { MenuNavigator } from "../.."
import { MenuPage } from ".."

import license from '@generated/license-file'

export const MenuLicenseFile: React.FC = () => {
    const navigator = useContext(MenuNavigator)
    return (
        <>
            <MenuPage
                header='开放源代码许可声明'
                onBack={() => navigator.pop()}
            >
                <pre className='menu__license-file-content'>{license}</pre>
            </MenuPage>
        </>
    )
}
