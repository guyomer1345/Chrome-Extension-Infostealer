const platform = 'linkedin'

const InfoTypes = {
    Name: 'name',
    Address: 'address',
    Email: 'email'
};

const divs = {
    'text-body-small inline t-black--light break-words': InfoTypes.Address,
    'text-heading-xlarge inline t-24 v-align-middle break-words': InfoTypes.Name,
    't-16 t-black t-bold': InfoTypes.Name,
    'text-heading-xlarge inline t-24 v-align-middle break-words': InfoTypes.Name

};

const hrefs = {
    'pv-contact-info__contact-link link-without-visited-state t-14': InfoTypes.Email
}

const divsClasses = Object.keys(divs);
const hrefsClasses = Object.keys(hrefs);


var currentHref = document.location.href;


function ScrapeDivs(divsClasses, divs){
    divsClasses.forEach(currentClass => {

        var elmList = document.getElementsByClassName(currentClass);
        if (elmList.length){
            if (!elmList[0].innerHTML.toLowerCase().includes('profile')) // 'Your Profile' and name share same tag in some places
            {
                var dataType = divs[currentClass]
                var data = elmList[0].innerHTML.trim()
                var args = {}
                args[dataType] = data
                chrome.runtime.sendMessage({'platform': platform, 'args': args})
            }       
        }
    })
}

function ScrapeHrefs(hrefsClasses, hrefs){
    hrefsClasses.forEach(currentClass => {

        var hrefList = Array.from(document.getElementsByClassName(currentClass));
        if (hrefList.length){
    
            hrefList.forEach(currentHref => {
    
                if(currentHref.innerHTML.includes('@')){
                    var data = currentHref.innerHTML.trim()
                    var dataType = hrefs[currentClass]
                    
                    var args = {}
                    args[dataType] = data
                    chrome.runtime.sendMessage({'platform': platform, 'args': args})
                }
            });
        }
    })
}

function Scrape(){
    ScrapeDivs(divsClasses, divs)
    ScrapeHrefs(hrefsClasses, hrefs)
}

const target = document.querySelector('body');
const config = { childList: true };

const observer = new MutationObserver(function() {
    Scrape();  
});



observer.observe(target, config);


