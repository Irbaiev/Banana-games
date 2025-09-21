// Детальный логгер для отслеживания этапов загрузки игры
const LOG_PREFIX = '🎮 GAME LOADER:';
const ERROR_PREFIX = '❌ ERROR:';
const SUCCESS_PREFIX = '✅ SUCCESS:';
const INFO_PREFIX = 'ℹ️ INFO:';

// Расширенный набор mock данных
const MOCK_DATA = {
    // Основные API
    '/api/token': {
        url: 'https://staging.playzia.com/games/playzia-bananabonanza/index.html?token=offline_mock_token_12345&login=offline_user&currency=EUR&gameCode=playzia-bananabonanza&mode=2&language=en',
        token: 'offline_mock_token_12345',
        login: 'offline_user',
        balance: 1000000.0,
        currency: 'EUR',
        status: 'success'
    },
    '/token': {
        url: 'https://staging.playzia.com/games/playzia-bananabonanza/index.html?token=offline_mock_token_12345&login=offline_user&currency=EUR&gameCode=playzia-bananabonanza&mode=2&language=en',
        token: 'offline_mock_token_12345',
        login: 'offline_user',
        balance: 1000000.0,
        currency: 'EUR',
        status: 'success'
    },
    '/api/game/balance': {
        balance: 1000000.0,
        currency: 'EUR'
    },
    '/api/game/spin': {
        result: 'win',
        multiplier: 2.5,
        win: 2.5,
        balance: 1000000.0
    },
    '/api/game/enter': {
        status: 'success',
        balance: 1000000.0
    },
    '/api/game/cashout': {
        status: 'success',
        amount: 2.5,
        balance: 1000000.0
    },
    
    // Frontend Service
    '/frontendService/gameVoteData': {
        gameId: 25721,
        likeCount: 999,
        superLikeCount: 99,
        dislikeCount: 0
    },
    '/frontendService/vote/game': {
        status: 'success',
        message: 'Vote recorded'
    },
    
    // WebSocket mock
    'websocket_blocked': {
        error: 'WebSocket disabled in offline mode',
        status: 'offline'
    },
    
    // Playzia API
    '/gs2.playzia.com/token': {
        url: 'https://staging.playzia.com/games/playzia-bananabonanza/index.html?token=offline_mock_token_12345&login=offline_user&currency=EUR&gameCode=playzia-bananabonanza&mode=2&language=en',
        token: 'offline_mock_token_12345',
        login: 'offline_user',
        status: 'success'
    },
    '/gs2.playzia.com/api/token': {
        url: 'https://staging.playzia.com/games/playzia-bananabonanza/index.html?token=offline_mock_token_12345&login=offline_user&currency=EUR&gameCode=playzia-bananabonanza&mode=2&language=en',
        token: 'offline_mock_token_12345',
        login: 'offline_user',
        status: 'success'
    },
    '/gs2.playzia.com/api/game/balance': {
        balance: 1000000.0,
        currency: 'EUR'
    },
    '/gs2.playzia.com/api/game/spin': {
        result: 'win',
        multiplier: 2.5,
        win: 2.5,
        balance: 1000000.0
    },
    
    // Staging API
    '/staging.playzia.com/api/token': {
        token: 'staging_offline_mock_token_67890',
        status: 'success'
    },
    '/staging.playzia.com/api/game/balance': {
        balance: 1000000.0,
        currency: 'EUR'
    },
    
    // Игровые API запросы
    '/staging.playzia.com/games/playzia-bananabonanza/offline_user': {
        tokenData: {
            operatorId: "internal_testoperator",
            playerId: "offline_user_12345",
            gameId: "playzia-bananabonanza",
            mode: "DEMO",
            currency: "EUR",
            language: "EN",
            currencyMultiplier: 1
        },
        balance: {
            totalBalance: 10000000,
            mode: "DEMO",
            currency: "EUR",
            balances: [{
                amount: 10000000,
                currency: "EUR",
                type: "demo"
            }]
        },
        backendUrl: "https://api.playzia.staging.hizi-service.com/gameapi/bananabonanza/interface",
        refreshUrl: "https://api.playzia.staging.hizi-service.com/gameapi/v2/reconnect?token=offline_mock_token_12345",
        logoutUrl: "https://api.playzia.staging.hizi-service.com/gameapi/v2/disconnect?token=offline_mock_token_12345",
        webSocketUrl: null,
        token: "offline_mock_token_12345",
        gameSettings: {
            autoplayEnabled: true,
            autoplayLossLimitRequired: false,
            displayCoins: true,
            displayJackpotOdds: false,
            displayRTP: false,
            displayXRTP: false,
            forceOrientation: 0,
            gambleEnabled: true,
            historyURL: "",
            homeURL: "",
            loadMsg: "",
            maxExposure: 250000000,
            multipleInstancesAllowed: false,
            rcDisplayWinLoss: false,
            rcEnabled: false,
            stopEnabled: true,
            topupURL: "",
            turboEnabled: true,
            homeEnabled: true,
            dynamicMinSpinTime: false,
            redirectTarget: "top",
            packageBuyEnabled: true,
            operatorHandlesErrors: false,
            displayClock: true,
            isSocial: false,
            partialCollectEnabled: true,
            hideCompanyLogo: false,
            abbreviateAmounts: true,
            showExactRTP: false,
            forceDefaultStake: false,
            disableFullScreenMobile: false,
            displayPaytableOnEnterGame: false
        },
        operatorProtocol: 1
    },
    
    // Дополнительные API запросы
    '/api/game/leave': {
        status: 'success',
        message: 'Game session ended',
        timestamp: Date.now()
    },
    '/api/game/history': {
        history: [
            {
                id: 'game_1',
                timestamp: Date.now() - 60000,
                bet: 1.0,
                win: 2.5,
                result: 'win'
            },
            {
                id: 'game_2',
                timestamp: Date.now() - 120000,
                bet: 1.0,
                win: 0,
                result: 'lose'
            },
            {
                id: 'game_3',
                timestamp: Date.now() - 180000,
                bet: 2.0,
                win: 10.0,
                result: 'big_win'
            }
        ],
        status: 'success',
        timestamp: Date.now()
    },
    '/api/game/settings': {
        settings: {
            soundEnabled: true,
            musicEnabled: true,
            autoplayEnabled: true,
            turboMode: false,
            language: 'en',
            currency: 'EUR'
        },
        status: 'success',
        timestamp: Date.now()
    },
    '/api/game/statistics': {
        statistics: {
            totalSpins: 150,
            totalWins: 45,
            totalLosses: 105,
            winRate: 30.0,
            averageWin: 25.5,
            biggestWin: 500.0,
            totalWagered: 1500.0,
            totalWon: 1125.0
        },
        status: 'success',
        timestamp: Date.now()
    },
    
    // Playzia API v2 дополнительные эндпоинты
    '/api.playzia.staging.hizi-service.com/gameapi/v2/connect': {
        status: 'connected',
        sessionId: 'offline_session_12345',
        token: 'offline_mock_token_12345',
        serverUrl: 'wss://ws.playzia.staging.hizi-service.com/connect',
        timestamp: Date.now()
    },
    '/api.playzia.staging.hizi-service.com/gameapi/bananabonanza/interface': {
        gameData: {
            gameId: 'playzia-bananabonanza',
            version: '1.0.0',
            features: ['autoplay', 'turbo', 'gamble'],
            betLevels: [0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0, 50.0, 100.0],
            maxBet: 100.0,
            minBet: 0.1
        },
        playerData: {
            balance: 1000000.0,
            currency: 'EUR',
            sessionId: 'offline_session_12345'
        },
        status: 'success',
        timestamp: Date.now()
    }
};

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

