import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import React, { useState } from 'react';
import ChatBubble from "./ChatBubble";
import { speak, isSpeakingAsync, stop } from 'expo-speech';
import { Ionicons } from 'react-native-vector-icons';

const ChatBot = () => {
    const [chat, setChat] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const API_KEY = "AIzaSyBApv0M03F8yvcqESAzRlByjjCdHmsD-zo";

    const handleUserInput = async () => {
        if (!userInput.trim()) return; // Prevent empty input

        let updatedChat = [
            ...chat,
            {
                role: "user",
                parts: [{ text: userInput }],
            },
        ];

        setLoading(true);

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
                {
                    contents: [{ parts: [{ text: userInput }] }]
                }
            );

            let modelResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

            if (modelResponse) {
                modelResponse = modelResponse
                    .replace(/\*\*/g, "")
                    .replace(/##/g, "")
                    .replace(/`/g, "")
                    .replace(/\*/g, "");

                const updatedChatWithModel = [
                    ...updatedChat,
                    {
                        role: "model",
                        parts: [{ text: modelResponse }],
                    },
                ];

                setChat(updatedChatWithModel);
                setUserInput(""); // Clear input field
            } else {
                console.warn("No model response returned from API");
                setError("No response received from the model");
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setError("An error occurred. Please try again!");
        } finally {
            setLoading(false);
        }
    };

    const handleSpeech = async (text) => {
        if (isSpeaking) {
            stop();
            setIsSpeaking(false);
        } else {
            if (!(await isSpeakingAsync())) {
                speak(text);
                setIsSpeaking(true);
            }
        }
    };

    const renderChatItem = ({ item }) => (
        <ChatBubble
            role={item.role}
            text={item.parts[0].text}
            onSpeech={() => handleSpeech(item.parts[0].text)}
        />
    );

    const handleRefresh = () => {
        setChat([]); // Clear the chat
    };

    const handleDelete = () => {
        setUserInput(""); // Clear the input field
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My-GPT</Text>

            {/* Refresh and Delete Buttons */}
            <View style={styles.headerIcons}>
                <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
                    <Ionicons name="refresh-outline" size={30} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRefresh} style={styles.iconButton}>
                    <Ionicons name="trash-outline" size={30} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={chat}
                renderItem={renderChatItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.chatContainer}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    placeholderTextColor="#aaa"
                    value={userInput}
                    onChangeText={setUserInput}
                />
                <TouchableOpacity style={styles.button} onPress={handleUserInput}>
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>

            {loading && <ActivityIndicator style={styles.loading} />}
            {error && <Text style={styles.error}>{error}</Text>}

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Developed by G.A.P.Pathum | Powered by GeminiAI</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        marginTop: 40,
        textAlign: 'center',
    },
    chatContainer: {
        flexGrow: 1,
        justifyContent: "flex-end",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        color: 'rgb(0 122 255)',
    },
    input: {
        flex: 1,
        height: 50,
        marginRight: 10,
        padding: 8,
        borderColor: "#333",
        borderWidth: 1,
        borderRadius: 25,
        color: "#333",
        backgroundColor: "#fff",
    },
    button: {
        padding: 10,
        backgroundColor: "#007AFF",
        borderRadius: 25,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
    },
    loading: {
        marginTop: 10,
    },
    error: {
        color: "red",
        marginTop: 10,
    },
    headerIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginHorizontal: 10,
    },
    iconButton: {
        padding: 10,
    },
    footer: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        color: '#555',
    },
});

export default ChatBot;
