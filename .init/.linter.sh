#!/bin/bash
cd /home/kavia/workspace/code-generation/openai-chatbot-web-application-3147-3156/chatbot_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

