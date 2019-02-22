import { observable, action, asMap } from 'mobx'
import { persist } from 'mobx-persist'

export class AuthStore {
    @persist @observable username = ''
    @persist @observable password = ''
    @action save(uname, pswrd) {
        this.username = uname;
        this.password = pswrd
    }
}