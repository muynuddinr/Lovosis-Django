# Django Project Setup

## Prerequisites
- Python 3.x installed
- Git (optional, for cloning)

## Setup Instructions

1. **Create a virtual environment:**
   ```
   python -m venv venv
   ```

2. **Activate the virtual environment:**
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

3. **Install requirements:**
   ```
   pip install -r requirements.txt
   ```

4. **Make migrations:**
   ```
   python manage.py makemigrations
   ```

5. **Make migrations for apps:**
   ```
   python manage.py makemigrations apps
   ```

6. **Migrate:**
   ```
   python manage.py migrate
   ```

7. **Create superuser:**
   ```
   python manage.py createsuperuser
   ```

8. **Run the server:**
   ```
   python manage.py runserver
   ```

## Usage
- Access the application at `http://127.0.0.1:8000/`
- Admin panel at `http://127.0.0.1:8000/admin/`

## Notes
- Ensure you are in the project root directory (`server/`) when running commands.
- Deactivate the virtual environment with `deactivate` when done.