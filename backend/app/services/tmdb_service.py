import requests

class TMDBService:
    BASE_URL = "https://api.themoviedb.org/3"
    
    def __init__(self, api_key):
        self.api_key = api_key

    def search_movies(self, query, page=1):
        # 搜索电影
        movie_response = requests.get(
            f"{self.BASE_URL}/search/movie",
            params={
                "api_key": self.api_key,
                "query": query,
                "page": page,
                "language": "zh-CN"
            }
        ).json()

        # 搜索人物（演员、导演等）
        person_response = requests.get(
            f"{self.BASE_URL}/search/person",
            params={
                "api_key": self.api_key,
                "query": query,
                "page": 1,
                "language": "zh-CN"
            }
        ).json()

        # 如果找到相关人物，获取他们参与的电影
        additional_movies = []
        if person_response.get('results'):
            for person in person_response['results'][:3]:  # 只处理前3个最相关的人物
                # 获取该人物参与的电影
                person_movies = requests.get(
                    f"{self.BASE_URL}/person/{person['id']}/movie_credits",
                    params={
                        "api_key": self.api_key,
                        "language": "zh-CN"
                    }
                ).json()
                
                # 添加该人物最近的电影
                if person_movies.get('cast'):
                    additional_movies.extend(person_movies['cast'])
                if person_movies.get('crew'):
                    # 只添加导演的作品
                    director_movies = [m for m in person_movies['crew'] if m['job'] == 'Director']
                    additional_movies.extend(director_movies)

        # 合并结果
        all_movies = movie_response.get('results', [])
        
        # 将人物相关的电影添加到结果中（避免重复）
        existing_ids = {movie['id'] for movie in all_movies}
        for movie in additional_movies:
            if movie['id'] not in existing_ids:
                all_movies.append(movie)
                existing_ids.add(movie['id'])

        # 按照流行度排序
        all_movies.sort(key=lambda x: x.get('popularity', 0), reverse=True)

        # 分页处理
        start_idx = (int(page) - 1) * 20
        end_idx = start_idx + 20
        paginated_movies = all_movies[start_idx:end_idx]

        return {
            'results': paginated_movies,
            'total_results': len(all_movies),
            'total_pages': (len(all_movies) + 19) // 20,
            'page': page
        }

    def get_movie_details(self, movie_id):
        response = requests.get(
            f"{self.BASE_URL}/movie/{movie_id}",
            params={
                "api_key": self.api_key,
                "language": "zh-CN",
                "append_to_response": "credits"  # 包含演员和导演信息
            }
        )
        return response.json()
    
    def get_trending_movies(self, page=1):
        response = requests.get(
            f"{self.BASE_URL}/trending/movie/week",
            params={
                "api_key": self.api_key,
                "page": page,
                "language": "zh-CN"
            }
        )
        return response.json() 