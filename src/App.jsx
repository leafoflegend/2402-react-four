import { useState, useEffect } from 'react';

function App() {
    const [valid, setValid] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [token, setToken] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        if (!token) {
            return;
        }

        const authenticateUser = async () => {
            try {
                const response = await fetch('https://fsa-jwt-practice.herokuapp.com/authenticate', {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    },
                );

                const responseData = await response.json();

                setLoggedInUser(responseData.data.username);
            } catch (e) {
                console.error(`Failed to retrieve currently logged in user.`);
            }
        };

        authenticateUser();
    }, [token])

    const handleUsernameChange = (e) => {
        let nextUsername = e.target.value;

        if (nextUsername.includes(' ')) {
            setValid(false);
        } else {
            setValid(true);
        }

        setUsername(nextUsername);
    };

    const handlePasswordChange = (e) => {
        let nextPassword = e.target.value;

        setPassword(nextPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!valid) {
            alert(`Your current username "${username}" is invalid. Spaces are not allowed in usernames.`);
            return;
        }

        try {
            const response = await fetch('https://fsa-jwt-practice.herokuapp.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const responseData = await response.json();

            setToken(responseData.token);
        } catch (e) {
            console.error('Failed to Sign Up!');
            console.error(e);
        }
    }

    return (
        <>
            {
                !token
                    ? (
                        <>
                            <h1>Sign Up</h1>
                            <form
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    border: 'solid 3px black',
                                    padding: '1em',
                                }}
                                onSubmit={handleSubmit}
                            >
                                <label style={{color: !valid ? 'red' : 'black'}}>
                                    Username:
                                    <input
                                        value={username}
                                        onChange={handleUsernameChange}
                                    />
                                </label>
                                <label>
                                    Password:
                                    <input
                                        type={passwordVisibility ? '' : 'password'}
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPasswordVisibility(!passwordVisibility)
                                        }}
                                    >
                                        👁️
                                    </button>
                                </label>
                                <button type={'submit'}>Sign Up</button>
                            </form>
                        </>
                    ) : (
                        <div>
                            <h3>You are logged in as: {loggedInUser}</h3>
                        </div>
                    )
            }
        </>
    );
}

export default App
