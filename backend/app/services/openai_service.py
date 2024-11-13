from openai import OpenAI

class OpenAIService:
    def __init__(self, api_key):
        self.client = OpenAI(api_key=api_key)

    def get_movie_recommendations(self, favorite_movies):
        prompt = f"""基于用户喜欢的以下电影，推荐10部相似的电影：
        用户喜欢的电影：{', '.join(favorite_movies)}
        
        要求：
        1. 只返回电影的中文名称和年份
        2. 每行一个电影
        3. 格式：电影名称 (年份)
        4. 不要包含其他任何文字
        5. 必须返回10部不同的电影
        6. 尽量选择评分较高的经典电影
        """
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "你是一个电影推荐专家。请只返回电影名称和年份，每行一个，不要包含其他文字。必须返回10部不同的电影。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=300
        )
        
        return response.choices[0].message.content.strip().split('\n')