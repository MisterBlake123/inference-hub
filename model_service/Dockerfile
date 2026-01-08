FROM python:3.9-slim

WORKDIR /app

# Install system dependencies if any (none for now)

# Copy requirements and install
COPY model_service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy proto files (Must be available in build context)
COPY proto /app/proto

# Copy app source
COPY model_service /app/model_service

WORKDIR /app/model_service

# Generate Protobuf code
# We run this during build so the image is ready-to-run
RUN python -m grpc_tools.protoc -I../proto --python_out=. --grpc_python_out=. ../proto/inference.proto

EXPOSE 50051

CMD ["python", "server.py"]
