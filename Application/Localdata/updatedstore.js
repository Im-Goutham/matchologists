class AuthenticationStore {
    constructor() {
      isAuthenticating = true
      AsyncStorage.getItem('token').then(action((data) => {
        this.token = data
        this.isAuthenticating = false
      }))
    }
  
    @observable isAuthenticating = false
    @observable token = null
    @computed get isAuthenticated () {
      return this.token ? true : false
    }
  
    @action login () {
      invariant(!this.isAuthenticating, 'Cannot login while authenticating.')
      invariant(!this.isAuthenticated, 'Cannot login while authenticated.')
  
      this.isAuthenticating = true
  
      // more code above, here is the relevant setting of token
  
      this.token = token
      this.isAuthenticating = false
      AsyncStorage.setItem('token', token)
    }
  
    @action logout () {
      invariant(!this.isAuthenticating, 'Cannot logout while authenticating.')
      invariant(this.isAuthenticated, 'Cannot logout while not authenticated.')
  
      this.token = null
      AsyncStorage.removeItem('token')
    }
  }