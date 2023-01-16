import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
export default NextAuth({
  secret: '4e3297264c8bb22bb459da74706e753b',
  providers: [
    GoogleProvider({
        clientId: '6576293325-ksh69mlndna72tpjvkeo1hh4b2sqrs2q.apps.googleusercontent.com',
        clientSecret: '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',
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        },
    })
    // ...add more providers here
  ],
  callbacks: {
    jwt: ({ token, account }) => {
    //   console.log('token')
      if(account){
        console.log(account)
      }
      return token;
    },
    session: ({ session }) => {
      // console.log('session')
      // console.log(session);
      // console.log(token);
      return session;
    }
  },
})