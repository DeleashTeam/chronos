## Entitites

| User         | -   | Calendar   | -   | Message   | -   | Event       |                                        |
| ------------ | --- | ---------- | --- | --------- | --- | ----------- | -------------------------------------- |
| login        | -   | createdAt  | -   | createdAt | -   | name        |                                        |
| authId       | -   | name       | -   | creator   | -   | creator     |                                        |
| name         | -   | calendarId | -   | content   | -   | appointedAt |                                        |
| passwordHash | -   | events     | -   |           | -   | createdAt   |                                        |
| email        | -   | users      | -   |           | -   | type        | [arrangement, holiday, reminder, task] |
| createdAt    | -   | admins     | -   |           | -   | color       | enum of colors (e.g. Google)           |
|              | -   |            | -   |           | -   | messages    | [arrangment, holiday, reminder]        |
|              | -   |            | -   |           | -   | users       | [arrangment, holiday, reminder]        |
|              | -   |            | -   |           | -   | executor    | task                                   |
|              | -   |            | -   |           | -   | eventId     |                                        |  |

## Features
- custom general events

## Subscription
- number of calendars
- no ads with global events

## TODO
 - reset password (ssr)
 - on event creation fill calendar events depending on params (e.g. {month, 3})

## Endpoints
| Endpoint                            | Query                                                                                                         | Body                                                                                                                    | Auth  | Description                |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----- | -------------------------- |
| GET api/calendars                   | {<br>  page,<br>  pageSize = 5,<br>  filter (userCreated,<br>  calendarName),<br>  sort(createdAt, date)<br>} |                                                                                                                         | TRUE  |                            |
| GET api/calendars/:id               |                                                                                                               |                                                                                                                         | TRUE  |                            |
| POST api/calendars                  |                                                                                                               | { name }                                                                                                                | TRUE  |                            |
| DELETE api/calendars/:id            |                                                                                                               |                                                                                                                         | TRUE  |                            |
| PATCH api/calendars/:id             |                                                                                                               | { name }                                                                                                                | TRUE  |                            |
| POST api/calendars/:id/event        |                                                                                                               | {<br>  name,<br>  color,<br>  type,<br>  duration,<br>  frequency - {range, count},<br>  executor,<br> appointedAt<br>} | TRUE  |                            |
| POST api/calendars/:id/user         |                                                                                                               | { logins }                                                                                                              |       |                            |
| DELETE api/calendars/:id/user       |                                                                                                               | { logins }                                                                                                              |       |                            |
| EVENTS                              |
| GET api/events                      | {name, type, range}                                                                                           |                                                                                                                         | TRUE  |                            |
| GET api/events/:id                  |                                                                                                               |                                                                                                                         |       |                            |
| PATCH api/events/:id                |                                                                                                               | {<br>  name,<br>  color,<br>  type,<br>  duration,<br>  frequency - {range, count},<br>  executor,<br> appointedAt<br>} | TRUE  |                            |
| DELETE api/events/:id               |                                                                                                               |                                                                                                                         | TRUE  |                            |
| POST api/events/:id/user            |                                                                                                               | { logins }                                                                                                              | TRUE  |                            |
| DELETE api/events/:id/user          |                                                                                                               | { logins }                                                                                                              | TRUE  |                            |
| LOGIN                               |
| POST api/auth/login                 |                                                                                                               | { email, password }                                                                                                     | TRUE  |                            |
| POST api/auth/register              |                                                                                                               | {<br>  login,<br>  email,<br>  password,<br>  confirmPassword,<br>  name?,<br>}<br>                                     | TRUE  |                            |
| GET api/auth/reset-password         |                                                                                                               | { email }                                                                                                               | FALSE |                            |
| POST api/auth/reset-password/:token |                                                                                                               | { password, confirmPassword}                                                                                            | FALSE |                            |
| GET api/auth/reset-password/:token  |                                                                                                               |                                                                                                                         | FALSE | Return password reset form |
| USERS                               |
| PATCH api/users/:login              |                                                                                                               | {login, name, email}                                                                                                    | TRUE  |                            |
| PATCH api/users/:login/avatar       |                                                                                                               | {avatar}                                                                                                                | TRUE  |                            |
| GET api/users                       | { login }                                                                                                     |                                                                                                                         | TRUE  |                            |
| GET api/user/:login                 |                                                                                                               |                                                                                                                         | TRUE  |                            |  |
