export default [
  {
    id: 'gpgMine',
    banner: [
      {
        id: 'game_44',
        label: 'Tomorrow Star DJ2',
        tips: 'Dance to the beat',
        btn: 'Watch',
        bg: {
          pc: process.env.VUE_APP_IMG_URL + '/img/banner/bg_game_44_pc.jpg',
          mobile: process.env.VUE_APP_IMG_URL + '/img/banner/bg_game_44_mo.jpg',
        },
        link: {
          type: 'router',
          router: {
            name: 'game/detail',
            params: { gameID: '44' },
          },
        },
      },
      {
        id: 'game_55',
        label: 'ZEUS',
        tips: 'Play like GOD',
        btn: 'PLAY',
        bg: {
          pc: process.env.VUE_APP_IMG_URL + '/img/banner/bg_game_55_pc.jpg',
          mobile: process.env.VUE_APP_IMG_URL + '/img/banner/bg_game_55_mo.jpg',
        },
        link: {
          type: 'router',
          router: {
            name: 'game/detail',
            params: { gameID: '55' },
          },
        },
      },
      {
        id: 'treasure',
        label: 'Treasure-digging pets have their own abilities.',
        tips: 'gift is coming',
        btn: 'GO',
        bg: {
          pc: process.env.VUE_APP_IMG_URL + '/img/banner/bg_event_202301_c_pc.jpg',
          mobile: process.env.VUE_APP_IMG_URL + '/img/banner/bg_event_202301_c_mo.jpg',
        },
        link: {
          type: 'router',
          router: {
            name: 'game/detail',
            params: { gameID: '5001' },
          },
        },
      },
     {
        id: 'eden_102',
        tips: 'The game is on you',
        label: 'inPoker',
        btn: 'PLAY',
        bg: {
          pc: process.env.VUE_APP_IMG_URL + '/img/banner/bg_event_eden102_2_pc.jpg',
          mobile: process.env.VUE_APP_IMG_URL + '/img/banner/bg_event_eden102_2_mo.jpg',
        },
        link: {
          type: 'router',
          router: {
            name: 'game/detail',
            params: { gameID: '1000' },
          },
        },
      },
      {
        id: 'game_5522',
        label: 'Thunder Hammer',
        tips: 'Game on. Power up',
        btn: 'PLAY',
        bg: {
          pc: process.env.VUE_APP_IMG_URL + '/img/banner/bg_game_5522_pc.jpg',
          mobile: process.env.VUE_APP_IMG_URL + '/img/banner/bg_game_5522_mo.jpg',
        },
        link: {
          type: 'router',
          router: {
            name: 'game/detail',
            params: { gameID: '5522' },
          },
        },
      },
      {
        id: 'game_5519',
        label: 'Fortune Diamonds',
        tips: 'Play to win',
        btn: 'PLAY',
        bg: {
          pc: process.env.VUE_APP_IMG_URL + '/img/banner/bg_game_5519_pc.jpg',
          mobile: process.env.VUE_APP_IMG_URL + '/img/banner/bg_game_5519_mo.jpg',
        },
        link: {
          type: 'router',
          router: {
            name: 'game/detail',
            params: { gameID: '5519' },
          },
        },
      },
      {
        id: 'game_5520',
        label: 'Funny Fruit',
        tips: 'Ready, set, play！',
        btn: 'PLAY',
        bg: {
          pc: process.env.VUE_APP_IMG_URL + '/img/banner/bg_game_5520_pc.jpg',
          mobile: process.env.VUE_APP_IMG_URL + '/img/banner/bg_game_5520_mo.jpg',
        },
        link: {
          type: 'router',
          router: {
            name: 'game/detail',
            params: { gameID: '5520' },
          },
        },
      },
      {
        id: 'game_5516',
        label: 'Gems Wheel',
        tips: 'Play like a champion.',
        btn: 'PLAY',
        bg: {
          pc: process.env.VUE_APP_IMG_URL + '/img/banner/bg_game_5516_pc.jpg',
          mobile: process.env.VUE_APP_IMG_URL + '/img/banner/bg_game_5516_mo.jpg',
        },
        link: {
          type: 'router',
          router: {
            name: 'game/detail',
            params: { gameID: '5516' },
          },
        },
      },
    ],
    activity: {
      progress: [
        {
          id: 'ani_event202112',

          tips: '超激推薦',
          type: 'game',
          title: '朋友們都在玩的德州撲克',
          sub: '入桌配對',
          lottie: '/2021dec/ani_event202112_03.json',
          bgColor: '#C4B26A',
          action: {
            type: 'game',
            gameID: 1000,
          },
        },
        {
          id: 'ani_event202111_03',
          tips: '本月推廣',
          title: '簡單玩法，等你挑戰',
          sub: '馬上嘗試',
          // lottie: '/2022-jan-weekend/ani_e202202_4.json',
          lottie: '/2021nov/ani_event202111_03.json',
          bgColor: '#5e3f28',
          action: {
            type: 'game',
            gameID: 35,
          },
        },
      ],
    },
    deadline: {
      start: '2000-01-01T06:00:00+08:00',
      end: '2100-12-31T23:59:59+08:00',
    },
  },
].map(item => {
  return {
    version: 'japan',
    ...item,
  }
})
