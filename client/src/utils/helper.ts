import { io, Socket } from 'socket.io-client';

const getDeviceType = (userAgent: any) => {
  switch (true) {
    case /Android/.test(userAgent):
      return { mobile: true, device: 'Android' };
    case /iPhone/.test(userAgent):
      return { mobile: true, device: 'iPhone' };
    case /Macintosh/.test(userAgent):
      return { mobile: false, device: 'Macintosh' };
    case /Windows/.test(userAgent):
      return { mobile: false, device: 'Windows' };
    case /Linux/.test(userAgent) && !/Android/.test(userAgent):
      return { mobile: false, device: 'Linux' };
    default:
      return { mobile: false, device: 'Unknown Device Type' };
  }
};

const dateFormatter = (date: Date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getGreeting = () => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  let greeting;

  switch (true) {
    case currentHour < 5:
      greeting = 'Kamu Tidak Tidur';
      break;
    case currentHour >= 5 && currentHour < 10:
      greeting = 'Selamat Pagi';
      break;
    case currentHour >= 10 && currentHour < 15:
      greeting = 'Selamat Siang';
      break;
    case currentHour >= 15 && currentHour < 18:
      greeting = 'Selamat Sore';
      break;
    case currentHour >= 18 && currentHour < 22:
      greeting = 'Selamat Malam';
      break;
    default:
      greeting = 'Pukul Berapa Ini';
  }

  return greeting;
};

let socket: Socket;
const socketConnection = () => {
  const Server_URL = import.meta.env.VITE_BACKEND;
  if (!socket) {
    socket = io(Server_URL, {
      transports: ['websocket'],
    });
    socket.connect();
  }
  return socket;
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

const originalStyle = {
  weight: 2,
  color: 'black',
  dashArray: '3',
  fillColor: 'transparent',
};

const highlightFeature = (e: any) => {
  const layer = e.target;
  layer.setStyle({
    weight: 4,
    color: '#f9844d',
  });
  layer.bringToFront();
};

const resetHighlight = (e: any) => {
  const layer = e.target;
  layer.setStyle(originalStyle);
};

const onEachFeature = (feature: any, layer: any, zoomToFeature: any) => {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: (e: any) => {
      zoomToFeature(e, feature);
    },
  });
};

export {
  dateFormatter,
  getGreeting,
  getDeviceType,
  socketConnection,
  disconnectSocket,
  originalStyle,
  highlightFeature,
  resetHighlight,
  onEachFeature,
};
