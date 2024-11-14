import requests
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pika
import json
import schedule
import time
from datetime import datetime, timedelta
from meteostat import Stations, Daily
from sklearn.utils.validation import check_non_negative


def fetch_data():
    # Fetch news from SA
    news_api_url = 'http://api.mediastack.com/v1/news?access_key=5edb2ff2ee693bcdf2aa4aa1d462927d&country=za&categories=general&keywords=weather,disaster'
    response_za = requests.get(news_api_url)
    news_data = response_za.json()

    # List of cities in South Africa
    cities = [
        {"name": "Butterworth", "latitude": -32.3300, "longitude": 28.1500},
        {"name": "Dikeni", "latitude": -32.7200, "longitude": 26.5300},
        {"name": "East London", "latitude": -33.0292, "longitude": 27.8546},
        {"name": "Gqeberha", "latitude": -33.9608, "longitude": 25.6022},
        {"name": "Graaff-Reinet", "latitude": -32.2522, "longitude": 24.5300},
        {"name": "Kariega", "latitude": -33.7650, "longitude": 25.5970},
        {"name": "Komani", "latitude": -31.8976, "longitude": 26.8753},
        {"name": "Makhanda", "latitude": -33.3100, "longitude": 26.5200},
        {"name": "Mthatha", "latitude": -31.5889, "longitude": 28.7844},
        {"name": "Qonce", "latitude": -32.6900, "longitude": 27.3900},
        {"name": "Zwelitsha", "latitude": -32.9000, "longitude": 27.4333},
        {"name": "Bethlehem", "latitude": -28.2300, "longitude": 28.3000},
        {"name": "Bloemfontein", "latitude": -29.0852, "longitude": 26.1596},
        {"name": "Jagersfontein", "latitude": -29.7500, "longitude": 25.4300},
        {"name": "Kroonstad", "latitude": -27.6500, "longitude": 27.2300},
        {"name": "Odendaalsrus", "latitude": -27.8700, "longitude": 26.6800},
        {"name": "Parys", "latitude": -26.9000, "longitude": 27.4500},
        {"name": "Phuthaditjhaba", "latitude": -28.5300, "longitude": 28.8200},
        {"name": "Sasolburg", "latitude": -26.8100, "longitude": 27.8200},
        {"name": "Virginia", "latitude": -28.1036, "longitude": 26.8650},
        {"name": "Welkom", "latitude": -27.9833, "longitude": 26.7333},
        {"name": "Benoni", "latitude": -26.1881, "longitude": 28.3200},
        {"name": "Boksburg", "latitude": -26.2125, "longitude": 28.2625},
        {"name": "Brakpan", "latitude": -26.2361, "longitude": 28.3694},
        {"name": "Carletonville", "latitude": -26.3600, "longitude": 27.4000},
        {"name": "Germiston", "latitude": -26.2170, "longitude": 28.1700},
        {"name": "Johannesburg", "latitude": -26.2041, "longitude": 28.0473},
        {"name": "Krugersdorp", "latitude": -26.1000, "longitude": 27.7700},
        {"name": "Pretoria", "latitude": -25.7479, "longitude": 28.2293},
        {"name": "Randburg", "latitude": -26.1000, "longitude": 28.0000},
        {"name": "Randfontein", "latitude": -26.1833, "longitude": 27.7000},
        {"name": "Roodepoort", "latitude": -26.1625, "longitude": 27.8725},
        {"name": "Soweto", "latitude": -26.2678, "longitude": 27.8585},
        {"name": "Springs", "latitude": -26.2500, "longitude": 28.4000},
        {"name": "Vanderbijlpark", "latitude": -26.7060, "longitude": 27.8370},
        {"name": "Vereeniging", "latitude": -26.6731, "longitude": 27.9261},
        {"name": "Durban", "latitude": -29.8587, "longitude": 31.0218},
        {"name": "Empangeni", "latitude": -28.7500, "longitude": 31.9000},
        {"name": "Newcastle", "latitude": -27.7585, "longitude": 29.9318},
        {"name": "Pietermaritzburg", "latitude": -29.6006, "longitude": 30.3794},
        {"name": "Pinetown", "latitude": -29.8167, "longitude": 30.8500},
        {"name": "Ulundi", "latitude": -28.3353, "longitude": 31.4165},
        {"name": "Umlazi", "latitude": -29.9500, "longitude": 30.8833},
        {"name": "uMnambithi", "latitude": -28.5500, "longitude": 29.7833},
        {"name": "Giyani", "latitude": -23.3000, "longitude": 30.7167},
        {"name": "Lebowakgomo", "latitude": -24.2000, "longitude": 29.5000},
        {"name": "Musina", "latitude": -22.3500, "longitude": 30.0333},
        {"name": "Phalaborwa", "latitude": -23.9333, "longitude": 31.1167},
        {"name": "Polokwane", "latitude": -23.8962, "longitude": 29.4486},
        {"name": "Seshego", "latitude": -23.8833, "longitude": 29.3833},
        {"name": "Sibasa", "latitude": -22.9500, "longitude": 30.4833},
        {"name": "Thabazimbi", "latitude": -24.5917, "longitude": 27.4111},
        {"name": "Emalahleni", "latitude": -25.8770, "longitude": 29.2332},
        {"name": "Mbombela", "latitude": -25.4753, "longitude": 30.9690},
        {"name": "Secunda", "latitude": -26.5167, "longitude": 29.2000},
        {"name": "Klerksdorp", "latitude": -26.8521, "longitude": 26.6667},
        {"name": "Mahikeng", "latitude": -25.8650, "longitude": 25.6440},
        {"name": "Mmabatho", "latitude": -25.8500, "longitude": 25.6333},
        {"name": "Potchefstroom", "latitude": -26.7167, "longitude": 27.1000},
        {"name": "Rustenburg", "latitude": -25.6545, "longitude": 27.2559},
        {"name": "Kimberley", "latitude": -28.7384, "longitude": 24.7637},
        {"name": "Kuruman", "latitude": -27.4500, "longitude": 23.4333},
        {"name": "Port Nolloth", "latitude": -29.2500, "longitude": 16.8667},
        {"name": "Bellville", "latitude": -33.9000, "longitude": 18.6333},
        {"name": "Cape Town", "latitude": -33.9249, "longitude": 18.4241},
        {"name": "Constantia", "latitude": -34.0167, "longitude": 18.4167},
        {"name": "George", "latitude": -33.9648, "longitude": 22.4598},
        {"name": "Hopefield", "latitude": -33.0667, "longitude": 18.3500},
        {"name": "Oudtshoorn", "latitude": -33.5833, "longitude": 22.2000},
        {"name": "Paarl", "latitude": -33.7333, "longitude": 18.9667},
        {"name": "Simons Town", "latitude": -34.1933, "longitude": 18.4328},
        {"name": "Stellenbosch", "latitude": -33.9333, "longitude": 18.8667},
        {"name": "Swellendam", "latitude": -34.0200, "longitude": 20.4400},
        {"name": "Worcester", "latitude": -33.6467, "longitude": 19.4481}
    ]

    # Filter news articles to include only relevant weather disasters
    relevant_keywords = ['flood', 'storm', 'hurricane', 'tornado', 'drought', 'heatwave', 'blizzard']
    filtered_articles = [article for article in news_data['data'] if any(
        keyword in article['title'].lower() or keyword in article['description'].lower() for keyword in
        relevant_keywords) and any(
        city['name'].lower() in article['title'].lower() or city['name'].lower() in article['description'].lower() for
        city in cities)]

    # Set the time period
    current_date = datetime.now().date()
    start = datetime.combine(current_date - timedelta(days=5), datetime.min.time())
    end = datetime.combine(current_date + timedelta(days=5), datetime.min.time())

    #start = datetime(2024, 1, 1)
    #end = datetime(2024, 12, 31)

    # Create an empty DataFrame to store the data
    all_weather_data = pd.DataFrame()

    # Fetch weather data from South Africa for each city
    for city in cities:
        # Find the nearest weather station
        stations = Stations()
        stations = stations.nearby(city['latitude'], city['longitude'])
        station = stations.fetch(1)

        # If a station is found, fetch the weather data
        if not station.empty:
            station_id = station.index[0]
            data = Daily(station_id, start, end)
            data = data.fetch()
            data["city"] = city['name']
            all_weather_data = pd.concat([all_weather_data, data])

    # Reset index and display the data
    all_weather_data.reset_index(inplace=True)
    print(all_weather_data.head())

    data = pd.DataFrame(filtered_articles)  # + twitter_data['data'])
    data = pd.concat([data, all_weather_data], ignore_index=True)

    return data, cities, news_data

