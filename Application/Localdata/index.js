import { AsyncStorage } from 'react-native'
import { observer } from 'mobx-react/native'
import { create } from 'mobx-persist'
import { GetStore } from './store'

const hydrate = create({ storage: AsyncStorage })
const getStore = new GetStore
hydrate('username', getStore)
@observer
export class getUsername {
    getname(){
        return "hajkdfsgk"
    }
}
