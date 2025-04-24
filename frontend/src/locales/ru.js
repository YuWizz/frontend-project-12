export default {
  translation: {
    buttons: {
      login: 'Войти',
      logout: 'Выйти',
      signup: 'Зарегистрироваться',
      submit: 'Отправить',
      add: '+',
      rename: 'Переименовать',
      remove: 'Удалить',
      cancel: 'Отменить',
    },
    toasts: {
      addChannelSuccess: 'Канал создан',
      renameChannelSuccess: 'Канал переименован',
      removeChannelSuccess: 'Канал удалён',
      networkError: 'Ошибка соединения',
    },
    errors: {
      required: 'Обязательное поле',
      usernameLength: 'От 3 до 20 символов',
      passwordLength: 'Не менее 6 символов',
      passwordsMustMatch: 'Пароли должны совпадать',
      channelUnique: 'Должно быть уникальным',
      profanityDetected: 'Недопустимая лексика',
      invalidCredentials: 'Неверные имя пользователя или пароль',
      userExists: 'Такой пользователь уже существует',
      connection: 'Ошибка соединения',
      unknown: 'Неизвестная ошибка',
    },
    loading: 'Загрузка...',
    notFound: {
      title: '404 - Страница не найдена',
      message: 'Извините, запрошенная вами страница не существует.',
      goHome: 'Перейти на главную',
    },
    navbar: {
      brand: 'Hexlet Chat',
      loggedInAs: 'Вы вошли как: {{username}}',
    },
    login: {
      title: 'Войти',
      usernameLabel: 'Ваш ник',
      passwordLabel: 'Пароль',
      noAccount: 'Нет аккаунта?',
      signupLink: 'Регистрация',
    },
    signup: {
      title: 'Регистрация',
      usernameLabel: 'Имя пользователя',
      usernamePlaceholder: 'От 3 до 20 символов',
      passwordLabel: 'Пароль',
      passwordPlaceholder: 'Не менее 6 символов',
      confirmPasswordLabel: 'Подтвердите пароль',
      confirmPasswordPlaceholder: 'Пароли должны совпадать',
    },
    chat: {
      channelsHeader: 'Каналы',
      messagesCount_one: '{{count}} сообщение',
      messagesCount_few: '{{count}} сообщения',
      messagesCount_many: '{{count}} сообщений',
      newMessagePlaceholder: 'Введите сообщение...',
      newMessageAriaLabel: 'Новое сообщение',
      sendMessage: 'Отправить',
      channelControl: 'Управление каналом',
    },
    modals: {
      addChannel: {
        title: 'Добавить канал',
        label: 'Имя канала',
      },
      renameChannel: {
        title: 'Переименовать канал',
        label: 'Новое имя',
      },
      removeChannel: {
        title: 'Удалить канал',
        confirm: 'Уверены?',
      },
    }
  }
};