def is_disaster(row):
    if row['temp'] > 25:   #40
        return row['temp'], 'temp'
    elif row['snowfall'] > 10:
        return row['snowfall'], 'snowfall'
    elif row['wind_speed'] > 15: #50:
        return row['wind_speed'], 'wind_speed'
    elif row['rainfall'] > 15: #50:
        return row['rainfall'], 'rainfall'
    else:
        return 0, None

def analyze_data(data, cities):
    # Extract relevant fields
    data['temp'] = data['tmax']
    data['snowfall'] = data['snow']
    data['wind_speed'] = data['wspd']
    data['rainfall'] = data['prcp']

    # Add a column to indicate whether a disaster is happening and the field that triggered it
    data[['disaster_value', 'disaster_field']] = data.apply(lambda row: pd.Series(is_disaster(row)), axis=1)

    # Prepare the data for training
    features = data[['temp', 'snowfall', 'wind_speed', 'rainfall']]
    labels = data['disaster_value'].apply(lambda x: 1 if x != 0 else 0)

    # Ensure the indices are reset so they match after the train-test split
    features.reset_index(drop=True, inplace=True)
    data.reset_index(drop=True, inplace=True)

    # Split the data into training and testing sets
    if len(features) > 1:
        X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)
    else:
        raise ValueError("Not enough samples to split into training and testing sets.")

    # Train a DecisionTree model
    model = DecisionTreeClassifier(random_state=42)
    model.fit(X_train, y_train)

    # Make predictions
    predictions = model.predict(X_test)

    # Evaluate the model
    accuracy = accuracy_score(y_test, predictions)
    print(f'Accuracy: {accuracy}')

    # Create a list of JSON objects with the predictions, city, and disaster field
    prediction_data = []
    for index, prediction in enumerate(predictions):
        if prediction == 1:
            city = data.loc[X_test.index[index], 'city']
            disaster_field = data.loc[X_test.index[index], 'disaster_field']
            disaster_value = data.loc[X_test.index[index], 'disaster_value']
            coords = next(city_info for city_info in cities if city_info["name"] == city)
            prediction_data.append({
                "city": city,
                "latitude": coords["latitude"],
                "longitude": coords["longitude"],
                "disaster_field": disaster_field,
                "disaster_value": disaster_value
            })

    return prediction_data

def send_to_rabbitmq(predictions):
    credentials = pika.PlainCredentials('queue_user', 'queue_password')
    connection = pika.BlockingConnection(pika.ConnectionParameters('102.211.204.21', credentials=credentials))
    channel = connection.channel()
    channel.queue_declare(queue='weather_disaster')

    for prediction in predictions:
        message = json.dumps(prediction)
        #print(f'Sending message: {message}') # Debug print
        channel.basic_publish(exchange='', routing_key='weather_disaster', body=message)

    connection.close()

def send_news_to_rabbitmq(news_data):
    credentials = pika.PlainCredentials('queue_user', 'queue_password')
    connection = pika.BlockingConnection(pika.ConnectionParameters('102.211.204.21', credentials=credentials))
    channel = connection.channel()
    channel.queue_declare(queue='news')

    for article in news_data['data']:
        message=json.dumps(article)
        channel.basic_publish(exchange='', routing_key='news', body=message)

    connection.close()


def job():
    data, cities, news_data = fetch_data()
    predictions = analyze_data(data, cities)
    #print(f'Predictions: {predictions}')  # Debug print
    send_to_rabbitmq(predictions)
    send_news_to_rabbitmq(news_data)

schedule.every(2).minutes.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)