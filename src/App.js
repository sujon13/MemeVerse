import React, {useState} from 'react';
import Signin from './authentication/Signin';
import SignUp from './authentication/Signup';
import Newsfeed from './home/Newsfeed';
import PasswordReset from './authentication/PasswordReset';

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';

const App = () => {
    const [user, setUser] = useState({});
    const [accessToken, setAccessToken] = useState('');

    function handleUser(data) {
        const localUser = data.profile;
        localUser.profilePic = data.profile.name;
        setUser(localUser);
        setAccessToken(data.accessToken);
    }

    return(
        <Router>
            <div>
                <Switch>
                    <Route path="/signin">
                        <Signin handleUser = {handleUser}/>
                    </Route>
                    <Route path="/signup" exact>
                        <SignUp />
                    </Route>
                    <Route path="/" exact>
                        <Newsfeed />
                    </Route>
                    <Route path="/home" exact>
                        <Newsfeed/>
                    </Route>
                    <Route path="/password" exact>
                        <PasswordReset/>
                    </Route>
                </Switch>
            </div>
            
        </Router>
    );
}

export default App;