// Логирование информации
function logInfo(message, data = null) {
    console.log(`${INFO_PREFIX} ${message}`);
    if (data) {
        console.log(`${INFO_PREFIX} Data:`, data);
    }
}

// Логирование этапов загрузки
function logGameLoadStage(stage, message, data = null) {
    console.log(`${LOG_PREFIX} [STAGE ${stage}] ${message}`);
    if (data) {
        console.log(`${LOG_PREFIX} [STAGE ${stage}] Data:`, data);
    }
}

// Обработка API запросов
async function handleApiRequest(request, startTime) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    logGameLoadStage(4, `API Request: ${request.method} ${url.href}`);
    
    // Ищем mock данные
    let mockData = null;
    let foundKey = null;
    
    for (const [key, value] of Object.entries(MOCK_DATA)) {
        if (path.includes(key) || url.href.includes(key) || url.pathname.includes(key)) {
            // Mock data found
            mockData = value;
            foundKey = key;
            break;
        }
    }
    
    // Дополнительная проверка для игровых запросов
    if (!mockData && url.hostname.includes('staging.playzia.com')) {
        if (url.pathname.includes('offline_user')) {
            // Using offline_user mock data
            mockData = MOCK_DATA['/staging.playzia.com/games/playzia-bananabonanza/offline_user'];
            foundKey = '/staging.playzia.com/games/playzia-bananabonanza/offline_user';
        }
    }
    
    // Проверка для Playzia API v2
    if (!mockData && url.hostname.includes('api.playzia.staging.hizi-service.com')) {
        if (url.pathname.includes('/gameapi/v2/connect')) {
            mockData = MOCK_DATA['/api.playzia.staging.hizi-service.com/gameapi/v2/connect'];
            foundKey = '/api.playzia.staging.hizi-service.com/gameapi/v2/connect';
        } else if (url.pathname.includes('/gameapi/bananabonanza/interface')) {
            mockData = MOCK_DATA['/api.playzia.staging.hizi-service.com/gameapi/bananabonanza/interface'];
            foundKey = '/api.playzia.staging.hizi-service.com/gameapi/bananabonanza/interface';
        }
    }
    
    // Проверка на WebSocket запросы
    if (!mockData && (url.protocol === 'wss:' || url.protocol === 'ws:')) {
        logGameLoadStage(4, `WebSocket connection attempt blocked: ${url.href}`);
        mockData = { error: 'WebSocket disabled in offline mode' };
        foundKey = 'websocket_blocked';
    }
    
    if (mockData) {
        logGameLoadStage(4, `Returning mock data for: ${foundKey}`);
        
        const response = new Response(JSON.stringify(mockData), {
            status: 200,
            statusText: 'OK',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        });
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        // API Response successful
        
        return response;
    } else {
        logError(`No mock data found for: ${path}`);
        logError(`Available keys:`, Object.keys(MOCK_DATA));
        
        const response = new Response(JSON.stringify({
            error: 'No mock data available',
            path: path,
            availableKeys: Object.keys(MOCK_DATA)
        }), {
            status: 404,
            statusText: 'Not Found',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        logError(`API Response: ${request.method} ${url.href} - 404 (${duration}ms)`);
        
        return response;
    }
}

    // Обработка внешних ресурсов
    async function handleExternalResourceRequest(url) {
        logInfo(`Handling external resource: ${url.href}`);
        
        // Обработка everestjs.net
        if (url.hostname === 'www.everestjs.net') {
            logInfo(`Mocking everestjs.net request: ${url.href}`);
            return new Response('// Mock everestjs.net response', {
                status: 200,
                headers: { 'Content-Type': 'application/javascript' }
            });
        }
        
        // Обработка data.casino.guru
        if (url.hostname === 'data.casino.guru') {
            const localPath = `/data.casino.guru${url.pathname}`;
            logInfo(`Redirecting data.casino.guru to local: ${url.href} -> ${localPath}`);
            return fetch(localPath);
        }
        
        // Обработка fonts.gstatic.com
        if (url.hostname === 'fonts.gstatic.com') {
            const localPath = `/fonts.gstatic.com${url.pathname}`;
            logInfo(`Redirecting fonts.gstatic.com to local: ${url.href} -> ${localPath}`);
            return fetch(localPath);
        }
        
        // Обработка maxcdn.bootstrapcdn.com
        if (url.hostname === 'maxcdn.bootstrapcdn.com') {
            const localPath = `/maxcdn.bootstrapcdn.com${url.pathname}`;
            logInfo(`Redirecting maxcdn.bootstrapcdn.com to local: ${url.href} -> ${localPath}`);
            return fetch(localPath);
        }
        
        // Обработка static.casino.guru
        if (url.hostname === 'static.casino.guru') {
            const localPath = `/static.casino.guru${url.pathname}`;
            logInfo(`Redirecting static.casino.guru to local: ${url.href} -> ${localPath}`);
            return fetch(localPath);
        }
        
        // Обработка других внешних ресурсов
        const localPath = `${url.pathname}`;
        logInfo(`Redirecting to local: ${url.href} -> ${localPath}`);
        
        return fetch(localPath);
    }

// Основной обработчик fetch
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    const startTime = Date.now();
    
    // Игнорируем запросы к самому Service Worker
    if (url.pathname === '/sw.js' || url.pathname === '/casino_guru_complete/sw.js') {
        return;
    }
    
    // Логируем только важные запросы
    if (url.pathname.includes('/assets/') || url.pathname.includes('.webp') || url.pathname.includes('.json') || url.pathname.includes('.atlas') || url.pathname.includes('/api/') || url.pathname.includes('/frontendService/') || url.pathname.includes('/token') || url.pathname.includes('/offline_user')) {
        logInfo(`Intercepting: ${event.request.method} ${event.request.url}`);
    }
    
    // Специальное логирование для frontendService
    if (url.pathname.includes('/frontendService/')) {
        logGameLoadStage(2, `FrontendService request detected: ${url.pathname}`);
    }
    
    // Перехватываем WebSocket запросы
    if (url.protocol === 'wss:' || url.protocol === 'ws:') {
        logGameLoadStage(4, `WebSocket connection attempt: ${url.href}`);
        // Перенаправляем WebSocket запросы на наш WebSocket сервер
        const wsUrl = url.href.replace('ws://localhost:5000/', 'ws://localhost:5001/');
        logGameLoadStage(4, `Redirecting WebSocket to: ${wsUrl}`);
        event.respondWith(new Response('WebSocket redirected to offline server', { 
            status: 200,
            headers: { 
                'Content-Type': 'text/plain',
                'X-WebSocket-URL': wsUrl
            }
        }));
        return;
    }
    
    // Исправляем пути статических файлов
    if (url.pathname.includes('/casino.guru/static.casino.guru/')) {
        const correctedPath = url.pathname.replace('/casino.guru/static.casino.guru/', '/static.casino.guru/');
        logGameLoadStage(6, `Correcting static file path: ${url.pathname} -> ${correctedPath}`);
        const correctedUrl = new URL(correctedPath, url.origin);
        event.respondWith(fetch(correctedUrl));
        return;
    }
    
    // Перехватываем API запросы
    if (url.pathname.includes('/api/') || 
        url.pathname.includes('/frontendService/') ||
        url.pathname.includes('/token') ||
        url.pathname.includes('/offline_user') ||
        url.pathname.includes('/gameapi/') ||
        url.pathname.includes('/connect') ||
        url.pathname.includes('/reconnect') ||
        url.pathname.includes('/disconnect') ||
        url.hostname.includes('playzia.com') || 
        url.hostname.includes('gs2.playzia.com') ||
        url.hostname.includes('staging.playzia.com') ||
        url.hostname.includes('api.playzia.com') ||
        url.hostname.includes('hizi-service.com') ||
        (url.hostname === 'gs2.playzia.com' && url.pathname === '/token')) {
        
        logGameLoadStage(4, `Intercepting API request: ${url.pathname} (hostname: ${url.hostname})`);
        event.respondWith(handleApiRequest(event.request, startTime));
        return;
    }
    
    // Игнорируем запросы от Chrome расширений
    if (url.hostname.includes('chrome-extension')) {
        logInfo(`Ignoring Chrome extension request: ${url.href}`);
        return;
    }
    
    // Блокируем внешние запросы (но не локальные и не нужные для игры)
    if (url.hostname !== 'localhost' && 
        url.hostname !== '127.0.0.1' && 
        !url.hostname.includes('casino_guru_complete') &&
        url.hostname !== 'gs2.playzia.com') {
        
        // Разрешаем определенные внешние домены
        if (url.hostname === 'fonts.gstatic.com' ||
            url.hostname === 'maxcdn.bootstrapcdn.com' ||
            url.hostname === 'data.casino.guru' ||
            url.hostname === 'static.casino.guru' ||
            url.hostname === 'www.everestjs.net') {
            
            logInfo(`Redirecting external request to local: ${url.href} -> ${url.pathname}`);
            event.respondWith(handleExternalResourceRequest(url));
            return;
        }
        
        logError(`Blocking external request: ${url.href}`);
        event.respondWith(new Response('Blocked by offline mode', { status: 403 }));
        return;
    }
    
        // Специальное логирование для игровых ассетов
        if (url.pathname.includes('/assets/') || url.pathname.includes('.webp') || url.pathname.includes('.json') || url.pathname.includes('.atlas')) {
            logGameLoadStage(6, `Loading game asset: ${url.pathname}`);
        }
        
        // Обрабатываем локальные запросы (без лишних логов)
        const endTime = Date.now();
        const duration = endTime - startTime;
});

// Глобальные переменные для диагностики
let debugInfo = {
    requests: [],
    errors: [],
    assets: [],
    apiCalls: [],
    startTime: Date.now()
};

// Функции для диагностики
function addDebugRequest(url, status, type) {
    debugInfo.requests.push({
        url: url,
        status: status,
        type: type,
        timestamp: Date.now() - debugInfo.startTime
    });
}

function addDebugError(error, context) {
    debugInfo.errors.push({
        error: error,
        context: context,
        timestamp: Date.now() - debugInfo.startTime
    });
}

function addDebugAsset(asset) {
    debugInfo.assets.push({
        asset: asset,
        timestamp: Date.now() - debugInfo.startTime
    });
}

function addDebugApiCall(api, data) {
    debugInfo.apiCalls.push({
        api: api,
        data: data,
        timestamp: Date.now() - debugInfo.startTime
    });
}

// Регистрация Service Worker
self.addEventListener('install', event => {
    logGameLoadStage(1, 'Service Worker installing...');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    logGameLoadStage(1, 'Service Worker activated and ready to intercept requests');
    event.waitUntil(self.clients.claim());
});

logGameLoadStage(1, 'Service Worker loaded and ready to intercept requests');
