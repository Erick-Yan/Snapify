from kafka import KafkaConsumer
import json
import logging
import datetime

def consume(consumer, timeout=5):
    end_time = datetime.datetime.now() + datetime.timedelta(seconds=timeout)
    messages = []
    try:
        while datetime.datetime.now() < end_time:
            message_pack = consumer.poll(timeout_ms=1000) 
            if message_pack:
                for topic_partition, messages in message_pack.items():
                    for message in messages:
                        print(f"Message received: {message.key} = {message.value}")
            if datetime.datetime.now() >= end_time:
                break
        consumer.close()
    except Exception as e:
        logging.error("Failed to subscribe and consume to kafka topic!")
        raise e
    
def check_messages(consumer, key):
    message_count = 0
    try:
        records = consumer.poll(timeout_ms=5000)
        print("Records Here: ", records)

        for topic_partition, messages in records.items():
            for message in messages:
                print(message.key, key)
                if message.key.decode('utf-8') == key:
                    message_count += 1
        return message_count
    except Exception as e:
        logging.error(f'Failed to check messages under key={key}')
        raise e
    finally:
        consumer.close()

def get_kafka_consumer(topic_name):
    _consumer = None
    try:
        _consumer = KafkaConsumer(topic_name,
                         bootstrap_servers='kafka:9093',
                         auto_offset_reset='earliest',
                         group_id='user_follow_group',
                         enable_auto_commit=False,
                         value_deserializer=lambda x: json.loads(x.decode('utf-8')))
    except Exception as e:
        logging.error("Failed to connect with kafka!")
        raise e
    
    return _consumer
