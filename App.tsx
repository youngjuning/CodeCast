import React from 'react';
import {View, Button} from 'react-native';
import {authorize} from 'react-native-app-auth';

const config = {
  redirectUrl: 'com.codecast://oauthredirect',
  scopes: ['user', 'repo'],
  additionalHeaders: {Accept: 'application/json'},
  clientId: '',
  clientSecret: '',
  serviceConfiguration: {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint:
      'https://github.com/settings/connections/applications/Ov23li74mEHJYGmKLnnO',
  },
};

function App(): React.JSX.Element {
  const handleLogin = async () => {
    try {
      const result = await authorize(config);
      if (result.accessToken) {
        console.log('Access Token:', result.accessToken);
      }
      // result includes accessToken, accessTokenExpirationDate and refreshToken
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button title="GitHub" onPress={() => handleLogin()} />
    </View>
  );
}

export default App;
