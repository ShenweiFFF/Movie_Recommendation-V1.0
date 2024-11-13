import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///movie_recommender.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY')
    TMDB_API_KEY = os.getenv('TMDB_API_KEY')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY') 