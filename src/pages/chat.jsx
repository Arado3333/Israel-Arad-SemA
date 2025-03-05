import React, { useState, useEffect } from "react";
import { HfInference } from "@huggingface/inference";
import {
    Button,
    TextField,
    Paper,
    Typography,
    Box,
    Grid,
    Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { blue } from "@mui/material/colors";

function ChatPage() {
    const sysPrompt = `Welcome to the job interview assistant! I will guide you through 10 simple questions to create your resume. Answer each question with short, precise information. What is your name?`;

    const [token] = useState(import.meta.env.VITE_HF_TOKEN);

    const [text, setText] = useState("");
    const [messages, setMessages] = useState([
        { role: "system", content: sysPrompt },
    ]);
    const [resumeData, setResumeData] = useState({
        fullName: "",
        currentRole: "",
        skills: "",
        education: "",
        teamExperience: "",
        achievements: "",
        careerGoals: "",
        hobbies: "",
        location: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem("resumeData", JSON.stringify(resumeData));
    }, [resumeData]);

    const questions = [
        "What is your full name?",
        "What is your current or last job title?",
        "What are your key technical skills (languages, tools, databases)?",
        "What is your educational background (degree, studies, field)?",
        "What is your experience in team work or project management?",
        "What are some of your key achievements or projects?",
        "What are your career goals for the future?",
        "What are your hobbies or interests outside of work?",
        "Where are you located (city, region)?",
    ];

    const askAI = async (updatedMessages) => {
        setLoading(true);
        const client = new HfInference(token);

        try {
            const answer = await client.chatCompletion({
                model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
                messages: updatedMessages,
                temperature: 0.5,
                max_tokens: 2048,
                top_p: 0.7,
            });

            const botMessage = answer.choices[0].message;
            setMessages([...updatedMessages, botMessage]);
        } catch (error) {
            console.error("Error during AI call:", error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = (questionIndex) => {
        if (text.trim()) {
            const newMessage = { role: "user", content: text };
            const updatedMessages = [...messages, newMessage];
            setMessages(updatedMessages);

            const newResumeData = { ...resumeData };
            if (questionIndex < questions.length) {
                const questionKey = Object.keys(resumeData)[questionIndex];
                newResumeData[questionKey] = text;
            }

            setResumeData(newResumeData);
            askAI(updatedMessages);
            setText("");
        }
    };

    const endConversation = () => {
        console.log("Resume data:", resumeData);    
        
        fetch("http://localhost:5001/save-resume", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resumeData),
        })
            .then((response) => response.json())
            .then(alert("Resume data has been saved successfully!"))
            .catch((error) =>
                console.error("Error saving resume data:", error)
            );
    };

    return (
        <Paper elevation={3} sx={{ padding: 3, margin: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Job Interview Chat
            </Typography>
            <Box sx={{ height: "60vh", overflowY: "auto", marginBottom: 2 }}>
                {messages.map((message, index) => (
                    <Box key={index} sx={{ display: "flex", marginBottom: 2 }}>
                        {message.role === "user" ? (
                            <>
                                <Avatar
                                    sx={{ bgcolor: blue[500], marginRight: 1 }}
                                >
                                    U
                                </Avatar>
                                <Box
                                    sx={{
                                        backgroundColor: "gray",
                                        padding: 1,
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography>{message.content}</Typography>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        backgroundColor: "black",
                                        padding: 1,
                                        borderRadius: 2,
                                        marginLeft: "auto",
                                    }}
                                >
                                    <Typography>{message.content}</Typography>
                                </Box>
                                <Avatar
                                    sx={{ bgcolor: "grey.500", marginLeft: 1 }}
                                >
                                    A
                                </Avatar>
                            </>
                        )}
                    </Box>
                ))}
            </Box>

            <Typography variant="h6" align="center" gutterBottom>
                {questions[messages.length - 1]?.role === "system"
                    ? questions[0]
                    : questions[messages.length] || ""}
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <TextField
                        fullWidth
                        label="Type your response"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => sendMessage(messages.length)}
                        fullWidth
                        startIcon={<SendIcon />}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Send"}
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={endConversation}
                        fullWidth
                        disabled={loading}
                    >
                        End Conversation
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default ChatPage;
