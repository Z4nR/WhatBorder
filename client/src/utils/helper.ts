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

  if (currentHour < 5) {
    greeting = 'Kamu Tidak Tidur';
  } else if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Selamat Pagi';
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Selamat Siang';
  } else if (currentHour >= 17 && currentHour < 20) {
    greeting = 'Selamat Sore';
  } else {
    greeting = 'Selamat Malam';
  }

  return greeting;
};

export { dateFormatter, getGreeting };
