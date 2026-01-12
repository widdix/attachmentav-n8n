#!/bin/sh

# Start n8n in background to initialize the database
n8n start &
N8N_PID=$!

# Wait for n8n to be ready
echo "Waiting for n8n to initialize..."
sleep 15

# Create AttachmentAV API credentials if they don't exist
echo "Setting up AttachmentAV API credentials..."

# Create a temporary credentials file with the API key from environment variable
if [ -n "$ATTACHMENT_API_KEY" ]; then
  echo "Injecting API key from environment variable..."
  cat > /tmp/attachmentav-credentials-temp.json <<EOF
[
  {
    "id": "BFGbk0a71fKWY967",
    "name": "AttachmentAV Account",
    "type": "attachmentAVApi",
    "data": {
      "apiKey": "$ATTACHMENT_API_KEY"
    }
  }
]
EOF
  n8n import:credentials --input=/tmp/attachmentav-credentials-temp.json 2>/dev/null || echo "Credentials already exist or import failed"
  rm -f /tmp/attachmentav-credentials-temp.json
else
  echo "Error: ATTACHMENT_API_KEY environment variable not set. Please set it in your .env file."
  exit 1
fi

# Import the workflow if it doesn't exist yet
echo "Checking if workflow needs to be imported..."
n8n import:workflow --input=/tmp/workflows/AttachmentAV_Smoke_Test.json 2>/dev/null || echo "Workflow already exists or import failed"

# Bring n8n back to foreground
wait $N8N_PID
