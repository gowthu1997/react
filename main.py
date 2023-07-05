from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = mysql.connector.connect(
    host="database-1.ctr7kjxl5713.ap-south-1.rds.amazonaws.com",
    user="admin",
    password="Hegdegow1997",
)

with conn.cursor() as cursor:
    cursor.execute("CREATE DATABASE IF NOT EXISTS your_database")
    conn.commit()

conn.database = "your_database"

with conn.cursor() as cursor:
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(50) NOT NULL,
            email VARCHAR(50) NOT NULL
        )
    """)
    conn.commit()

class User(BaseModel):
    username: str
    email: str


@app.post("/post_user")
def add_user(user: User):
    with conn.cursor() as cursor:
        cursor.execute(
            "INSERT INTO users (username, email) VALUES (%s, %s)", (user.username, user.email))
        conn.commit()
        return {"message": "User added successfully"}


@app.get("/get_users")
def get_users():
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM users")
        users = cursor.fetchall()
        user_list = []
        for user in users:
            user_dict = {
                "id": user[0],
                "username": user[1],
                "email": user[2]
            }
            user_list.append(user_dict)
        return user_list
