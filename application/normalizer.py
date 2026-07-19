import os

from dotenv import load_dotenv
from ollama_adapter import Ollama, Message
from prompts.prompt_loader import PromptLoader
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

OLLAMA_API_KEY = os.environ.get("OLLAMA_API_KEY")
MODEL = "gemma4:31b-cloud"

class Normalizer():
  def __init__(self, model = MODEL):
    self.llm = Ollama(
      host="https://ollama.com", 
      api_key=OLLAMA_API_KEY, 
      model=model)
      
    self.system_instruction = PromptLoader.load("prompts/normalize_instruction.md")

  def normalize(self,text: str):
    messages = []
    messages.append(Message.system(self.system_instruction))
    messages.append(Message.user(text))
    response = self.llm.chat(messages=messages,temperature=0.5)
    return response.message.content

  def normalize_many(self, texts: list[str], max_workers=4) -> list[str]:
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            return list(
                executor.map(
                    self.normalize,
                    texts,
                )
            )

