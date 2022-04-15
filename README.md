This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Swan Song

The purpose of this project is to create a full-stack application that displays pre-defined content and allows people
to register as users to comment and rate that content. In addition, it has the following unique features:

1. It ensures that all users are a part of the same organization. (To prevent bot spam)
2. It prevents users from creating multiple accounts. (To enforce bans from excessive shitposting)
3. It guarantees complete anonymity for all users. (To protect privacy)

## Setup

```bash
yarn install
yarn dev
```

## Sign-up flow and database structure

```

┌────────────────────────────────────────────────────┐
│                                                    │
│                      Frontend                      │
│                                                    │
│    ┌──────────────┐    ┌──────────────────────┐    │
│    │              │    │                      │    │
│    │       1.     │    │          5.          │    │
│    │              │    │                      │    │
│    │    Signup    │    │    Create account    │    │
│    │              │    │                      │    │
│    │    Fields:   │    │     Fields:          │    │
│    │    * Email   │    │     * Username       │    │
│    │              │    │     * Password       │    │
│    │              │    │                      │    │
│    └─────┬────────┘    └──────▲─────────────┬─┘    │
│          │                    │             │      │
│          │                    │             │      │
└──────────┼────────────────────┼─────────────┼──────┘
           │                    │             │
           │ POST               │ GET         │
           │ * Email            │ * UUID      │
           │                    │             │
           │          ┌─────────┴────────┐    │
           │          │                  │    │
           │          │        4.        │    │
           │          │                  │    │ POST
           │          │  User goes to    │    │ * UUID
           │          │  email inbox     │    │ * Username
           │          │  and clicks link │    │ * Password
           │          │                  │    │
           │          └───▲──────────────┘    │
           │              │                   │
           │              │  Verification     │
           │              │  email            │
           │              │  * UUID           │
           │              │                   │
┌──────────┼──────────────┼───────────────────┼───────────────────────┐
│          │              │                   │                       │
│          │              │   Backend         │                       │
│          │              │                   │                       │
│    ┌─────▼──────┐     ┌─┴──────────────┐  ┌─▼──────────────────┐    │
│    │            │     │                │  │                    │    │
│    │      2.    │     │       3.       │  │         6.         │    │
│    │            │ Yes │                │  │                    │    │
│    │  Is email  ├──┬──►  Send email    │  │  Is email already  │    │
│    │  valid?    │  │  │  verification  │  │  verified?         │    │
│    │            │  │  │                │  │                    │    │
│    └────────────┘  │  └────────────────┘  └───┬────────────────┘    │
│                    │                          │                     │
│                    │                          │ No                  │
│                    │                          │                     │
└────────────────────┼──────────────────────────┼─────────────────────┘
                     │                          │
                     │                          │
          Save to db │        isVerified=true   │ Save to db
                     │     ┌────────────────────┤
                     │     │                    │
┌────────────────────┼─────┼────────────────────┼──────────┐
│                    │     │                    │          │
│    Database        │     │                    │          │
│                    │     │                    │          │
│    ┌───────────────▼─────▼─┐   ┌──────────────▼─────┐    │
│    │                       │   │                    │    │
│    │         Emails        │   │        Users       │    │
│    │                       │   │                    │    │
│    │  Fields:              │   │   Fields:          │    │
│    │  * Email              │   │   * Username       │    │
│    │  * UUID               │   │   * Password hash  │    │
│    │  * isVerified (bool)  │   │                    │    │
│    │                       │   │                    │    │
│    └───────────────────────┘   └────────────────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```