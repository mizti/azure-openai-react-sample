import React, { useEffect, useState } from 'react'
import "./Home.css"
import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated } from "@azure/msal-react";
import axios from 'axios';
import { useMsal } from "@azure/msal-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Home = () => {
    const isAuthenticated = useIsAuthenticated();
    const [query, setQuery] = useState("お勧めの春野菜レシピを教えて");

    const [responseText, setResponseText] = useState('');
    const { instance } = useMsal();
    const [cog_token, setCogToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function acquireOpenAIToken() {
            try {
                const account = instance.getAllAccounts()[0];
                if (!account) {
                    throw new Error("User not logged in.");
                }

                const tokenRequest = {
                    scopes: ["https://cognitiveservices.azure.com/.default"],
                    account: account
                };

                try {
                    const response = await instance.acquireTokenSilent(tokenRequest);
                    setCogToken(response.accessToken);
                    return response.accessToken;
                } catch (error) {
                    console.error("Error acquiring token:", error);
                    throw error;
                }
            } catch (error) {
                console.error('Error acquiring OpenAI token or calling ChatCompletion API:', error);
            }
        }
        acquireOpenAIToken();
    }, [isAuthenticated]);

    const requestOpenAiChat = async () => {
        if (!cog_token) return;
        const apiUrl = `https://${process.env.REACT_APP_OPEN_AI_SUBDOMAIN}.openai.azure.com/openai/deployments/${process.env.REACT_APP_OPEN_AI_MODEL_NAME}/chat/completions?api-version=${process.env.REACT_APP_OPEN_AI_API_VERSION}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cog_token}`,
        };
        const data = {
            messages: [
                {
                    role: 'system',
                    content: '語尾には必ずニャンをつけてください。',
                },
                {
                    role: 'user',
                    content: query,
                },
            ],
            temperature: 0.5,
            max_tokens: 800,
            top_p: 0.95,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: null,
        };

        try {
            setIsLoading(true);
            const response = await axios.post(apiUrl, data, { headers });
            setIsLoading(false);
            setResponseText(response.data.choices[0].message.content);
        } catch (error) {
            setIsLoading(false);
            console.error('Error calling ChatCompletion API:', error);
        }
    };

    return (
        <div className="homePage">
            <UnauthenticatedTemplate>
                <h5 className="unauthmessage">
                    ログインしてください
                </h5>
            </UnauthenticatedTemplate>

            <AuthenticatedTemplate>
                <div className="postContainer">
                    <h1>Open AI Chat Demo</h1>
                    <div className="inputPost">
                        <div>聞きたい内容を入れてください</div>
                        <input type="text" placeholder="例. お勧めの春野菜レシピを教えて" onChange={(e => setQuery(e.target.value))} />
                    </div>
                    <button className="postButton" onClick={requestOpenAiChat}>投稿する</button>

                    <div className="inputPost">
                        <div>Open AIからの返答</div>
                        <div className="responseTextWrapper">
                            <textarea
                                type="text"
                                placeholder="返答が表示されます"
                                value={responseText}
                                readOnly
                            />
                            {isLoading &&
                                <div className="loading-icon">
                                    <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </AuthenticatedTemplate>
        </div>

    )
};

export default Home