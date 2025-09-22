// Исправленная версия custom-data.js для оффлайн работы
// Убираем Adobe Alloy SDK и заменяем на mock функции

(function() {
    'use strict';
    
    console.log('🎮 Custom data script loaded (offline mode)');
    
    // Mock Adobe Alloy SDK
    if (typeof window.alloy === 'undefined') {
        window.alloy = {
            configure: function(config) {
                console.log('🎮 Mock Adobe Alloy configure called with:', config);
                return Promise.resolve();
            },
            sendEvent: function(event) {
                console.log('🎮 Mock Adobe Alloy sendEvent called with:', event);
                return Promise.resolve();
            },
            getIdentity: function() {
                console.log('🎮 Mock Adobe Alloy getIdentity called');
                return Promise.resolve({
                    identity: {
                        ECID: 'mock-ecid-12345'
                    }
                });
            }
        };
    }
    
    // Mock Adobe Experience Platform
    if (typeof window.adobeDataLayer === 'undefined') {
        window.adobeDataLayer = {
            push: function(data) {
                console.log('🎮 Mock Adobe Data Layer push:', data);
            },
            getState: function() {
                return {
                    pageInfo: {
                        pageName: 'Banana Bonanza Game',
                        pageURL: window.location.href
                    },
                    userInfo: {
                        isLoggedIn: true,
                        userID: 'mock-user-123'
                    }
                };
            }
        };
    }
    
    // Mock Adobe Analytics
    if (typeof window.s_gi === 'undefined') {
        window.s_gi = function() {
            return {
                t: function() {
                    console.log('🎮 Mock Adobe Analytics track called');
                },
                tl: function() {
                    console.log('🎮 Mock Adobe Analytics track link called');
                }
            };
        };
    }
    
    // Mock Adobe Target
    if (typeof window.adobe === 'undefined') {
        window.adobe = {
            target: {
                getOffer: function() {
                    console.log('🎮 Mock Adobe Target getOffer called');
                    return Promise.resolve({});
                },
                applyOffer: function() {
                    console.log('🎮 Mock Adobe Target applyOffer called');
                }
            }
        };
    }
    
    // Mock Adobe Audience Manager
    if (typeof window.demdex === 'undefined') {
        window.demdex = {
            call: function() {
                console.log('🎮 Mock Adobe Audience Manager called');
            }
        };
    }
    
    // Инициализация mock данных
    try {
        // Инициализируем mock Adobe Alloy с фиктивным datastreamId
        if (window.alloy && window.alloy.configure) {
            window.alloy.configure({
                datastreamId: 'mock-datastream-id-12345',
                edgeDomain: 'mock-edge-domain.com',
                orgId: 'mock-org-id@AdobeOrg'
            }).then(() => {
                console.log('🎮 Mock Adobe Alloy initialized successfully');
            }).catch((error) => {
                console.log('🎮 Mock Adobe Alloy initialization error (ignored):', error);
            });
        }
        
        // Инициализируем mock Adobe Data Layer
        if (window.adobeDataLayer) {
            window.adobeDataLayer.push({
                event: 'page-view',
                pageInfo: {
                    pageName: 'Banana Bonanza Game',
                    pageURL: window.location.href
                }
            });
        }
        
        console.log('🎮 All mock Adobe services initialized successfully');
        
    } catch (error) {
        console.log('🎮 Error initializing mock Adobe services (ignored):', error);
    }
    
    // Экспортируем mock функции для использования в других скриптах
    window.mockAdobeServices = {
        alloy: window.alloy,
        adobeDataLayer: window.adobeDataLayer,
        analytics: window.s_gi,
        target: window.adobe?.target,
        audienceManager: window.demdex
    };
    
})();




