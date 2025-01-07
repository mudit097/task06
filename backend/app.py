from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3

app = Flask(__name__)
CORS(app)

# Replace with your AWS S3 bucket name and credentials
BUCKET_NAME = 'team06s3'
AWS_ACCESS_KEY_ID = 'AKIA3C6FMG2HE5IHG3V3'
AWS_SECRET_ACCESS_KEY = 'o/1LrtIQzwzwUXXinYS//d12ZUlhC+E6md1EvVD8'

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        s3_client.upload_fileobj(file, BUCKET_NAME, file.filename)
        return jsonify({'message': 'File uploaded successfully!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/files', methods=['GET'])
def list_files():
    try:
        response = s3_client.list_objects_v2(Bucket=BUCKET_NAME)
        files = []
        if 'Contents' in response:
            for obj in response['Contents']:
                file_url = s3_client.generate_presigned_url(
                    'get_object',
                    Params={'Bucket': BUCKET_NAME, 'Key': obj['Key']},
                    ExpiresIn=3600
                )
                files.append({'name': obj['Key'], 'url': file_url})
        return jsonify(files)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/delete', methods=['POST'])
def delete_file():
    data = request.json
    file_name = data.get('file_name')

    if not file_name:
        return jsonify({'error': 'No file name provided'}), 400

    try:
        s3_client.delete_object(Bucket=BUCKET_NAME, Key=file_name)
        return jsonify({'message': f'File {file_name} deleted successfully!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)