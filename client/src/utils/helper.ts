import { message } from 'antd';
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

const colors = ['red', 'blue', 'green', 'orange', 'purple'];
const colorTransferMap = (index: number) => colors[index % colors.length]; // Cycle colors for border

const highlightFeature = (e: any) => {
  const layer = e.target;

  // Highlight the feature with a new style
  layer.setStyle({
    weight: 4,
    color: '#f9844d',
  });

  // Bring the layer to the front to emphasize
  layer.bringToFront();
};

const resetHighlight = (e: any) => {
  const layer = e.target;

  // Reset the style back to its original style
  layer.setStyle(layer.defaultOptions);
};

const onEachFeature = (feature: any, layer: any, zoomToFeature: any) => {
  // Save the original style to the layer's options
  layer.defaultOptions = { ...layer.options };

  layer.on({
    mouseover: highlightFeature, // Highlight on hover
    mouseout: resetHighlight, // Reset on mouseout
    click: (e: any) => {
      zoomToFeature(e, feature); // Handle click for zoom
    },
  });
};

const shareLink = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.info('Tautan berhasil disalin ke clipboard!');
      })
      .catch((err) => {
        message.error('Gagal menyalin tautan: ', err);
      });
  } else {
    message.error('Clipboard API tidak mendukung peramban versi ini.');
  }
};

export {
  dateFormatter,
  getGreeting,
  getDeviceType,
  socketConnection,
  disconnectSocket,
  originalStyle,
  colorTransferMap,
  highlightFeature,
  resetHighlight,
  onEachFeature,
  shareLink,
};
