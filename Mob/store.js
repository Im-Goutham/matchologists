import { observable, action, asMap } from 'mobx'
import { persist } from 'mobx-persist'



export class CountStore {
    @persist @observable count = 0
    @action inc() {
        this.count = this.count + 1
    }
}
var arr = [
    {
        fruit:'apple',
        location:"ahmedabad"
    },
    {
        fruit:'orange',
        location:"nagpur"
    }
];
class Item {
    @persist @observable info = JSON.stringify(arr)
}

export class MapStore {
    @persist('map', Item) @observable items = observable.map()
    @action test(key = 'test') {
        console.log(this.items.keys().join('.'))
        this.items.set(key, new Item)
        // this.items.clear()
        
    }
}

export class ListStore {
    @persist('list') @observable list = []
    @action test(text = `${Date.now()}`) {
        this.list.push({ text })
        this.list.pop()
    }
}