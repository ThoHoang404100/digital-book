from typing import Any
from ollama import Client


class Ollama:
    def __init__(
        self,
        host: str,
        api_key: str | None,
        model: str,
    ):
        headers = {}

        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"

        self.client = Client(
            host=host,
            headers=headers,
        )

        self.model = model

    def chat(
        self,
        messages: list[dict],
        system: str | None = None,
        temperature: float = 1.0,
        stop_sequences: list[str] | None = None,
        tools: list | None = None,
        stream: bool = False,
        think: bool = False,
    ):
        conversation = messages.copy()

        if system:
            conversation.insert(
                0,
                {
                    "role": "system",
                    "content": system,
                },
            )

        options = {
            "temperature": temperature,
        }

        if stop_sequences:
            options["stop"] = stop_sequences

        return self.client.chat(
            model=self.model,
            messages=conversation,
            tools=tools,
            stream=stream,
            think=think,
            options=options,
        )


class Message:
    @staticmethod
    def system(content: str):
        return {"role": "system", "content": content}

    @staticmethod
    def user(content: str):
        return {"role": "user", "content": content}

    @staticmethod
    def assistant(content: str, tool_calls=None):
        msg = {"role": "assistant", "content": content}
        if tool_calls:
            msg["tool_calls"] = tool_calls
        return msg

    @staticmethod
    def tool(name: str, content: str):
        return {
            "role": "tool",
            "tool_name": name,
            "content": content,
        }