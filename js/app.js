window.addEventListener('DOMContentLoaded', function() {
  var mgmt = navigator.mozApps.mgmt,
    appListPage = document.getElementById('dynapps'),
    includeSystemRole = true
  
  mgmt.getAll().then(function(rawAppList) {
    var appList = includeSystemRole ? rawAppList : rawAppList.filter(function(app) {
      return !(app.manifest.role === 'system')
    })
    var l = appList.length, p = 0, pageSize = 1000, maxPage = ((l / pageSize) | 0)

    function displayPage(num) {
      var startIndex = num * pageSize,
          pagedApps = appList.slice(startIndex, startIndex + pageSize), pl = pagedApps.length,
          i, renderedHTML = ''
      for(i=0;i<pl;i++) {
        var appName = pagedApps[i].manifest.name, appOrigin = pagedApps[i].origin, appTime=pagedApps[i].installTime, displayAppIndex = i,
            realAppIndex = startIndex + i, appStatus = pagedApps[i].enabled
        renderedHTML += '<li data-display-index="' + displayAppIndex + '" data-real-index="' + realAppIndex + '" + data-status="' + appStatus + '">' + appName + '   <small><i>(' + new Date(appTime).getHours() + ':' + new Date(appTime).getMinutes() + ')</i></small><br><small><a href="'+appOrigin+'" target="_blank">'+appOrigin+'</a></small></li>'
      }
      appListPage.innerHTML = renderedHTML
    }

    function toggleApp(appNum) {
      var item = document.querySelector('li[data-display-index="'+appNum+'"]'),
          appIndex = item.dataset.realIndex | 0,
          appRef = appList[appIndex],
          newAppStatus = !appRef.enabled
      mgmt.setEnabled(appRef, newAppStatus)
      window.setTimeout(function() {
        displayPage(p)
      }, 100)
    }

    /*window.addEventListener('keydown', function(e) {
      switch(e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'SoftLeft':
          p -= 1
          if(p < 0) p = 0
          displayPage(p)
          break
        case 'ArrowRight':
        case 'ArrowDown':
        case 'SoftRight':
          p += 1
          if(p > maxPage) p = maxPage
          displayPage(p)
          break
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          toggleApp(Number(e.key))
          break
        case '#':
					// the modified prompt was misleading
          if(window.confirm(`One last touch!\nOnce you've made sure of all the changes, press OK (the RSK one) to close the app, then restart your device manually for them to take effect. Or, press Cancel now to review your changes.\nProceed?`))
            window.close()
          break
        default:
          break
      }
    }, false)*/

    displayPage(p)

  })
  console.log(mgmt.getAll());
}, false)
