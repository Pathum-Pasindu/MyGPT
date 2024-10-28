import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react';
import { Ionicons} from "react-native-vector-icons";

const ChatBubble = ({ role, text, onSpeech }) => {
    return (
        <View style={[
            styles.chatItem,
            role == "user" ? styles.userChatItem : styles.modelChatItem,
        ]}>
            <Text style={styles.chatText}>{text}</Text>
            {role == "model" && (
                <TouchableOpacity onPress={onSpeech} style={styles.speakIcon}>
                    <Ionicons name="volume-high-outline" size={24} color="#fff"/>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    chatItem: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        maxWidth: '70%',
        position: "relative",
    },
    userChatItem: {
        alignSelf: "flex-end",
        backgroundColor: "#5a97ee",
    },
    modelChatItem: {
        borderRadius: 10,
        alignSelf: "flex-start",
        backgroundColor: "#007AFF", // Set model message background to light grey
    },
    chatText: {
        color: "#fff",
        fontSize: 20,
    },
    speakIcon: {
        position: "absolute",
        bottom: 1,
        right: 1,
    },
});

export default ChatBubble;