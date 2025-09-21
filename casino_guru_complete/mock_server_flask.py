#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Мок сервер на Flask для оффлайн игры Banana Bonanza
"""

from flask import Flask, jsonify, request, send_from_directory, send_file
from flask_cors import CORS
import os
import time
import random
import json
from pathlib import Path
import threading
import socket
import asyncio
import websockets

app = Flask(__name__)
CORS(app)  # Включаем CORS для всех запросов

# Глобальные переменные для состояния игры
game_state = {
    'balance': 1000000.0,
    'currency': 'EUR',
    'session_id': 'offline_session_12345',
    'token': 'offline_mock_token_12345',
    'game_history': [],
    'statistics': {
        'total_spins': 0,
        'total_wins': 0,
        'total_losses': 0,
        'biggest_win': 0.0,
        'total_wagered': 0.0,
        'total_won': 0.0
    }
}

def generate_game_result():
    """Генерирует результат игрового спина"""
    # 70% шанс выигрыша, 30% проигрыша
    is_win = random.random() < 0.7
    
    if is_win:
        # Случайный множитель от 1.0 до 50.0
        multiplier = round(random.uniform(1.0, 50.0), 2)
        win_amount = round(multiplier * 1.0, 2)  # Ставка 1.0
        
        # Обновляем статистику
        game_state['statistics']['total_wins'] += 1
        game_state['statistics']['biggest_win'] = max(game_state['statistics']['biggest_win'], win_amount)
        game_state['statistics']['total_won'] += win_amount
        
        result_type = 'big_win' if multiplier > 10 else 'win'
    else:
        multiplier = 0.0
        win_amount = 0.0
        result_type = 'lose'
        game_state['statistics']['total_losses'] += 1
    
    # Обновляем общую статистику
    game_state['statistics']['total_spins'] += 1
    game_state['statistics']['total_wagered'] += 1.0  # Ставка 1.0
    
    # Добавляем в историю
    game_result = {
        'id': f'game_{len(game_state["game_history"]) + 1}',
        'timestamp': int(time.time()),
        'bet': 1.0,
        'win': win_amount,
        'multiplier': multiplier,
        'result': result_type
    }
    game_state['game_history'].insert(0, game_result)  # Добавляем в начало
    
    # Ограничиваем историю 50 записями
    if len(game_state['game_history']) > 50:
        game_state['game_history'] = game_state['game_history'][:50]
    
    return game_result

# ==================== ОСНОВНЫЕ API ЭНДПОИНТЫ ====================

@app.route('/api/token', methods=['GET', 'POST'])
def api_token():
    """Получение токена аутентификации"""
    return jsonify({
        'url': 'https://staging.playzia.com/games/playzia-bananabonanza/index.html?token=offline_mock_token_12345&login=offline_user&currency=EUR&gameCode=playzia-bananabonanza&mode=2&language=en',
        'token': game_state['token'],
        'login': 'offline_user',
        'balance': game_state['balance'],
        'currency': game_state['currency'],
        'status': 'success',
        'timestamp': int(time.time())
    })

@app.route('/token', methods=['GET', 'POST'])
def token():
    """Альтернативный эндпоинт для токена"""
    return api_token()

@app.route('/api/game/balance', methods=['GET'])
def game_balance():
    """Получение баланса игрока"""
    return jsonify({
        'balance': game_state['balance'],
        'currency': game_state['currency'],
        'status': 'success',
        'timestamp': int(time.time())
    })

@app.route('/api/game/spin', methods=['POST'])
def game_spin():
    """Выполнение игрового спина"""
    game_result = generate_game_result()
    
    return jsonify({
        'result': game_result['result'],
        'multiplier': game_result['multiplier'],
        'win': game_result['win'],
        'balance': game_state['balance'],
        'status': 'success',
        'timestamp': game_result['timestamp']
    })

@app.route('/api/game/enter', methods=['POST'])
def game_enter():
    """Вход в игру"""
    return jsonify({
        'status': 'success',
        'balance': game_state['balance'],
        'gameId': 'playzia-bananabonanza',
        'sessionId': game_state['session_id'],
        'timestamp': int(time.time())
    })

@app.route('/api/game/cashout', methods=['POST'])
def game_cashout():
    """Вывод средств"""
    cashout_amount = round(random.uniform(10, 500), 2)
    
    return jsonify({
        'status': 'success',
        'amount': cashout_amount,
        'balance': game_state['balance'],
        'timestamp': int(time.time())
    })

@app.route('/api/game/leave', methods=['POST'])
def game_leave():
    """Выход из игры"""
    return jsonify({
        'status': 'success',
        'message': 'Game session ended',
        'timestamp': int(time.time())
    })

@app.route('/api/game/history', methods=['GET'])
def game_history():
    """История игр"""
    return jsonify({
        'history': game_state['game_history'],
        'status': 'success',
        'timestamp': int(time.time())
    })

@app.route('/api/game/settings', methods=['GET', 'POST'])
def game_settings():
    """Настройки игры"""
    if request.method == 'POST':
        # Обновляем настройки из запроса
        new_settings = request.get_json() or {}
        # Здесь можно добавить логику сохранения настроек
        return jsonify({
            'status': 'success',
            'message': 'Settings updated',
            'timestamp': int(time.time())
        })
    
    return jsonify({
        'settings': {
            'soundEnabled': True,
            'musicEnabled': True,
            'autoplayEnabled': True,
            'turboMode': False,
            'language': 'en',
            'currency': 'EUR'
        },
        'status': 'success',
        'timestamp': int(time.time())
    })

@app.route('/api/game/statistics', methods=['GET'])
def game_statistics():
    """Статистика игрока"""
    stats = game_state['statistics'].copy()
    if stats['total_spins'] > 0:
        stats['win_rate'] = round((stats['total_wins'] / stats['total_spins']) * 100, 2)
        stats['average_win'] = round(stats['total_won'] / max(stats['total_wins'], 1), 2)
    else:
        stats['win_rate'] = 0.0
        stats['average_win'] = 0.0
    
    return jsonify({
        'statistics': stats,
        'status': 'success',
        'timestamp': int(time.time())
    })

# ==================== FRONTEND SERVICE API ====================

@app.route('/frontendService/gameVoteData', methods=['GET'])
def frontend_service_game_vote_data():
    """Данные голосования за игру"""
    return jsonify({
        'gameId': 25721,
        'likeCount': 999,
        'superLikeCount': 99,
        'dislikeCount': 0,
        'status': 'success',
        'timestamp': int(time.time())
    })

@app.route('/frontendService/vote/game', methods=['POST'])
def frontend_service_vote_game():
    """Голосование за игру"""
    return jsonify({
        'status': 'success',
        'message': 'Vote recorded successfully',
        'timestamp': int(time.time())
    })

# ==================== PLAYZIA API V2 ====================

@app.route('/api.playzia.staging.hizi-service.com/gameapi/v2/connect', methods=['GET', 'POST'])
def playzia_api_v2_connect():
    """Подключение к игровому серверу"""
    return jsonify({
        'status': 'connected',
        'sessionId': game_state['session_id'],
        'token': game_state['token'],
        'serverUrl': 'wss://ws.playzia.staging.hizi-service.com/connect',
        'timestamp': int(time.time())
    })

@app.route('/api.playzia.staging.hizi-service.com/gameapi/v2/reconnect', methods=['GET', 'POST'])
def playzia_api_v2_reconnect():
    """Переподключение к серверу"""
    return jsonify({
        'status': 'reconnected',
        'sessionId': game_state['session_id'],
        'token': game_state['token'],
        'timestamp': int(time.time())
    })

@app.route('/api.playzia.staging.hizi-service.com/gameapi/v2/disconnect', methods=['GET', 'POST'])
def playzia_api_v2_disconnect():
    """Отключение от сервера"""
    return jsonify({
        'status': 'disconnected',
        'message': 'Session ended',
        'timestamp': int(time.time())
    })

@app.route('/api.playzia.staging.hizi-service.com/gameapi/bananabonanza/interface', methods=['GET', 'POST'])
def playzia_api_bananabonanza_interface():
    """Игровой интерфейс API"""
    return jsonify({
        'gameData': {
            'gameId': 'playzia-bananabonanza',
            'version': '1.0.0',
            'features': ['autoplay', 'turbo', 'gamble'],
            'betLevels': [0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0, 50.0, 100.0],
            'maxBet': 100.0,
            'minBet': 0.1
        },
        'playerData': {
            'balance': game_state['balance'],
            'currency': game_state['currency'],
            'sessionId': game_state['session_id']
        },
        'status': 'success',
        'timestamp': int(time.time())
    })

# ==================== STAGING API ====================

@app.route('/staging.playzia.com/api/token', methods=['GET', 'POST'])
def staging_api_token():
    """Staging API токен"""
    return jsonify({
        'token': 'staging_offline_mock_token_67890',
        'status': 'success',
        'timestamp': int(time.time())
    })

@app.route('/staging.playzia.com/api/game/balance', methods=['GET'])
def staging_api_game_balance():
    """Staging API баланс"""
    return jsonify({
        'balance': game_state['balance'],
        'currency': game_state['currency'],
        'status': 'success',
        'timestamp': int(time.time())
    })

# ==================== GS2 PLAYZIA API ====================

@app.route('/gs2.playzia.com/token', methods=['GET', 'POST'])
def gs2_playzia_token():
    """GS2 Playzia токен"""
    return jsonify({
        'url': 'https://staging.playzia.com/games/playzia-bananabonanza/index.html?token=offline_mock_token_12345&login=offline_user&currency=EUR&gameCode=playzia-bananabonanza&mode=2&language=en',
        'token': game_state['token'],
        'login': 'offline_user',
        'status': 'success',
        'timestamp': int(time.time())
    })

@app.route('/gs2.playzia.com/api/token', methods=['GET', 'POST'])
def gs2_playzia_api_token():
    """GS2 Playzia API токен"""
    return gs2_playzia_token()

@app.route('/gs2.playzia.com/api/game/balance', methods=['GET'])
def gs2_playzia_api_game_balance():
    """GS2 Playzia API баланс"""
    return jsonify({
        'balance': game_state['balance'],
        'currency': game_state['currency'],
        'status': 'success',
        'timestamp': int(time.time())
    })

@app.route('/gs2.playzia.com/api/game/spin', methods=['POST'])
def gs2_playzia_api_game_spin():
    """GS2 Playzia API спин"""
    game_result = generate_game_result()
    
    return jsonify({
        'result': game_result['result'],
        'multiplier': game_result['multiplier'],
        'win': game_result['win'],
        'balance': game_state['balance'],
        'status': 'success',
        'timestamp': game_result['timestamp']
    })

# ==================== ОСНОВНЫЕ ИГРОВЫЕ ДАННЫЕ ====================

@app.route('/staging.playzia.com/games/playzia-bananabonanza/offline_user', methods=['GET'])
def staging_playzia_games_offline_user():
    """Основные игровые данные для offline_user"""
    return jsonify({
        'tokenData': {
            'operatorId': "internal_testoperator",
            'playerId': "offline_user_12345",
            'gameId': "playzia-bananabonanza",
            'mode': "DEMO",
            'currency': "EUR",
            'language': "EN",
            'currencyMultiplier': 1
        },
        'balance': {
            'totalBalance': 10000000,
            'mode': "DEMO",
            'currency': "EUR",
            'balances': [{
                'amount': 10000000,
                'currency': "EUR",
                'type': "demo"
            }]
        },
        'backendUrl': "https://api.playzia.staging.hizi-service.com/gameapi/bananabonanza/interface",
        'refreshUrl': "https://api.playzia.staging.hizi-service.com/gameapi/v2/reconnect?token=offline_mock_token_12345",
        'logoutUrl': "https://api.playzia.staging.hizi-service.com/gameapi/v2/disconnect?token=offline_mock_token_12345",
        'webSocketUrl': None,
        'token': game_state['token'],
        'gameSettings': {
            'autoplayEnabled': True,
            'autoplayLossLimitRequired': False,
            'displayCoins': True,
            'displayJackpotOdds': False,
            'displayRTP': False,
            'displayXRTP': False,
            'forceOrientation': 0,
            'gambleEnabled': True,
            'historyURL': "",
            'homeURL': "",
            'loadMsg': "",
            'maxExposure': 250000000,
            'multipleInstancesAllowed': False,
            'rcDisplayWinLoss': False,
            'rcEnabled': False,
            'stopEnabled': True,
            'topupURL': "",
            'turboEnabled': True,
            'homeEnabled': True,
            'dynamicMinSpinTime': False,
            'redirectTarget': "top",
            'packageBuyEnabled': True,
            'operatorHandlesErrors': False,
            'displayClock': True,
            'isSocial': False,
            'partialCollectEnabled': True,
            'hideCompanyLogo': False,
            'abbreviateAmounts': True,
            'showExactRTP': False,
            'forceDefaultStake': False,
            'disableFullScreenMobile': False,
            'displayPaytableOnEnterGame': False
        },
        'operatorProtocol': 1,
        'status': 'success',
        'timestamp': int(time.time())
    })

# ==================== WEBSOCKET ОБРАБОТКА ====================

async def websocket_handler(websocket, path):
    """Обработчик WebSocket соединений"""
    print(f"🔌 WebSocket подключение: {path}")
    
    try:
        # Отправляем приветственное сообщение
        welcome_msg = {
            'type': 'connection',
            'status': 'connected',
            'message': 'WebSocket connected in offline mode',
            'timestamp': int(time.time())
        }
        await websocket.send(json.dumps(welcome_msg))
        print(f"✅ Отправлено приветственное сообщение")
        
        # Обрабатываем входящие сообщения
        async for message in websocket:
            try:
                print(f"📨 Получено сообщение: {message}")
                
                # Пытаемся распарсить JSON
                try:
                    data = json.loads(message)
                    print(f"📨 WebSocket JSON сообщение: {data}")
                except json.JSONDecodeError:
                    # Если не JSON, обрабатываем как текстовое сообщение
                    data = {'type': 'text', 'message': message}
                    print(f"📨 WebSocket текстовое сообщение: {message}")
                
                # Обрабатываем разные типы сообщений
                if data.get('type') == 'ping':
                    response = {
                        'type': 'pong',
                        'status': 'success',
                        'timestamp': int(time.time())
                    }
                elif data.get('type') == 'test':
                    response = {
                        'type': 'test_response',
                        'status': 'success',
                        'message': 'Test message received successfully',
                        'original_message': data.get('message', ''),
                        'timestamp': int(time.time())
                    }
                elif data.get('type') == 'game_action':
                    response = {
                        'type': 'game_response',
                        'status': 'success',
                        'data': 'Game action processed in offline mode',
                        'timestamp': int(time.time())
                    }
                else:
                    response = {
                        'type': 'response',
                        'status': 'success',
                        'data': 'WebSocket работает в оффлайн режиме',
                        'received_type': data.get('type', 'unknown'),
                        'timestamp': int(time.time())
                    }
                
                print(f"📤 Отправляем ответ")
                await websocket.send(json.dumps(response))
                
            except Exception as msg_error:
                print(f"❌ Ошибка обработки сообщения: {msg_error}")
                error_response = {
                    'type': 'error',
                    'message': f'Error processing message: {str(msg_error)}',
                    'timestamp': int(time.time())
                }
                try:
                    await websocket.send(json.dumps(error_response))
                except:
                    pass
                
    except websockets.exceptions.ConnectionClosed:
        print("🔌 WebSocket соединение закрыто")
    except Exception as e:
        print(f"❌ Ошибка в WebSocket обработчике: {e}")
        import traceback
        traceback.print_exc()

def start_websocket_server():
    """Запуск WebSocket сервера в отдельном потоке"""
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        async def run_server():
            # Пробуем разные порты
            for port in [5001, 5002, 5003, 5004, 5005]:
                try:
                    server = await websockets.serve(websocket_handler, "localhost", port)
                    print(f"🔌 WebSocket сервер запущен на ws://localhost:{port}")
                    await server.wait_closed()
                    break
                except OSError as e:
                    if "Address already in use" in str(e) or "10048" in str(e):
                        print(f"⚠️ Порт {port} занят, пробуем следующий...")
                        continue
                    else:
                        raise e
        
        loop.run_until_complete(run_server())
    except Exception as e:
        print(f"❌ Ошибка WebSocket сервера: {e}")
        print("ℹ️ WebSocket сервер отключен, игра будет работать без него")

@app.route('/staging.playzia.com/games/playzia-bananabonanza/index.html', methods=['GET'])
def websocket_redirect():
    """Обработка WebSocket запросов - перенаправляем на обычную игру"""
    # Обычный запрос к игре
    game_path = Path('staging.playzia.com/games/playzia-bananabonanza/index.html')
    if game_path.exists():
        return send_file(str(game_path))
    
    return jsonify({
        'error': 'Game file not found',
        'status': 404
    }), 404

# ==================== СТАТИЧЕСКИЕ ФАЙЛЫ ====================

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_static_files(path):
    """Обслуживание статических файлов"""
    if not path:
        path = 'casino.guru/gameDetailIos.html'
    
    # НЕ убираем префиксы доменов! Файлы хранятся с полными путями
    # Проверяем существование файла с оригинальным путем
    file_path = Path(path)
    if file_path.exists() and file_path.is_file():
        return send_file(str(file_path))
    
    # Если файл не найден, попробуем найти в разных местах
    possible_paths = [
        path,
        f'./{path}',
        f'../{path}',
        f'casino_guru_complete/{path}'
    ]
    
    for possible_path in possible_paths:
        test_path = Path(possible_path)
        if test_path.exists() and test_path.is_file():
            return send_file(str(test_path))
    
    # Если файл не найден, возвращаем 404
    return jsonify({
        'error': 'File not found',
        'path': path,
        'status': 404
    }), 404

# ==================== ОБРАБОТКА ОШИБОК ====================

@app.errorhandler(404)
def not_found(error):
    """Обработка 404 ошибок"""
    return jsonify({
        'error': 'Endpoint not found',
        'status': 404,
        'timestamp': int(time.time())
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Обработка 500 ошибок"""
    return jsonify({
        'error': 'Internal server error',
        'status': 500,
        'timestamp': int(time.time())
    }), 500

