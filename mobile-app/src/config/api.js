import { Platform } from 'react-native';

const getDevelopmentUrl = async () => {
  try {
    const response = await fetch('http://localhost:4040/api/tunnels');
    const data = await response.json();
    
    if (data.tunnels?.length > 0) {
      const httpsUrl = data.tunnels.find(tunnel => tunnel.proto === 'https');
      if (httpsUrl) {
        console.log('Using ngrok tunnel:', httpsUrl.public_url);
        return httpsUrl.public_url;
      }
    }
  } catch (error) {
    console.log('Ngrok unavailable, using local network');
  }
  
  const localUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://10.0.0.173:5001';
  console.log('Using local network:', localUrl);
  return localUrl;
};

export const getApiConfig = async () => {
  if (__DEV__) {
    const baseUrl = await getDevelopmentUrl();
    return {
      API_URL: `${baseUrl}/api`,
      SOCKET_URL: baseUrl
    };
  }
  
  return {
    API_URL: 'https://hunting-comm-api.herokuapp.com/api',
    SOCKET_URL: 'https://hunting-comm-api.herokuapp.com'
  };
};
