import requests
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pika
import json
import schedule
import time
from datetime import datetime
from meteostat import Stations, Daily

def fetch_data():
    # Fetch news from SA
    news_api_url = 'https://newsapi.org/v2/top-headlines?country=za&apiKey=217769cc2bee43fbb3854299ecb7ecfc'
    response_za = requests.get(news_api_url)
    news_data = response_za.json()

    # Fetch tweets
    #twitter_api_url = 'https://api.twitter.com/2/tweets/search/recent?query=YOUR_QUERY'
    #headers = {'Authorization': 'Bearer YOUR_BEARER_TOKEN'}
    #response_twitter = requests.get(twitter_api_url, headers=headers)
    #twitter_data = response_twitter.json()

    # List of cities in South Africa
    cities = ['Butterworth','Dikeni','East London','Gqeberha','Graaff-Reinet','Kariega','Komani','Makhanda','Mthatha','Qonce','Zwelitsha','Bethlehem','Bloemfontein','Jagersfontein','Kroonstad','Odendaalsrus','Parys','Phuthaditjhaba','Sasolburg','Virginia','Welkom','Benoni','Boksburg','Brakpan','Carletonville','Germiston','Johannesburg','Krugersdorp','Pretoria','Randburg','Randfontein','Roodepoort','Soweto','Springs','Vanderbijlpark','Vereeniging','Durban','Empangeni','Newcastle','Pietermaritzburg','Pinetown','Ulundi','Umlazi','uMnambithi','Giyani','Lebowakgomo','Musina','Phalaborwa','Polokwane','Seshego','Sibasa','Thabazimbi','Emalahleni','Mbombela','Secunda','Klerksdorp','Mahikeng','Mmabatho','Potchefstroom','Rustenburg','Kimberley','Kuruman','Port Nolloth','Bellville','Cape Town','Constantia','George','Hopefield','Oudtshoorn','Paarl','Simons Town','Stellenbosch','Swellendam','Worcester']

    # Set the time period
    start = datetime(2024, 1,1)
    end = datetime(2024, 12, 31)

    # Create an empty DataFrame to store the data
    all_weather_data = pd.DataFrame()

    # Fetch weather data from South Africa for each city
    for city in cities:
        # Find the nearest weather station
        stations = Stations()
        stations = stations.nearby(city)
        station = stations.fetch(1)

        # If a station is found, fetch the weather data
        if not station.empty:
            station_id = station.index[0]
            data = Daily(station_id, start, end)
            data = data.fetch()
            data["city"] = city
            all_weather_data = pd.concat([all_weather_data, data])

    # Reset index and display the data
    all_weather_data.reset_index(inplace=True)
    print(all_weather_data.head())


    data = pd.DataFrame(news_data['articles']) #+ twitter_data['data'])
    data = pd.concat([data, all_weather_data], ignore_index=True)

    return data

def analyze_data(data):
    # Extract relevant fields
    data['temp'] = data['main'].apply(lambda x: x['temp'] if isinstance(x, dict) else None)
    data['humidity'] = data['main'].apply(lambda x: x['humidity'] if isinstance(x, dict) else None)
    data['wind_speed'] = data['wind'].apply(lambda x: x['speed'] if isinstance(x, dict) else None)
    data['cloudiness'] = data['clouds'].apply(lambda x: x['all'] if isinstance(x, dict) else None)
    data['rainfall'] = data['rain'].apply(lambda x: x.get('1h', 0) if isinstance(x, dict) else 0)
    data['coords'] = data['coord'].apply(lambda x: (x['lat'], x['lon']) if isinstance(x, dict) else (None, None))

    # Drop rows with None values in any of the relevant columns
    data.dropna(subset=['temp', 'humidity', 'wind_speed', 'cloudiness', 'rainfall', 'coords'], inplace=True)

    # Prepare the data for training
    features = data[['temp', 'humidity', 'wind_speed', 'cloudiness', 'rainfall']]
    labels = [1] * len(data)  # Dummy labels for demonstration

    # Ensure the indices are reset so they match after the train-test split
    features.reset_index(drop=True, inplace=True)
    data.reset_index(drop=True, inplace=True)

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)

    # Train a RandomForest model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Make predictions
    predictions = model.predict(X_test)

    # Evaluate the model
    accuracy = accuracy_score(y_test, predictions)
    print(f'Accuracy: {accuracy}')

    # Include coordinates in the predictions
    prediction_coords = data.loc[X_test.index, 'coords'].tolist()

    return list(zip(predictions, prediction_coords))

def send_to_rabbitmq(predictions):
    credentials = pika.PlainCredentials('queue_user', 'queue_password')
    connection = pika.BlockingConnection(pika.ConnectionParameters('102.211.204.21', credentials=credentials))
    channel = connection.channel()
    channel.queue_declare(queue='weather_disaster')
    message = json.dumps(predictions)
    channel.basic_publish(exchange='', routing_key='weather_disaster', body=message)
    connection.close()

def job():
    data = fetch_data()
    predictions = analyze_data(data)
    send_to_rabbitmq(predictions)

schedule.every(5).minutes.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)