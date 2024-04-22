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
      greeting = 'Selamat Malam';
  }

  return greeting;
};

export { dateFormatter, getGreeting };
