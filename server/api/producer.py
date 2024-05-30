import logging
from kafka import KafkaProducer
import json


def get_kafka_producer():
    _producer = None
    try:
        _producer = KafkaProducer(bootstrap_servers='kafka:9093',
                         value_serializer=lambda v: json.dumps(v).encode('utf-8'))
    except Exception as e:
        logging.error("Failed to fetch producer: ", e)
        raise e
    logging.info("Connected with producer!")
    return _producer

def publish(producer, topic_name, key, value):
    try:
        producer.send(topic_name, key=key, value=value)
        producer.close
    except Exception as e:
        logging.error("Failed to publish message: ", e)
        raise e
    logging.info(f'Published the following message under {topic_name}: {key}: {value}')

    