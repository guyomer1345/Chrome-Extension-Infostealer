const platform = 'twitter'



window.addEventListener('load', function(event) {
    console.info('loading')
    const screenName = 'screen_name'
    var text = this.document.body.innerHTML
    var index = text.search(screenName)
    if (index != -1){
        var userName = text.slice(index+screenName.length,-1)
        userName = userName.split('"')[2]
        args = {'username': userName}
        chrome.runtime.sendMessage({'platform': platform, 'args': args})
    }  
})
