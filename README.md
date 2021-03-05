# Fresh meat

팔고 싶은 상품을 경매로 사고팔 수 있도록 중개해 주는 서비스

---

## Table of Contents

- [General Info](#general-Info)
- [Schema](#schema)
  - [User](#user)
  - [Product](#product)
  - [File](#file)
- [API](#api)
  - [Query](#query)
  - [Mutation](#mutation)
- [Unit Test](#unit-test)
  - [User Service](#user-service)
  - [Product Service](#product-service)
  - [File Service](#file-service)
  - [Coverage](#coverage)
- [Memo](#memo)

---

## General Info

프레임워크로 <a href="https://nestjs.com/" target="_blank">NestJS</a>를 사용해서 <a href="https://graphql.org/" target="_blank">GraphQL</a> API를 구현했습니다. 데이터베이스로 <a href="https://www.postgresql.org/" target="_blank">PostgreSQL</a>을 사용하고 ORM은 <a href="https://typeorm.io/#/" target="_blank">TypeORM</a>을 사용했습니다. Session Storage로 사용하는 <a href="https://redis.io/" target="_blank">Redis</a>에 로그인한 사용자의 정보를 저장합니다.

---

## Schema

하나의 `User`는 여러 개의 `sellingProducts`와 `1:N` 관계이고, `biddingProducts`와도 마찬가지로 `1:N` 관계입니다. `Product` 경매(거래) 진행 상태를 나타내는 `Progress`는 `Waiting`, `InProgress`, `Closed`, `Paid`, 그리고 `Completed` 중 하나입니다. 또한 `Product`는 하나의 이미지로써 `File`와 1:1 관계입니다.

### User

```User Entity
type User {
  id: Float!

  createdAt: DateTime!

  updatedAt: DateTime!

  username: String!

  email: String!

  password: String!

  // OneToMany
  sellingProducts: [Product!]

  // OneToMany
  biddingProducts: [Product!]
}

```

### Product

```Product Entity
type ProductObjectType {
  id: Float!

  createdAt: DateTime!

  updatedAt: DateTime!

  productName: String!

  description: String

  // OneToOne
  picture: File

  // ManyToOne
  seller: User!

  // ManyToOne
  bidder: User

  startPrice: Float!

  bidPrice: Float

  remainingTime: DateTime

  progress: Progress!
}
```

### File

```File Entity
type FileObjectType {
  id: Float!

  createdAt: DateTime!

  updatedAt: DateTime!

  // OneToOne
  product: Product!

  url: String!

  key: String!

  fileName: String!
}
```

---

## API

### Query

_Note: 별도로 `Public`을 명시하지 않은 API는 `login`한 유저만 요청할 수 있습니다._

**me**
현재 로그인되어있는 유저의 정보를 요청

- query

```me query
query {
  me {
    username
    email
    sellingProducts {
      productName
      progress
    }
    biddingProducts {
      productName
      progress
    }
  }
}
```

- variables
  _no variables_

**userDetail**
_Note: Public Query_
유저 한명의 정보와 `progress`가 `Waiting`이거나 `InProgress`인 그 유저가 업로드한 `product`를 요청

- query

```userDetail
query userDetail ($input: UserDetailDto!) {
  userDetail(input: $input) {
    ok
    error
    user {
      email
      username
    }
    inProgress {
      productName
    }
    waiting {
      productName
      startPrice
      progress
    }
  }
}
```

- variables

```userDetail_varialbles
{
  "input": {
    "userId": 1
  }
}
```

**myProfile**
`progress`가 `Paid`이거나 `Closed`이거나 `Completed`인 유저가 업로드한 `uploadedProduct`와 유저가 `bidding`한 `product`를 요청

- query

```myProfile
query {
  myProfile {
    ok
    error
    uploadedProduct {
      id
      productName
    }
    inProgressProduct {
      id
      productName
    }
    closedProduct {
      id
      productName
    }
    paidProduct {
      id
      productName
    }
    completedProduct {
      id
      productName
    }
  }
}
```

- variables
  _no variables_

**productDetail**
_Note: Public Query_
`product`의 정보와 `seller`, `bidder`의 정보를 요청

- query

```productDetail
query productDetail ($input: ProductDetailDto!) {
  productDetail (input: $input) {
    ok
    error
    product {
      id
      productName
      startPrice
      picture {
        url
      }
      seller {
        username
      }
      bidder {
        username
      }
    }
  }
}
```

- variables

```productDetail_variables
{
  "input": {
    "productId": 1
  }
}
```

**getWaitingProducts**
_Note: Public Query_

- query

```getWaitingProducts
query getWaitingProducts ($input: GetAllProductsDto!) {
  getWaitingProducts (input: $input) {
    ok
    error
    maxPage
    products {
      id
      productName
      picture {
        url
      }
    }
  }
}
```

- variables

```getWaitingProducts_variables
{
  "input": {
    "page": 1
  }
}
```

**getInProgressProducts**
_Note: Public Query_

- query

```getInProgressProducts
query getWaitingProducts ($input: GetAllProductsDto!) {
  getWaitingProducts (input: $input) {
    ok
    error
    maxPage
    products {
      id
      productName
      picture {
        url
      }
    }
  }
}
```

- variables

```getInProgressProducts_variables
{
  "input": {
    "page": 1
  }
}
```

### Mutation

**createUser**
_Note: Public Mutation_

- query
- variables

**login**
_Note: Public Mutation_

- query
- variables

**logout**
_Note: Public Mutation_

- query
- variables

**updateUser**

- query
- variables

**deleteUser**

- query
- variables

**uploadProduct**

- query
- variables

**deleteProduct**

- query
- variables

**editProduct**

- query
- variables

**editProgress**

- query
- variables

**createBidding**

- query
- variables

**updateBidding**

- query
- variables

**uploadImage**

- query
- variables

---

## Unit Test

유닛 테스트를 위해 자바스크립트 테스팅 프레임워크인 <a href="https://jestjs.io/" target="_blank">Jest</a>를 사용했습니다.

### User Service

<img src="./images/user-service-unit-test.png" />

### Product Service

<img src="./images/product-service-unit-test.png" />

### File Service

<img src="./images/file-service-unit-test.png" />

### Coverage

<img src="./images/unit-test-coverage.png" />

---

</br>
<div style="text-align:center">
  <img src="./images/upload-image-postman.png" />
</div>
<div style="text-align:center">
  <span style="font-weight:bold">
    uploadImage test using postman
  </span>
</div>

---

## Memo

#### **Issue #1**

Set-cookie not working when executing login mutation in playground

**Solution**
In playground "request.credentials": `"omit"` &rarr; `"same-origin"`

---

#### **Issue #2**

In updateUser the hashed password is hashed again during `updateUser`

**Solution**
Update `user.entity.ts`

```
...
  @Column({ select: false })
  @Field((type) => String)
  @IsString()
  @Length(8)
  password: string;

```

---

#### **Issue #3**

Can't read session type during unit test

**Solution**
Update `SessionData` of `express-session` in `common.interface.ts` and delete `ISession`

```
...
declare module 'express-session' {
  interface SessionData extends session.Session {
    user?: User;
  }
}
```

---

#### **Issue #4**

Cookie is set in the frontend but cannot be read

**Solution**

Update `express-session` setting in `main.ts` like:

```
  app.use(
    session({
      ...
      cookie: {
        ...
        domain:
          process.env.NODE_ENV === 'production' ? process.env.DOMAIN : null,
      },
    }),
  );
```

docs: https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Set-Cookie
