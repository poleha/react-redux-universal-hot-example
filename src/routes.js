import React from 'react';
//React
import {IndexRoute, Route} from 'react-router';
//React router
import { isLoaded as isAuthLoaded, load as loadAuth } from './redux/modules/auth';
//isLoaded - функция, проверяющая, загружен ли пользователь(получает глобальный state)
//load - функция, возвращающая
/*
return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/loadAuth')
};
*/


//Импортируем контейнеры
import {
    App,
    Chat,
    Home,
    Widgets,
    About,
    Login,
    LoginSuccess,
    Survey,
    NotFound,
  } from './containers';



//Экспортируем функцию. Она получает store и возвращает routes. То есть элемент Route и вложенные.
export default (store) => {
  //Это функция для проверки onEnter(nextState, replace, callback?)
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
        //user = store.getState().auth.user
      if (!user) {
        // oops, not logged in, so can't be here!
        replace('/');
      }
      cb();
      //Если установлен колбек, то выполняем его после выполнения асинхронной функции. То есть мы перебираем все OnEnter
      //И после перебора всех запускаем enter. То есть cb() это по сути как раз вход.
    }

    if (!isAuthLoaded(store.getState())) { //Если не залогинен(это функция, получающая globalState)
      store.dispatch(loadAuth()).then(checkAuth);
     //Тогда dispatch загрузка пользователя и потом checkAuth
    } else {
      checkAuth();
        //Иначе(если загрузен пользователь), сразу checkAuth
    }
  };


  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Home}/>

      { /* Routes requiring login */ }
      <Route onEnter={requireLogin}>
        <Route path="chat" component={Chat}/>
        <Route path="loginSuccess" component={LoginSuccess}/>
      </Route>

      { /* Routes */ }
      <Route path="about" component={About}/>
      <Route path="login" component={Login}/>
      <Route path="survey" component={Survey}/>
      <Route path="widgets" component={Widgets}/>

      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
