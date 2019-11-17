let env
if (location.hostname.indexOf('localhost') >= 0 || location.hostname.indexOf('10.0') >= 0) {
  env = {
    gaWapKey: 'UA-55969660-8',
    gaAndroidKey: 'UA-55969660-8',
    gaIosKey: 'UA-55969660-8',
    countlyAppKey: 'cb95b4e9125098b99a7df2fbda4554eda982918b',
    countlyServer: 'http://10.0.243.111:8080',
    apiUrl: 'http://dev.upms.startimestv.com'
  }
} else if (location.hostname.indexOf('dev') >= 0) {
  env = {
    gaWapKey: 'UA-55969660-8',
    gaAndroidKey: 'UA-55969660-8',
    gaIosKey: 'UA-55969660-8',
    countlyAppKey: 'cb95b4e9125098b99a7df2fbda4554eda982918b',
    countlyServer: 'http://10.0.243.111:8080',
    apiUrl: 'http://dev.upms.startimestv.com'
  }
} else if (location.hostname.indexOf('test') >= 0) {
  env = {
    gaWapKey: 'UA-55969660-8',
    gaAndroidKey: 'UA-55969660-8',
    gaIosKey: 'UA-55969660-8',
    countlyAppKey: 'cb95b4e9125098b99a7df2fbda4554eda982918b',
    countlyServer: 'http://10.0.243.111:8080',
    apiUrl: 'http://qa.upms.startimestv.com'
  }
} else {
  env = {
    gaWapKey: 'UA-55969660-4',
    gaAndroidKey: 'UA-55969660-7',
    gaIosKey: 'UA-55969660-5',
    countlyAppKey: 'cd58cfb3e81658905d802cbe44b04683effbc7ed',
    countlyServer: 'https://event.startimestv.com',
    apiUrl: 'http://upms.startimestv.com'
  }
}

export default env
