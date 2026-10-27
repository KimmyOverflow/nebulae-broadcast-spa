import { useContext } from 'react'
import { MenuNavigator } from '../..'
import { MenuPage } from '..'
import { useFetch } from '../../../../hooks/useFetch'
import { BASE_URL } from '../../../../consts'
import { MenuPlaceholderLoading } from '../../placeholders/loading'
import { MenuPlaceholderError } from '../../placeholders/error'

export const MenuPageOnlineUsers: React.FC = () => {
    const navigator = useContext(MenuNavigator)

    const [data, reload] = useFetch<{}>(
        `${BASE_URL}/api/stat/users`,
        { requireLogin: true }
    )

    let content = null
    switch (data.status) {
        case 'loading':
            content = <MenuPlaceholderLoading key='loading' />
            break
        case 'success':
            break
        case 'error':
        default:
            content = <MenuPlaceholderError onRetry={reload} key='error' />
            break
    }

    return (
        <MenuPage
            header='用户'
            onBack={() => navigator.pop()}
        >
            {content}
        </MenuPage>
    )
}