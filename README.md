# flay-js

directory

-   bin

    node를 기동하기 위한 env가 저장되는 www script가 포함되어 있다.<br>
    www는 node를 기동하기 위한 port 등을 정의하며, node 기동시 사용되는 script로 활용된다.<br>
    ex - node 기동방법 : <code>node ./bin/www</code><br>
    nodemon 이용: <code>nodemon ./bin/www</code>

-   public

    static 파일이 위치하는 공간이다.<br>
    express에서 제공하는 `express.static`을 통해 위치를 저장할 수 있으며,<br>
    기본 default로는 package경로 하위의 public directory를 사용한다.<br>
    대체로 css, html, img 등이 위치한다.

-   routes

    라우팅 관련된 JavaScript가 저장되는 공간이다.<br>
    NodeJS는 Router를 구분하여 API를 제공하는 JavaScript와 Routing을 제공하는 JavaScript를 독립적으로 관리 할 수 있도록 한다.

-   views

    views에는 Frontend 기술을 적용하는 view page가 저장된다.<br>
    앞서 express sample 생성시 입력한 -e의 경우 ejs project를 생성하며, --pug 입력 시 pug가 생성된다.

-   app.js

    app.js가 node를 통해 기동될 경우 참조하는 미들웨어를 정의한다.<br>
    또한, 각종 init 정보를 초기화한다. 또한 index.js(router) 위치를 지정하고, router의 유입점으로써의 역할을 한다.

-   package.json

    npm dependencies에 대한 정보를 저장한다.<br>
    npm install을 통해 일괄 적용할 수 있다.

-   app.locals
    자바스크립트 객체이고, 프로퍼티들은 애플리케이션 내의 지역 변수들이다.
    애플리케이션의 라이프 타임 동안 유효하다.
-   req.app.locals
    미들웨어에서 app의 지역 변수들을 사용할 수 있게 해준다.
-   res.locals
    request의 라이프 타임 동안에만 유효하다.
    html/view 클라이언트 사이드로 변수들을 보낼 수 있으며, 그 변수들은 오로지 거기서만 사용할 수 있다.

ref. http://expressjs.com/en/4x/api.html

    "morgan": "~1.9.1",
    "to": "^0.2.9",
    "update": "^0.7.4"
