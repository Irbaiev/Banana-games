// Wrapper.js с детальным логированием для отслеживания этапов загрузки игры
const LOG_PREFIX = '🎮 WRAPPER:';
const ERROR_PREFIX = '❌ WRAPPER ERROR:';
const SUCCESS_PREFIX = '✅ WRAPPER SUCCESS:';
const INFO_PREFIX = 'ℹ️ WRAPPER INFO:';

// Логирование ошибок
function logError(message, error = null) {
    console.error(`${ERROR_PREFIX} ${message}`);
    if (error) {
        console.error(`${ERROR_PREFIX} Details:`, error);
    }
}

// Логирование успеха
function logSuccess(message, data = null) {
    console.log(`${SUCCESS_PREFIX} ${message}`);
    if (data) {
        console.log(`${SUCCESS_PREFIX} Data:`, data);
    }
}

// Логирование информации (отключено для уменьшения засорения консоли)
function logInfo(message, data = null) {
    // console.log(`${INFO_PREFIX} ${message}`);
    // if (data) {
    //     console.log(`${INFO_PREFIX} Data:`, data);
    // }
}

// Логирование этапов загрузки (отключено для уменьшения засорения консоли)
function logGameLoadStage(stage, message, data = null) {
    // console.log(`${LOG_PREFIX} [STAGE ${stage}] ${message}`);
    // if (data) {
    //     console.log(`${LOG_PREFIX} [STAGE ${stage}] Data:`, data);
    // }
}

let currency;
let language;
let gameCode;
let channel;
let mode;
let homeUrl;
let platformConfig;
let gameParam = {};
let tokenUrl;
let launchUrl;
let apiUrl;
let iframeElement;
let balance;

function loadPlatformConfig() {
    logGameLoadStage(3, 'Starting to load platform configuration...');
    platformConfig = "./configuration/platformConfig.json";
    
    logInfo(`Loading config from: ${platformConfig}`);
    
    $.ajax({
        async: false,
        url: platformConfig,
        type: 'GET',
        success: function (res) {
            logGameLoadStage(3, 'Platform configuration loaded successfully');
            logInfo('Platform config data:', res);
            platformData = res;
            initiatePage();
        },
        error: function(xhr, status, error) {
            logError(`Failed to load platform config: ${status} - ${error}`);
            logError('XHR details:', xhr);
        }
    });
}

//disable zoom
document.addEventListener('gesturestart', function (event) {
    event.preventDefault();
}, false);

document.addEventListener('touchmove', function (event) {
    if (event.scale !== 1) { event.preventDefault(); }
}, false);

// initiate the wrapper
function initiatePage() {
    logGameLoadStage(3, 'Initiating page...');
    
    iframeElement = document.getElementById("iframe");
    if (!iframeElement) {
        logError('iframe element not found!');
        return;
    }
    
    logInfo('iframe element found:', iframeElement);
    
    gameParam = getUrlVars(window.location.href);
    logInfo('Game parameters from URL:', gameParam);
    
    language = gameParam.language || 'en';
    currency = gameParam.currency || 'EUR';
    gameCode = gameParam.gameCode;
    balance = gameParam.balance || 100000;
    gameFolderName = gameCode;
    isReal = false;
    mode = "DEMO";
    
    logInfo('Game settings:', {
        language: language,
        currency: currency,
        gameCode: gameCode,
        balance: balance,
        gameFolderName: gameFolderName,
        mode: mode
    });
    
    channel = detectmob();
    userAgent = window["platform"];
    window.setFullScreen = true;
    
    if (!platformData) {
        logError('Platform data not loaded!');
        return;
    }
    
    launchUrl = platformData.launchUrl;
    apiUrl = platformData.apiUrl;
    
    logInfo('Platform data:', {
        launchUrl: launchUrl,
        apiUrl: apiUrl
    });
    
    logGameLoadStage(4, 'Starting token request...');
    sendGetTokenRequest();
}

function sendGetTokenRequest() {
    logGameLoadStage(4, 'Preparing token request...');
    
    let requestData = {
        currency: currency,
        gameCode: gameCode,
        mode: mode,
        language: language,
        balance: balance
    };
    
    logInfo('Token request data:', requestData);
    logInfo('API URL:', apiUrl + "token");
    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        logInfo(`XHR state change: readyState=${xhr.readyState}, status=${xhr.status}`);
        
        if (xhr.readyState === 4) {
            logGameLoadStage(4, 'Token request completed');
            logInfo('Response status:', xhr.status);
            logInfo('Response text:', xhr.responseText);
            
            if (xhr.status === 200 && xhr.response && JSON.parse(xhr.response).url) {
                logSuccess('Token request successful!');
                
                let responseData = JSON.parse(xhr.response);
                logInfo('Token response data:', responseData);
                
                let gameMode = "2";
                let launchData = getUrlVars(responseData.url);
                logInfo('Launch data from URL:', launchData);
                
                // Строим путь к игре
                let gamePath = launchUrl + "games/" + gameFolderName + "/index.html?token=" + launchData["token"]+"&login=" + launchData["login"]
                +"&currency="+ currency +"&gameCode="+ gameCode +"&mode="+ gameMode +"&language="+ language;
                
                logGameLoadStage(5, 'Setting iframe source to game...');
                logInfo('Game path:', gamePath);
                
                iframeElement.src = gamePath;
                
                logSuccess('Game iframe source set successfully!');
                
            } else {
                logError('Token request failed!');
                logError('Status:', xhr.status);
                logError('Response:', xhr.responseText);
                showErrorMsg("Getting Error on game load. Please Reload the game.");
            }
        }
    };
    
    xhr.onerror = function() {
        logError('XHR error occurred');
    };
    
    xhr.ontimeout = function() {
        logError('XHR timeout occurred');
    };
    
    xhr.open("POST", apiUrl + "token", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.withCredentials = false;
    
    logGameLoadStage(4, 'Sending token request...');
    xhr.send(JSON.stringify(requestData));
}

function getUrlVars(url) {
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function detectmob() {
    if( navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
    ){
        return "mobile";
    }
    else {
        return "desktop";
    }
}

function showErrorMsg(message) {
    logError(`Showing error message: ${message}`);
    document.getElementById("msgPanelContent").innerHTML = message;
    document.getElementById("msgPanelBar").style.display = "block";
}

function msgPanelBtnClick() {
    logInfo('Error panel button clicked');
    document.getElementById("msgPanelBar").style.display = "none";
}

// Логирование инициализации
logGameLoadStage(1, 'Wrapper.js loaded and ready');
logInfo('Current URL:', window.location.href);
logInfo('Document ready state:', document.readyState);
