const platform = 'facebook'


window.addEventListener('load', function(event) {
    console.info('loading')
    const name = ',"name name'
    const gender = ',"gender gender'
    const elements = [name, gender]
    var text = this.document.body.innerHTML   
    
    var args = {'name': '', 'gender': ''}
    
    elements.forEach(element => {
        var elementValues = element.split(' ')
        var elementType = elementValues[1]
        element = elementValues[0]
        var index = text.search(element)
        if (index != -1){
            var valueList = text.slice(index+element.length,-1)
            value = valueList.split('"')[2]
            args[elementType] = value
        }   
    
    });
    console.log(args)
    chrome.runtime.sendMessage({'platform': platform, 'args': args})
    
})