# ==================== ЗАПУСК СЕРВЕРА ====================

if __name__ == '__main__':
    print("🎮 Запуск Flask мок сервера для Banana Bonanza")
    print("🌐 HTTP сервер: http://localhost:5000")
    print("🔌 WebSocket сервер: ws://localhost:5001")
    print("📁 Убедитесь, что все файлы игры находятся в текущей папке")
    print("🔄 Service Worker (sw.js) автоматически перехватывает все запросы")
    print("📊 Полный набор API эндпоинтов включен")
    print("\nДоступные API эндпоинты:")
    print("  • /api/token - Получение токена")
    print("  • /api/game/balance - Баланс игрока")
    print("  • /api/game/spin - Игровой спин")
    print("  • /api/game/enter - Вход в игру")
    print("  • /api/game/cashout - Вывод средств")
    print("  • /api/game/leave - Выход из игры")
    print("  • /api/game/history - История игр")
    print("  • /api/game/settings - Настройки игры")
    print("  • /api/game/statistics - Статистика")
    print("  • /frontendService/gameVoteData - Данные голосования")
    print("  • /api.playzia.staging.hizi-service.com/gameapi/v2/* - Playzia API v2")
    print("\nНажмите Ctrl+C для остановки сервера")
    
    # Запускаем WebSocket сервер в отдельном потоке
    ws_thread = threading.Thread(target=start_websocket_server, daemon=True)
    ws_thread.start()
    
    # Запускаем Flask сервер
    app.run(host='0.0.0.0', port=5000, debug=True)
