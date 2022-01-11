import Vue from 'vue'
import Router from 'vue-router'

const home = resolve => require(['@/pages/home.vue'], resolve);
Vue.use(Router)

const router = new Router({
  //mode: 'history',
  routes: [{
      path: '/login',
      name: 'login',
      component: resolve => require(['@/pages/login.vue'], resolve),
    }, {
      path: '/Index',
      name: 'Index',
      components: {
        default: home,
        home: resolve => require(['@/pages/index/Index'], resolve),
      },
    },{
      path: '/microMap',//微地图
      name: 'microMap',
      components: {
        default: home,
        home: resolve => require(['@/pages/microMap/index.vue'], resolve),
      },
	  meta:{
		alone:true
	  }
    }, {
      path: '/PersonnelControl',
      name: 'PersonnelControl',
      components: {
        default: home,
        home: resolve => require(['@/pages/personnelcontrol/PersonnelControl.vue'], resolve),
      },
      meta: {
        requireAuth: true
      }
    }, {
      path: '/SchoolLife',
      name: 'SchoolLife',
      components: {
        default: home,
        home: resolve => require(['@/pages/schoollife/SchoolLife.vue'], resolve),
      },
      meta: {
        requireAuth: true
      }
    }, {
      path: '/EmergencySafeguard',
      name: 'EmergencySafeguard',
      components: {
        default: home,
        home: resolve => require(['@/pages/emergency/Emergency.vue'], resolve),
      },
      meta: {
        requireAuth: true
      }
    }, {
      path: '/Campussecurity',
      name: 'Campussecurity',
      components: {
        default: home,
        home: resolve => require(['@/pages/campussecurity/campussecurity.vue'], resolve),
      },
      meta: {
        requireAuth: true
      }
    }, {
      path: '/TrafficRegulation',
      name: 'CarSupervision',
      components: {
        default: home,
        home: resolve => require(['@/pages/carsupervision/carSupervision.vue'], resolve),
      },
      meta: {
        requireAuth: true
      }
    }, {
      path: '/FireMintenance',
      name: 'FireMaintenance',
      components: {
        default: home,
        home: resolve => require(['@/pages/fireMaintenance/fireMaintenance.vue'], resolve),
      },
      meta: {
        requireAuth: true
      }
    }, {
      path: '/SchoolFire',
      name: 'SchoolFire',
      components: {
        default: home,
        home: resolve => require(['@/pages/schoolFire/schoolFire.vue'], resolve),
      },
      meta: {
        requireAuth: true
      }
    }, {
      path: '/SecurityMintenance',
      name: 'SecurityMaintenance',
      components: {
        default: home,
        home: resolve => require(['@/pages/securityMaintenance/securityMaintenance.vue'], resolve),
      },
      meta: {
        requireAuth: true
      }
    }, {
      path: '/EnergyRegulation',
      name: 'EnergyRegulation',
      components: {
        default: home,
        home: resolve => require(['@/pages/EnergyRegulation/energyRegulation.vue'], resolve),
      },
      meta: {
        requireAuth: true
      }
    }, {
      path: '/Welcome',
      name: 'Welcome',
      components: {
        default: home,
        home: resolve => require(['@/pages/welcome/welcome.vue'], resolve),
      },
      meta: {
        requireAuth: true
      }
    }, {
      path: '/LeaveSchool',
      name: 'LeaveSchool',
      components: {
        default: home,
        home: resolve => require(['@/pages/leaveSchool/leaveSchool.vue'], resolve),
      },
      meta: {
        requireAuth: true
      }
    }, {
      path: '/Capital',
      name: 'Capital',
      components: {
        default: home,
        home: resolve => require(['@/pages/Capital/Capital.vue'], resolve),
      },
      meta: {
        requireAuth: true
      }
    }, {
      path: '/FoodSafety',
      name: 'FoodSafety',
      components: {
        default: home,
        home: resolve => require(['@/pages/foodSafety/foodSafety.vue'], resolve),
      },
      meta: {
        requireAuth: true
      }
    }, {
      path: '/EnergySafety',
      name: 'EnergySafety',
      components: {
        default: home,
        home: resolve => require(['@/pages/energySafety/energySafety.vue'], resolve),
      },
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/citylevel',
      name: 'citylevel',
      component: resolve => require(['@/city/citylevel/citylevel.vue'], resolve),
      meta: {
        requireAuth: false
      }
    }, {
      path: '/chinaMap',
      name: 'chinaMap',
      component: resolve => require(['@/chinaMap/components/china.vue'], resolve),
      meta: {
        requireAuth: false
      }
    }, {
      path: '/districtIndex',
      name: 'districtIndex',
      component: resolve => require(['@/city/district/districtIndex.vue'], resolve),
      meta: {
        requireAuth: false
      }
    }, {
      path: '/DataSafty',
      name: 'DataSafty',
      components: {
        default: home,
        home: resolve => require(['@/pages/dataSafty/dataSafty.vue'], resolve),
      },
      meta: {
        requireAuth: true
      }
    }, {
      path: '/Shelter',
      name: 'Shelter',
      components: {
        default: home,
        home: resolve => require(['@/pages/shelter/shelter.vue'], resolve),
      },
    },
    {
      path: '/elecSafety',
      name: 'elecSafety',
      components: {
        default: home,
        home: resolve => require(['@/pages/electricitySafety/electricitySafety.vue'], resolve),
      },
    }

  ]
})
let TOKEN = window.TOKEN;
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth == true) {
    if (TOKEN != null) {
      if (to.name == null) {
        next({
          path: '/Index'
        });
      }
      next();
    } else {
      if (to.name == null) {
        next({
          path: '/login'
        });
      }
      next();
    }
  } else {
    if (to.name == null) {
      next({
        path: '/login'
      });
    }
    next();
  }
  next();
})

export default router
