import express from "express";
import cors from "cors";
import fs from "fs/promises";
import { User } from "./models/User.model.js";

const app = express();
const port = process.env.SERVER_PORT || 5001;

app.use(cors());
app.use(express.json()); // מאפשר קריאת JSON בבקשות

// Endpoint לשמירת נתונים לתוך JSON בלי למחוק את הישנים
app.post("/save-resume", async (req, res) => {
    const resumeData = req.body;

    console.log(resumeData);

    // קריאת הנתונים הקיימים (אם יש)
    await fs.readFile("resumeData.json", "utf8", (err, data) => {
        let existingData = [];

        if (!err && data) {
            try {
                existingData = JSON.parse(data);
            } catch (parseErr) {
                console.error("Error parsing JSON:", parseErr);
            }
        }

        // הוספת הנתונים החדשים
        existingData.push(resumeData);

        // שמירת הנתונים המעודכנים
        fs.writeFile(
            "resumeData.json",
            JSON.stringify(existingData, null, 2),
            (err) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ message: "Error saving data", error: err });
                }
                res.status(200).json({
                    message: "Resume data saved successfully",
                });
            }
        );
    });
});

// Endpoint לשליפת הנתונים מהקובץ
app.get("/get-resume", async (req, res) => {
    await fs.readFile("resumeData.json", "utf8", (err, data) => {
        if (err) {
            return res
                .status(500)
                .json({ message: "Error reading data", error: err });
        }

        try {
            const parsedData = JSON.parse(data);
            res.status(200).json(parsedData);
        } catch (parseErr) {
            res.status(500).json({
                message: "Error parsing JSON data",
                error: parseErr,
            });
        }
    });
});

app.post("/users/register", async (req, res) => {
    let { fName, lName, email, username, password } = req.body;

    let users = await fs.readFile("./data/users.json", "utf-8");
    users = JSON.parse(users); //"importing" the json file as an array of objects

    let userExist = users.find(
        (user) => user.username === username || user.email === email
    );

    if (userExist) {
        res.status(400).json({
            message: "User already exists",
            success: false,
        });
    } else {
        const newUser = new User(
            fName || null,
            lName || null,
            email || null,
            username || null,
            password || null
        );

        let maxId = users.length;
        newUser.id = maxId + 1;

        users.push(newUser);

        await fs.writeFile(
            "./data/users.json",
            JSON.stringify(users, null, 2),
            (err) => console.log(err)
        );
        res.status(200).json({
            message: "User created successfully",
            success: true,
        });
    }
});

app.post("/users/login", async (req, res) => {
    let { username, password } = req.body;
    let users = await fs.readFile("./data/users.json", "utf-8");
    users = JSON.parse(users); //"importing" the json file as an array of objects

    let userExist = users.find((user) => user.username === username);
    let passCorrect = users.find((user) => user.password === password);

    if (userExist && passCorrect) {
        res.status(200).json({
            message: "Authentication successful, Logging in",
            success: true,
        });
    } else {
        res.status(401).json({
            message: "Incorrect credentials or unregistered",
            success: false,
        });
    }
});

// הפעלת השרת
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
